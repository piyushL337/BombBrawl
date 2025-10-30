# BombBrawl Technical Architecture

## System Architecture Overview

BombBrawl follows a modular, scalable architecture designed for high-performance multiplayer gaming on Android devices.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer (Unity)                      │
├─────────────────────────────────────────────────────────────────┤
│  Presentation Layer                                              │
│  ├─ UI System (TextMeshPro, UGUI)                              │
│  ├─ Menu System                                                 │
│  ├─ HUD & Notifications                                         │
│  └─ Visual Effects (Particles, Shaders)                         │
├─────────────────────────────────────────────────────────────────┤
│  Game Logic Layer                                                │
│  ├─ Game Modes Manager                                          │
│  ├─ Player Controller & Physics                                 │
│  ├─ Weapon System (Bombs, Explosions)                          │
│  ├─ Power-up System                                             │
│  ├─ AI System (Bot Behavior)                                    │
│  └─ Match Flow Controller                                       │
├─────────────────────────────────────────────────────────────────┤
│  Core Systems Layer                                              │
│  ├─ Scene Management                                             │
│  ├─ Audio Management                                             │
│  ├─ Input Management (Touch, Controller)                        │
│  ├─ Object Pooling                                               │
│  ├─ Event System                                                 │
│  └─ Animation System                                             │
├─────────────────────────────────────────────────────────────────┤
│  Multiplayer Layer                                               │
│  ├─ Network Manager (Photon PUN2)                              │
│  ├─ Room Management                                              │
│  ├─ State Synchronization                                        │
│  ├─ Matchmaking System                                           │
│  └─ Lag Compensation                                             │
├─────────────────────────────────────────────────────────────────┤
│  Data Layer                                                      │
│  ├─ Save System (Local & Cloud)                                 │
│  ├─ Player Data Management                                       │
│  ├─ Progression System                                           │
│  ├─ Configuration Data                                           │
│  └─ Cache Management                                             │
├─────────────────────────────────────────────────────────────────┤
│  Services Layer                                                  │
│  ├─ Firebase Integration                                         │
│  ├─ Analytics Service                                            │
│  ├─ Authentication Service                                       │
│  ├─ IAP Service (Google Play Billing)                          │
│  ├─ Ad Service (AdMob)                                          │
│  └─ Social Services (Friends, Chat, Clans)                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                      Backend Services                            │
├─────────────────────────────────────────────────────────────────┤
│  Photon Cloud (PUN2)                                            │
│  ├─ Room Hosting                                                │
│  ├─ Player State Sync                                           │
│  ├─ Matchmaking                                                 │
│  └─ Voice Chat (optional)                                       │
├─────────────────────────────────────────────────────────────────┤
│  Firebase                                                        │
│  ├─ Authentication                                               │
│  ├─ Realtime Database                                            │
│  ├─ Cloud Firestore                                              │
│  ├─ Cloud Storage                                                │
│  ├─ Analytics                                                    │
│  └─ Crashlytics                                                  │
├─────────────────────────────────────────────────────────────────┤
│  Custom Python Backend (Like BombSquad) [Optional]               │
│  ├─ REST API (Flask/FastAPI)                                     │
│  ├─ WebSocket Server (asyncio/websockets)                        │
│  ├─ Leaderboards Service                                         │
│  ├─ Achievement Tracking                                         │
│  └─ Admin Dashboard (Django/Flask)                               │
├─────────────────────────────────────────────────────────────────┤
│  Third-Party Services                                            │
│  ├─ Google Play Services                                         │
│  ├─ Google Play Games Services                                   │
│  ├─ Google Play Billing                                          │
│  └─ AdMob                                                        │
└─────────────────────────────────────────────────────────────────┘
```

## Core System Components

### 1. Game Manager (Central Controller)

```csharp
/// <summary>
/// Central game controller managing game state and core systems
/// </summary>
public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }
    
    // Game State
    public GameState CurrentState { get; private set; }
    public GameMode CurrentGameMode { get; private set; }
    
    // Core Systems References
    public AudioManager AudioManager { get; private set; }
    public InputManager InputManager { get; private set; }
    public UIManager UIManager { get; private set; }
    public NetworkManager NetworkManager { get; private set; }
    public ProgressionManager ProgressionManager { get; private set; }
    
    // Events
    public event Action<GameState> OnGameStateChanged;
    public event Action OnMatchStarted;
    public event Action<MatchResult> OnMatchEnded;
    
    private void Awake()
    {
        InitializeSingleton();
        InitializeSystems();
    }
    
    public void ChangeGameState(GameState newState)
    {
        CurrentState = newState;
        OnGameStateChanged?.Invoke(newState);
    }
    
    public void StartMatch(GameMode mode, MapData map, List<PlayerData> players)
    {
        CurrentGameMode = mode;
        // Initialize match...
        OnMatchStarted?.Invoke();
    }
    
    public void EndMatch(MatchResult result)
    {
        OnMatchEnded?.Invoke(result);
        // Process results, update progression, etc.
    }
}

public enum GameState
{
    MainMenu,
    Lobby,
    Loading,
    Playing,
    Paused,
    MatchEnd
}
```

### 2. Player Controller Architecture

```csharp
/// <summary>
/// Player controller handling movement, combat, and interactions
/// </summary>
public class PlayerController : MonoBehaviour
{
    // Components
    private PlayerMovement movement;
    private PlayerHealth health;
    private PlayerCombat combat;
    private PlayerAnimation animator;
    private PlayerInput input;
    
    // State
    public PlayerState CurrentState { get; private set; }
    public PlayerData PlayerData { get; set; }
    
    // Properties
    public bool IsLocalPlayer { get; set; }
    public bool IsAlive => health.IsAlive;
    
    private void Awake()
    {
        InitializeComponents();
    }
    
    private void Update()
    {
        if (!IsLocalPlayer || !IsAlive) return;
        
        input.ProcessInput();
        movement.UpdateMovement(input.MoveDirection);
        
        if (input.BombButtonPressed)
            combat.DropBomb();
            
        if (input.PunchButtonPressed)
            combat.Punch();
    }
    
    public void TakeDamage(float damage, PlayerController attacker)
    {
        health.TakeDamage(damage);
        
        if (!health.IsAlive)
        {
            OnPlayerDied(attacker);
        }
    }
    
    private void OnPlayerDied(PlayerController killer)
    {
        // Handle death, notify game manager, update stats
        animator.PlayDeathAnimation();
        GameManager.Instance.OnPlayerKilled(this, killer);
    }
}
```

### 3. Bomb System Architecture

```csharp
/// <summary>
/// Base class for all bomb types
/// </summary>
public abstract class BombBase : MonoBehaviour
{
    [SerializeField] protected float explosionRadius = 5f;
    [SerializeField] protected float explosionDamage = 100f;
    [SerializeField] protected float fuseTime = 3f;
    [SerializeField] protected GameObject explosionPrefab;
    
    protected PlayerController owner;
    protected float timer;
    protected bool isActive = true;
    
    public virtual void Initialize(PlayerController ownerPlayer)
    {
        owner = ownerPlayer;
        timer = fuseTime;
        StartCoroutine(FuseCountdown());
    }
    
    protected virtual IEnumerator FuseCountdown()
    {
        while (timer > 0 && isActive)
        {
            timer -= Time.deltaTime;
            OnFuseTick(timer);
            yield return null;
        }
        
        if (isActive)
            Explode();
    }
    
    protected virtual void Explode()
    {
        // Create explosion effect
        GameObject explosion = PoolManager.Instance.GetFromPool("Explosion");
        explosion.transform.position = transform.position;
        
        // Find and damage players in radius
        Collider[] hitColliders = Physics.OverlapSphere(transform.position, explosionRadius);
        foreach (var hitCollider in hitColliders)
        {
            PlayerController player = hitCollider.GetComponent<PlayerController>();
            if (player != null && player.IsAlive)
            {
                float distance = Vector3.Distance(transform.position, player.transform.position);
                float damageMultiplier = 1 - (distance / explosionRadius);
                player.TakeDamage(explosionDamage * damageMultiplier, owner);
            }
        }
        
        OnExploded();
        PoolManager.Instance.ReturnToPool("Bomb", gameObject);
    }
    
    protected abstract void OnFuseTick(float remainingTime);
    protected abstract void OnExploded();
}

/// <summary>
/// Standard bomb implementation
/// </summary>
public class StandardBomb : BombBase
{
    protected override void OnFuseTick(float remainingTime)
    {
        // Visual feedback for timer
        float scale = 1 + (0.2f * Mathf.Sin(remainingTime * 10));
        transform.localScale = Vector3.one * scale;
    }
    
    protected override void OnExploded()
    {
        AudioManager.Instance.PlaySFX("BombExplosion");
        CameraShake.Instance.Shake(0.3f, 0.5f);
    }
}

/// <summary>
/// Sticky bomb that attaches to surfaces and players
/// </summary>
public class StickyBomb : BombBase
{
    private Transform attachedTo;
    private Vector3 attachOffset;
    
    public override void Initialize(PlayerController ownerPlayer)
    {
        base.Initialize(ownerPlayer);
        CheckForAttachment();
    }
    
    private void CheckForAttachment()
    {
        RaycastHit hit;
        if (Physics.Raycast(transform.position, Vector3.down, out hit, 1f))
        {
            attachedTo = hit.transform;
            attachOffset = transform.position - attachedTo.position;
        }
    }
    
    private void LateUpdate()
    {
        if (attachedTo != null)
        {
            transform.position = attachedTo.position + attachOffset;
        }
    }
    
    protected override void OnFuseTick(float remainingTime)
    {
        // Pulsing red light
        Color color = Color.Lerp(Color.white, Color.red, 1 - (remainingTime / fuseTime));
        GetComponent<Renderer>().material.SetColor("_EmissionColor", color);
    }
    
    protected override void OnExploded()
    {
        AudioManager.Instance.PlaySFX("StickyBombExplosion");
    }
}
```

### 4. Power-up System Architecture

```csharp
/// <summary>
/// Base class for all power-ups
/// </summary>
public abstract class PowerUpBase : MonoBehaviour
{
    [SerializeField] protected float duration = 10f;
    [SerializeField] protected GameObject pickupEffect;
    
    protected PlayerController affectedPlayer;
    protected float timeRemaining;
    protected bool isActive = false;
    
    public virtual void OnPickup(PlayerController player)
    {
        affectedPlayer = player;
        isActive = true;
        timeRemaining = duration;
        
        ApplyEffect();
        ShowPickupEffect();
        StartCoroutine(DurationTimer());
        
        PowerUpManager.Instance.RegisterActivePowerUp(this, player);
    }
    
    protected abstract void ApplyEffect();
    protected abstract void RemoveEffect();
    
    protected virtual IEnumerator DurationTimer()
    {
        while (timeRemaining > 0)
        {
            timeRemaining -= Time.deltaTime;
            OnTick();
            yield return null;
        }
        
        OnExpired();
    }
    
    protected virtual void OnTick()
    {
        // Update UI indicator, etc.
    }
    
    protected virtual void OnExpired()
    {
        RemoveEffect();
        isActive = false;
        PowerUpManager.Instance.UnregisterActivePowerUp(this);
    }
    
    private void ShowPickupEffect()
    {
        if (pickupEffect != null)
        {
            Instantiate(pickupEffect, transform.position, Quaternion.identity);
        }
        AudioManager.Instance.PlaySFX("PowerUpPickup");
    }
}

/// <summary>
/// Speed boost power-up
/// </summary>
public class SpeedBoostPowerUp : PowerUpBase
{
    [SerializeField] private float speedMultiplier = 1.5f;
    private float originalSpeed;
    
    protected override void ApplyEffect()
    {
        PlayerMovement movement = affectedPlayer.GetComponent<PlayerMovement>();
        originalSpeed = movement.MoveSpeed;
        movement.MoveSpeed *= speedMultiplier;
        
        // Visual effect (trail)
        affectedPlayer.GetComponent<TrailRenderer>().enabled = true;
    }
    
    protected override void RemoveEffect()
    {
        PlayerMovement movement = affectedPlayer.GetComponent<PlayerMovement>();
        movement.MoveSpeed = originalSpeed;
        
        affectedPlayer.GetComponent<TrailRenderer>().enabled = false;
    }
}
```

### 5. Network Synchronization Architecture

```csharp
/// <summary>
/// Network player controller with state synchronization
/// </summary>
public class NetworkPlayerController : MonoBehaviourPunCallbacks, IPunObservable
{
    private PlayerController playerController;
    private Vector3 networkPosition;
    private Quaternion networkRotation;
    private float positionLerpSpeed = 10f;
    
    // Network state
    private PlayerNetworkState currentState;
    
    private void Awake()
    {
        playerController = GetComponent<PlayerController>();
    }
    
    private void Update()
    {
        if (!photonView.IsMine)
        {
            // Interpolate position for smooth movement
            transform.position = Vector3.Lerp(transform.position, networkPosition, 
                Time.deltaTime * positionLerpSpeed);
            transform.rotation = Quaternion.Lerp(transform.rotation, networkRotation, 
                Time.deltaTime * positionLerpSpeed);
        }
    }
    
    public void OnPhotonSerializeView(PhotonStream stream, PhotonMessageInfo info)
    {
        if (stream.IsWriting)
        {
            // Send data to other clients
            stream.SendNext(transform.position);
            stream.SendNext(transform.rotation);
            stream.SendNext(playerController.CurrentState);
            stream.SendNext(playerController.PlayerData.Health);
        }
        else
        {
            // Receive data from other clients
            networkPosition = (Vector3)stream.ReceiveNext();
            networkRotation = (Quaternion)stream.ReceiveNext();
            currentState = (PlayerNetworkState)stream.ReceiveNext();
            float health = (float)stream.ReceiveNext();
            
            // Apply received data
            playerController.CurrentState = currentState;
            playerController.PlayerData.Health = health;
        }
    }
    
    [PunRPC]
    public void RPC_DropBomb(Vector3 position)
    {
        // Spawn bomb on all clients
        BombManager.Instance.SpawnBomb(position, playerController);
    }
    
    [PunRPC]
    public void RPC_TakeDamage(float damage, int attackerViewID)
    {
        PlayerController attacker = PhotonView.Find(attackerViewID)?.GetComponent<PlayerController>();
        playerController.TakeDamage(damage, attacker);
    }
}

/// <summary>
/// Network manager handling room and matchmaking
/// </summary>
public class NetworkManager : MonoBehaviourPunCallbacks
{
    public static NetworkManager Instance { get; private set; }
    
    public bool IsConnected => PhotonNetwork.IsConnected;
    public bool InRoom => PhotonNetwork.InRoom;
    
    private void Awake()
    {
        Instance = this;
        DontDestroyOnLoad(gameObject);
    }
    
    public void ConnectToServer()
    {
        PhotonNetwork.ConnectUsingSettings();
    }
    
    public override void OnConnectedToMaster()
    {
        Debug.Log("Connected to Photon Master Server");
        PhotonNetwork.JoinLobby();
    }
    
    public void CreateRoom(string roomName, int maxPlayers)
    {
        RoomOptions options = new RoomOptions
        {
            MaxPlayers = (byte)maxPlayers,
            IsVisible = true,
            IsOpen = true
        };
        
        PhotonNetwork.CreateRoom(roomName, options);
    }
    
    public void JoinRoom(string roomName)
    {
        PhotonNetwork.JoinRoom(roomName);
    }
    
    public void QuickMatch()
    {
        PhotonNetwork.JoinRandomRoom();
    }
    
    public override void OnJoinedRoom()
    {
        Debug.Log($"Joined room: {PhotonNetwork.CurrentRoom.Name}");
        
        // Spawn player
        Vector3 spawnPosition = GetSpawnPosition();
        PhotonNetwork.Instantiate("Player", spawnPosition, Quaternion.identity);
    }
    
    public override void OnJoinRandomFailed(short returnCode, string message)
    {
        Debug.Log("No rooms available, creating new room");
        CreateRoom($"Room_{Random.Range(1000, 9999)}", 8);
    }
    
    private Vector3 GetSpawnPosition()
    {
        // Get spawn point based on player count
        SpawnPoint[] spawnPoints = FindObjectsOfType<SpawnPoint>();
        int playerIndex = PhotonNetwork.CurrentRoom.PlayerCount - 1;
        
        if (playerIndex < spawnPoints.Length)
            return spawnPoints[playerIndex].transform.position;
        
        return Vector3.zero;
    }
}
```

### 6. Game Mode System Architecture

```csharp
/// <summary>
/// Base class for all game modes
/// </summary>
public abstract class GameModeBase : MonoBehaviour
{
    [SerializeField] protected float matchDuration = 300f; // 5 minutes
    [SerializeField] protected int scoreToWin = 10;
    
    protected Dictionary<PlayerController, int> playerScores;
    protected float matchTimer;
    protected bool isMatchActive;
    
    public event Action<PlayerController, int> OnScoreChanged;
    public event Action<MatchResult> OnMatchEnded;
    
    public virtual void Initialize()
    {
        playerScores = new Dictionary<PlayerController, int>();
        matchTimer = matchDuration;
        isMatchActive = true;
        
        RegisterPlayers();
        OnModeStarted();
    }
    
    protected virtual void Update()
    {
        if (!isMatchActive) return;
        
        matchTimer -= Time.deltaTime;
        
        if (matchTimer <= 0)
        {
            EndMatch();
        }
        
        CheckWinCondition();
    }
    
    protected abstract void OnModeStarted();
    protected abstract void CheckWinCondition();
    public abstract void OnPlayerKilled(PlayerController victim, PlayerController killer);
    public abstract void OnPlayerScored(PlayerController player, int points);
    
    protected virtual void RegisterPlayers()
    {
        PlayerController[] players = FindObjectsOfType<PlayerController>();
        foreach (var player in players)
        {
            playerScores[player] = 0;
        }
    }
    
    protected virtual void EndMatch()
    {
        isMatchActive = false;
        MatchResult result = CalculateResults();
        OnMatchEnded?.Invoke(result);
    }
    
    protected virtual MatchResult CalculateResults()
    {
        // Determine winner based on scores
        var sortedScores = playerScores.OrderByDescending(x => x.Value);
        
        return new MatchResult
        {
            Winner = sortedScores.First().Key,
            FinalScores = sortedScores.ToDictionary(x => x.Key, x => x.Value),
            MatchDuration = matchDuration - matchTimer
        };
    }
}

/// <summary>
/// Free-for-all game mode implementation
/// </summary>
public class FreeForAllMode : GameModeBase
{
    protected override void OnModeStarted()
    {
        Debug.Log("Free-for-All Match Started!");
        UIManager.Instance.ShowGameModeUI("Free-for-All");
    }
    
    protected override void CheckWinCondition()
    {
        foreach (var score in playerScores)
        {
            if (score.Value >= scoreToWin)
            {
                EndMatch();
                return;
            }
        }
    }
    
    public override void OnPlayerKilled(PlayerController victim, PlayerController killer)
    {
        if (killer != null && killer != victim)
        {
            // Award point to killer
            playerScores[killer]++;
            OnScoreChanged?.Invoke(killer, playerScores[killer]);
            
            // Notify UI
            UIManager.Instance.ShowKillFeed($"{killer.PlayerData.Username} eliminated {victim.PlayerData.Username}");
        }
        
        // Respawn victim after delay
        StartCoroutine(RespawnPlayer(victim, 3f));
    }
    
    public override void OnPlayerScored(PlayerController player, int points)
    {
        playerScores[player] += points;
        OnScoreChanged?.Invoke(player, playerScores[player]);
    }
    
    private IEnumerator RespawnPlayer(PlayerController player, float delay)
    {
        yield return new WaitForSeconds(delay);
        
        Vector3 spawnPos = GetRandomSpawnPoint();
        player.transform.position = spawnPos;
        player.GetComponent<PlayerHealth>().ResetHealth();
        player.gameObject.SetActive(true);
    }
    
    private Vector3 GetRandomSpawnPoint()
    {
        SpawnPoint[] spawns = FindObjectsOfType<SpawnPoint>();
        return spawns[Random.Range(0, spawns.Length)].transform.position;
    }
}
```

### 7. Data Persistence Architecture

```csharp
/// <summary>
/// Save system handling local and cloud saves
/// </summary>
public class SaveSystem
{
    private const string SAVE_FILE = "playerdata.json";
    
    public static void SavePlayerData(PlayerData data)
    {
        // Local save
        string json = JsonUtility.ToJson(data);
        string encryptedData = EncryptData(json);
        File.WriteAllText(GetSavePath(), encryptedData);
        
        // Cloud save (Firebase)
        if (FirebaseManager.Instance.IsAuthenticated)
        {
            FirebaseManager.Instance.SaveToCloud("playerData", json);
        }
    }
    
    public static PlayerData LoadPlayerData()
    {
        // Try cloud first
        if (FirebaseManager.Instance.IsAuthenticated)
        {
            string cloudData = FirebaseManager.Instance.LoadFromCloud("playerData");
            if (!string.IsNullOrEmpty(cloudData))
            {
                return JsonUtility.FromJson<PlayerData>(cloudData);
            }
        }
        
        // Fallback to local
        string path = GetSavePath();
        if (File.Exists(path))
        {
            string encryptedData = File.ReadAllText(path);
            string json = DecryptData(encryptedData);
            return JsonUtility.FromJson<PlayerData>(json);
        }
        
        return CreateNewPlayerData();
    }
    
    private static string GetSavePath()
    {
        return Path.Combine(Application.persistentDataPath, SAVE_FILE);
    }
    
    private static string EncryptData(string data)
    {
        // Simple XOR encryption (use stronger encryption in production)
        byte[] bytes = System.Text.Encoding.UTF8.GetBytes(data);
        byte[] encrypted = new byte[bytes.Length];
        
        for (int i = 0; i < bytes.Length; i++)
        {
            encrypted[i] = (byte)(bytes[i] ^ 42); // XOR with key
        }
        
        return Convert.ToBase64String(encrypted);
    }
    
    private static string DecryptData(string encryptedData)
    {
        byte[] encrypted = Convert.FromBase64String(encryptedData);
        byte[] decrypted = new byte[encrypted.Length];
        
        for (int i = 0; i < encrypted.Length; i++)
        {
            decrypted[i] = (byte)(encrypted[i] ^ 42);
        }
        
        return System.Text.Encoding.UTF8.GetString(decrypted);
    }
    
    private static PlayerData CreateNewPlayerData()
    {
        return new PlayerData
        {
            Username = "Player",
            Level = 1,
            Experience = 0,
            Currency = 0,
            UnlockedCharacters = new List<string> { "default" },
            UnlockedMaps = new List<string> { "courtyard" }
        };
    }
}
```

## Python Custom Server Implementation (BombSquad-Style)

### Overview
Following BombSquad's architecture, we can implement a custom Python backend server for additional features like leaderboards, matchmaking, authentication, and admin controls. This complements Photon's real-time multiplayer functionality.

### Python Server Architecture

```python
# server_architecture.py
"""
BombBrawl Python Server Architecture (Like BombSquad)
Handles: Authentication, Leaderboards, Matchmaking, Admin Dashboard
Uses: FastAPI for REST API, asyncio for WebSocket, PostgreSQL/Redis for data
"""

from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import uvicorn
from typing import Dict, List, Optional
import json
import redis
from datetime import datetime, timedelta

# Initialize FastAPI app
app = FastAPI(title="BombBrawl Server", version="1.0.0")

# Configure CORS for Unity clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis for caching and real-time data
redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)

# In-memory storage (use database in production)
active_players = {}
matchmaking_queue = []
server_stats = {
    "total_matches": 0,
    "active_players": 0,
    "total_players": 0
}
```

### 1. Authentication System

```python
# auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import jwt
import bcrypt
from datetime import datetime, timedelta

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()

SECRET_KEY = "your-secret-key-here"  # Use environment variable in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

class UserCredentials(BaseModel):
    username: str
    password: str
    device_id: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    player_id: str
    username: str

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/register", response_model=TokenResponse)
async def register(credentials: UserCredentials):
    """Register new player account"""
    # Check if username exists
    if redis_client.hexists("usernames", credentials.username):
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Hash password
    password_hash = bcrypt.hashpw(credentials.password.encode(), bcrypt.gensalt())
    
    # Create player ID
    player_id = f"player_{credentials.device_id}_{int(datetime.utcnow().timestamp())}"
    
    # Store user data
    user_data = {
        "player_id": player_id,
        "username": credentials.username,
        "password_hash": password_hash.decode(),
        "device_id": credentials.device_id,
        "created_at": datetime.utcnow().isoformat(),
        "level": 1,
        "xp": 0,
        "currency": 0
    }
    
    redis_client.hset("usernames", credentials.username, player_id)
    redis_client.hset(f"player:{player_id}", mapping=user_data)
    
    # Create access token
    access_token = create_access_token({"player_id": player_id, "username": credentials.username})
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        player_id=player_id,
        username=credentials.username
    )

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserCredentials):
    """Login existing player"""
    # Get player ID from username
    player_id = redis_client.hget("usernames", credentials.username)
    if not player_id:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Get player data
    user_data = redis_client.hgetall(f"player:{player_id}")
    
    # Verify password
    if not bcrypt.checkpw(credentials.password.encode(), user_data["password_hash"].encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create access token
    access_token = create_access_token({"player_id": player_id, "username": credentials.username})
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        player_id=player_id,
        username=user_data["username"]
    )

@router.get("/verify")
async def verify(user: dict = Depends(verify_token)):
    """Verify token is valid"""
    return {"valid": True, "player_id": user["player_id"], "username": user["username"]}
```

### 2. Leaderboard System

```python
# leaderboards.py
from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/leaderboards", tags=["Leaderboards"])

class LeaderboardEntry(BaseModel):
    rank: int
    player_id: str
    username: str
    score: int
    wins: int
    kills: int
    deaths: int
    kd_ratio: float

class LeaderboardType:
    GLOBAL = "global"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    FRIENDS = "friends"

@router.get("/top", response_model=List[LeaderboardEntry])
async def get_leaderboard(
    leaderboard_type: str = Query("global", enum=["global", "weekly", "monthly"]),
    limit: int = Query(100, ge=10, le=500),
    offset: int = Query(0, ge=0),
    user: dict = Depends(verify_token)
):
    """Get top players leaderboard"""
    
    # Get leaderboard key based on type
    if leaderboard_type == "weekly":
        leaderboard_key = f"leaderboard:weekly:{datetime.now().strftime('%Y-W%W')}"
    elif leaderboard_type == "monthly":
        leaderboard_key = f"leaderboard:monthly:{datetime.now().strftime('%Y-%m')}"
    else:
        leaderboard_key = "leaderboard:global"
    
    # Get top players from Redis sorted set
    top_players = redis_client.zrevrange(leaderboard_key, offset, offset + limit - 1, withscores=True)
    
    leaderboard = []
    for rank, (player_id, score) in enumerate(top_players, start=offset + 1):
        # Get player stats
        player_stats = redis_client.hgetall(f"stats:{player_id}")
        
        if player_stats:
            kills = int(player_stats.get("kills", 0))
            deaths = int(player_stats.get("deaths", 0))
            kd_ratio = kills / deaths if deaths > 0 else kills
            
            leaderboard.append(LeaderboardEntry(
                rank=rank,
                player_id=player_id,
                username=player_stats.get("username", "Unknown"),
                score=int(score),
                wins=int(player_stats.get("wins", 0)),
                kills=kills,
                deaths=deaths,
                kd_ratio=round(kd_ratio, 2)
            ))
    
    return leaderboard

@router.get("/player/{player_id}", response_model=dict)
async def get_player_rank(player_id: str, user: dict = Depends(verify_token)):
    """Get specific player's rank and stats"""
    
    leaderboard_key = "leaderboard:global"
    
    # Get player's rank
    rank = redis_client.zrevrank(leaderboard_key, player_id)
    score = redis_client.zscore(leaderboard_key, player_id)
    
    if rank is None:
        return {"rank": None, "message": "Player not ranked yet"}
    
    # Get player stats
    player_stats = redis_client.hgetall(f"stats:{player_id}")
    
    return {
        "rank": rank + 1,
        "score": int(score) if score else 0,
        "stats": player_stats
    }

@router.post("/update")
async def update_player_score(
    player_id: str,
    score_delta: int,
    match_stats: dict,
    user: dict = Depends(verify_token)
):
    """Update player score after match (called by game server)"""
    
    # Update global leaderboard
    redis_client.zincrby("leaderboard:global", score_delta, player_id)
    
    # Update weekly leaderboard
    weekly_key = f"leaderboard:weekly:{datetime.now().strftime('%Y-W%W')}"
    redis_client.zincrby(weekly_key, score_delta, player_id)
    redis_client.expire(weekly_key, 604800)  # 7 days
    
    # Update monthly leaderboard
    monthly_key = f"leaderboard:monthly:{datetime.now().strftime('%Y-%m')}"
    redis_client.zincrby(monthly_key, score_delta, player_id)
    redis_client.expire(monthly_key, 2592000)  # 30 days
    
    # Update player stats
    stats_key = f"stats:{player_id}"
    redis_client.hincrby(stats_key, "matches_played", 1)
    redis_client.hincrby(stats_key, "kills", match_stats.get("kills", 0))
    redis_client.hincrby(stats_key, "deaths", match_stats.get("deaths", 0))
    redis_client.hincrby(stats_key, "wins", 1 if match_stats.get("won", False) else 0)
    
    return {"success": True, "new_score": redis_client.zscore("leaderboard:global", player_id)}
```

### 3. Matchmaking Service

```python
# matchmaking.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
import asyncio
import json
from typing import Dict, List
from datetime import datetime

router = APIRouter(prefix="/matchmaking", tags=["Matchmaking"])

class MatchmakingQueue:
    def __init__(self):
        self.queue: List[Dict] = []
        self.matches: Dict[str, List] = {}
        
    async def add_player(self, player_data: dict):
        """Add player to matchmaking queue"""
        player_data["joined_at"] = datetime.utcnow()
        player_data["skill_rating"] = self._get_player_skill(player_data["player_id"])
        self.queue.append(player_data)
        
        # Try to find match
        await self._try_match_players()
    
    def _get_player_skill(self, player_id: str) -> int:
        """Get player's skill rating"""
        score = redis_client.zscore("leaderboard:global", player_id)
        return int(score) if score else 1000  # Default rating
    
    async def _try_match_players(self):
        """Try to match players with similar skill"""
        if len(self.queue) < 2:
            return
        
        # Sort queue by skill rating
        self.queue.sort(key=lambda x: x["skill_rating"])
        
        # Match players in groups of 4-8
        while len(self.queue) >= 4:
            # Take top 4-8 players with similar skill
            match_size = min(8, len(self.queue))
            matched_players = self.queue[:match_size]
            
            # Check skill difference (max 200 points)
            if matched_players[-1]["skill_rating"] - matched_players[0]["skill_rating"] <= 200:
                # Create match
                match_id = f"match_{int(datetime.utcnow().timestamp())}"
                self.matches[match_id] = matched_players
                
                # Remove from queue
                self.queue = self.queue[match_size:]
                
                # Notify players
                await self._notify_match_found(match_id, matched_players)
            else:
                break
    
    async def _notify_match_found(self, match_id: str, players: List[Dict]):
        """Notify all players that match was found"""
        for player in players:
            if player.get("websocket"):
                await player["websocket"].send_json({
                    "type": "match_found",
                    "match_id": match_id,
                    "players": [p["username"] for p in players]
                })

matchmaking_queue = MatchmakingQueue()

@router.websocket("/queue")
async def matchmaking_websocket(websocket: WebSocket):
    """WebSocket endpoint for matchmaking"""
    await websocket.accept()
    
    player_data = None
    
    try:
        # Receive player data
        data = await websocket.receive_json()
        player_data = {
            "player_id": data["player_id"],
            "username": data["username"],
            "game_mode": data.get("game_mode", "free_for_all"),
            "websocket": websocket
        }
        
        # Add to queue
        await matchmaking_queue.add_player(player_data)
        
        await websocket.send_json({
            "type": "queue_joined",
            "message": "Searching for match..."
        })
        
        # Keep connection alive
        while True:
            await asyncio.sleep(1)
            await websocket.send_json({"type": "ping"})
            
    except WebSocketDisconnect:
        # Remove from queue if still there
        if player_data and player_data in matchmaking_queue.queue:
            matchmaking_queue.queue.remove(player_data)
```

### 4. Server Statistics and Monitoring

```python
# stats.py
from fastapi import APIRouter, Depends
from datetime import datetime, timedelta

router = APIRouter(prefix="/stats", tags=["Statistics"])

@router.get("/server")
async def get_server_stats():
    """Get server statistics"""
    
    # Get active players count
    active_players = len(redis_client.keys("session:*"))
    
    # Get total matches today
    today = datetime.now().strftime('%Y-%m-%d')
    matches_today = redis_client.get(f"matches:count:{today}") or 0
    
    # Get total registered players
    total_players = redis_client.hlen("usernames")
    
    return {
        "active_players": active_players,
        "matches_today": int(matches_today),
        "total_players": total_players,
        "server_uptime": get_server_uptime(),
        "timestamp": datetime.utcnow().isoformat()
    }

@router.get("/player/{player_id}/history")
async def get_match_history(
    player_id: str,
    limit: int = 10,
    user: dict = Depends(verify_token)
):
    """Get player's recent match history"""
    
    # Get recent matches from Redis list
    matches = redis_client.lrange(f"matches:history:{player_id}", 0, limit - 1)
    
    match_history = []
    for match_data in matches:
        match_info = json.loads(match_data)
        match_history.append(match_info)
    
    return {"matches": match_history, "count": len(match_history)}

def get_server_uptime():
    """Calculate server uptime"""
    start_time = redis_client.get("server:start_time")
    if start_time:
        start = datetime.fromisoformat(start_time)
        uptime = datetime.utcnow() - start
        return str(uptime)
    return "Unknown"
```

### 5. Main Server Entry Point

```python
# main.py
"""
BombBrawl Python Server - Main Entry Point
Run with: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
"""

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import redis
from datetime import datetime

# Import routers
from auth import router as auth_router
from leaderboards import router as leaderboard_router
from matchmaking import router as matchmaking_router
from stats import router as stats_router

# Initialize FastAPI
app = FastAPI(
    title="BombBrawl Server",
    description="Python backend server for BombBrawl game (Like BombSquad)",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(leaderboard_router)
app.include_router(matchmaking_router)
app.include_router(stats_router)

# Initialize Redis
redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)

@app.on_event("startup")
async def startup_event():
    """Initialize server on startup"""
    print("🚀 BombBrawl Server Starting...")
    redis_client.set("server:start_time", datetime.utcnow().isoformat())
    print("✅ Server ready!")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    print("🛑 Server shutting down...")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": "BombBrawl Server",
        "version": "1.0.0",
        "status": "online",
        "message": "Python backend for BombBrawl (Like BombSquad)"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
```

### Python Server Requirements

Create `requirements.txt`:
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
redis==5.0.1
pydantic==2.5.0
websockets==12.0
asyncio==3.4.3
```

### Deployment Configuration

#### Docker Compose Setup
```yaml
# docker-compose.yml
version: '3.8'

services:
  server:
    build: .
    ports:
      - "8000:8000"
    environment:
      - REDIS_HOST=redis
      - DATABASE_URL=postgresql://user:password@db:5432/bombbrawl
    depends_on:
      - redis
      - db
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: bombbrawl
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  redis_data:
  postgres_data:
```

#### Dockerfile
```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Integration with Unity Client

```csharp
// UnityPythonServerClient.cs
using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using System.Collections.Generic;
using Newtonsoft.Json;

public class PythonServerClient : MonoBehaviour
{
    private const string SERVER_URL = "http://your-server.com:8000";
    private string authToken;
    
    [System.Serializable]
    public class LoginRequest
    {
        public string username;
        public string password;
        public string device_id;
    }
    
    [System.Serializable]
    public class TokenResponse
    {
        public string access_token;
        public string token_type;
        public string player_id;
        public string username;
    }
    
    public IEnumerator Login(string username, string password)
    {
        var request = new LoginRequest
        {
            username = username,
            password = password,
            device_id = SystemInfo.deviceUniqueIdentifier
        };
        
        string json = JsonConvert.SerializeObject(request);
        
        using (UnityWebRequest www = UnityWebRequest.Post($"{SERVER_URL}/auth/login", json, "application/json"))
        {
            yield return www.SendWebRequest();
            
            if (www.result == UnityWebRequest.Result.Success)
            {
                TokenResponse response = JsonConvert.DeserializeObject<TokenResponse>(www.downloadHandler.text);
                authToken = response.access_token;
                Debug.Log($"Logged in as {response.username}");
            }
            else
            {
                Debug.LogError($"Login failed: {www.error}");
            }
        }
    }
    
    public IEnumerator GetLeaderboard()
    {
        using (UnityWebRequest www = UnityWebRequest.Get($"{SERVER_URL}/leaderboards/top"))
        {
            www.SetRequestHeader("Authorization", $"Bearer {authToken}");
            yield return www.SendWebRequest();
            
            if (www.result == UnityWebRequest.Result.Success)
            {
                Debug.Log($"Leaderboard: {www.downloadHandler.text}");
            }
        }
    }
}
```

### Benefits of Python Backend (Like BombSquad)

1. **Familiar Architecture**: Same technology as BombSquad
2. **Rapid Development**: Python is quick for prototyping and iteration
3. **Rich Ecosystem**: Many libraries for data processing, analytics, AI
4. **Easy Deployment**: Can be deployed on any cloud provider
5. **Scalability**: FastAPI is async and highly performant
6. **Cost-Effective**: Can handle thousands of concurrent connections
7. **Maintainability**: Clean, readable code like BombSquad

This Python backend complements Photon's real-time multiplayer and provides additional features that are managed server-side.

## Performance Optimization Strategies

### 1. Object Pooling Implementation
```csharp
public class PoolManager : MonoBehaviour
{
    [System.Serializable]
    public class Pool
    {
        public string tag;
        public GameObject prefab;
        public int size;
    }
    
    public List<Pool> pools;
    private Dictionary<string, Queue<GameObject>> poolDictionary;
    
    private void Start()
    {
        poolDictionary = new Dictionary<string, Queue<GameObject>>();
        
        foreach (Pool pool in pools)
        {
            Queue<GameObject> objectPool = new Queue<GameObject>();
            
            for (int i = 0; i < pool.size; i++)
            {
                GameObject obj = Instantiate(pool.prefab);
                obj.SetActive(false);
                objectPool.Enqueue(obj);
            }
            
            poolDictionary.Add(pool.tag, objectPool);
        }
    }
    
    public GameObject GetFromPool(string tag, Vector3 position, Quaternion rotation)
    {
        if (!poolDictionary.ContainsKey(tag))
        {
            Debug.LogWarning($"Pool with tag {tag} doesn't exist");
            return null;
        }
        
        GameObject objectToSpawn = poolDictionary[tag].Dequeue();
        objectToSpawn.SetActive(true);
        objectToSpawn.transform.position = position;
        objectToSpawn.transform.rotation = rotation;
        
        poolDictionary[tag].Enqueue(objectToSpawn);
        
        return objectToSpawn;
    }
}
```

### 2. LOD (Level of Detail) Strategy
- Use LOD groups for character models
- 3 LOD levels: High (0-10m), Medium (10-25m), Low (25-50m)
- Cull objects beyond 50m
- Reduce particle effects at distance

### 3. Render Optimization
- Use static batching for static objects
- Dynamic batching for small dynamic objects
- GPU instancing for repeated objects
- Texture atlasing for UI and characters
- Occlusion culling for maps

### 4. Network Optimization
- Send only delta changes
- Compress network messages
- Implement lag compensation
- Client-side prediction
- Server reconciliation

## Security Considerations

### 1. Anti-Cheat Measures
- Server-authoritative gameplay
- Validation of all client inputs
- Detect impossible movements
- Rate limiting for actions
- Obfuscated code (IL2CPP)

### 2. Data Protection
- Encrypted save files
- Secure communication (HTTPS)
- IAP receipt validation
- Protected PlayerPrefs
- Secure random generation

### 3. Multiplayer Security
- Room validation
- Player authentication
- Anti-speed hack detection
- Memory protection
- Code injection prevention

## Scalability Plan

### Horizontal Scaling
- Photon Cloud auto-scales
- Firebase scales automatically
- CDN for asset delivery
- Regional server selection

### Vertical Scaling
- Optimize memory usage
- Reduce CPU overhead
- Minimize network traffic
- Efficient asset loading

This architecture provides a solid foundation for a professional-grade multiplayer game with room for growth and optimization.
