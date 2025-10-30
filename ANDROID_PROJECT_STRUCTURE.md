# BombBrawl Android Project Structure

## Overview
This document outlines the recommended project structure for the BombBrawl Android game development using Unity.

## Unity Project Structure

```
BombBrawl/
├── Assets/
│   ├── _Project/                      # Main project assets
│   │   ├── Scenes/                    # Game scenes
│   │   │   ├── Main.unity            # Main menu scene
│   │   │   ├── Gameplay.unity        # Core gameplay scene
│   │   │   ├── Lobby.unity           # Multiplayer lobby
│   │   │   └── Loading.unity         # Loading screen
│   │   │
│   │   ├── Scripts/                   # C# scripts organized by feature
│   │   │   ├── Core/                 # Core game systems
│   │   │   │   ├── GameManager.cs
│   │   │   │   ├── SceneManager.cs
│   │   │   │   ├── AudioManager.cs
│   │   │   │   ├── InputManager.cs
│   │   │   │   └── PoolManager.cs
│   │   │   │
│   │   │   ├── Player/               # Player-related scripts
│   │   │   │   ├── PlayerController.cs
│   │   │   │   ├── PlayerMovement.cs
│   │   │   │   ├── PlayerHealth.cs
│   │   │   │   ├── PlayerAnimation.cs
│   │   │   │   ├── PlayerInput.cs
│   │   │   │   └── PlayerCustomization.cs
│   │   │   │
│   │   │   ├── Weapons/              # Bomb and weapon systems
│   │   │   │   ├── BombController.cs
│   │   │   │   ├── BombTypes/
│   │   │   │   │   ├── StandardBomb.cs
│   │   │   │   │   ├── StickyBomb.cs
│   │   │   │   │   ├── IceBomb.cs
│   │   │   │   │   ├── ImpactBomb.cs
│   │   │   │   │   └── LandMine.cs
│   │   │   │   ├── Explosion.cs
│   │   │   │   └── ExplosionManager.cs
│   │   │   │
│   │   │   ├── PowerUps/             # Power-up system
│   │   │   │   ├── PowerUpManager.cs
│   │   │   │   ├── PowerUpSpawner.cs
│   │   │   │   ├── PowerUpBase.cs
│   │   │   │   └── PowerUpTypes/
│   │   │   │       ├── SpeedBoost.cs
│   │   │   │       ├── ExtraBombs.cs
│   │   │   │       ├── BiggerExplosion.cs
│   │   │   │       ├── Shield.cs
│   │   │   │       └── PunchPower.cs
│   │   │   │
│   │   │   ├── GameModes/            # Different game modes
│   │   │   │   ├── GameModeBase.cs
│   │   │   │   ├── FreeForAll.cs
│   │   │   │   ├── TeamDeathmatch.cs
│   │   │   │   ├── CaptureTheFlag.cs
│   │   │   │   ├── KingOfHill.cs
│   │   │   │   ├── Hockey.cs
│   │   │   │   ├── Football.cs
│   │   │   │   ├── Elimination.cs
│   │   │   │   ├── RaceMode.cs
│   │   │   │   └── Onslaught.cs
│   │   │   │
│   │   │   ├── AI/                   # AI bot system
│   │   │   │   ├── AIController.cs
│   │   │   │   ├── AIBehavior.cs
│   │   │   │   ├── AIPathfinding.cs
│   │   │   │   └── AIDifficulty.cs
│   │   │   │
│   │   │   ├── Multiplayer/          # Networking
│   │   │   │   ├── NetworkManager.cs
│   │   │   │   ├── RoomManager.cs
│   │   │   │   ├── MatchmakingSystem.cs
│   │   │   │   ├── NetworkPlayer.cs
│   │   │   │   ├── NetworkSyncManager.cs
│   │   │   │   └── LagCompensation.cs
│   │   │   │
│   │   │   ├── UI/                   # User interface
│   │   │   │   ├── MenuSystem/
│   │   │   │   │   ├── MainMenu.cs
│   │   │   │   │   ├── LobbyMenu.cs
│   │   │   │   │   ├── SettingsMenu.cs
│   │   │   │   │   ├── CharacterSelection.cs
│   │   │   │   │   └── ShopMenu.cs
│   │   │   │   ├── HUD/
│   │   │   │   │   ├── GameHUD.cs
│   │   │   │   │   ├── ScoreDisplay.cs
│   │   │   │   │   ├── HealthBar.cs
│   │   │   │   │   ├── KillFeed.cs
│   │   │   │   │   └── PowerUpIndicator.cs
│   │   │   │   └── Popups/
│   │   │   │       ├── VictoryScreen.cs
│   │   │   │       ├── DefeatScreen.cs
│   │   │   │       └── NotificationSystem.cs
│   │   │   │
│   │   │   ├── Map/                  # Map and environment
│   │   │   │   ├── MapManager.cs
│   │   │   │   ├── MapInteractables/
│   │   │   │   │   ├── DestructibleObject.cs
│   │   │   │   │   ├── MovingPlatform.cs
│   │   │   │   │   ├── BouncePad.cs
│   │   │   │   │   ├── Teleporter.cs
│   │   │   │   │   └── Hazard.cs
│   │   │   │   └── SpawnSystem.cs
│   │   │   │
│   │   │   ├── Progression/          # Player progression
│   │   │   │   ├── ProgressionManager.cs
│   │   │   │   ├── LevelSystem.cs
│   │   │   │   ├── AchievementSystem.cs
│   │   │   │   ├── UnlockSystem.cs
│   │   │   │   ├── CurrencyManager.cs
│   │   │   │   ├── DailyChallenges.cs
│   │   │   │   └── BattlePass.cs
│   │   │   │
│   │   │   ├── Social/               # Social features
│   │   │   │   ├── FriendsSystem.cs
│   │   │   │   ├── PartySystem.cs
│   │   │   │   ├── ChatSystem.cs
│   │   │   │   ├── ClanSystem.cs
│   │   │   │   └── GiftingSystem.cs
│   │   │   │
│   │   │   ├── Monetization/         # IAP and ads
│   │   │   │   ├── IAPManager.cs
│   │   │   │   ├── AdManager.cs
│   │   │   │   ├── ShopSystem.cs
│   │   │   │   └── PurchaseValidator.cs
│   │   │   │
│   │   │   ├── Data/                 # Data management
│   │   │   │   ├── SaveSystem.cs
│   │   │   │   ├── CloudSave.cs
│   │   │   │   ├── DataModels/
│   │   │   │   │   ├── PlayerData.cs
│   │   │   │   │   ├── GameSettings.cs
│   │   │   │   │   ├── ProgressData.cs
│   │   │   │   │   └── MatchData.cs
│   │   │   │   └── DatabaseManager.cs
│   │   │   │
│   │   │   ├── Analytics/            # Analytics and tracking
│   │   │   │   ├── AnalyticsManager.cs
│   │   │   │   ├── EventTracker.cs
│   │   │   │   └── PerformanceMonitor.cs
│   │   │   │
│   │   │   └── Utilities/            # Helper scripts
│   │   │       ├── Extensions.cs
│   │   │       ├── Constants.cs
│   │   │       ├── Helpers.cs
│   │   │       └── Debug/
│   │   │           ├── DebugConsole.cs
│   │   │           └── PerformanceDisplay.cs
│   │   │
│   │   ├── Prefabs/                   # Reusable game objects
│   │   │   ├── Characters/
│   │   │   │   ├── Player.prefab
│   │   │   │   └── CharacterTypes/
│   │   │   ├── Weapons/
│   │   │   │   ├── StandardBomb.prefab
│   │   │   │   ├── StickyBomb.prefab
│   │   │   │   └── Explosion.prefab
│   │   │   ├── PowerUps/
│   │   │   │   ├── SpeedBoost.prefab
│   │   │   │   ├── Shield.prefab
│   │   │   │   └── ExtraBombs.prefab
│   │   │   ├── UI/
│   │   │   │   ├── MainMenu.prefab
│   │   │   │   ├── HUD.prefab
│   │   │   │   └── Popups/
│   │   │   ├── Environment/
│   │   │   │   ├── Platform.prefab
│   │   │   │   ├── Wall.prefab
│   │   │   │   └── Hazard.prefab
│   │   │   └── Effects/
│   │   │       ├── ExplosionEffect.prefab
│   │   │       ├── PowerUpEffect.prefab
│   │   │       └── ParticleEffects/
│   │   │
│   │   ├── Models/                    # 3D models
│   │   │   ├── Characters/
│   │   │   │   ├── Character_01.fbx
│   │   │   │   ├── Character_02.fbx
│   │   │   │   └── Accessories/
│   │   │   ├── Environment/
│   │   │   │   ├── Maps/
│   │   │   │   │   ├── IceRink/
│   │   │   │   │   ├── Stadium/
│   │   │   │   │   └── Castle/
│   │   │   │   └── Props/
│   │   │   └── Items/
│   │   │       ├── Bombs/
│   │   │       └── PowerUps/
│   │   │
│   │   ├── Materials/                 # Materials and shaders
│   │   │   ├── Characters/
│   │   │   ├── Environment/
│   │   │   ├── Effects/
│   │   │   └── UI/
│   │   │
│   │   ├── Textures/                  # Texture files
│   │   │   ├── Characters/
│   │   │   ├── Environment/
│   │   │   ├── UI/
│   │   │   └── Effects/
│   │   │
│   │   ├── Animations/                # Animation files
│   │   │   ├── Characters/
│   │   │   │   ├── Idle.anim
│   │   │   │   ├── Run.anim
│   │   │   │   ├── Jump.anim
│   │   │   │   ├── Punch.anim
│   │   │   │   ├── Kick.anim
│   │   │   │   └── Victory.anim
│   │   │   ├── AnimationControllers/
│   │   │   │   └── PlayerController.controller
│   │   │   └── UI/
│   │   │
│   │   ├── Audio/                     # Sound files
│   │   │   ├── Music/
│   │   │   │   ├── MainMenu.mp3
│   │   │   │   ├── Gameplay_01.mp3
│   │   │   │   └── Victory.mp3
│   │   │   ├── SFX/
│   │   │   │   ├── Explosions/
│   │   │   │   ├── Characters/
│   │   │   │   ├── PowerUps/
│   │   │   │   ├── UI/
│   │   │   │   └── Environment/
│   │   │   └── AudioMixers/
│   │   │       └── MainMixer.mixer
│   │   │
│   │   ├── UI/                        # UI assets
│   │   │   ├── Sprites/
│   │   │   │   ├── Icons/
│   │   │   │   ├── Buttons/
│   │   │   │   ├── Backgrounds/
│   │   │   │   └── Characters/
│   │   │   ├── Fonts/
│   │   │   └── Atlases/
│   │   │
│   │   ├── Resources/                 # Runtime loaded assets
│   │   │   ├── Configs/
│   │   │   │   ├── GameModeConfigs/
│   │   │   │   ├── CharacterConfigs/
│   │   │   │   └── MapConfigs/
│   │   │   └── Localization/
│   │   │       ├── English.json
│   │   │       ├── Spanish.json
│   │   │       └── French.json
│   │   │
│   │   ├── StreamingAssets/           # Platform-specific assets
│   │   │   └── AssetBundles/
│   │   │
│   │   └── Plugins/                   # Third-party plugins
│   │       ├── Android/               # Android-specific plugins
│   │       │   └── AndroidManifest.xml
│   │       ├── Photon/                # PUN2
│   │       ├── Firebase/              # Firebase SDK
│   │       ├── PlayServices/          # Google Play Services
│   │       └── AdMob/                 # AdMob SDK
│   │
│   ├── Third-Party/                   # Third-party assets
│   │   ├── DOTween/                  # Animation library
│   │   ├── TextMeshPro/              # Text rendering
│   │   └── PostProcessing/            # Visual effects
│   │
│   └── Editor/                        # Editor tools and extensions
│       ├── BuildTools/
│       ├── Inspectors/
│       └── Utilities/
│
├── ProjectSettings/                   # Unity project settings
│   ├── ProjectSettings.asset
│   ├── QualitySettings.asset
│   ├── TagManager.asset
│   └── InputManager.asset
│
├── Packages/                          # Unity Package Manager
│   └── manifest.json
│
└── Build/                            # Build outputs
    ├── Android/
    │   ├── Development/
    │   └── Release/
    └── iOS/                          # Future iOS builds

```

## Android-Specific Configuration

### AndroidManifest.xml Configuration
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.yourstudio.bombbrawl"
    android:versionCode="1"
    android:versionName="1.0">

    <!-- Permissions -->
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
    <uses-permission android:name="android.permission.VIBRATE"/>
    <uses-permission android:name="android.permission.WAKE_LOCK"/>
    
    <!-- Optional Permissions -->
    <uses-permission android:name="android.permission.BLUETOOTH"/>
    <uses-permission android:name="android.permission.BLUETOOTH_ADMIN"/>
    <uses-permission android:name="android.permission.RECORD_AUDIO"/> <!-- For voice chat -->
    
    <!-- Required Features -->
    <uses-feature android:glEsVersion="0x00030000" android:required="true"/>
    <uses-feature android:name="android.hardware.touchscreen" android:required="false"/>
    <uses-feature android:name="android.hardware.gamepad" android:required="false"/>
    
    <!-- Minimum Android Version -->
    <uses-sdk android:minSdkVersion="24" android:targetSdkVersion="33"/>
    
    <application
        android:allowBackup="true"
        android:icon="@mipmap/app_icon"
        android:label="@string/app_name"
        android:theme="@style/UnityThemeSelector"
        android:hardwareAccelerated="true">
        
        <!-- Main Activity -->
        <activity android:name="com.unity3d.player.UnityPlayerActivity"
            android:configChanges="orientation|screenSize|keyboard|keyboardHidden"
            android:screenOrientation="landscape"
            android:launchMode="singleTask">
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
        
        <!-- Firebase -->
        <meta-data android:name="com.google.android.gms.games.APP_ID"
            android:value="@string/app_id"/>
        
        <!-- AdMob -->
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"/>
    </application>
</manifest>
```

### Gradle Configuration

#### build.gradle (Project level)
```gradle
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:7.4.2'
        classpath 'com.google.gms:google-services:4.3.15'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
        flatDir {
            dirs 'libs'
        }
    }
}
```

#### build.gradle (App level)
```gradle
apply plugin: 'com.android.application'
apply plugin: 'com.google.gms.google-services'

android {
    compileSdkVersion 33
    buildToolsVersion '30.0.3'
    
    defaultConfig {
        applicationId "com.yourstudio.bombbrawl"
        minSdkVersion 24
        targetSdkVersion 33
        versionCode 1
        versionName "1.0"
        
        multiDexEnabled true
    }
    
    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
        debug {
            minifyEnabled false
            debuggable true
        }
    }
    
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
    // Unity
    implementation fileTree(dir: 'libs', include: ['*.jar'])
    
    // Google Play Services
    implementation 'com.google.android.gms:play-services-games:23.1.0'
    implementation 'com.google.android.gms:play-services-auth:20.5.0'
    
    // Firebase
    implementation platform('com.google.firebase:firebase-bom:32.0.0')
    implementation 'com.google.firebase:firebase-analytics'
    implementation 'com.google.firebase:firebase-auth'
    implementation 'com.google.firebase:firebase-database'
    implementation 'com.google.firebase:firebase-storage'
    implementation 'com.google.firebase:firebase-crashlytics'
    
    // AdMob
    implementation 'com.google.android.gms:play-services-ads:22.0.0'
    
    // Billing
    implementation 'com.android.billingclient:billing:5.2.0'
    
    // Photon (If using external library)
    // implementation 'com.photonengine:photon-android:4.x.x.x'
}
```

## Unity Package Dependencies

### packages/manifest.json
```json
{
  "dependencies": {
    "com.unity.textmeshpro": "3.0.6",
    "com.unity.render-pipelines.universal": "12.1.6",
    "com.unity.addressables": "1.20.5",
    "com.unity.services.analytics": "4.4.0",
    "com.unity.services.authentication": "2.4.0",
    "com.unity.services.core": "1.8.1",
    "com.unity.multiplayer.tools": "1.1.0",
    "com.unity.purchasing": "4.7.0",
    "com.unity.ads": "4.4.2",
    "com.unity.mobile.notifications": "2.1.0",
    "com.unity.2d.sprite": "1.0.0",
    "com.unity.2d.tilemap": "1.0.0",
    "com.unity.ide.rider": "3.0.18",
    "com.unity.ide.visualstudio": "2.0.17",
    "com.unity.test-framework": "1.1.31"
  }
}
```

## Code Organization Patterns

### 1. Singleton Pattern (For Managers)
```csharp
public class GameManager : MonoBehaviour
{
    private static GameManager _instance;
    public static GameManager Instance
    {
        get
        {
            if (_instance == null)
            {
                _instance = FindObjectOfType<GameManager>();
                if (_instance == null)
                {
                    GameObject go = new GameObject("GameManager");
                    _instance = go.AddComponent<GameManager>();
                }
            }
            return _instance;
        }
    }
    
    private void Awake()
    {
        if (_instance != null && _instance != this)
        {
            Destroy(gameObject);
            return;
        }
        _instance = this;
        DontDestroyOnLoad(gameObject);
    }
}
```

### 2. Object Pooling Pattern
```csharp
public class PoolManager : MonoBehaviour
{
    private Dictionary<string, Queue<GameObject>> poolDictionary;
    
    public GameObject GetFromPool(string tag)
    {
        if (!poolDictionary.ContainsKey(tag))
            return null;
            
        GameObject obj = poolDictionary[tag].Dequeue();
        obj.SetActive(true);
        poolDictionary[tag].Enqueue(obj);
        return obj;
    }
    
    public void ReturnToPool(string tag, GameObject obj)
    {
        obj.SetActive(false);
    }
}
```

### 3. Event System Pattern
```csharp
public class EventManager
{
    private static Dictionary<string, UnityEvent> eventDictionary = 
        new Dictionary<string, UnityEvent>();
    
    public static void StartListening(string eventName, UnityAction listener)
    {
        if (eventDictionary.TryGetValue(eventName, out UnityEvent thisEvent))
        {
            thisEvent.AddListener(listener);
        }
        else
        {
            thisEvent = new UnityEvent();
            thisEvent.AddListener(listener);
            eventDictionary.Add(eventName, thisEvent);
        }
    }
    
    public static void StopListening(string eventName, UnityAction listener)
    {
        if (eventDictionary.TryGetValue(eventName, out UnityEvent thisEvent))
        {
            thisEvent.RemoveListener(listener);
        }
    }
    
    public static void TriggerEvent(string eventName)
    {
        if (eventDictionary.TryGetValue(eventName, out UnityEvent thisEvent))
        {
            thisEvent.Invoke();
        }
    }
}
```

## Asset Management Strategy

### 1. Addressables System
- Use Addressables for dynamic content loading
- Group assets by:
  - Characters (loaded on demand)
  - Maps (loaded per match)
  - UI Screens (loaded per scene)
  - Audio (streamed)

### 2. Asset Bundles Structure
```
AssetBundles/
├── Core/               # Essential assets (loaded at startup)
├── Characters/         # Character packs (loaded on selection)
├── Maps/              # Map assets (loaded per match)
├── Audio/             # Music and SFX (streamed)
└── Localization/      # Language packs (loaded based on device)
```

### 3. Texture Atlas Strategy
- UI elements: Single atlas per screen
- Characters: Atlas per character set
- Effects: Shared atlas for particle effects

## Build Configuration

### Development Build
- Debug symbols enabled
- Logging enabled
- Profiler enabled
- IL2CPP (for performance testing)

### Release Build
- Obfuscation enabled
- Logging disabled
- Strip engine code
- IL2CPP (required for ARM64)
- Gradle template customization
- ProGuard optimization

## Version Control Strategy

### .gitignore for Unity
```
[Ll]ibrary/
[Tt]emp/
[Oo]bj/
[Bb]uild/
[Bb]uilds/
[Ll]ogs/
[Uu]ser[Ss]ettings/

# Visual Studio cache
.vs/

# Rider cache
.idea/

# Android build
*.apk
*.aab
```

## Continuous Integration Setup

### GitHub Actions Workflow (example)
```yaml
name: Build Android

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Cache Unity Library
      uses: actions/cache@v2
      with:
        path: Library
        key: Library-${{ hashFiles('Assets/**', 'Packages/**', 'ProjectSettings/**') }}
    
    - name: Build Android
      uses: game-ci/unity-builder@v2
      with:
        targetPlatform: Android
        
    - name: Upload Build
      uses: actions/upload-artifact@v2
      with:
        name: Build-Android
        path: build/Android
```

## Testing Structure

### Unit Tests
```
Assets/Tests/
├── EditMode/          # Edit mode tests
│   ├── PlayerTests.cs
│   ├── BombTests.cs
│   └── UtilityTests.cs
└── PlayMode/          # Play mode tests
    ├── GameplayTests.cs
    ├── NetworkTests.cs
    └── UITests.cs
```

## Performance Considerations

### Memory Management
- Object pooling for frequently instantiated objects
- Addressables for large assets
- Texture compression (ETC2 for Android)
- Audio compression (Vorbis for Android)

### Optimization Targets
- Target 60 FPS on mid-range devices
- Keep draw calls < 500
- Memory usage < 512MB on low-end devices
- APK size < 150MB (base)

## Documentation Structure

```
Documentation/
├── API/               # Code documentation
├── GameDesign/        # Design documents
├── Technical/         # Technical specifications
└── UserManual/        # Player guides
```

This structure provides a solid foundation for developing a professional-grade multiplayer Android game with Unity, following industry best practices and scalability considerations.
