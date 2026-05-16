# Architecture Overview - Anurag Aluminium

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React Native/Expo)                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐      │
│  │   Admin Panel    │  │  Field Expert    │  │    Login         │      │
│  │   Components     │  │   Components     │  │   Component      │      │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘      │
│         │                      │                      │                │
│         │  Manage Estimates    │  Create Estimates   │  Auth           │
│         │  Manage Field Experts│  View Progress       │                │
│         │  View Notifications  │                      │                │
│         └──────────────┬───────────────────────┬─────┘                │
│                        │                       │                      │
│  ┌─────────────────────▼───────────────────────▼──────────────┐       │
│  │            API Client Layer (utils/api.ts)                 │       │
│  │  - fieldExperts.*()   - estimates.*()                      │       │
│  │  - notifications.*()  - windowTypes.*()                    │       │
│  │  - auth.*()           - settings.*()                       │       │
│  └────────────────────────┬─────────────────────────────────┘       │
│                           │                                          │
│  ┌─────────────────────────▼───────────────────────────────┐        │
│  │     Zustand State Management (authStore.ts)            │        │
│  │     - User state                                        │        │
│  │     - Cross-platform storage (AsyncStorage/localStorage)        │
│  └──────────────────────┬─────────────────────────────────┘        │
│                         │                                           │
└─────────────────────────┼───────────────────────────────────────────┘
                          │
                   HTTP/JSON (REST)
                          │
┌─────────────────────────▼───────────────────────────────────────────────┐
│                    BACKEND (Spring Boot 3.2.0)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    Controllers (REST)                            │   │
│  ├──────────────────────────────────────────────────────────────────┤   │
│  │  ┌─────────────────────┐  ┌──────────────────────────────────┐   │   │
│  │  │ EstimateController  │  │ FieldExpertController           │   │   │
│  │  │                     │  │                                  │   │   │
│  │  │ POST   /estimates   │  │ POST   /field-experts           │   │   │
│  │  │ GET    /estimates   │  │ GET    /field-experts           │   │   │
│  │  │ PUT    /estimates   │  │ GET    /field-experts/:id       │   │   │
│  │  │ DELETE /estimates   │  │ PUT    /field-experts/:id       │   │   │
│  │  │ GET    /search      │  │ DELETE /field-experts/:id       │   │   │
│  │  │ GET    /date-range  │  │ PUT    /activate               │   │   │
│  │  │ GET    /status      │  │ PUT    /deactivate             │   │   │
│  │  │ GET    /expert      │  │ GET    /search                 │   │   │
│  │  └─────────────────────┘  └──────────────────────────────────┘   │   │
│  │                           ┌──────────────────────────────────┐   │   │
│  │                           │ NotificationController          │   │   │
│  │                           │                                  │   │   │
│  │                           │ GET    /notifications/:id        │   │   │
│  │                           │ PUT    /mark-read               │   │   │
│  │                           │ GET    /unread-count            │   │   │
│  │                           └──────────────────────────────────┘   │   │
│  │                  + SettingsController, AuthController, etc.      │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                     │                                   │
│  ┌──────────────────────────────────▼──────────────────────────────┐   │
│  │              Services (Business Logic)                           │   │
│  ├──────────────────────────────────────────────────────────────────┤   │
│  │  ┌─────────────────────────┐  ┌──────────────────────────────┐   │   │
│  │  │ EstimateService         │  │ FieldExpertService          │   │   │
│  │  │                         │  │                              │   │   │
│  │  │ createEstimate()        │  │ createFieldExpert()         │   │   │
│  │  │ updateEstimate()        │  │ updateFieldExpert()         │   │   │
│  │  │ deleteEstimate()        │  │ deleteFieldExpert()         │   │   │
│  │  │ searchEstimates()       │  │ getActiveFieldExperts()     │   │   │
│  │  │ getByDate()             │  │ searchFieldExperts()        │   │   │
│  │  │ getByStatus()           │  │ incrementEstimateCount()    │   │   │
│  │  │ getByFieldExpert()      │  │ deactivate/activate         │   │   │
│  │  │ generateOrderId()       │  │                              │   │   │
│  │  └─────────────────────────┘  └──────────────────────────────┘   │   │
│  │           ┌──────────────────────────────────────────┐             │   │
│  │           │ NotificationService                      │             │   │
│  │           │                                          │             │   │
│  │           │ createNotification()                     │             │   │
│  │           │ getNotifications()                       │             │   │
│  │           │ getUnreadCount()                         │             │   │
│  │           │ markAsRead()                             │             │   │
│  │           └──────────────────────────────────────────┘             │   │
│  │                                                                     │   │
│  │  + SettingsService, AuthService, WindowTypeService                │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                     │                                   │
│  ┌──────────────────────────────────▼──────────────────────────────┐   │
│  │          Repositories (Data Access)                             │   │
│  ├──────────────────────────────────────────────────────────────────┤   │
│  │  ┌─────────────────────────┐  ┌──────────────────────────────┐   │   │
│  │  │ EstimateRepository      │  │ FieldExpertRepository        │   │   │
│  │  │ (MongoRepository)       │  │ (MongoRepository)            │   │   │
│  │  │                         │  │                              │   │   │
│  │  │ - Query methods ✅      │  │ - Query methods ✅           │   │   │
│  │  │ - Custom @Query        │  │ - Custom @Query              │   │   │
│  │  │ - Full-text search     │  │ - Filter by active           │   │   │
│  │  └─────────────────────────┘  └──────────────────────────────┘   │   │
│  │      ┌──────────────────────────────────────────┐                 │   │
│  │      │ NotificationRepository                   │                 │   │
│  │      │ (MongoRepository)                        │                 │   │
│  │      │ - Query by adminId                       │                 │   │
│  │      │ - Filter by read status                  │                 │   │
│  │      └──────────────────────────────────────────┘                 │   │
│  │                                                                     │   │
│  │  + UserRepository, SettingsRepository, WindowTypeRepository       │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                     │                                   │
│  ┌──────────────────────────────────▼──────────────────────────────┐   │
│  │              Models (Data Objects)                               │   │
│  ├──────────────────────────────────────────────────────────────────┤   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │   │
│  │  │ Estimate │  │FieldExp. │  │Notif.   │  │ User    │          │   │
│  │  │          │  │          │  │         │  │         │          │   │
│  │  │ id       │  │ id       │  │ id      │  │ id      │          │   │
│  │  │ orderId  │  │ name     │  │ title   │  │ username│          │   │
│  │  │ created* │  │ phone    │  │ message │  │ password│          │   │
│  │  │ measures │  │ email    │  │ read    │  │ role    │          │   │
│  │  │ total    │  │ userId   │  │ admin   │  │ name    │          │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘          │   │
│  │   + Settings, MeasurementItem, Window Types                       │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                     │                                   │
└─────────────────────────────────────▼───────────────────────────────────┘
                                     │
┌─────────────────────────────────────▼───────────────────────────────────┐
│                      MongoDB Atlas (Database)                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Collections:                                                            │
│  ┌────────────────┐ ┌───────────────┐ ┌──────────────┐ ┌─────────────┐ │
│  │ estimates      │ │ field_experts │ │ notifications│ │ users       │ │
│  │ • 1000s docs   │ │ • Indexed: id │ │ • Indexed:  │ │ • Indexed   │ │
│  │ • Indexed      │ │ • Indexed:    │ │   admin_id  │ │ • Indexed   │ │
│  │ • Sharded      │ │   isActive    │ │   isRead    │ │ • Password  │ │
│  │                │ │ • Indexed:    │ │ • TTL can   │ │   encrypted │ │
│  │ Indexes:       │ │   name        │ │   be set    │ └─────────────┘ │
│  │ - orderId      │ └───────────────┘ └──────────────┘                 │
│  │ - createdAt    │                                  ┌─────────────┐   │
│  │ - fieldExpert  │ ┌────────────────┐  ┌──────────┐ │ settings    │   │
│  │ - customName   │ │ window_types   │  │ audit    │ │ • defaultR. │   │
│  │ - status       │ │ • name         │  │ • logs   │ └─────────────┘   │
│  └────────────────┘ └────────────────┘  └──────────┘                  │
│                                                                          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. Field Expert Creation Flow
```
Frontend UI (Admin)
    ↓
Form submission
    ↓
POST /api/field-experts
    ↓ (with: name, phone, email, username, password)
    ↓
FieldExpertController.create()
    ↓
FieldExpertService.createFieldExpert()
    ↓
    ├─→ Create User (for login)
    │   └─→ UserRepository.save()
    │       └─→ MongoDB: users collection
    │
    ├─→ Create FieldExpert (profile)
    │   └─→ FieldExpertRepository.save()
    │       └─→ MongoDB: field_experts collection
    │
    └─→ Return FieldExpertResponse
        └─→ Frontend: Success/Error message
```

### 2. Estimate Creation with Notification Flow
```
Frontend UI (Field Expert)
    ↓
Create Estimate Form
    ↓
POST /api/estimates
    ↓ (with: measurements, fieldExpertName, etc.)
    ↓
EstimateController.create()
    ↓
EstimateService.createEstimate()
    ↓
    ├─→ Generate unique orderId (ORD-XXXXXXXX)
    │
    ├─→ Apply default rate if not set
    │   └─→ Get from SettingsService
    │       └─→ Default: 100.0 if not configured
    │
    ├─→ Calculate measurements
    │   └─→ For each MeasurementItem:
    │       - areaSqft = (width × height) / 144
    │       - amount = areaSqft × rate × quantity
    │       - No more zero values! ✅
    │
    ├─→ Calculate totals
    │   └─→ subtotal - discount + cartage = total
    │
    ├─→ Save to EstimateRepository
    │   └─→ MongoDB: estimates collection
    │
    ├─→ Create Admin Notification
    │   └─→ NotificationService.createNotification()
    │       └─→ NotificationRepository.save()
    │           └─→ MongoDB: notifications collection
    │
    └─→ Increment Field Expert estimate count
        └─→ FieldExpertService.incrementEstimateCount()
            └─→ FieldExpertRepository.save()
                └─→ MongoDB: field_experts collection
                    (totalEstimates++)
```

### 3. Search/Filter Estimates Flow
```
Frontend UI (Admin)
    ↓
Apply filters: date range, expert, status, search term
    ↓
Multiple parallel queries:
    │
    ├─→ GET /api/estimates/search?query="ORD-"
    │   └─→ EstimateController.searchEstimates()
    │       └─→ EstimateService.searchEstimates()
    │           └─→ EstimateRepository.searchByCustomerName()  ← REGEX
    │           └─→ EstimateRepository.findByOrderIdContaining()
    │           └─→ EstimateRepository.findByMobileNumber()
    │           └─→ EstimateRepository.findByFieldExpertName()
    │               └─→ MongoDB: Indexed queries, returns results
    │
    ├─→ GET /api/estimates/date-range?s=...&e=...
    │   └─→ EstimateRepository.findByCreatedAtBetween()
    │       └─→ MongoDB: createdAt index, returns results
    │
    ├─→ GET /api/estimates/field-expert/{name}
    │   └─→ EstimateRepository.findByFieldExpertName()
    │       └─→ MongoDB: field_expert_name index, returns results
    │
    └─→ GET /api/estimates/payment-status/{status}
        └─→ EstimateRepository.findByPaymentStatus()
            └─→ MongoDB: query by status, returns results
                ↓
            Frontend: Displays filtered results with sorting
```

### 4. Notification Management Flow
```
Field Expert creates estimate
    ↓
EstimateService triggers NotificationService
    ↓
Notification saved to MongoDB
    ↓
Admin opens notifications page
    ↓
GET /api/notifications/admin/{adminId}
    ↓
NotificationController.getNotifications()
    ↓
NotificationService.getNotifications()
    ↓
NotificationRepository.findByAdminIdOrderByCreatedAtDesc()
    ↓
MongoDB: Query with adminId filter, sorted by createdAt DESC
    ↓
Return list to frontend
    ↓
Admin clicks notification
    ↓
PUT /api/notifications/{id}/mark-read
    ↓
NotificationService.markAsRead()
    ↓
NotificationRepository.update(isRead = true)
    ↓
MongoDB: Update notification document
    ↓
Unread count decreases on dashboard
```

---

## Component Relationships

```
┌─────────────────────────────────────────────────┐
│          Frontend Components                    │
├─────────────────────────────────────────────────┤
│                                                  │
│  admin/
│  ├── index.tsx (Dashboard)
│  │   ├── Notifications badge ──┐
│  │   ├── Menu (Estimates) ─────┼──┐
│  │   ├── Menu (Field Experts)  ├──┼──┐
│  │   └── Menu (Settings)       │  │  │
│  │                             │  │  │
│  ├── estimates.tsx             │  │  │
│  │   ├── List with search      │  │  │
│  │   ├── Sort options          │  │  │
│  │   ├── Filter options        │  │  │
│  │   └── Click to edit         │  │  │
│  │                             │  │  │
│  ├── edit-estimate.tsx         │  │  │
│  │   └── Update estimate       │  │  │
│  │                             │  │  │
│  ├── create-estimate.tsx ◄─────┘  │  │
│  │   └── Admin create estimate    │  │
│  │                                │  │
│  ├── field-experts.tsx ◄──────────┘  │
│  │   ├── List field experts         │
│  │   ├── Search bar                 │
│  │   ├── Add button → create.tsx    │
│  │   └── Click to edit → edit.tsx   │
│  │                                  │
│  ├── field-experts-form.tsx         │
│  │   └── Reusable form component    │
│  │                                  │
│  ├── notifications.tsx ◄────────────┘
│  │   ├── List all notifications
│  │   ├── Mark as read
│  │   └── Link to estimate
│  │
│  └── _layout.tsx
│      └── Routing configuration
│
└──────────────────────────────────────────────────┘
         All use: utils/api.ts methods
```

---

## Database Schema

### Estimates Collection
```javascript
{
  _id: ObjectId,
  order_id: "ORD-ABC12345",        // NEW - Unique, indexed
  field_expert_name: "John Doe",
  customer_name: "ABC Company",
  site_address: "123 Business St",
  mobile_number: "9876543210",
  measurements: [
    {
      window_type: "Glass Door",
      width_inches: 36.5,
      height_inches: 84.0,
      quantity: 2,
      rate: 150.0,
      area_sqft: 21.5,
      amount: 6450.0
    }
  ],
  subtotal: 12900.0,
  discount: 500.0,
  advance_received: 1000.0,
  cartage: 100.0,
  total: 12500.0,
  payment_status: "pending",
  created_by: "field_expert",       // NEW
  created_by_name: "John Doe",      // NEW
  created_at: ISODate("2024-01-15T10:30:00Z"),
  updated_at: ISODate("2024-01-15T10:30:00Z")
}

Indexes:
- _id (primary)
- order_id (unique)
- field_expert_name
- customer_name
- created_at
- payment_status
```

### Field Experts Collection
```javascript
{
  _id: ObjectId,
  name: "John Doe",                 // Indexed
  phone: "9876543210",              // Unique
  email: "john@example.com",        // Unique
  address: "123 Main St",
  user_id: ObjectId(...),           // Reference to users collection
  is_active: true,                  // Indexed - for soft delete
  total_estimates: 25,              // Incremented when estimate created
  created_at: ISODate("2024-01-10T14:20:00Z"),
  updated_at: ISODate("2024-01-15T10:30:00Z")
}

Indexes:
- _id (primary)
- name
- is_active
- user_id
```

### Notifications Collection
```javascript
{
  _id: ObjectId,
  admin_id: "admin123",             // Indexed
  type: "estimate_created",
  title: "New Estimate from John Doe",
  message: "Customer: ABC Company, Order: ORD-ABC12345",
  estimate_id: ObjectId(...),       // Reference to estimates
  field_expert_name: "John Doe",
  customer_name: "ABC Company",
  is_read: false,                   // Indexed for unread count
  created_at: ISODate("2024-01-15T10:35:00Z")
}

Indexes:
- _id (primary)
- admin_id
- admin_id + is_read (compound)
- created_at (for sorting)
```

---

## API Response Examples

### Create Field Expert Response
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "address": "123 Main St",
  "is_active": true,
  "total_estimates": 0,
  "user_id": "507f1f77bcf86cd799439012",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Create Estimate Response (Admin)
```json
{
  "id": "507f1f77bcf86cd799439013",
  "order_id": "ORD-A1B2C3D4",
  "field_expert_name": "John Doe",
  "customer_name": "ABC Company",
  "site_address": "123 Business Ave",
  "mobile_number": "9876543210",
  "measurements": [
    {
      "window_type": "Glass Door",
      "width_inches": 36.5,
      "height_inches": 84.0,
      "quantity": 2,
      "rate": 150.0,
      "area_sqft": 21.5,
      "amount": 6450.0
    }
  ],
  "subtotal": 12900.0,
  "discount": 500.0,
  "advance_received": 1000.0,
  "cartage": 100.0,
  "total": 12500.0,
  "payment_status": "pending",
  "created_by": "admin",
  "created_by_name": "Admin User",
  "created_at": "2024-01-15T10:35:00Z",
  "updated_at": "2024-01-15T10:35:00Z"
}
```

### Get Notifications Response
```json
[
  {
    "id": "507f1f77bcf86cd799439014",
    "admin_id": "admin123",
    "type": "estimate_created",
    "title": "New Estimate from John Doe",
    "message": "Customer: ABC Company, Order: ORD-A1B2C3D4",
    "estimate_id": "507f1f77bcf86cd799439013",
    "field_expert_name": "John Doe",
    "customer_name": "ABC Company",
    "is_read": false,
    "created_at": "2024-01-15T10:35:00Z"
  }
]
```

---

## Technology Stack Summary

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | React Native | Latest | Mobile/Web UI |
| | Expo Router | Latest | Navigation |
| | Zustand | Latest | State Management |
| | TypeScript | Latest | Type Safety |
| **Backend** | Spring Boot | 3.2.0 | REST API Framework |
| | Spring Data | 3.2.0 | Data Access |
| | Spring Security | 3.2.0 | Crypto |
| | Lombok | Latest | Reduce Boilerplate |
| **Database** | MongoDB | Atlas | Document Store |
| | Mongoose | N/A (Java) | Schema Validation |
| **Build** | Maven | 3.9.6 | Java Build |
| **Runtime** | Java | 21 LTS | JVM Runtime |

---

**Architecture Status**: ✅ COMPLETE & PRODUCTION READY
