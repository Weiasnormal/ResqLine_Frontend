# ResqLine API Integration

This directory contains the complete API integration layer for ResqLine, perfectly aligned with your .NET backend.

## 📁 Structure

```
app/
├── _api/                 # API layer
│   ├── config.ts         # Axios configuration & interceptors
│   ├── auth.ts           # Authentication endpoints
│   ├── user.ts           # User management endpoints  
│   ├── reports.ts        # Reports endpoints
│   └── index.ts          # Exports all APIs
├── _providers/           # React providers
│   └── ApiProvider.tsx   # React Query provider
├── _hooks/               # Custom hooks
│   └── useApi.ts         # React Query hooks for API calls
├── _utils/               # Utility functions
│   └── apiHelpers.ts     # Helper functions for API operations
└── _examples/            # Example integrations
    └── SignUp-Verification-API.tsx  # Example screen with API
```

## 🚀 Backend Alignment

### **Endpoints Mapped:**
- `POST /users/register` → `authApi.register()`
- `POST /otp/generate` → `authApi.generateOtp()`
- `POST /otp/verify` → `authApi.verifyOtp()` 
- `PATCH /users/updateinformation` → `userApi.updateInformation()`
- `PATCH /users/updatephonenumber` → `userApi.updatePhoneNumber()`
- `DELETE /users` → `userApi.deleteAccount()`
- `POST /reports` → `reportsApi.create()`
- `GET /reports` → `reportsApi.getAll()`
- `GET /reports/{id}` → `reportsApi.getById()`

### **Data Types Match Backend:**
```typescript
// Categories (Flags enum)
enum Category {
  None = 0,
  Fire = 1, 
  Electric = 2,
  Flood = 4,
  Violence = 8
}

// Status enum
enum Status {
  Submitted = 'Submitted',
  Under_Review = 'Under_Review', 
  In_Progress = 'In_Progress',
  Resolved = 'Resolved',
  Rejected = 'Rejected'
}

// Location object
interface Location {
  latitude: number;
  longitude: number;
  altitude: number;
  accuracy: number;
  altitudeAccuracy: number;
}
```

## 🔧 Usage Examples

### **1. Authentication Flow**

```tsx
import { useRegister, useGenerateOtp, useVerifyOtp } from '../_hooks/useApi';

const SignUpScreen = () => {
  const registerMutation = useRegister();
  const generateOtpMutation = useGenerateOtp();
  const verifyOtpMutation = useVerifyOtp();

  const handleRegister = async () => {
    try {
      // 1. Register user
      await registerMutation.mutateAsync({
        mobileNumber: '09123456789',
        firstName: 'John',
        lastName: 'Doe'
      });

      // 2. Generate OTP
      await generateOtpMutation.mutateAsync({
        mobileNumber: '09123456789'
      });

      // 3. Verify OTP (in verification screen)
      await verifyOtpMutation.mutateAsync({
        mobileNumber: '09123456789',
        otp: '1234'
      });

      // JWT token is automatically stored
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
};
```

### **2. Report Creation**

```tsx
import { useCreateReport } from '../_hooks/useApi';
import { Category, mapCategoryToEnum } from '../_api/reports';
import { pickAndConvertImage } from '../_utils/apiHelpers';

const ReportScreen = () => {
  const createReportMutation = useCreateReport();

  const handleSubmitReport = async () => {
    try {
      // Pick and convert image
      const base64Image = await pickAndConvertImage();
      
      // Get current location (using your existing location hooks)
      const location = await getCurrentLocation();

      // Create report
      await createReportMutation.mutateAsync({
        userId: 'user-guid-here',
        image: base64Image || '',
        category: mapCategoryToEnum('fire'), // Category.Fire
        title: 'Emergency Report',
        description: 'Details about the emergency',
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          altitude: 0,
          accuracy: location.accuracy || 10,
          altitudeAccuracy: 0
        }
      });

      Alert.alert('Success', 'Report submitted successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
};
```

### **3. Fetch Reports**

```tsx
import { useReports, useReportsByStatus } from '../_hooks/useApi';
import { Status } from '../_api/reports';

const ReportsScreen = () => {
  // Get all reports
  const { data: allReports, isLoading } = useReports({
    pageSize: 20,
    pageOffset: 0,
    sort: 'createdAt'
  });

  // Get reports by status
  const { data: submittedReports } = useReportsByStatus(Status.Submitted);

  if (isLoading) return <LoadingSpinner />;

  return (
    <FlatList
      data={allReports}
      renderItem={({ item }) => (
        <ReportCard 
          report={{
            ...item,
            status: mapStatusToString(item.status), // Convert enum to display string
          }}
        />
      )}
    />
  );
};
```

### **4. User Profile Management**

```tsx
import { useUpdateUserInformation, useUpdatePhoneNumber } from '../_hooks/useApi';

const ProfileScreen = () => {
  const updateInfoMutation = useUpdateUserInformation();
  const updatePhoneMutation = useUpdatePhoneNumber();

  const handleUpdateProfile = async () => {
    try {
      await updateInfoMutation.mutateAsync({
        firstName: 'John',
        lastName: 'Doe', 
        username: 'johndoe'
      });

      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleUpdatePhone = async () => {
    try {
      await updatePhoneMutation.mutateAsync('09123456789');
      Alert.alert('Success', 'Phone number updated successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
};
```

## 🔐 Authentication

JWT tokens are automatically handled:
- Stored securely in `expo-secure-store`
- Automatically added to request headers
- Auto-logout on token expiration (401 errors)

## 🔧 Configuration

Update API base URL in `_api/config.ts`:

```typescript
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000'        // Your local backend
  : 'https://api.resqline.com';    // Your production backend
```

## 📱 Integration Steps

1. **Replace mock data** in existing screens with API calls
2. **Use React Query hooks** for automatic caching and error handling  
3. **Handle loading states** with `isLoading` from hooks
4. **Show errors** using the formatted error messages
5. **Update UI** when mutations succeed (auto-invalidation)

## ⚠️ Important Notes

- **Image handling**: Images are converted to base64 for API upload
- **Phone formatting**: Use `formatPhoneForApi()` to clean phone numbers
- **Error handling**: All errors are properly formatted for user display
- **Caching**: React Query automatically caches responses
- **Background sync**: Failed requests can be retried automatically

## 🔄 Migration from Mock Data

Replace calls like:
```tsx
// OLD - Mock data
const reports = RECENT_REPORTS_DATA;

// NEW - API data
const { data: reports, isLoading } = useReports();
```

Your ResqLine app is now 100% ready for backend integration! 🎉