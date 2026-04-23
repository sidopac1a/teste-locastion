# معمارية النظام (System Architecture)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │   Browser   │  │   Mobile    │  │   Tablet    │  │     PWA     │   │
│  │   (Web)     │  │   (Web)     │  │   (Web)     │  │   (Web)     │   │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘   │
└─────────┼────────────────┼────────────────┼────────────────┼──────────┘
          │                │                │                │
          └────────────────┴────────────────┴────────────────┘
                                   │
                          HTTPS / TLS 1.3
                                   │
┌──────────────────────────────────┼─────────────────────────────────────┐
│                      VERCEL EDGE NETWORK                                  │
│  ┌───────────────────────────────┼─────────────────────────────────┐     │
│  │         Next.js 14            │         SSR / SSG / ISR         │     │
│  │      React 18 + TypeScript    │                                 │     │
│  │      Tailwind CSS + Lucide    │                                 │     │
│  └───────────────────────────────┼─────────────────────────────────┘     │
│                                  │                                       │
│  ┌───────────────────────────────┼─────────────────────────────────┐     │
│  │      Middleware (Security)   │  CSP, HSTS, X-Frame-Options     │     │
│  └───────────────────────────────┼─────────────────────────────────┘     │
└──────────────────────────────────┼─────────────────────────────────────┘
                                   │
                          Firebase SDK
                                   │
┌──────────────────────────────────┼─────────────────────────────────────┐
│                         FIREBASE BACKEND                                  │
│                                                                          │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────┐  │
│  │   Authentication    │  │   Cloud Firestore   │  │  Realtime DB    │  │
│  │   (Email/Password)  │  │   (NoSQL Database)  │  │  (Live Sync)    │  │
│  │                     │  │                     │  │                 │  │
│  │  • Login/Register   │  │  • Users Collection │  │  • Live Updates │  │
│  │  • Role Management  │  │  • Locations        │  │  • Presence     │  │
│  │  • Session Control  │  │  • Location History │  │  • Sync State   │  │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────┘  │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                    Security Rules (Firestore)                        │  │
│  │  • Admin: Full CRUD access                                          │  │
│  │  • Employee: Read own data, Update location sharing                 │  │
│  │  • Authenticated: Read user profiles                              │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                          External APIs
                                   │
┌──────────────────────────────────┼─────────────────────────────────────┐
│                      THIRD-PARTY SERVICES                                 │
│                                                                          │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────┐   │
│  │   OpenStreetMap     │  │   Google Maps API   │  │  Geolocation    │   │
│  │   (Free Tiles)      │  │   (Geocoding)       │  │  (Browser GPS)  │   │
│  │                     │  │                     │  │                 │   │
│  │  • Map Rendering    │  │  • Address Lookup   │  │  • Coordinates  │   │
│  │  • Markers          │  │  • Reverse Geocode  │  │  • Accuracy     │   │
│  │  • Zoom/Pan         │  │  • Arabic Support   │  │  • Timestamp    │   │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Employee  │────▶│  Browser    │────▶│  Firebase   │────▶│  Firestore  │
│   Device    │     │  Geolocation│     │   Auth      │     │  Database   │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                    │
                                                                    │ Real-time
                                                                    │ Sync
                                                                    ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Admin     │◀────│   Next.js   │◀────│  Firebase   │◀────│  Firestore  │
│  Dashboard  │     │   Client    │     │   SDK       │     │  Listener   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │
       │ Render
       ▼
┌─────────────┐
│   Leaflet   │
│    Map      │
│  (Markers)  │
└─────────────┘
```

## Component Hierarchy

```
App
├── Layout (AuthProvider + Toaster)
│   ├── Middleware (Security Headers)
│   │
│   ├── / (HomePage)
│   │   └── Landing Sections
│   │
│   ├── /login (LoginPage)
│   │   └── Auth Form
│   │
│   ├── /register (RegisterPage)
│   │   └── Registration Form
│   │
│   ├── /dashboard (Admin Dashboard)
│   │   ├── Navbar
│   │   ├── Stats Cards
│   │   ├── MapView (Leaflet)
│   │   ├── EmployeeCard[]
│   │   ├── EmployeeModal
│   │   └── LocationHistory
│   │
│   ├── /map (Full Map)
│   │   ├── Navbar
│   │   └── MapView (Leaflet)
│   │
│   ├── /employees (Employee Management)
│   │   ├── Navbar
│   │   ├── Search & Filter
│   │   ├── EmployeeCard[]
│   │   ├── EmployeeModal
│   │   └── LocationHistory
│   │
│   ├── /employee (Employee Dashboard)
│   │   ├── Navbar
│   │   ├── Location Status Card
│   │   ├── Tracking Info Card
│   │   └── LocationHistory Modal
│   │
│   └── /employee/map (Employee Map)
│       ├── Navbar
│       └── MapView (Leaflet)
│
└── Hooks
    ├── useAuth (Firebase Auth State)
    ├── useLocationTracker (Geolocation API)
    └── useRealtimeData (Firestore Listeners)
```

## Security Model

```
┌─────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                         │
├─────────────────────────────────────────────────────────────┤
│  Layer 1: Network                                           │
│  ├── HTTPS/TLS 1.3                                        │
│  ├── CSP Headers                                            │
│  ├── X-Frame-Options: DENY                                  │
│  └── HSTS                                                   │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: Authentication                                    │
│  ├── Firebase Auth (Email/Password)                       │
│  ├── JWT Tokens                                             │
│  └── Session Management                                     │
├─────────────────────────────────────────────────────────────┤
│  Layer 3: Authorization                                     │
│  ├── Role-based Access (Admin/Employee)                   │
│  ├── Firestore Security Rules                             │
│  └── Route Guards                                           │
├─────────────────────────────────────────────────────────────┤
│  Layer 4: Data Validation                                   │
│  ├── Input Sanitization                                     │
│  ├── TypeScript Types                                       │
│  └── Form Validation                                        │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

```
users/{uid}
├── uid: string
├── email: string
├── displayName: string
├── phone: string (optional)
├── department: string (optional)
├── role: "admin" | "employee"
├── isActive: boolean
├── locationSharingEnabled: boolean
├── createdAt: timestamp
└── updatedAt: timestamp

locations/{userId}
├── userId: string
├── latitude: number
├── longitude: number
├── accuracy: number (optional)
├── timestamp: timestamp
└── address: string (optional)

locationHistory/{docId}
├── userId: string
├── latitude: number
├── longitude: number
├── accuracy: number (optional)
├── timestamp: timestamp
└── address: string (optional)
```

## API Endpoints (Internal)

| Function | Description | Auth Required |
|----------|-------------|---------------|
| `registerUser()` | Create new account | No |
| `loginUser()` | Authenticate user | No |
| `logoutUser()` | End session | Yes |
| `createUser()` | Add employee (Admin) | Admin |
| `updateUser()` | Update profile | Owner/Admin |
| `deleteUser()` | Remove employee | Admin |
| `toggleUserStatus()` | Activate/Deactivate | Admin |
| `saveLocation()` | Store coordinates | Employee |
| `getLocationHistory()` | Retrieve history | Owner/Admin |
| `subscribeToLocations()` | Real-time locations | Admin |
| `subscribeToUsers()` | Real-time users | Admin |
