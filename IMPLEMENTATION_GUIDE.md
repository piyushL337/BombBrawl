# BombBrawl Implementation Guide

## Quick Start Guide for Unity Android Development

This guide provides step-by-step instructions to begin implementing the BombBrawl game based on the comprehensive development plan.

## Prerequisites

### Software Requirements
- **Unity Hub** (latest version)
- **Unity 2021.3 LTS** or newer
- **Visual Studio 2019/2022** or **Rider**
- **Android Studio** (for SDK/NDK)
- **Git** for version control
- **Python 3.8+** (optional, for custom backend server like BombSquad)

### Hardware Requirements
- **Development PC**: Windows 10/11, macOS 10.15+, or Linux
  - 16GB RAM minimum (32GB recommended)
  - 100GB free disk space
  - Dedicated GPU (NVIDIA/AMD)
- **Testing Devices**: 
  - Mid-range Android device (for testing)
  - High-end Android device (for quality reference)
  - Low-end Android device (for optimization testing)

### Accounts to Create
1. **Unity Account** - [unity.com](https://unity.com)
2. **Photon Account** - [photonengine.com](https://www.photonengine.com)
3. **Firebase Account** - [firebase.google.com](https://firebase.google.com)
4. **Google Play Console** - [play.google.com/console](https://play.google.com/console)
5. **Google AdMob** - [admob.google.com](https://admob.google.com)

## Step-by-Step Implementation

### Step 1: Install Unity and Set Up Android Build Support

```bash
# 1. Download Unity Hub from unity.com
# 2. Install Unity 2021.3 LTS or newer
# 3. During installation, include:
#    - Android Build Support
#    - Android SDK & NDK Tools
#    - OpenJDK
```

#### Configure Android Build Settings in Unity

1. Open Unity Hub → Installs → Click gear icon → Add Modules
2. Select:
   - ✅ Android Build Support
   - ✅ Android SDK & NDK Tools
   - ✅ OpenJDK
3. Wait for installation to complete

### Step 2: Create New Unity Project

```bash
# 1. Open Unity Hub
# 2. Click "New Project"
# 3. Select "3D Core" or "3D URP" template
# 4. Name: BombBrawl
# 5. Location: Choose your workspace
# 6. Create Project
```

#### Initial Project Configuration

1. **Switch to Android Platform**
   - File → Build Settings
   - Select "Android"
   - Click "Switch Platform"

2. **Configure Player Settings**
   - Edit → Project Settings → Player
   - Company Name: `YourStudioName`
   - Product Name: `BombBrawl`
   - Package Name: `com.yourstudio.bombbrawl`
   - Version: `0.1.0`
   - Minimum API Level: Android 7.0 (API 24)
   - Target API Level: Android 13 (API 33)
   - Scripting Backend: IL2CPP
   - Target Architectures: ARM64 ✅, ARMv7 ✅

3. **Configure Quality Settings**
   - Edit → Project Settings → Quality
   - Create quality presets: Low, Medium, High, Ultra
   - Set default quality to Medium for Android

### Step 3: Set Up Project Structure

Create the folder structure according to `ANDROID_PROJECT_STRUCTURE.md`:

```
Assets/
├── _Project/
│   ├── Scenes/
│   ├── Scripts/
│   │   ├── Core/
│   │   ├── Player/
│   │   ├── Weapons/
│   │   ├── PowerUps/
│   │   ├── GameModes/
│   │   ├── AI/
│   │   ├── Multiplayer/
│   │   ├── UI/
│   │   ├── Map/
│   │   ├── Progression/
│   │   ├── Social/
│   │   ├── Monetization/
│   │   ├── Data/
│   │   ├── Analytics/
│   │   └── Utilities/
│   ├── Prefabs/
│   ├── Models/
│   ├── Materials/
│   ├── Textures/
│   ├── Animations/
│   ├── Audio/
│   ├── UI/
│   └── Resources/
└── Third-Party/
```

### Step 4: Install Required Unity Packages

#### Method 1: Package Manager (Recommended)

1. Window → Package Manager
2. Install these packages:
   - **TextMesh Pro** (Essential)
   - **Universal RP** (Graphics)
   - **Addressables** (Asset Management)
   - **Unity Services Core** (Backend)
   - **Unity Analytics** (Tracking)
   - **Unity Ads** (Monetization)
   - **In-App Purchasing** (Monetization)
   - **Mobile Notifications** (Engagement)

#### Method 2: Manual manifest.json

Edit `Packages/manifest.json`:

```json
{
  "dependencies": {
    "com.unity.textmeshpro": "3.0.6",
    "com.unity.render-pipelines.universal": "12.1.6",
    "com.unity.addressables": "1.20.5",
    "com.unity.services.analytics": "4.4.0",
    "com.unity.services.core": "1.8.1",
    "com.unity.purchasing": "4.7.0",
    "com.unity.ads": "4.4.2",
    "com.unity.mobile.notifications": "2.1.0"
  }
}
```

### Step 5: Install Third-Party Assets

#### Photon PUN2 (Multiplayer)

1. Go to Unity Asset Store
2. Search "Photon PUN2"
3. Download and Import "Photon PUN 2 - FREE"
4. Configure Photon:
   - Window → Photon Unity Networking → PUN Wizard
   - Enter your Photon AppID from dashboard
   - Click "Setup Project"

#### DOTween (Animation - Optional but Recommended)

1. Asset Store → Search "DOTween"
2. Download free version
3. Import into project
4. Set up DOTween in Unity

### Step 6: Firebase Integration

#### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Name: BombBrawl
4. Enable Google Analytics
5. Complete setup

#### Download Firebase Config Files

1. In Firebase Console → Project Settings
2. Click "Add App" → Android
3. Enter package name: `com.yourstudio.bombbrawl`
4. Download `google-services.json`
5. Place in `Assets/Plugins/Android/`

#### Install Firebase Unity SDK

1. Download Firebase Unity SDK from [firebase.google.com/docs/unity/setup](https://firebase.google.com/docs/unity/setup)
2. Import these packages:
   - FirebaseAuth.unitypackage
   - FirebaseDatabase.unitypackage
   - FirebaseAnalytics.unitypackage
   - FirebaseStorage.unitypackage
   - FirebaseCrashlytics.unitypackage

### Step 7: Create Core Systems (Phase 1)

#### 7.1 Create GameManager

Create `Assets/_Project/Scripts/Core/GameManager.cs`:

```csharp
using UnityEngine;
using System;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }
    
    [Header("Game State")]
    public GameState CurrentState { get; private set; }
    
    [Header("Managers")]
    public AudioManager AudioManager { get; private set; }
    public InputManager InputManager { get; private set; }
    public UIManager UIManager { get; private set; }
    
    public event Action<GameState> OnGameStateChanged;
    
    private void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }
        
        Instance = this;
        DontDestroyOnLoad(gameObject);
        
        InitializeManagers();
    }
    
    private void InitializeManagers()
    {
        // Get or create managers
        AudioManager = GetComponentInChildren<AudioManager>();
        InputManager = GetComponentInChildren<InputManager>();
        UIManager = FindObjectOfType<UIManager>();
        
        Debug.Log("GameManager initialized");
    }
    
    public void ChangeGameState(GameState newState)
    {
        if (CurrentState == newState) return;
        
        CurrentState = newState;
        OnGameStateChanged?.Invoke(newState);
        Debug.Log($"Game state changed to: {newState}");
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

#### 7.2 Create AudioManager

Create `Assets/_Project/Scripts/Core/AudioManager.cs`:

```csharp
using UnityEngine;
using System.Collections.Generic;

public class AudioManager : MonoBehaviour
{
    public static AudioManager Instance { get; private set; }
    
    [Header("Audio Sources")]
    [SerializeField] private AudioSource musicSource;
    [SerializeField] private AudioSource sfxSource;
    
    [Header("Audio Clips")]
    [SerializeField] private AudioClip mainMenuMusic;
    [SerializeField] private AudioClip gameplayMusic;
    [SerializeField] private AudioClip victoryMusic;
    
    private Dictionary<string, AudioClip> sfxClips = new Dictionary<string, AudioClip>();
    
    private void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }
        
        Instance = this;
        DontDestroyOnLoad(gameObject);
        
        InitializeAudio();
    }
    
    private void InitializeAudio()
    {
        // Create audio sources if not assigned
        if (musicSource == null)
        {
            GameObject musicObj = new GameObject("MusicSource");
            musicObj.transform.SetParent(transform);
            musicSource = musicObj.AddComponent<AudioSource>();
            musicSource.loop = true;
        }
        
        if (sfxSource == null)
        {
            GameObject sfxObj = new GameObject("SFXSource");
            sfxObj.transform.SetParent(transform);
            sfxSource = sfxObj.AddComponent<AudioSource>();
        }
    }
    
    public void PlayMusic(string trackName)
    {
        AudioClip clip = null;
        
        switch (trackName)
        {
            case "MainMenu":
                clip = mainMenuMusic;
                break;
            case "Gameplay":
                clip = gameplayMusic;
                break;
            case "Victory":
                clip = victoryMusic;
                break;
        }
        
        if (clip != null && musicSource.clip != clip)
        {
            musicSource.clip = clip;
            musicSource.Play();
        }
    }
    
    public void PlaySFX(string sfxName)
    {
        if (sfxClips.TryGetValue(sfxName, out AudioClip clip))
        {
            sfxSource.PlayOneShot(clip);
        }
    }
    
    public void SetMusicVolume(float volume)
    {
        musicSource.volume = Mathf.Clamp01(volume);
    }
    
    public void SetSFXVolume(float volume)
    {
        sfxSource.volume = Mathf.Clamp01(volume);
    }
}
```

#### 7.3 Create InputManager

Create `Assets/_Project/Scripts/Core/InputManager.cs`:

```csharp
using UnityEngine;

public class InputManager : MonoBehaviour
{
    public static InputManager Instance { get; private set; }
    
    [Header("Input State")]
    public Vector2 MoveDirection { get; private set; }
    public bool BombButtonPressed { get; private set; }
    public bool PunchButtonPressed { get; private set; }
    public bool JumpButtonPressed { get; private set; }
    
    [Header("Touch Controls")]
    [SerializeField] private VirtualJoystick virtualJoystick;
    [SerializeField] private VirtualButton bombButton;
    [SerializeField] private VirtualButton punchButton;
    [SerializeField] private VirtualButton jumpButton;
    
    private void Awake()
    {
        Instance = this;
    }
    
    private void Update()
    {
        ProcessInput();
    }
    
    private void ProcessInput()
    {
        // Desktop/Editor input (for testing)
        if (Application.isEditor)
        {
            float horizontal = Input.GetAxisRaw("Horizontal");
            float vertical = Input.GetAxisRaw("Vertical");
            MoveDirection = new Vector2(horizontal, vertical).normalized;
            
            BombButtonPressed = Input.GetKeyDown(KeyCode.Space);
            PunchButtonPressed = Input.GetKeyDown(KeyCode.E);
            JumpButtonPressed = Input.GetKeyDown(KeyCode.W);
        }
        // Mobile touch input
        else
        {
            if (virtualJoystick != null)
                MoveDirection = virtualJoystick.Direction;
            
            if (bombButton != null)
                BombButtonPressed = bombButton.IsPressed;
            
            if (punchButton != null)
                PunchButtonPressed = punchButton.IsPressed;
            
            if (jumpButton != null)
                JumpButtonPressed = jumpButton.IsPressed;
        }
    }
}
```

### Step 8: Create First Scene

1. Create Main scene:
   - File → New Scene
   - Save as `Assets/_Project/Scenes/Main.unity`

2. Set up scene hierarchy:
   ```
   Main Scene
   ├── GameManager (Empty GameObject)
   │   ├── AudioManager
   │   └── InputManager
   ├── Canvas (UI)
   ├── EventSystem
   ├── Main Camera
   └── Directional Light
   ```

3. Attach scripts:
   - GameManager script to GameManager object
   - AudioManager script to AudioManager object
   - InputManager script to InputManager object

### Step 9: Build and Test on Device

1. **Connect Android Device**
   - Enable Developer Options on phone
   - Enable USB Debugging
   - Connect via USB

2. **Build Settings**
   - File → Build Settings
   - Add "Main" scene
   - Click "Build and Run"
   - Choose output location
   - Wait for build and installation

3. **Test Basic Functionality**
   - App launches successfully
   - No errors in logcat
   - Basic UI displays

### Step 10: Version Control Setup

Initialize Git repository:

```bash
cd BombBrawl
git init
git add .
git commit -m "Initial Unity project setup"
git remote add origin https://github.com/yourusername/BombBrawl.git
git push -u origin main
```

Create `.gitignore` for Unity:

```
[Ll]ibrary/
[Tt]emp/
[Oo]bj/
[Bb]uild/
[Bb]uilds/
[Ll]ogs/
[Uu]ser[Ss]ettings/
*.apk
*.aab
.vs/
.idea/
```

## Phase 2: Core Gameplay Implementation

### Step 11: Create Player Character

#### 11.1 Create Player Prefab

1. Create 3D capsule: GameObject → 3D Object → Capsule
2. Name it "Player"
3. Add components:
   - Rigidbody
   - Capsule Collider
4. Create `Assets/_Project/Scripts/Player/PlayerController.cs`

```csharp
using UnityEngine;

public class PlayerController : MonoBehaviour
{
    [Header("Movement")]
    [SerializeField] private float moveSpeed = 5f;
    [SerializeField] private float jumpForce = 10f;
    
    [Header("Components")]
    private Rigidbody rb;
    private InputManager input;
    
    public bool IsLocalPlayer { get; set; }
    
    private void Awake()
    {
        rb = GetComponent<Rigidbody>();
    }
    
    private void Start()
    {
        input = InputManager.Instance;
    }
    
    private void FixedUpdate()
    {
        if (!IsLocalPlayer) return;
        
        Move();
    }
    
    private void Move()
    {
        Vector3 movement = new Vector3(input.MoveDirection.x, 0, input.MoveDirection.y);
        rb.velocity = new Vector3(movement.x * moveSpeed, rb.velocity.y, movement.z * moveSpeed);
    }
    
    private void Update()
    {
        if (!IsLocalPlayer) return;
        
        if (input.JumpButtonPressed && IsGrounded())
        {
            rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);
        }
        
        if (input.BombButtonPressed)
        {
            DropBomb();
        }
    }
    
    private bool IsGrounded()
    {
        return Physics.Raycast(transform.position, Vector3.down, 1.1f);
    }
    
    private void DropBomb()
    {
        // To be implemented in bomb system
        Debug.Log("Bomb dropped!");
    }
}
```

5. Save as prefab: Drag Player into `Assets/_Project/Prefabs/Characters/`

### Step 12: Create Bomb System

#### 12.1 Create Bomb Prefab

1. Create 3D sphere: GameObject → 3D Object → Sphere
2. Name it "StandardBomb"
3. Scale: (0.5, 0.5, 0.5)
4. Add Rigidbody
5. Create `Assets/_Project/Scripts/Weapons/BombBase.cs`

```csharp
using UnityEngine;
using System.Collections;

public abstract class BombBase : MonoBehaviour
{
    [Header("Bomb Properties")]
    [SerializeField] protected float explosionRadius = 5f;
    [SerializeField] protected float explosionDamage = 100f;
    [SerializeField] protected float fuseTime = 3f;
    
    [Header("Effects")]
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
        if (explosionPrefab != null)
        {
            Instantiate(explosionPrefab, transform.position, Quaternion.identity);
        }
        
        // Find and damage players in radius
        Collider[] hitColliders = Physics.OverlapSphere(transform.position, explosionRadius);
        foreach (var hitCollider in hitColliders)
        {
            PlayerController player = hitCollider.GetComponent<PlayerController>();
            if (player != null)
            {
                float distance = Vector3.Distance(transform.position, player.transform.position);
                float damageMultiplier = 1 - (distance / explosionRadius);
                // Apply damage here
                Debug.Log($"Player hit with {explosionDamage * damageMultiplier} damage");
            }
        }
        
        OnExploded();
        Destroy(gameObject);
    }
    
    protected abstract void OnFuseTick(float remainingTime);
    protected abstract void OnExploded();
}
```

6. Create `Assets/_Project/Scripts/Weapons/StandardBomb.cs`:

```csharp
using UnityEngine;

public class StandardBomb : BombBase
{
    protected override void OnFuseTick(float remainingTime)
    {
        // Visual feedback
        float scale = 1 + (0.1f * Mathf.Sin(remainingTime * 10));
        transform.localScale = Vector3.one * 0.5f * scale;
    }
    
    protected override void OnExploded()
    {
        Debug.Log("Standard bomb exploded!");
    }
}
```

7. Save as prefab

## Continuing Development

After completing Phase 1 and 2 setup:

1. **Implement remaining systems** following DEVELOPMENT_PLAN.md phases
2. **Test frequently** on actual Android devices
3. **Optimize performance** using Unity Profiler
4. **Follow best practices** from TECHNICAL_ARCHITECTURE.md
5. **Document your progress** and create issues for bugs

## Useful Unity Commands

### Build Commands
```csharp
// Build APK
BuildPlayerOptions buildOptions = new BuildPlayerOptions
{
    scenes = new[] { "Assets/_Project/Scenes/Main.unity" },
    locationPathName = "Builds/BombBrawl.apk",
    target = BuildTarget.Android,
    options = BuildOptions.None
};
BuildPipeline.BuildPlayer(buildOptions);
```

### Debug Commands
```csharp
// Log to Android logcat
Debug.Log("Message");
Debug.LogWarning("Warning");
Debug.LogError("Error");

// Performance profiling
Profiler.BeginSample("MyCode");
// Your code here
Profiler.EndSample();
```

## Common Issues and Solutions

### Issue: Build fails with "SDK not found"
**Solution**: 
- Go to Edit → Preferences → External Tools
- Set Android SDK path
- Set Android NDK path
- Set JDK path

### Issue: App crashes on startup
**Solution**:
- Check logcat for errors: `adb logcat -s Unity`
- Verify all required permissions in AndroidManifest.xml
- Check IL2CPP build settings

### Issue: Low FPS on device
**Solution**:
- Use Unity Profiler to identify bottlenecks
- Reduce draw calls with batching
- Optimize scripts (avoid Update() when possible)
- Use object pooling for frequent instantiations

## Next Steps

1. Complete Phase 1-2 (Foundation and Core Mechanics)
2. Implement multiplayer using Photon PUN2
3. Create game modes one by one
4. Add maps and content
5. Implement progression systems
6. Polish and optimize
7. Test extensively
8. Launch!

## Resources

- **Unity Documentation**: [docs.unity3d.com](https://docs.unity3d.com)
- **Photon Tutorials**: [doc.photonengine.com](https://doc.photonengine.com)
- **Firebase Unity**: [firebase.google.com/docs/unity](https://firebase.google.com/docs/unity)
- **Android Development**: [developer.android.com/games](https://developer.android.com/games)

Happy coding! 🚀
