# Frontend Implementation Quick Reference

## API Base URL
```typescript
const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
// Example: http://localhost:8080
```

---

## Field Expert Management API

### Get All Field Experts
```typescript
GET /api/field-experts
Response: Array<FieldExpert>
```

### Get Active Field Experts Only
```typescript
GET /api/field-experts/active
Response: Array<FieldExpert>
```

### Search Field Experts
```typescript
GET /api/field-experts/search?query=john
Response: Array<FieldExpert>
```

### Get Single Field Expert
```typescript
GET /api/field-experts/{id}
Response: FieldExpert
```

### Create Field Expert
```typescript
POST /api/field-experts
Body: {
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "address": "123 Main St",
  "username": "john_doe",
  "password": "secure_pass"
}
Response: FieldExpert
```

### Update Field Expert
```typescript
PUT /api/field-experts/{id}
Body: {
  "name": "John Updated",
  "phone": "9876543211",
  "email": "john.new@example.com",
  "address": "456 Oak St"
}
Response: FieldExpert
```

### Delete Field Expert
```typescript
DELETE /api/field-experts/{id}
Response: { message: "Deleted" }
```

### Deactivate Field Expert
```typescript
PUT /api/field-experts/{id}/deactivate
Response: FieldExpert (with isActive=false)
```

### Activate Field Expert
```typescript
PUT /api/field-experts/{id}/activate
Response: FieldExpert (with isActive=true)
```

---

## Notification API

### Get All Notifications for Admin
```typescript
GET /api/notifications/admin/{adminId}
Response: Array<Notification>
Example: GET /api/notifications/admin/admin123
```

### Get Unread Notification Count
```typescript
GET /api/notifications/admin/{adminId}/unread-count
Response: { unread_count: 5 }
```

### Mark Notification as Read
```typescript
PUT /api/notifications/{notificationId}/mark-read
Response: Notification (with isRead=true)
```

---

## Estimate Enhancement API

### Search Estimates
```typescript
GET /api/estimates/search?query=ORD-ABC123
// Searches: customer name, order ID, phone, field expert name
Response: Array<Estimate>
```

### Filter Estimates by Date Range
```typescript
GET /api/estimates/date-range?startDate=2024-01-01T00:00:00&endDate=2024-12-31T23:59:59
Response: Array<Estimate>
```

### Filter by Payment Status
```typescript
GET /api/estimates/payment-status/paid
// Values: "paid", "pending", "partial"
Response: Array<Estimate>
```

### Get Estimates by Field Expert
```typescript
GET /api/estimates/field-expert/John%20Doe
Response: Array<Estimate>
```

### Create Estimate (Admin)
```typescript
POST /api/estimates
Body: {
  "field_expert_name": "John Doe",  // Optional for admin
  "customer_name": "ABC Company",
  "site_address": "123 Business Ave",
  "mobile_number": "9876543210",
  "measurements": [
    {
      "window_type": "Glass Door",
      "width_inches": 36,
      "height_inches": 84,
      "quantity": 2,
      "rate": 150.0
    }
  ],
  "created_by": "admin",  // NEW
  "created_by_name": "Admin User",  // NEW
  "discount": 100.0,  // NEW
  "advance_received": 500.0,  // NEW
  "cartage": 50.0,  // NEW
  "payment_status": "pending"
}
Response: Estimate
```

---

## Data Models

### FieldExpert
```typescript
{
  id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  isActive: boolean;
  totalEstimates: number;
  userId: string;  // Reference to User
  createdAt: string;
  updatedAt: string;
}
```

### Notification
```typescript
{
  id: string;
  adminId: string;
  type: string;  // e.g., "estimate_created"
  title: string;
  message: string;
  estimateId: string;
  fieldExpertName: string;
  customerName: string;
  isRead: boolean;
  createdAt: string;
}
```

### Estimate (Updated)
```typescript
{
  id: string;
  fieldExpertName: string;
  customerName: string;
  siteAddress: string;
  mobileNumber: string;
  measurements: Array<{
    windowType: string;
    widthInches: number;
    heightInches: number;
    quantity: number;
    rate: number;
    areaSqft: number;
    amount: number;
  }>;
  orderId: string;  // NEW - e.g., "ORD-ABC12345"
  createdBy: string;  // NEW - "admin" or "field_expert"
  createdByName: string;  // NEW - Name of creator
  subtotal: number;
  discount: number;
  advanceReceived: number;
  cartage: number;
  total: number;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## Frontend API Integration (in utils/api.ts)

### Already Added Methods
```typescript
// Field Experts
api.fieldExperts.getAll()
api.fieldExperts.getActive()
api.fieldExperts.create(data)
api.fieldExperts.update(id, data)
api.fieldExperts.delete(id)
api.fieldExperts.get(id)
api.fieldExperts.search(query)

// Notifications
api.notifications.getAll(adminId)
api.notifications.getUnreadCount(adminId)
api.notifications.markAsRead(id)

// Estimate Enhancements
api.estimates.searchEstimates(query)
api.estimates.getEstimatesByDate(startDate, endDate)
api.estimates.getEstimatesByFieldExpert(fieldExpertName)
api.estimates.getEstimatesByPaymentStatus(status)
```

---

## Component Structure Recommendations

### For Field Expert Management
```
admin/
├── field-experts/
│   ├── index.tsx          # List all with search
│   ├── create.tsx         # Create form
│   └── edit/[id].tsx      # Edit form
```

### For Admin Estimate Creation
```
admin/
├── create-estimate.tsx    # Create estimate form (similar to field expert's)
└── edit-estimate.tsx      # Update to include new fields
```

### For Notifications
```
admin/
├── notifications.tsx      # List notifications
└── _layout.tsx            # Add notification badge in header
```

---

## Common Implementation Patterns

### Using New API Methods
```typescript
import { api } from '../utils/api';

// Get field experts for dropdown
const experts = await api.fieldExperts.getActive();

// Create field expert
const newExpert = await api.fieldExperts.create({
  name: "John",
  phone: "9876543210",
  email: "john@example.com",
  username: "john_user",
  password: "pass123"
});

// Search estimates
const results = await api.estimates.searchEstimates("ORD-");

// Get unread notifications
const { unread_count } = await api.notifications.getUnreadCount(userId);

// Mark notification as read
await api.notifications.markAsRead(notificationId);
```

### Form Validation
```typescript
// Field Expert Creation Form
const validateFieldExpert = (data: any) => {
  const errors: Record<string, string> = {};
  
  if (!data.name?.trim()) errors.name = "Name required";
  if (!data.phone?.match(/^\d{10}$/)) errors.phone = "Valid 10-digit phone required";
  if (!data.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.email = "Valid email required";
  if (!data.username?.trim()) errors.username = "Username required";
  if (!data.password || data.password.length < 6) errors.password = "Password min 6 chars";
  
  return Object.keys(errors).length === 0 ? null : errors;
};
```

### Error Handling
```typescript
try {
  const fieldExpert = await api.fieldExperts.create(data);
  // Show success message
  showToast('Field expert created successfully');
} catch (error: any) {
  // Show error message
  showToast('Failed to create field expert: ' + error.message);
}
```

---

## Key Frontend Features to Implement

1. **Field Expert CRUD**
   - ✅ Backend ready
   - ⏳ UI needed

2. **Admin Estimate Creation**
   - ✅ Backend ready
   - ⏳ UI needed

3. **Notifications**
   - ✅ Backend ready
   - ⏳ UI needed

4. **Advanced Search & Filter**
   - ✅ Backend ready
   - ⏳ UI needed

5. **Navigation Fixes**
   - ⏳ Use `router.replace()` instead of `router.back()`

---

## Testing Endpoints with cURL

### Create Field Expert
```bash
curl -X POST http://localhost:8080/api/field-experts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Expert",
    "phone": "9999999999",
    "email": "test@example.com",
    "address": "123 Test St",
    "username": "testuser",
    "password": "password123"
  }'
```

### Get All Field Experts
```bash
curl http://localhost:8080/api/field-experts
```

### Search Estimates
```bash
curl "http://localhost:8080/api/estimates/search?query=ORD-"
```

### Get Notifications
```bash
curl http://localhost:8080/api/notifications/admin/admin123
```

---

## Notes for Frontend Developers

1. **Order IDs**: Format is always ORD-XXXXXXXX, useful for searching
2. **Default Rate**: Always applied when not specified (defaults to 100.0)
3. **Amounts**: Always calculated correctly (no more zero values)
4. **Notifications**: Auto-created when field expert submits estimate
5. **Date Format**: Use ISO format (2024-01-15T00:00:00)
6. **Search**: Case-insensitive, works across multiple fields

---

## Related Files Modified

### Backend Changes
- `/backend/src/main/java/com/anurag/aluminium/controller/EstimateController.java` - Added search/filter endpoints
- `/backend/src/main/java/com/anurag/aluminium/service/EstimateService.java` - Added search/filter methods
- `/backend/src/main/java/com/anurag/aluminium/repository/EstimateRepository.java` - Added query methods
- `/backend/src/main/java/com/anurag/aluminium/dto/EstimateRequest.java` - Added new fields

### Frontend Updates
- `/frontend/utils/api.ts` - All new API methods added

---

**Status**: All backend APIs are production-ready and fully compiled! ✅
