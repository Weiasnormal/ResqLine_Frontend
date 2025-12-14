# ResQLink Frontend Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Architecture](#architecture)
5. [API Integration](#api-integration)
6. [State Management](#state-management)
7. [Navigation](#navigation)
8. [Authentication Flow](#authentication-flow)
9. [Screens Documentation](#screens-documentation)
10. [Components Documentation](#components-documentation)
11. [Hooks](#hooks)
12. [Utilities](#utilities)
13. [Styling Guide](#styling-guide)
14. [Data Models](#data-models)
15. [Error Handling](#error-handling)
16. [Performance Optimization](#performance-optimization)
17. [Testing](#testing)
18. [Deployment](#deployment)

---

## Project Overview

**ResQLink** is a React Native mobile application built with Expo that enables users to report emergencies, track their reports, and access emergency hotlines. The application provides real-time emergency reporting with location tracking, photo uploads, and status monitoring.

### Key Features
- 📱 User authentication via OTP (SMS verification)
- 🚨 Emergency report creation with photo upload
- 📍 Automatic location detection with reverse geocoding
- 📊 Report tracking and status monitoring
- 📞 Emergency hotline directory
- 👤 User profile management
- 🔔 Push notifications for report updates

---

## Technology Stack

### Core Technologies
- **React Native**: 0.74.x
- **Expo**: ~51.x
- **TypeScript**: 5.x
- **React Navigation**: 6.x (Expo Router)

### State Management & Data Fetching
- **React Query (@tanstack/react-query)**: v5.x - Server state management
- **React Context API**: Local state management

### UI & Styling
- **React Native Elements**: UI components
- **Expo Vector Icons**: Icon library
- **Custom StyleSheets**: Component-specific styling

### Location & Media
- **expo-location**: GPS and reverse geocoding
- **expo-image-picker**: Photo selection
- **expo-camera**: Camera access

### Storage & Security
- **expo-secure-store**: Secure token storage
- **AsyncStorage**: Local data caching

### HTTP Client
- **Axios**: API communication with interceptors

### Fonts
- **Open Sans**: Primary font family (Regular, SemiBold, Bold)

---

## Project Structure

```
ResqLink/
├── app/                          # Main application code (Expo Router)
│   ├── (screens)/               # Screen components
│   │   ├── AccountDeletion.tsx
│   │   ├── ChangeNumberScreen.tsx
│   │   ├── EditInformationScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── HotlineScreen.tsx
│   │   ├── LogIn-Number.tsx
│   │   ├── LogIn-Verification.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── RecentReportScreen.tsx
│   │   ├── ReportScreen.tsx
│   │   ├── SignUp-AccountCreated.tsx
│   │   ├── SignUp-BasicInfo.tsx
│   │   ├── SignUp-Verification.tsx
│   │   ├── SOSScreen.tsx
│   │   ├── VerifyNumberScreen.tsx
│   │   └── WelcomeScreen.tsx
│   │
│   ├── (tabs)/                  # Tab navigation layout
│   │   └── _layout.tsx
│   │
│   ├── _api/                    # API integration layer
│   │   ├── auth.ts             # Authentication APIs
│   │   ├── config.ts           # Axios configuration
│   │   ├── health.ts           # Health check APIs
│   │   ├── index.ts            # API exports
│   │   ├── reports.ts          # Reports APIs
│   │   ├── user.ts             # User APIs
│   │   └── README.md
│   │
│   ├── _contexts/              # React Context providers
│   │   └── UserProfileContext.tsx
│   │
│   ├── _data/                  # Static data
│   │   ├── emergencyDepartments.ts
│   │   └── recentReportsData.ts
│   │
│   ├── _examples/              # Example implementations
│   │   └── SignUp-Verification-API.tsx
│   │
│   ├── _hooks/                 # Custom React hooks
│   │   ├── useApi.ts           # API hooks (React Query)
│   │   └── useLocation.ts      # Location hooks
│   │
│   ├── _providers/             # Context providers
│   │   └── ApiProvider.tsx     # React Query provider
│   │
│   ├── _services/              # Business logic services
│   │   └── locationService.ts
│   │
│   ├── _transitions/           # Animation transitions
│   │   ├── fadeIn.ts
│   │   ├── fadeOut.ts
│   │   ├── index.ts
│   │   ├── rippleTransition.ts
│   │   └── slideIn.ts
│   │
│   ├── _utils/                 # Utility functions
│   │   ├── apiHelpers.ts       # API utility functions
│   │   ├── authGuard.ts        # Authentication guards
│   │   ├── camera.ts           # Camera utilities
│   │   ├── deviceInfo.ts       # Device information
│   │   ├── errorLogger.ts      # Error logging
│   │   ├── notificationManager.ts  # Notification handling
│   │   ├── reportFilters.ts    # Report filtering logic
│   │   └── requestContext.ts   # Request context management
│   │
│   ├── components/             # Reusable components
│   │   ├── FooterNav.tsx       # Bottom navigation
│   │   ├── Header.tsx          # App header
│   │   ├── IntroScreen.tsx     # Welcome screen
│   │   │
│   │   ├── body/              # Screen body components
│   │   │   ├── HomeBody.tsx
│   │   │   ├── HotlineBody.tsx
│   │   │   ├── ProfileBody.tsx
│   │   │   ├── ReportBody.tsx
│   │   │   └── SOSBody.tsx
│   │   │
│   │   ├── card_modal/        # Cards and modals
│   │   │   ├── HotlineCard.tsx
│   │   │   ├── HotlineModal.tsx
│   │   │   ├── LocationConfirmationModal.tsx
│   │   │   ├── ReportCard.tsx
│   │   │   └── SOSAlertModal.tsx
│   │   │
│   │   ├── inputs/            # Input components
│   │   │   └── InlineTextField.tsx
│   │   │
│   │   └── overlays/          # Overlay components
│   │       ├── DeleteConfirm.tsx
│   │       └── LogoutConfirm.tsx
│   │
│   ├── _layout.tsx            # Root layout
│   └── index.jsx              # Entry point
│
├── assets/                     # Static assets
│   ├── EmergencyIcons/        # Emergency category icons
│   └── Home/                  # Home screen assets
│
├── scripts/                    # Build scripts
│   └── apply-open-sans.js
│
├── types/                      # TypeScript type definitions
│   └── svg.d.ts
│
├── app.json                   # Expo configuration
├── babel.config.js            # Babel configuration
├── metro.config.js            # Metro bundler config
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Project README
```

---

## Architecture

### Design Pattern: Container/Presentational Components

The application follows a clear separation between:

#### **Container Components** (Smart Components)
- Located in `app/(screens)/` and `app/components/body/`
- Handle data fetching, state management, and business logic
- Use React Query hooks for API calls
- Transform API data into presentation format
- Examples: `HomeBody.tsx`, `RecentReportScreen.tsx`

#### **Presentational Components** (Dumb Components)
- Located in `app/components/`
- Receive data via props
- Focus purely on UI rendering
- No API calls or complex logic
- Highly reusable
- Examples: `ReportCard.tsx`, `Header.tsx`, `FooterNav.tsx`

### Data Flow

```
API Backend
    ↓
API Layer (app/_api/)
    ↓
React Query Hooks (app/_hooks/useApi.ts)
    ↓
Container Components (Screens/Body Components)
    ↓
Data Transformation
    ↓
Presentational Components (UI Components)
    ↓
User Interface
```

### State Management Strategy

1. **Server State**: React Query (@tanstack/react-query)
   - Handles all API data fetching, caching, and synchronization
   - Automatic refetching and background updates
   - Optimistic updates for mutations

2. **Authentication State**: React Context + SecureStore
   - User profile stored in `UserProfileContext`
   - JWT tokens stored in SecureStore (encrypted)

3. **Local UI State**: React useState/useReducer
   - Form inputs, modals, animations
   - Component-specific temporary data

4. **Navigation State**: Expo Router
   - File-based routing system
   - Automatic deep linking

---

## API Integration

### Base Configuration
**File**: `app/_api/config.ts`

```typescript
export const API_BASE_URL = 'https://resqline-backend.onrender.com';
export const TOKEN_KEY = 'resqline_auth_token';
export const USER_ID_KEY = 'resqline_user_id';
```

### Axios Interceptors

#### Request Interceptor
- Automatically attaches JWT token from SecureStore
- Adds correlation ID for request tracking
- Logs request performance metrics

#### Response Interceptor
- Handles 401 Unauthorized (token expiration)
- Automatically clears tokens on auth failure
- Logs errors with context
- Performance tracking

### API Modules

#### 1. Authentication API (`app/_api/auth.ts`)
```typescript
// Endpoints
authApi.register(data: RegisterRequest)          // POST /users/register
authApi.generateOtp(data: GenerateOtpRequest)    // POST /otp/register/send
authApi.generateLoginOtp(data)                   // POST /otp/login/send
authApi.verifyOtp(data: VerifyOtpRequest)        // POST /otp/login/verify
authApi.verifyRegisterOtp(data)                  // POST /otp/register/verify
authApi.logout()                                 // Clear local storage
authApi.isAuthenticated()                        // Check auth status
authApi.getAuthToken()                           // Retrieve stored token
```

#### 2. User API (`app/_api/user.ts`)
```typescript
// Endpoints
userApi.getById(userId: string)                       // GET /users/{id}
userApi.updateInformation(data)                       // PUT /users/information
userApi.updatePhoneNumber(data)                       // PUT /users/phone
userApi.deleteAccount()                               // DELETE /users
```

#### 3. Reports API (`app/_api/reports.ts`)
```typescript
// Endpoints
reportsApi.create(data: CreateReportRequest)          // POST /reports
reportsApi.getAll(params: GetReportsRequest)          // GET /reports?...
reportsApi.getByStatus(status, params)                // Client-side filter
reportsApi.getById(reportId: string)                  // GET /reports/{id}
reportsApi.complete(reportId: string)                 // PATCH /reports/{id}/complete
reportsApi.delete(reportId: string)                   // DELETE /reports/{id}
```

### Request/Response Types

#### Report Creation
```typescript
interface CreateReportRequest {
  images: string[];              // Base64 encoded images (max 5)
  category: Category;            // Enum: TrafficAccident, FireIncident, etc.
  description?: string;
  location: Location;            // Includes coordinates and reverseGeoCode
}

interface Location {
  latitude: number;
  longitude: number;
  altitude: number;
  accuracy: number;
  altitudeAccuracy: number;
  reverseGeoCode?: string;       // Human-readable address
}
```

#### Report Response
```typescript
interface ReportResponse {
  id: string;
  images: string[];              // Base64 encoded images
  category: Category;
  description?: string;
  location: Location;
  createdAt: string;             // ISO 8601 format
  status: Status;                // Submitted, Under_Review, etc.
}
```

### Category Enum
```typescript
enum Category {
  Other = 32,
  TrafficAccident = 4,
  FireIncident = 3,
  Flooding = 8,
  StructuralDamage = 9,
  MedicalEmergency = 2,
}
```

### Status Enum
```typescript
enum Status {
  Submitted = 'Submitted',
  Under_Review = 'Under_Review',
  In_Progress = 'In_Progress',
  Resolved = 'Resolved',
  Rejected = 'Rejected',
}
```

---

## State Management

### React Query Configuration
**File**: `app/_providers/ApiProvider.tsx`

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,        // 5 minutes
      cacheTime: 1000 * 60 * 10,        // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});
```

### Query Keys Structure
```typescript
queryKeys = {
  user: (id?: string) => ['user', id],
  reports: {
    all: (params?: GetReportsRequest) => ['reports', 'all', params],
    byStatus: (status: Status, params?) => ['reports', 'status', status, params],
    byId: (id: string) => ['reports', 'detail', id],
  },
}
```

### Custom Hooks (React Query)
**File**: `app/_hooks/useApi.ts`

#### Authentication Hooks
```typescript
useRegister()           // Mutation for user registration
useGenerateOtp()        // Mutation for registration OTP
useGenerateLoginOtp()   // Mutation for login OTP
useVerifyOtp()          // Mutation for OTP verification
```

#### User Hooks
```typescript
useUser(userId?: string)                    // Query user profile
useUpdateUserInformation()                  // Mutation for profile update
useUpdatePhoneNumber()                      // Mutation for phone update
useDeleteAccount()                          // Mutation for account deletion
```

#### Report Hooks
```typescript
useReports(params?: GetReportsRequest)      // Query all reports
useReportsByStatus(status, params?)         // Query reports by status
useReport(reportId?: string)                // Query single report
useCreateReport()                           // Mutation for creating report
useCompleteReport()                         // Mutation for completing report
useDeleteReport()                           // Mutation for deleting report
```

### User Profile Context
**File**: `app/_contexts/UserProfileContext.tsx`

Provides global access to user profile information:
```typescript
const { profile, updateProfile, clearProfile } = useUserProfile();
```

---

## Navigation

### Expo Router (File-Based Routing)

The application uses Expo Router with file-based routing:

```
app/
├── _layout.tsx              → Root layout
├── index.jsx                → Entry point (redirects to welcome)
├── (tabs)/
│   └── _layout.tsx          → Tab navigation layout
└── (screens)/
    └── *.tsx                → Individual screens
```

### Navigation Structure

```
Root
├── Welcome Screen           (First-time users)
├── Authentication Flow
│   ├── Login Number
│   ├── Login Verification
│   ├── SignUp Basic Info
│   ├── SignUp Verification
│   └── Account Created
└── Main App (Tab Navigation)
    ├── Home Tab
    │   └── Recent Reports
    ├── Report Tab
    ├── SOS Tab
    ├── Hotline Tab
    └── Profile Tab
        ├── Edit Information
        ├── Change Number
        ├── Verify Number
        └── Account Deletion
```

### Navigation Patterns

#### Push Navigation
```typescript
router.push('/path/to/screen');
```

#### Replace Navigation (No back)
```typescript
router.replace({ pathname: '/(tabs)', params: { tab: 'home' } });
```

#### Go Back
```typescript
router.back();
```

#### Tab Navigation
```typescript
// FooterNav component handles tab switching
onTabPress={(tab: string) => setActiveTab(tab)}
```

---

## Authentication Flow

### 1. Registration Flow

```
SignUp Basic Info
    ↓ (Submit phone + name)
POST /users/register
    ↓
POST /otp/register/send
    ↓
SignUp Verification
    ↓ (Enter OTP)
POST /otp/register/verify
    ↓
Account Created Screen
    ↓
Main App
```

### 2. Login Flow

```
Login Number
    ↓ (Enter phone)
POST /otp/login/send
    ↓
Login Verification
    ↓ (Enter OTP)
POST /otp/login/verify
    ↓ (Returns JWT)
Store JWT in SecureStore
    ↓
Main App
```

### 3. Token Management

- **Storage**: Expo SecureStore (encrypted)
- **Attachment**: Axios request interceptor
- **Refresh**: Manual re-login required
- **Expiration**: Auto-logout on 401 response

### 4. Protected Routes

All authenticated routes use `authGuard.ts`:
```typescript
// Redirect to welcome if not authenticated
await redirectIfAuthenticated();
```

---

## Screens Documentation

### Welcome & Authentication Screens

#### WelcomeScreen.tsx
- **Purpose**: App entry point for new users
- **Features**: 
  - App introduction
  - Get Started button
  - Auto-redirect if already authenticated

#### LogIn-Number.tsx
- **Purpose**: Phone number entry for login
- **API**: `generateLoginOtp()`
- **Validation**: 10-digit Philippine phone number
- **Navigation**: → Login Verification

#### LogIn-Verification.tsx
- **Purpose**: OTP verification for login
- **API**: `verifyOtp()`
- **Features**:
  - 4-digit OTP input
  - Resend OTP (60s timer)
  - Max 5 attempts lockout
- **Navigation**: → Home (on success)

#### SignUp-BasicInfo.tsx
- **Purpose**: New user registration
- **API**: `register()` + `generateOtp()`
- **Form Fields**:
  - First Name
  - Last Name
  - Mobile Number (10 digits)
- **Validation**: All fields required
- **Navigation**: → SignUp Verification

#### SignUp-Verification.tsx
- **Purpose**: OTP verification for registration
- **API**: `verifyRegisterOtp()`
- **Features**: Same as login verification
- **Navigation**: → Account Created

#### SignUp-AccountCreated.tsx
- **Purpose**: Registration success confirmation
- **Features**: Success message + Continue button
- **Navigation**: → Home

### Main Application Screens

#### HomeScreen.tsx
- **Purpose**: Main dashboard
- **Components**: 
  - Header
  - HomeBody (main content)
  - FooterNav
- **Features**:
  - Recent reports preview (5 reports)
  - Emergency quick actions
  - Stats overview

#### ReportScreen.tsx
- **Purpose**: Create new emergency report
- **Components**:
  - Header
  - ReportBody (form)
  - FooterNav
- **API**: `createReport()`

#### RecentReportScreen.tsx
- **Purpose**: View all user reports
- **API**: 
  - `useReports()` - All reports
  - `useReportsByStatus()` - Filtered by status
- **Features**:
  - Filter by status (Submitted, Under Review, All)
  - Infinite scroll
  - Pull to refresh
- **Components**: ReportCard list

#### SOSScreen.tsx
- **Purpose**: Emergency SOS activation
- **Features**:
  - Large SOS button
  - Emergency contacts
  - Quick location sharing

#### HotlineScreen.tsx
- **Purpose**: Emergency hotline directory
- **Data Source**: `emergencyDepartments.ts`
- **Categories**:
  - Hospitals
  - Fire Department
  - Police
  - Power Company
  - Disaster Management

#### ProfileScreen.tsx
- **Purpose**: User profile management
- **API**: `useUser()`
- **Features**:
  - View profile info
  - Edit information
  - Change phone number
  - Delete account
  - Logout

---

## Components Documentation

### Layout Components

#### Header.tsx
**Props**:
```typescript
interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}
```
**Usage**: Consistent header across all screens

#### FooterNav.tsx
**Props**:
```typescript
interface FooterNavProps {
  activeTab: 'home' | 'report' | 'sos' | 'hotline' | 'profile';
  onTabPress?: (tab: string) => void;
}
```
**Features**: 
- Icon-based navigation
- Active state highlighting
- Smooth tab transitions

### Body Components

#### HomeBody.tsx
**API**: `useReports({ pageSize: 50, pageOffset: 1 })`
**Features**:
- Recent reports carousel (5 reports)
- Emergency quick action cards
- Category icons mapping
- Pull to refresh
**Data Transformation**:
```typescript
// Converts API ReportResponse to ReportCard format
const recentReports = allReports.map(report => ({
  id: report.id,
  title: report.description,
  status: mapStatusToString(report.status),
  type: categoryString,
  typeIcon: getCategoryIcon(categoryString),
  date: formatted date,
  location: report.location.reverseGeoCode,
  image: report.images[0]
}));
```

#### ReportBody.tsx
**State Management**:
```typescript
const [photos, setPhotos] = useState<Photo[]>([]);
const [category, setCategory] = useState('');
const [description, setDescription] = useState('');
const [coords, setCoords] = useState<LocationCoords | null>(null);
const [address, setAddress] = useState('');
```

**Features**:
- Photo upload (max 5 images, base64 encoding)
- Category dropdown
- Description text area
- Automatic location detection
- Reverse geocoding
- Form validation
- Image preview

**Location Fetching**:
```typescript
// Uses expo-location
const location = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.High
});

// Reverse geocode
const reverseGeocode = await Location.reverseGeocodeAsync({
  latitude, longitude
});
```

**Image Processing**:
```typescript
// Converts to base64
const base64 = await convertImageToBase64(photo.uri);

// Size warning (>5MB)
if (totalSizeKB > 5120) {
  Alert.alert('Large Images Warning', '...');
}
```

#### ProfileBody.tsx
**API**: `useUser(userId)`
**Features**:
- Display user information
- Navigation to edit screens
- Logout functionality
- Account deletion

### Card Components

#### ReportCard.tsx
**Props**:
```typescript
interface ReportCardProps {
  report: Report;
  onPress?: (report: Report) => void;
  fullWidth?: boolean;
}

interface Report {
  id: number;
  title: string;
  status: string;
  type: string;
  typeIcon: string;
  date: string;
  location: string;
  image?: string;  // Base64 image
}
```

**Features**:
- Status badge with color coding
- Category icon
- Location display (reverseGeoCode)
- Image display with fallback
- Truncated title (35 chars)
- Tap to view details

**Image Handling**:
```typescript
<Image 
  source={
    report.image 
      ? { uri: `data:image/jpeg;base64,${report.image}` }
      : require('../../../assets/defaultimage.png')
  } 
/>
```

#### HotlineCard.tsx
**Props**:
```typescript
interface HotlineCardProps {
  department: EmergencyDepartment;
  onPress: () => void;
}
```
**Features**: Emergency contact card with call action

### Modal Components

#### HotlineModal.tsx
- Displays detailed emergency contact information
- Direct call integration
- Closing animation

#### LocationConfirmationModal.tsx
- Shows current location on map
- Confirm/edit location
- Used before report submission

#### SOSAlertModal.tsx
- Emergency alert confirmation
- Quick cancel option
- Countdown timer

### Input Components

#### InlineTextField.tsx
**Props**:
```typescript
interface InlineTextFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  editable?: boolean;
}
```
**Features**: Consistent input styling across forms

### Overlay Components

#### DeleteConfirm.tsx
- Account deletion confirmation
- Double-check safety measure

#### LogoutConfirm.tsx
- Logout confirmation dialog
- Cancel option

---

## Hooks

### Custom Hooks

#### useLocation.ts
```typescript
// GPS location access
const { location, error, loading } = useLocation();

// Features:
// - Automatic permission request
// - High accuracy GPS
// - Error handling
// - Loading states
```

#### useApi.ts
All React Query hooks for API interactions (see State Management section)

### Animation Hooks

#### useSlideIn.ts
```typescript
const slideAnimation = useSlideIn({
  direction: 'right' | 'left' | 'up' | 'down',
  distance: number,
  duration: number
});

slideAnimation.slideIn();
slideAnimation.slideOut();
```

#### useFadeIn.ts
```typescript
const fadeAnimation = useFadeIn({ duration: number });
fadeAnimation.fadeIn();
fadeAnimation.fadeOut();
```

---

## Utilities

### API Helpers (`app/_utils/apiHelpers.ts`)

#### Image Processing
```typescript
// Convert URI to base64
convertImageToBase64(uri: string): Promise<string>
```

#### Validation
```typescript
// Validate report data
validateReportData(data: {
  category: string;
  location?: any;
}): string | null
```

#### Error Formatting
```typescript
// User-friendly error messages
formatApiError(error: string): string
```

### Auth Guard (`app/_utils/authGuard.ts`)
```typescript
// Redirect if authenticated
await redirectIfAuthenticated();

// Redirect if not authenticated
await redirectIfNotAuthenticated();
```

### Camera Utilities (`app/_utils/camera.ts`)
```typescript
// Photo picker alert
showPhotoPickerAlert(
  onPhotoSelected: (photo: Photo) => void,
  maxPhotos: number,
  currentCount: number
)
```

### Error Logger (`app/_utils/errorLogger.ts`)
```typescript
// Log errors with context
errorLogger.logError(error, context);

// Log performance metrics
errorLogger.logMetric(name, value, unit);
```

### Notification Manager (`app/_utils/notificationManager.ts`)
```typescript
// Handle domain events
notificationManager.handleDomainEvent({
  eventType: DomainEventType.ReportSubmitted,
  data: { ... }
});
```

### Request Context (`app/_utils/requestContext.ts`)
```typescript
// Manage correlation IDs for request tracking
requestContextManager.applyToConfig(axiosConfig);
requestContextManager.getCorrelationId();
requestContextManager.resetCorrelationId();
```

---

## Styling Guide

### Color Palette
```typescript
const colors = {
  primary: '#FF8C42',        // Orange (main brand color)
  secondary: '#2E7D32',      // Green (success)
  accent: '#1976D2',         // Blue (info)
  danger: '#D32F2F',         // Red (error/danger)
  warning: '#F57C00',        // Orange (warning)
  background: '#FFFFFF',     // White
  surface: '#F5F5F5',        // Light gray
  text: '#000000',           // Black
  textSecondary: '#666666',  // Gray
  border: '#E0E0E0',         // Light gray
  disabled: '#CCCCCC',       // Disabled state
};
```

### Typography
```typescript
const fonts = {
  regular: 'OpenSans_400Regular',
  semiBold: 'OpenSans_600SemiBold',
  bold: 'OpenSans_700Bold',
};

const fontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};
```

### Common Styles
```typescript
// Shadows
shadowLight: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2,
}

// Border Radius
borderRadius: {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
}

// Spacing
spacing: {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
}
```

### Status Colors
```typescript
statusColors = {
  Submitted: {
    background: '#f5f5f5',
    text: '#666',
  },
  'Under Review': {
    background: '#E3F2FD',
    text: '#1976D2',
  },
  'In Progress': {
    background: '#FFF3E0',
    text: '#F57C00',
  },
  Resolved: {
    background: '#E8F5E8',
    text: '#2E7D32',
  },
  Rejected: {
    background: '#FFEBEE',
    text: '#D32F2F',
  },
};
```

---

## Data Models

### Report Categories
```typescript
enum Category {
  Other = 32,                  // General incidents
  TrafficAccident = 4,         // Vehicle accidents
  FireIncident = 3,            // Fire emergencies
  Flooding = 8,                // Flood situations
  StructuralDamage = 9,        // Building damage
  MedicalEmergency = 2,        // Medical emergencies
}

// Icon Mapping
categoryIcons = {
  TrafficAccident: 'car-crash',
  FireIncident: 'flame',
  Flooding: 'water',
  StructuralDamage: 'home',
  MedicalEmergency: 'medical',
  Other: 'alert-circle',
}
```

### Report Status Flow
```
Submitted 
    ↓
Under Review 
    ↓
In Progress 
    ↓
Resolved / Rejected
```

### Location Data Structure
```typescript
interface Location {
  latitude: number;           // GPS coordinate
  longitude: number;          // GPS coordinate
  altitude: number;           // Meters above sea level
  accuracy: number;           // GPS accuracy in meters
  altitudeAccuracy: number;   // Altitude accuracy
  reverseGeoCode?: string;    // Human-readable address
}

// Example reverseGeoCode:
// "123 Main St, Quezon City, Metro Manila, 1100, Philippines"
```

---

## Error Handling

### API Error Handling

#### Error Response Structure
```typescript
interface ApiError {
  status: number;
  statusText: string;
  data: {
    title: string;
    type: string;
    status: number;
  };
  message: string;
}
```

#### Error Handling Pattern
```typescript
try {
  const result = await apiCall();
  if (!result.success) {
    throw new Error(result.error || 'Operation failed');
  }
  // Success handling
} catch (error: any) {
  console.error('Operation failed:', error);
  const errorMessage = formatApiError(error.message);
  Alert.alert('Error', errorMessage);
}
```

### Common Error Scenarios

#### 400 Bad Request
- Invalid form data
- Missing required fields
- Invalid category or status

#### 401 Unauthorized
- Token expired
- Invalid token
- User not authenticated
**Handling**: Auto-logout and redirect to login

#### 404 Not Found
- Report not found
- User not found

#### 409 Conflict
- Phone number already registered
- Duplicate report submission

#### 500 Server Error
- Backend server issues
- Database errors
**Handling**: Show user-friendly message and retry option

---

## Performance Optimization

### Image Optimization
```typescript
// Base64 encoding with size limits
if (totalSizeKB > 5120) {  // 5MB limit
  Alert.alert('Large Images Warning', '...');
}

// Lazy loading images in lists
<FlatList
  data={reports}
  renderItem={({ item }) => <ReportCard report={item} />}
  initialNumToRender={10}
  maxToRenderPerBatch={5}
  windowSize={5}
/>
```

### API Caching
```typescript
// React Query automatic caching
staleTime: 5 * 60 * 1000,  // 5 minutes
cacheTime: 10 * 60 * 1000,  // 10 minutes

// Manual invalidation
queryClient.invalidateQueries({ queryKey: ['reports'] });
```

### List Optimization
```typescript
// FlatList optimization
<FlatList
  data={items}
  keyExtractor={(item) => item.id.toString()}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  initialNumToRender={10}
  windowSize={7}
/>
```

### Location Services
```typescript
// Memoized location fetcher
const fetchLocation = useCallback(async () => {
  // Prevent duplicate calls
  if (isLocationLoading) return;
  // ... fetch logic
}, []); // Empty deps - stable reference
```

---

## Testing

### Testing Setup
```json
{
  "jest": {
    "preset": "jest-expo",
    "transformIgnorePatterns": [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
    ]
  }
}
```

### Unit Testing Examples

#### API Hook Testing
```typescript
import { renderHook, waitFor } from '@testing-library/react-hooks';
import { useReports } from '../_hooks/useApi';

test('useReports fetches reports successfully', async () => {
  const { result } = renderHook(() => useReports());
  
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toBeDefined();
});
```

#### Component Testing
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import ReportCard from '../components/card_modal/ReportCard';

test('ReportCard displays report information', () => {
  const mockReport = {
    id: 1,
    title: 'Test Report',
    status: 'Submitted',
    // ... other props
  };
  
  const { getByText } = render(<ReportCard report={mockReport} />);
  expect(getByText('Test Report')).toBeTruthy();
});
```

---

## Deployment

### Build Configuration

#### Development Build
```bash
npx expo start
```

#### Production Build (Android)
```bash
eas build --platform android --profile production
```

#### Production Build (iOS)
```bash
eas build --platform ios --profile production
```

### Environment Variables
```typescript
// app.json
{
  "expo": {
    "extra": {
      "apiUrl": process.env.API_URL,
      "environment": process.env.ENVIRONMENT
    }
  }
}
```

### Release Checklist

- [ ] Update version in app.json
- [ ] Test all authentication flows
- [ ] Test report creation and listing
- [ ] Verify image upload functionality
- [ ] Test location services
- [ ] Check error handling
- [ ] Test on both Android and iOS
- [ ] Verify API endpoint configuration
- [ ] Test offline behavior
- [ ] Review app permissions
- [ ] Update changelog
- [ ] Create release notes

---

## Best Practices

### Code Organization
1. **Separation of Concerns**: Keep API logic separate from UI
2. **Component Reusability**: Create generic, reusable components
3. **Type Safety**: Use TypeScript for all files
4. **Error Boundaries**: Implement proper error handling
5. **Loading States**: Always show loading indicators

### API Integration
1. Use React Query for all API calls
2. Implement proper error handling
3. Cache strategically to reduce network calls
4. Use optimistic updates for better UX
5. Handle authentication globally via interceptors

### Performance
1. Lazy load images
2. Use FlatList for long lists
3. Memoize expensive computations
4. Avoid inline functions in render
5. Use React.memo for expensive components

### Security
1. Store tokens in SecureStore only
2. Never log sensitive data
3. Validate all user inputs
4. Use HTTPS for all API calls
5. Implement proper authentication guards

---

## Troubleshooting

### Common Issues

#### "Unable to resolve module"
```bash
# Clear cache
npx expo start --clear

# Reinstall dependencies
rm -rf node_modules
npm install
```

#### "Network Error"
- Check API_BASE_URL configuration
- Verify backend server is running
- Check device network connection

#### "Token expired" (401)
- Clear app data and re-login
- Check token expiration time
- Verify token storage in SecureStore

#### Location not working
- Grant location permissions
- Enable GPS on device
- Check Location.requestForegroundPermissionsAsync()

#### Images not displaying
- Verify base64 encoding
- Check image size limits
- Ensure proper URI format: `data:image/jpeg;base64,${image}`

---

## Future Enhancements

### Planned Features
- [ ] Real-time report updates via WebSocket
- [ ] Push notifications for report status changes
- [ ] Offline mode with local storage
- [ ] Map view for reports
- [ ] Report history export
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Report analytics dashboard
- [ ] In-app messaging with responders

### Technical Improvements
- [ ] Implement automated testing (Jest + React Native Testing Library)
- [ ] Add error boundary components
- [ ] Implement app analytics (Firebase Analytics)
- [ ] Add crash reporting (Sentry)
- [ ] Optimize bundle size
- [ ] Implement code splitting
- [ ] Add accessibility features

---

## Contributing

### Development Setup
1. Clone repository
2. Install dependencies: `npm install`
3. Configure environment variables
4. Start development server: `npx expo start`

### Code Style
- Follow ESLint configuration
- Use Prettier for formatting
- Follow TypeScript strict mode
- Write meaningful commit messages

### Pull Request Process
1. Create feature branch from `main`
2. Implement feature with tests
3. Update documentation
4. Submit PR with description
5. Address review comments
6. Merge after approval

---

## Support & Contact

For issues, questions, or contributions:
- GitHub Issues: [Project Repository]
- Documentation: This file
- Backend Documentation: See backend README.md

---

**Last Updated**: December 13, 2025  
**Version**: 1.0.0  
**Maintainers**: ResQLink Development Team
