# ResqLink - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Installation & Setup](#installation--setup)
5. [Project Structure](#project-structure)
6. [Core Modules](#core-modules)
7. [API Integration](#api-integration)
8. [Authentication & Authorization](#authentication--authorization)
9. [Navigation System](#navigation-system)
10. [Utilities & Helpers](#utilities--helpers)
11. [UI Components](#ui-components)
12. [Screens](#screens)
13. [State Management](#state-management)
14. [Notifications](#notifications)
15. [Best Practices](#best-practices)
16. [Troubleshooting](#troubleshooting)

---

## Overview

**ResqLink** is a comprehensive emergency reporting and response mobile application built with React Native and Expo. It enables users to report emergencies, access emergency hotlines, track report statuses, and manage their profiles with real-time location services.

### Key Technologies
- **Framework**: React Native (Expo SDK 54)
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Query (TanStack Query)
- **Styling**: React Native StyleSheet
- **Backend API**: ASP.NET Core REST API
- **Authentication**: JWT tokens with Expo SecureStore
- **Location**: expo-location
- **Camera/Photos**: expo-image-picker
- **Device Info**: expo-device

### Application Type
Emergency Response & Reporting System

---

## Architecture

### Design Pattern
ResqLink follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  (Screens, Components, Navigation)  │
└─────────────────────────────────────┘
              ↕
┌─────────────────────────────────────┐
│         Business Logic Layer        │
│   (Hooks, Contexts, State Mgmt)     │
└─────────────────────────────────────┘
              ↕
┌─────────────────────────────────────┐
│         Data Access Layer           │
│     (API Clients, Services)         │
└─────────────────────────────────────┘
              ↕
┌─────────────────────────────────────┐
│         Backend API Layer           │
│  (ASP.NET Core REST API - External) │
└─────────────────────────────────────┘
```

### Key Architectural Decisions

1. **File-based Routing**: Uses Expo Router for automatic route generation
2. **Type Safety**: Full TypeScript implementation for compile-time safety
3. **API Abstraction**: Centralized API clients with React Query integration
4. **Context-based State**: User profile and API state managed via React Context
5. **Secure Storage**: Sensitive data (JWT tokens) stored in Expo SecureStore
6. **Modular Components**: Reusable UI components with clear responsibilities

---

## Features

### 1. User Authentication
- **Phone Number Registration**: SMS-based OTP verification
- **Login System**: OTP-based authentication
- **Guest Mode**: Limited access without account
- **Secure Token Storage**: JWT tokens in encrypted storage
- **Auto-logout**: Session expiration handling

### 2. Emergency Reporting
- **Create Reports**: Submit emergency reports with photos and location
- **Photo Capture**: Take photos or select from gallery (up to 5 photos)
- **Photo Preview**: Long-press to preview photos in full screen
- **Location Services**: Automatic GPS location capture
- **Category Selection**: Multiple emergency categories (Medical, Fire, Crime, etc.)
- **Report Tracking**: View report status (Submitted, Under Review, In Progress, Resolved)

### 3. Emergency Hotlines
- **Hotline Directory**: Access to emergency department contacts
- **Direct Calling**: One-tap calling functionality
- **GPS Directions**: Navigate to emergency departments
- **Department Categories**: Medical, Fire, Police, Disaster Response

### 4. SOS Alert System
- **Quick SOS**: Emergency alert with location sharing
- **Additional Details**: Add text descriptions and photos (up to 2)
- **Photo Preview**: Long-press to preview attached photos
- **Real-time Location**: Automatic location transmission

### 5. Profile Management
- **User Information**: Edit first name, last name, username
- **Phone Number**: Update and verify phone number
- **Device Name Integration**: Auto-populate name from device
- **Username Priority**: Display username over full name
- **Account Deletion**: Secure account removal
- **Logout**: Clear session and tokens

### 6. Recent Reports
- **Report History**: View all submitted reports
- **Filter by Status**: All, Submitted, Under Review
- **Report Details**: View full report information
- **Status Indicators**: Visual status badges

### 7. Location Services
- **Auto-request Permissions**: GPS permission on app start
- **Settings Integration**: Direct link to enable location in settings
- **Real-time Location**: Current coordinates and address
- **Location Caching**: Efficient location retrieval

### 8. Notifications
- **Domain Events**: Event-driven notification system
- **Login/Logout**: Welcome and goodbye notifications
- **Guest Mode**: Reminder about limited features
- **Report Status**: Updates on report progress
- **Account Events**: Registration, deletion confirmations

### 9. Camera & Photo Management
- **Reusable Utility**: Shared camera functions across features
- **Permission Handling**: Automatic camera/gallery permission requests
- **Photo Limit Validation**: Enforced photo limits (5 for reports, 2 for SOS)
- **Image Preview**: Full-screen photo previews
- **Photo Deletion**: Remove photos before submission

---

## Installation & Setup

### Prerequisites
```bash
Node.js >= 18.x
npm or yarn
Expo CLI
iOS Simulator (Mac) or Android Emulator
```

### Installation Steps

1. **Clone the Repository**
```bash
git clone https://github.com/Weiasnormal/ResqLink_Frontend.git
cd ResqLink_Frontend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Install Required Expo Packages**
```bash
npx expo install expo-router expo-location expo-image-picker expo-secure-store expo-device
```

4. **Start Development Server**
```bash
npx expo start
```

5. **Run on Device/Emulator**
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app

### Environment Configuration

The app connects to:
```typescript
Backend API: https://resqline-backend.onrender.com
```

No additional environment variables required (API base URL is hardcoded in `app/_api/config.ts`).

---

## Project Structure

```
ResqLink/
├── app/                          # Main application code
│   ├── (screens)/               # Screen components
│   │   ├── WelcomeScreen.tsx
│   │   ├── SignUp-BasicInfo.tsx
│   │   ├── SignUp-Verification.tsx
│   │   ├── LogIn-Number.tsx
│   │   ├── LogIn-Verification.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── ReportScreen.tsx
│   │   ├── SOSScreen.tsx
│   │   ├── HotlineScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── EditInformationScreen.tsx
│   │   ├── ChangeNumberScreen.tsx
│   │   ├── VerifyNumberScreen.tsx
│   │   ├── RecentReportScreen.tsx
│   │   └── AccountDeletion.tsx
│   │
│   ├── (tabs)/                  # Tab navigation layout
│   │   └── _layout.tsx
│   │
│   ├── components/              # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── FooterNav.tsx
│   │   ├── IntroScreen.tsx
│   │   ├── body/                # Screen body components
│   │   │   ├── HomeBody.tsx
│   │   │   ├── ReportBody.tsx
│   │   │   ├── SOSBody.tsx
│   │   │   ├── HotlineBody.tsx
│   │   │   └── ProfileBody.tsx
│   │   ├── card_modal/          # Cards and modals
│   │   │   ├── HotlineCard.tsx
│   │   │   ├── HotlineModal.tsx
│   │   │   ├── ReportCard.tsx
│   │   │   ├── SOSAlertModal.tsx
│   │   │   └── LocationConfirmationModal.tsx
│   │   ├── inputs/              # Form inputs
│   │   │   └── InlineTextField.tsx
│   │   └── overlays/            # Confirmation overlays
│   │       ├── LogoutConfirm.tsx
│   │       └── DeleteConfirm.tsx
│   │
│   ├── _api/                    # API client modules
│   │   ├── config.ts            # API configuration
│   │   ├── auth.ts              # Authentication endpoints
│   │   ├── user.ts              # User management endpoints
│   │   ├── reports.ts           # Reports endpoints
│   │   ├── health.ts            # Health check endpoint
│   │   ├── index.ts             # API exports
│   │   └── README.md            # API documentation
│   │
│   ├── _hooks/                  # Custom React hooks
│   │   ├── useApi.ts            # React Query hooks
│   │   └── useLocation.ts       # Location hooks
│   │
│   ├── _contexts/               # React Context providers
│   │   └── UserProfileContext.tsx
│   │
│   ├── _providers/              # App-level providers
│   │   └── ApiProvider.tsx      # React Query provider
│   │
│   ├── _services/               # Business logic services
│   │   └── locationService.ts   # Location utilities
│   │
│   ├── _utils/                  # Utility functions
│   │   ├── apiHelpers.ts        # API helper functions
│   │   ├── authGuard.ts         # Auth route guards
│   │   ├── errorLogger.ts       # Error logging
│   │   ├── notificationManager.ts # Notification system
│   │   ├── reportFilters.ts     # Report filtering
│   │   ├── requestContext.ts    # Request correlation IDs
│   │   ├── camera.ts            # Camera utilities
│   │   └── deviceInfo.ts        # Device information
│   │
│   ├── _transitions/            # Animation transitions
│   │   ├── fadeIn.ts
│   │   ├── fadeOut.ts
│   │   ├── slideIn.ts
│   │   ├── rippleTransition.ts
│   │   └── index.ts
│   │
│   ├── _data/                   # Static data
│   │   ├── emergencyDepartments.ts
│   │   └── recentReportsData.ts
│   │
│   ├── _examples/               # Example implementations
│   │   └── SignUp-Verification-API.tsx
│   │
│   ├── _layout.tsx              # Root layout
│   └── index.jsx                # Entry point
│
├── assets/                      # Images, SVGs, icons
│   ├── EmergencyIcons/
│   └── Home/
│
├── scripts/                     # Build scripts
│   └── apply-open-sans.js
│
├── types/                       # TypeScript type definitions
│   └── svg.d.ts
│
├── app.json                     # Expo configuration
├── babel.config.js              # Babel configuration
├── metro.config.js              # Metro bundler config
├── tsconfig.json                # TypeScript config
├── package.json                 # Dependencies
└── README.md                    # Project README
```

---

## Core Modules

### 1. Authentication (`app/_api/auth.ts`)

Handles all authentication-related API calls.

#### Interfaces
```typescript
interface RegisterRequest {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  username?: string;
}

interface GenerateOtpRequest {
  mobileNumber: string;
}

interface VerifyOtpRequest {
  mobileNumber: string;
  otp: string;
}
```

#### Functions
- `register(data: RegisterRequest)`: Register new user
- `generateOtp(data: GenerateOtpRequest)`: Send OTP to phone
- `verifyOtp(data: VerifyOtpRequest)`: Verify OTP and get JWT token
- `logout()`: Clear authentication tokens

### 2. User Management (`app/_api/user.ts`)

Manages user profile and account operations.

#### Interfaces
```typescript
interface UpdateUserInformationRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
}

interface ChangePhoneNumberRequest {
  newMobileNumber: string;
  otp: string;
}
```

#### Functions
- `getMyProfile()`: Fetch current user profile
- `updateUserInformation(data)`: Update user details
- `changePhoneNumber(data)`: Update phone number
- `deleteAccount()`: Delete user account

### 3. Reports (`app/_api/reports.ts`)

Manages emergency report creation and retrieval.

#### Interfaces
```typescript
interface CreateReportRequest {
  category: Category;
  title?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  images?: string[]; // Base64 encoded
}

interface GetReportsRequest {
  sort?: string;
  pageSize?: number;
  pageOffset?: number;
}

enum Category {
  Medical = 0,
  Fire = 1,
  Crime = 2,
  Traffic = 3,
  Natural_Disaster = 4,
  Other = 5
}

enum Status {
  Submitted = 0,
  Under_Review = 1,
  In_Progress = 2,
  Resolved = 3,
  Rejected = 4
}
```

#### Functions
- `create(data: CreateReportRequest)`: Submit new report
- `getAll(params)`: Get paginated reports
- `getById(id)`: Get single report details
- `getByStatus(status, params)`: Get reports by status

### 4. Location Service (`app/_services/locationService.ts`)

Centralized location management.

#### Interface
```typescript
interface UserLocation {
  latitude: number;
  longitude: number;
  address: string;
}
```

#### Functions
- `getCurrentLocation(includeAddress?: boolean)`: Get current GPS location
- `getAddressFromCoordinates(lat, lon)`: Reverse geocoding

### 5. Camera Utility (`app/_utils/camera.ts`)

Reusable camera and photo selection functions.

#### Interface
```typescript
interface Photo {
  uri: string;
  id: string;
}
```

#### Functions
- `takePhoto()`: Launch camera to take photo
- `pickImageFromLibrary()`: Pick photo from gallery
- `showPhotoPickerAlert(onPhotoSelected, maxPhotos?, currentPhotoCount?)`: Show camera/gallery selection dialog
- `quickTakePhoto()`: Direct camera access
- `quickPickImage()`: Direct gallery access

**Features:**
- Automatic permission handling
- Photo limit validation
- Error alerts for denied permissions
- Returns `null` on cancel/failure

### 6. Device Info (`app/_utils/deviceInfo.ts`)

Device information utilities.

#### Functions
- `getDeviceName()`: Get device name or "User" as fallback
- `getDefaultNamesFromDevice()`: Split device name into firstName/lastName

**Usage:**
Used to auto-populate user profile with device name when no name is set.

---

## API Integration

### Configuration (`app/_api/config.ts`)

```typescript
export const API_BASE_URL = 'https://resqline-backend.onrender.com';
export const TOKEN_KEY = 'auth_token';

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};
```

### API Response Format

All API responses follow this structure:
```typescript
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}
```

### Error Handling

Errors are handled consistently across the app:

```typescript
// API Error Formatter
formatApiError(errorMessage: string): string
```

**Error Flow:**
1. API client catches errors
2. `formatApiError()` formats the message
3. React Query returns error to components
4. Components display Alert or inline error

### React Query Hooks (`app/_hooks/useApi.ts`)

#### Query Hooks (Data Fetching)
```typescript
// User Profile
useMyProfile(): { data, isLoading, error, refetch }

// Reports
useReports(params?): { data, isLoading, error }
useReportsByStatus(status, params?): { data, isLoading, error }
useReportById(id): { data, isLoading, error }
```

#### Mutation Hooks (Data Modification)
```typescript
// Authentication
useRegister(): { mutateAsync, isPending }
useGenerateOtp(): { mutateAsync, isPending }
useVerifyOtp(): { mutateAsync, isPending }

// User Management
useUpdateUserInformation(): { mutateAsync, isPending }
useChangePhoneNumber(): { mutateAsync, isPending }
useDeleteAccount(): { mutateAsync, isPending }

// Reports
useCreateReport(): { mutateAsync, isPending }
```

**Usage Example:**
```typescript
const ProfileScreen = () => {
  const { data: profile, isLoading, error } = useMyProfile();
  const updateMutation = useUpdateUserInformation();

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        firstName: 'John',
        lastName: 'Doe'
      });
      Alert.alert('Success', 'Profile updated');
    } catch (error) {
      Alert.alert('Error', formatApiError(error.message));
    }
  };

  if (isLoading) return <ActivityIndicator />;
  
  return <View>{/* UI */}</View>;
};
```

### Request Context (`app/_utils/requestContext.ts`)

Generates unique correlation IDs for tracking requests across the system.

```typescript
class RequestContextManager {
  getCorrelationId(): string;
  setCorrelationId(id: string): void;
}

export const requestContextManager = new RequestContextManager();
```

---

## Authentication & Authorization

### Flow Diagram

```
┌──────────────┐
│ Welcome      │
│ Screen       │
└──────┬───────┘
       │
       ├─→ Sign Up → Basic Info → OTP Verification → Home (Logged In)
       │
       ├─→ Log In → Phone Number → OTP Verification → Home (Logged In)
       │
       └─→ Continue as Guest → Home (Guest Mode)
```

### Auth Guard (`app/_utils/authGuard.ts`)

#### Functions

1. **`isAuthenticated(): Promise<boolean>`**
   - Checks if JWT token exists in SecureStore
   - Returns true if authenticated

2. **`redirectIfAuthenticated()`**
   - Redirects to home if already logged in
   - Used on Welcome/Login screens

3. **`requireAuthentication()`**
   - Redirects to Welcome if not authenticated
   - Used on protected screens

4. **`handleLogout()`**
   - Clears JWT token
   - Shows logout notification
   - Redirects to Welcome screen

### Token Storage

```typescript
// Store token after successful OTP verification
await SecureStore.setItemAsync(TOKEN_KEY, jwtToken);

// Retrieve token for API requests
const token = await SecureStore.getItemAsync(TOKEN_KEY);

// Clear token on logout
await SecureStore.deleteItemAsync(TOKEN_KEY);
```

### Protected Routes

All routes except Welcome, SignUp, and LogIn require authentication. Guest mode has limited features.

---

## Navigation System

### File-Based Routing (Expo Router)

ResqLink uses Expo Router's file-based routing system:

```
app/
├── _layout.tsx              → Root layout
├── index.jsx                → Redirect to WelcomeScreen
├── (tabs)/                  → Tab navigation group
│   └── _layout.tsx          → Tab layout (Home, Report, SOS, Hotline, Profile)
└── (screens)/               → Modal/stack screens
    ├── WelcomeScreen.tsx
    ├── SignUp-*.tsx
    ├── LogIn-*.tsx
    └── ...
```

### Navigation Methods

```typescript
import { useRouter } from 'expo-router';

const MyComponent = () => {
  const router = useRouter();

  // Push new screen
  router.push('/SignUp-BasicInfo');

  // Replace current screen
  router.replace({ pathname: '/(tabs)', params: { tab: 'home' } });

  // Go back
  router.back();
};
```

### Tab Navigation

Five main tabs:
1. **Home**: Recent reports, emergency overview
2. **Report**: Submit emergency reports
3. **SOS**: Quick emergency alert
4. **Hotline**: Emergency department contacts
5. **Profile**: User account management

---

## Utilities & Helpers

### 1. API Helpers (`app/_utils/apiHelpers.ts`)

#### `convertImageToBase64(uri: string): Promise<string>`
Converts image URI to Base64 string for API upload.

#### `validateReportData(data): boolean`
Validates report submission data.

#### `formatApiError(error: string): string`
Formats API error messages for user display.

### 2. Notification Manager (`app/_utils/notificationManager.ts`)

Event-driven notification system.

#### Domain Events
```typescript
enum DomainEventType {
  UserRegistered,
  PhoneNumberVerified,
  ReportSubmitted,
  ReportApproved,
  ReportRejected,
  ReportInProgress,
  ReportResolved,
  AccountDeleted,
  PhoneNumberChanged,
  UserLoggedIn,
  UserLoggedOut,
  GuestModeActivated
}
```

#### Usage
```typescript
await notificationManager.handleDomainEvent({
  eventId: Date.now().toString(),
  eventType: DomainEventType.UserLoggedIn,
  aggregateId: userId,
  aggregateType: 'User',
  timestamp: new Date().toISOString(),
  data: { phoneNumber: '+1234567890' },
  correlationId: correlationId,
});
```

#### Methods
- `subscribe(eventType, callback)`: Listen to events
- `emit(event)`: Emit event to listeners
- `handleDomainEvent(event)`: Process and show notification

### 3. Error Logger (`app/_utils/errorLogger.ts`)

Centralized error logging (prepared for integration with error tracking services).

---

## UI Components

### 1. Header (`app/components/Header.tsx`)

Top navigation header with back button and title.

**Props:**
```typescript
interface HeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
}
```

### 2. Footer Navigation (`app/components/FooterNav.tsx`)

Bottom tab navigation bar.

**Props:**
```typescript
interface FooterNavProps {
  activeTab: 'home' | 'report' | 'sos' | 'hotline' | 'profile';
  onTabPress: (tab: string) => void;
}
```

### 3. Hotline Card (`app/components/card_modal/HotlineCard.tsx`)

Emergency department card with call and direction buttons.

**Props:**
```typescript
interface HotlineCardProps {
  department: EmergencyDepartment;
  onPress?: () => void;
}
```

### 4. Report Card (`app/components/card_modal/ReportCard.tsx`)

Displays recent report summary.

**Props:**
```typescript
interface ReportCardProps {
  report: Report;
  onPress?: () => void;
}
```

### 5. SOS Alert Modal (`app/components/card_modal/SOSAlertModal.tsx`)

Modal for adding details to SOS alert.

**Features:**
- Text input for details
- Add up to 2 photos (camera/gallery)
- Photo preview on long-press
- Send or skip

**Props:**
```typescript
interface SOSAlertModalProps {
  visible: boolean;
  onClose: () => void;
}
```

### 6. Inline Text Field (`app/components/inputs/InlineTextField.tsx`)

Editable text field with inline editing capability.

**Props:**
```typescript
interface InlineTextFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  editable?: boolean;
}
```

### 7. Confirmation Overlays

#### Logout Confirm (`app/components/overlays/LogoutConfirm.tsx`)
```typescript
interface Props {
  visible: boolean;
  onCancel?: () => void;
  onLogout?: () => void;
}
```

#### Delete Confirm (`app/components/overlays/DeleteConfirm.tsx`)
```typescript
interface Props {
  visible: boolean;
  onCancel?: () => void;
  onDelete?: () => void;
}
```

---

## Screens

### 1. Welcome Screen (`app/(screens)/WelcomeScreen.tsx`)

Entry point with three options:
- Sign Up
- Log In
- Continue as Guest (shows guest mode notification)

**Features:**
- Auto-redirect if already authenticated
- Gradient background
- Illustration

### 2. Sign Up Flow

#### Basic Info (`SignUp-BasicInfo.tsx`)
- First Name, Last Name, Phone Number
- Uses device name as default if empty
- Keyboard-aware layout

#### Verification (`SignUp-Verification.tsx`)
- 4-digit OTP input
- Auto-focus on digits
- Resend OTP functionality
- Max attempts lockout
- Auto-submit on 4th digit

### 3. Log In Flow

#### Phone Number (`LogIn-Number.tsx`)
- Phone number input with format validation
- Shows verification overlay when Continue is pressed

#### Verification (`LogIn-Verification.tsx`)
- Same OTP verification as Sign Up
- Shows login success notification
- Redirects to home on success

### 4. Home Screen (`app/(screens)/HomeScreen.tsx`)

**Components:**
- Recent reports carousel
- Emergency category grid
- Quick actions

**Features:**
- Report fetching (currently commented out)
- Navigate to category-specific screens

### 5. Report Screen (`app/(screens)/ReportScreen.tsx`)

**Features:**
- Category selection dropdown
- Title and description input
- Add up to 5 photos (camera/gallery)
- Photo preview on long-press
- Automatic location capture
- Submit button with validation

**Validation:**
- At least 1 photo required
- Category required
- Description required

### 6. SOS Screen (`app/(screens)/SOSScreen.tsx`)

**Features:**
- Large SOS button
- Emergency instructions
- Shows SOSAlertModal after button press
- Automatic location transmission

### 7. Hotline Screen (`app/(screens)/HotlineScreen.tsx`)

**Features:**
- Emergency department directory
- Search/filter by category
- Call button (phone dialer)
- Directions button (maps integration)

### 8. Profile Screen (`app/(screens)/ProfileScreen.tsx`)

**Sections:**
- User info (name, phone, location)
- Recent Reports
- Edit Information
- Change Phone Number
- Help & Support
- Report a Problem
- About ResqLine
- Privacy Policy
- Terms of Service
- Log Out
- Delete Account

**Features:**
- Displays username (priority) or full name or device name
- Location display with loading state
- Confirmation overlays for logout/delete

### 9. Edit Information (`app/(screens)/EditInformationScreen.tsx`)

**Fields:**
- First Name
- Last Name
- Username
- Phone Number (read-only, link to change)

**Features:**
- Device name as default for empty fields
- Save button with validation
- Change number navigation

### 10. Recent Reports (`app/(screens)/RecentReportScreen.tsx`)

**Filters:**
- All
- Submitted
- Under Review

**Features:**
- Status badges
- Category icons
- Report details view

---

## State Management

### 1. User Profile Context (`app/_contexts/UserProfileContext.tsx`)

Global user profile state.

```typescript
interface UserProfile {
  userId?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  phoneNumber?: string;
  email?: string;
}

interface UserProfileContextType {
  profile: UserProfile;
  isLoading: boolean;
  error: Error | null;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearProfile: () => void;
  getFullName: () => string;
}
```

**Usage:**
```typescript
const { profile, updateProfile, getFullName } = useUserProfile();

// Update profile
await updateProfile({ firstName: 'John', lastName: 'Doe' });

// Get display name
const displayName = getFullName(); // Returns "John Doe" or "User"
```

### 2. React Query State

All API data is cached and managed by React Query:

```typescript
// Automatic caching
const { data: profile } = useMyProfile();

// Background refetching
const { data: reports, refetch } = useReports();

// Optimistic updates
const mutation = useUpdateUserInformation({
  onSuccess: () => {
    queryClient.invalidateQueries(['user', 'profile']);
  }
});
```

---

## Notifications

### Notification Types

1. **Success Notifications** (Green theme)
   - Registration success
   - Login success
   - Report submitted
   - Profile updated
   - Report resolved

2. **Info Notifications** (Blue theme)
   - Logout confirmation
   - Guest mode reminder
   - Phone number changed
   - Report status updates

3. **Error Notifications** (Red theme)
   - Report rejected
   - API errors
   - Validation errors

### Notification Triggers

| Event | Trigger Location | Notification |
|-------|-----------------|--------------|
| User Registered | SignUp-Verification | "Account Created" |
| User Logged In | LogIn-Verification | "Welcome Back!" |
| User Logged Out | authGuard.ts | "Logged Out" |
| Guest Mode | WelcomeScreen | "Guest Mode" reminder |
| Report Submitted | ReportBody | "Report Submitted" |
| Phone Verified | VerifyNumberScreen | "Phone Verified" |
| Account Deleted | ProfileBody | "Account Deleted" |

### Custom Notifications

```typescript
// Subscribe to events
const unsubscribe = notificationManager.subscribe(
  DomainEventType.ReportSubmitted,
  (event) => {
    console.log('Report submitted:', event.data);
  }
);

// Clean up
unsubscribe();
```

---

## Best Practices

### 1. Code Organization

- **One Component Per File**: Each component in its own file
- **Grouped Imports**: React → Libraries → Local
- **Type Safety**: Always define TypeScript interfaces
- **Named Exports**: Use named exports for utilities

### 2. Error Handling

```typescript
// Always wrap API calls in try-catch
try {
  const result = await mutation.mutateAsync(data);
  if (result.success) {
    // Handle success
  }
} catch (error: any) {
  Alert.alert('Error', formatApiError(error.message));
}
```

### 3. Form Validation

```typescript
// Validate before submission
if (!firstName || !lastName) {
  Alert.alert('Validation Error', 'All fields are required');
  return;
}

// Trim inputs
const trimmedFirstName = firstName.trim();
```

### 4. Loading States

```typescript
// Show loading indicator
if (isLoading) {
  return <ActivityIndicator size="large" color="#FF4444" />;
}

// Disable buttons during submission
<TouchableOpacity
  disabled={mutation.isPending}
  onPress={handleSubmit}
>
  <Text>{mutation.isPending ? 'Saving...' : 'Save'}</Text>
</TouchableOpacity>
```

### 5. Image Handling

```typescript
// Always use camera utility for consistency
import { showPhotoPickerAlert, Photo } from '../../_utils/camera';

const handleAddPhoto = () => {
  showPhotoPickerAlert(
    (photo: Photo) => setPhotos([...photos, photo]),
    5, // max photos
    photos.length // current count
  );
};
```

### 6. Navigation

```typescript
// Use replace for auth flows
router.replace({ pathname: '/(tabs)', params: { tab: 'home' } });

// Use push for navigable screens
router.push('/EditInformationScreen');

// Use back for modal dismissal
router.back();
```

### 7. Permissions

```typescript
// Always check and request permissions
const { status } = await Location.requestForegroundPermissionsAsync();
if (status !== 'granted') {
  Alert.alert(
    'Permission Required',
    'Please enable location in settings',
    [{ text: 'Open Settings', onPress: () => Linking.openSettings() }]
  );
  return;
}
```

---

## Troubleshooting

### Common Issues

#### 1. Location Permission Not Working

**Symptom**: App doesn't ask for location permission on iOS

**Solution**:
- iOS doesn't show permission dialog after first denial
- App now shows alert to open Settings
- User must manually enable in device settings

#### 2. Photos Not Uploading

**Symptom**: Report submission fails with image error

**Solution**:
- Ensure images are converted to Base64
- Check file size (should be reasonable)
- Verify `convertImageToBase64()` is used

#### 3. OTP Not Received

**Symptom**: SMS OTP doesn't arrive

**Solution**:
- Check phone number format (+63XXXXXXXXXX)
- Verify backend SMS service is running
- Check logs for `generateOtp` errors

#### 4. Token Expired

**Symptom**: User logged out unexpectedly

**Solution**:
- JWT tokens expire after configured time
- App automatically redirects to login
- User must re-authenticate

#### 5. Report Fetching Disabled

**Symptom**: Reports don't show on Home/Recent screens

**Solution**:
- Report fetching is currently commented out
- Uncomment `useReports()` hooks to enable
- Backend must be accessible

#### 6. Build Errors

**Symptom**: Metro bundler errors

**Solution**:
```bash
# Clear cache
npx expo start -c

# Reinstall dependencies
rm -rf node_modules
npm install

# Reset Metro
watchman watch-del-all (Mac/Linux)
```

### Debug Mode

Enable detailed logging:
```typescript
// In app/_api/config.ts
export const DEBUG_MODE = true;

// In components
if (DEBUG_MODE) {
  console.log('Debug info:', data);
}
```

### Performance Optimization

1. **React Query Caching**: Data is cached by default
2. **Image Optimization**: Use appropriate image sizes
3. **Lazy Loading**: Tab content only loads when active
4. **Memoization**: Use `React.memo()` for expensive components

---

## API Endpoints Reference

### Authentication
- `POST /users/register` - Register user
- `POST /otp/generate` - Generate OTP
- `POST /otp/verify` - Verify OTP, get JWT

### User Management
- `GET /users/me` - Get current user profile
- `PUT /users/me/information` - Update user info
- `PUT /users/me/mobile-number` - Change phone number
- `DELETE /users/me` - Delete account

### Reports
- `POST /reports` - Create report
- `GET /reports` - Get all reports (paginated)
- `GET /reports/{id}` - Get report by ID
- `GET /reports?status={status}` - Filter by status

### Health
- `GET /health` - API health check

---

## Future Enhancements

### Planned Features
1. **Push Notifications**: Real-time alerts using expo-notifications
2. **Report Editing**: Edit submitted reports
3. **Report Comments**: Communication with responders
4. **Map View**: Visual report locations
5. **Offline Mode**: Queue reports when offline
6. **Dark Mode**: Theme switching
7. **Multi-language**: Internationalization (i18n)
8. **Report Analytics**: User report statistics
9. **Emergency Contacts**: Save personal emergency contacts
10. **Voice SOS**: Voice-activated emergency alert

### Technical Debt
1. Enable report fetching (currently commented)
2. Implement comprehensive error tracking (Sentry)
3. Add unit/integration tests
4. Implement CI/CD pipeline
5. Optimize image compression
6. Add accessibility features (screen readers)
7. Implement proper rate limiting

---

## Contributing Guidelines

### Code Style
- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Write descriptive commit messages

### Pull Request Process
1. Create feature branch from `main`
2. Implement feature with tests
3. Update documentation
4. Submit PR with description
5. Address review feedback
6. Merge after approval

### Commit Message Format
```
type(scope): subject

body (optional)
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## License

[Add License Information]

---

## Support

For issues, questions, or contributions:
- GitHub Issues: [Repository Issues](https://github.com/Weiasnormal/ResqLink_Frontend/issues)
- Backend Repository: [ResQLine_Backend](https://github.com/your-org/ResQLine_Backend-master)

---

## Version History

### v1.0.0 (Current)
- Initial release
- User authentication (OTP-based)
- Emergency reporting with photos
- SOS alert system
- Hotline directory
- Profile management
- Location services
- Guest mode
- Device name integration
- Camera utility module
- Notification system

---

**Last Updated**: December 10, 2025
