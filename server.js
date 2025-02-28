const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Game state
const players = {};
const rooms = {};
const games = {};

// Game constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const BOMB_RADIUS = 100;
const BOMB_TIMER = 3000; // 3 seconds

// Socket connection handler
io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);
    
    // Handle player login
    socket.on('login', (data) => {
        players[socket.id] = {
            id: socket.id,
            username: data.username,
            x: Math.random() * GAME_WIDTH,
            y: Math.random() * GAME_HEIGHT,
            color: getRandomColor(),
            isAlive: true
        };
        
        socket.emit('login-success', players[socket.id]);
    });
    
    // Handle room creation
    socket.on('create-room', () => {
        const roomId = uuidv4().substring(0, 8);
        rooms[roomId] = {
            id: roomId,
            players: [socket.id],
            status: 'waiting',
            playerCount: 1
        };
        
        socket.join(roomId);
        socket.emit('room-created', roomId);
    });
    
    // Handle room joining
    socket.on('join-room', (roomId) => {
        const room = rooms[roomId];
        
        if (!room) {
            socket.emit('error', 'Room not found');
            return;
        }
        
        if (room.status !== 'waiting' || room.players.length >= 4) {
            socket.emit('error', 'Cannot join room');
            return;
        }
        
        socket.join(roomId);
        room.players.push(socket.id);
        room.playerCount++;
        
        // Notify all clients about updated room
        io.emit('rooms-list', getRoomsList());
        
        // If room is full (4 players), start the game
        if (room.players.length === 4) {
            startGame(roomId);
        }
    });
    
    // Handle player movement
    socket.on('player-move', (data) => {
        const player = players[socket.id];
        if (!player) return;
        
        player.x += data.dx;
        player.y += data.dy;
        
        // Keep player within bounds
        player.x = Math.max(0, Math.min(GAME_WIDTH, player.x));
        player.y = Math.max(0, Math.min(GAME_HEIGHT, player.y));
        
        // Find player's room and update game state
        const roomId = getPlayerRoom(socket.id);
        if (roomId && games[roomId]) {
            const game = games[roomId];
            game.players[socket.id] = player;
            
            // Send updated game state to all players in room
            io.to(roomId).emit('game-update', {
                players: game.players,
                bombs: game.bombs,
                explosions: game.explosions
            });
        }
    });
    
    // Handle bomb dropping
    socket.on('drop-bomb', (data) => {
        const player = players[socket.id];
        if (!player || !player.isAlive) return;
        
        const roomId = getPlayerRoom(socket.id);
        if (!roomId || !games[roomId]) return;
        
        const game = games[roomId];
        const bombId = uuidv4();
        
        // Create new bomb
        game.bombs[bombId] = {
            id: bombId,
            x: data.x,
            y: data.y,
            playerId: socket.id,
            createdAt: Date.now()
        };
        
        // Schedule bomb explosion
        setTimeout(() => {
            // Remove bomb
            delete game.bombs[bombId];
            
            // Create explosion
            const explosion = {
                x: data.x,
                y: data.y,
                radius: BOMB_RADIUS,
                createdAt: Date.now()
            };
            
            game.explosions.push(explosion);
            
            // Check for players caught in explosion
            for (const playerId in game.players) {
                const p = game.players[playerId];
                
                if (!p.isAlive) continue;
                
                // Check if player is within explosion radius
                const dx = p.x - explosion.x;
                const dy = p.y - explosion.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance <= BOMB_RADIUS) {
                    p.isAlive = false;
                    io.to(roomId).emit('player-killed', playerId);
                }
            }
            
            // Remove explosion after animation
            setTimeout(() => {
                const index = game.explosions.indexOf(explosion);
                if (index !== -1) {
                    game.explosions.splice(index, 1);
                }
                
                // Check if game is over (only one player left alive)
                const alivePlayers = Object.values(game.players).filter(p => p.isAlive);
                if (alivePlayers.length === 1) {
                    endGame(roomId, alivePlayers[0]);
                }
            }, 1000);
            
            // Send updated game state
            io.to(roomId).emit('game-update', {
                players: game.players,
                bombs: game.bombs,
                explosions: game.explosions
            });
        }, BOMB_TIMER);
        
        // Send updated game state
        io.to(roomId).emit('game-update', {
            players: game.players,
            bombs: game.bombs,
            explosions: game.explosions
        });
    });
    
    // Handle room list request
    socket.on('get-rooms', () => {
        socket.emit('rooms-list', getRoomsList());
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);
        
        // Remove player from their room
        const roomId = getPlayerRoom(socket.id);
        if (roomId) {
            const room = rooms[roomId];
            
            // Remove player from room
            const index = room.players.indexOf(socket.id);
            if (index !== -1) {
                room.players.splice(index, 1);
                room.playerCount--;
            }
            
            // If room is empty, remove it
            if (room.players.length === 0) {
                delete rooms[roomId];
                if (games[roomId]) {
                    delete games[roomId];
                }
            } else if (games[roomId]) {
                // Mark player as dead in active game
                const game = games[roomId];
                if (game.players[socket.id]) {
                    game.players[socket.id].isAlive = false;
                }
                
                // Check if game is over
                const alivePlayers = Object.values(game.players).filter(p => p.isAlive);
                if (alivePlayers.length === 1) {
                    endGame(roomId, alivePlayers[0]);
                }
            }
        }
        
        // Remove player from players list
        delete players[socket.id];
        
        // Update room list for all clients
        io.emit('rooms-list', getRoomsList());
    });
});

// Start the game in a room
function startGame(roomId) {
    const room = rooms[roomId];
    if (!room) return;
    
    room.status = 'playing';
    
    // Initialize game state
    games[roomId] = {
        players: {},
        bombs: {},
        explosions: []
    };
    
    // Add players to game
    for (const playerId of room.players) {
        games[roomId].players[playerId] = {
            ...players[playerId],
            x: Math.random() * GAME_WIDTH,
            y: Math.random() * GAME_HEIGHT,
            isAlive: true
        };
    }
    
    // Notify players that game is starting
    io.to(roomId).emit('game-start', {
        players: games[roomId].players
    });
    
    // Update room list for all clients
    io.emit('rooms-list', getRoomsList());
}

// End game in a room
function endGame(roomId, winner) {
    const room = rooms[roomId];
    if (!room) return;
    
    room.status = 'waiting';
    
    // Notify players that game is over
    io.to(roomId).emit('game-over', winner);
    
    // Clean up game state
    delete games[roomId];
    
    // Update room list for all clients
    io.emit('rooms-list', getRoomsList());
}

// Get a list of all rooms for the client
function getRoomsList() {
    return Object.values(rooms).map(room => ({
        id: room.id,
        playerCount: room.playerCount,
        status: room.status
    }));
}

// Find which room a player is in
function getPlayerRoom(playerId) {
    for (const roomId in rooms) {
        if (rooms[roomId].players.includes(playerId)) {
            return roomId;
        }
    }
    return null;
}

// Generate a random color
function getRandomColor() {
    const colors = [
        '#e74c3c', // Red
        '#2ecc71', // Green
        '#3498db', // Blue
        '#f39c12', // Orange
        '#9b59b6', // Purple
        '#1abc9c', // Teal
        '#d35400', // Dark Orange
        '#c0392b'  // Dark Red
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
}

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
