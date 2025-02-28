// Main game client code
class BoomBrawlGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.players = {};
        this.bombs = {};
        this.explosions = [];
        this.localPlayer = null;
        this.gameStarted = false;
        this.socket = null;
        this.keys = {};
        this.assets = {};
        
        // Set up screens
        this.loginScreen = document.getElementById('login-screen');
        this.lobbyScreen = document.getElementById('lobby-screen');
        this.gameScreen = document.getElementById('game-screen');
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Initialize socket connection
        this.initSocketConnection();
        
        // Load assets
        this.loadAssets();
    }
    
    initEventListeners() {
        // Login screen
        document.getElementById('play-button').addEventListener('click', () => {
            const username = document.getElementById('username').value.trim();
            if (username) {
                this.login(username);
            }
        });
        
        // Lobby screen
        document.getElementById('create-room').addEventListener('click', () => {
            this.socket.emit('create-room');
        });
        
        document.getElementById('refresh-rooms').addEventListener('click', () => {
            this.socket.emit('get-rooms');
        });
        
        // Game controls
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            // Drop bomb with space
            if (e.key === ' ' && this.gameStarted && this.localPlayer) {
                this.socket.emit('drop-bomb', {
                    x: this.localPlayer.x,
                    y: this.localPlayer.y
                });
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // Resize canvas to fit window
        window.addEventListener('resize', () => this.resizeCanvas());
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    initSocketConnection() {
        // Connect to server
        this.socket = io('http://localhost:3000');
        
        // Socket event handlers
        this.socket.on('connect', () => {
            console.log('Connected to server');
        });
        
        this.socket.on('login-success', (playerData) => {
            this.localPlayer = playerData;
            this.showScreen(this.lobbyScreen);
            this.socket.emit('get-rooms');
        });
        
        this.socket.on('rooms-list', (rooms) => {
            this.updateRoomsList(rooms);
        });
        
        this.socket.on('room-created', (roomId) => {
            this.socket.emit('join-room', roomId);
        });
        
        this.socket.on('game-start', (gameData) => {
            this.players = gameData.players;
            this.gameStarted = true;
            this.showScreen(this.gameScreen);
            this.startGameLoop();
        });
        
        this.socket.on('game-update', (gameState) => {
            this.players = gameState.players;
            this.bombs = gameState.bombs;
            this.explosions = gameState.explosions;
        });
        
        this.socket.on('player-killed', (playerId) => {
            if (playerId === this.socket.id) {
                alert('You were eliminated!');
            }
        });
        
        this.socket.on('game-over', (winner) => {
            this.gameStarted = false;
            alert(`Game over! ${winner.username} wins!`);
            this.showScreen(this.lobbyScreen);
        });
    }
    
    login(username) {
        this.socket.emit('login', { username });
    }
    
    updateRoomsList(rooms) {
        const roomsList = document.getElementById('rooms-list');
        roomsList.innerHTML = '';
        
        if (rooms.length === 0) {
            roomsList.innerHTML = '<p>No rooms available. Create one!</p>';
            return;
        }
        
        rooms.forEach(room => {
            const roomItem = document.createElement('div');
            roomItem.className = 'room-item';
            roomItem.innerHTML = `
                <p>Room #${room.id}</p>
                <p>Players: ${room.playerCount}/4</p>
                <p>Status: ${room.status}</p>
            `;
            
            roomItem.addEventListener('click', () => {
                this.socket.emit('join-room', room.id);
            });
            
            roomsList.appendChild(roomItem);
        });
    }
    
    showScreen(screen) {
        this.loginScreen.classList.add('hidden');
        this.lobbyScreen.classList.add('hidden');
        this.gameScreen.classList.add('hidden');
        
        screen.classList.remove('hidden');
    }
    
    loadAssets() {
        // Load images
        const images = {
            player: 'assets/player.png',
            bomb: 'assets/bomb.png',
            explosion: 'assets/explosion.png',
            background: 'assets/background.png'
        };
        
        let loadedCount = 0;
        const totalImages = Object.keys(images).length;
        
        for (const [name, path] of Object.entries(images)) {
            const img = new Image();
            img.src = path;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    console.log('All assets loaded');
                }
            };
            this.assets[name] = img;
        }
    }
    
    startGameLoop() {
        const gameLoop = () => {
            this.update();
            this.render();
            
            if (this.gameStarted) {
                requestAnimationFrame(gameLoop);
            }
        };
        
        gameLoop();
    }
    
    update() {
        if (!this.localPlayer || !this.gameStarted) return;
        
        // Calculate movement based on key presses
        let dx = 0;
        let dy = 0;
        const speed = 5;
        
        if (this.keys['ArrowUp'] || this.keys['w']) dy -= speed;
        if (this.keys['ArrowDown'] || this.keys['s']) dy += speed;
        if (this.keys['ArrowLeft'] || this.keys['a']) dx -= speed;
        if (this.keys['ArrowRight'] || this.keys['d']) dx += speed;
        
        if (dx !== 0 || dy !== 0) {
            // Send movement to server
            this.socket.emit('player-move', { dx, dy });
            
            // Predict movement locally for smoother gameplay
            this.players[this.socket.id].x += dx;
            this.players[this.socket.id].y += dy;
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background (placeholder color)
        this.ctx.fillStyle = '#3498db';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw players
        for (const id in this.players) {
            const player = this.players[id];
            
            // Draw player as a colored circle with name
            this.ctx.fillStyle = player.color;
            this.ctx.beginPath();
            this.ctx.arc(player.x, player.y, 20, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw player name
            this.ctx.fillStyle = 'white';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(player.username, player.x, player.y - 30);
        }
        
        // Draw bombs
        for (const id in this.bombs) {
            const bomb = this.bombs[id];
            
            this.ctx.fillStyle = 'black';
            this.ctx.beginPath();
            this.ctx.arc(bomb.x, bomb.y, 10, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Draw explosions
        for (const explosion of this.explosions) {
            this.ctx.fillStyle = 'rgba(255, 87, 34, 0.7)';
            this.ctx.beginPath();
            this.ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new BoomBrawlGame();
});
