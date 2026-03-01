# Anurag Aluminium & Glass House - Window Estimation App

A professional mobile application for on-site window measurement and instant estimation, built specifically for Anurag Aluminium & Glass House.

## 📱 Features

### Field Expert Role
- **On-Site Measurements**: Enter window measurements in inches with fractional precision
- **Flexible Input**: Support for fractions (1/16 to 15/16) or decimal input
- **Multiple Windows**: Add multiple window measurements for a single customer
- **Predefined Window Types**: Select from 8+ standard operating procedures (SOPs)
- **Customer Management**: Store customer details including name, address, and mobile number
- **Offline Capability**: Works offline for on-site measurements
- **Area Calculation**: Automatic conversion from inches to square feet

### Admin Role
- **Estimate Management**: View, edit, and manage all customer estimates
- **Rate Setting**: Set rates per square foot for each window measurement
- **Discount & Charges**: Apply discounts, advance payments, and cartage charges
- **Payment Tracking**: Mark estimates as pending, partial, or fully paid
- **Professional PDF Generation**: Create detailed estimates with company branding
- **WhatsApp Sharing**: Share estimates directly via WhatsApp or other apps
- **Window Type Management**: Add/remove window types (SOPs)
- **Default Rate Setting**: Configure default rate per square foot

## 🏗️ Technical Architecture

### Frontend (Mobile App)
- **Framework**: React Native with Expo
- **Router**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Storage**: AsyncStorage for offline data
- **UI Components**: Custom components with React Native
- **PDF Generation**: expo-print
- **File Sharing**: expo-sharing, react-native-share

### Backend (API)
- **Framework**: FastAPI (Python)
- **Database**: MongoDB with Motor (async driver)
- **Authentication**: Password-based with bcrypt
- **API Pattern**: RESTful API

### Tech Stack
```
Frontend: React Native 0.81, Expo 54, TypeScript
Backend: FastAPI 0.110, Python 3.11
Database: MongoDB
Mobile Libraries:
  - @react-native-async-storage/async-storage
  - expo-print
  - expo-sharing
  - expo-file-system
  - react-native-share
  - zustand
```

## 📐 Measurement System

The app uses inches as the primary measurement unit with the following features:

1. **Fractional Input**: Select from 16 standard fractions (1/16, 1/8, 3/16, ..., 15/16)
2. **Whole + Fraction**: Enter measurements as whole inches + fraction
3. **Automatic Conversion**: Converts to decimal inches for calculation
4. **Square Feet Calculation**: Area = (Width × Height) / 144

### Example
```
Input: 48 inches + 1/4 = 48.25 inches (width)
       51 inches + 1/4 = 51.25 inches (height)
Area: (48.25 × 51.25) / 144 = 17.172 sq ft
```

## 🔐 Authentication

### Default Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`
- Role: Full access to all features

**Field Expert Account:**
- Username: `expert`
- Password: `expert123`
- Role: Can add measurements only (no rate/price visibility)

## 📋 Window Types (SOPs)

Predefined window types:
1. Three track sliding window
2. Two track sliding window
3. Three track domal system window
4. Two track domal system window
5. Partition fixed
6. Partition with doors
7. Ventilation only net
8. Ventilation net + glass

*Admin can add custom window types*

## 💰 Estimate Calculation

```
Subtotal = Σ (Area × Rate × Quantity)
Total = Subtotal - Discount + Cartage
Balance Due = Total - Advance Received
```

## 📄 PDF Estimate Format

The generated PDF includes:
- **Company Information**: Logo, name, address, contacts
- **Customer Details**: Name, address, mobile number
- **Estimate Number & Date**
- **Field Expert Name**
- **Detailed Measurements Table**:
  - Window Type
  - Dimensions (Width × Height in inches)
  - Area (sq ft)
  - Quantity
  - Rate per sq ft
  - Amount
- **Financial Summary**:
  - Subtotal
  - Discount (if any)
  - Cartage (if any)
  - Total Amount
  - Advance Received (if any)
  - Balance Due
  - Payment Status
- **Legal Note**: Terms and conditions with "GST extra" mention
- **Signature Spaces**: Customer and authorized signature

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB
- Expo CLI

### Installation

1. **Backend Setup**
```bash
cd /app/backend
pip install -r requirements.txt
python server.py
```

2. **Frontend Setup**
```bash
cd /app/frontend
yarn install
yarn start
```

3. **Initialize Database**
```bash
curl -X POST http://localhost:8001/api/auth/init
```

### Environment Variables

**Frontend (.env)**
```
EXPO_PUBLIC_BACKEND_URL=your-backend-url
```

**Backend (.env)**
```
MONGO_URL=your-mongodb-url
DB_NAME=anurag_aluminium
```

## 📱 Mobile App Screenshots

### Field Expert Flow
1. Login → Dashboard
2. New Measurement → Customer Details
3. Add Window Measurements (with fraction selector)
4. Save (without seeing rates)

### Admin Flow
1. Login → Dashboard
2. View All Estimates
3. Edit Estimate → Add Rates
4. Apply Discount/Advance/Cartage
5. Generate PDF → Share via WhatsApp

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/init` - Initialize default users

### Window Types
- `GET /api/window-types` - Get all window types
- `POST /api/window-types` - Create new window type (Admin only)
- `DELETE /api/window-types/{id}` - Delete window type (Admin only)

### Estimates
- `GET /api/estimates` - Get all estimates
- `GET /api/estimates/{id}` - Get specific estimate
- `POST /api/estimates` - Create new estimate (Field Expert)
- `PUT /api/estimates/{id}` - Update estimate (Admin only)
- `DELETE /api/estimates/{id}` - Delete estimate (Admin only)

### Settings
- `GET /api/settings` - Get app settings
- `PUT /api/settings` - Update settings (Admin only)

## 📊 Database Collections

### users
```json
{
  "username": "string",
  "password": "hashed_string",
  "role": "admin | field_expert",
  "name": "string",
  "created_at": "datetime"
}
```

### estimates
```json
{
  "field_expert_name": "string",
  "customer_name": "string",
  "site_address": "string",
  "mobile_number": "string",
  "measurements": [
    {
      "window_type": "string",
      "width_inches": "float",
      "height_inches": "float",
      "quantity": "int",
      "rate": "float",
      "area_sqft": "float",
      "amount": "float"
    }
  ],
  "subtotal": "float",
  "discount": "float",
  "advance_received": "float",
  "cartage": "float",
  "total": "float",
  "payment_status": "pending | partial | full",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### window_types
```json
{
  "name": "string",
  "created_at": "datetime"
}
```

### settings
```json
{
  "default_rate": "float"
}
```

## 🏢 Company Information

**Anurag Aluminium & Glass House**
- Address: 55, Sainath Colony, Alakhdham Nagar, Indore Road, Ujjain
- Contact: 9827086001, 9131001671
- Owners: Sandeep Jain, Mehul Jain

## 📝 Important Notes

1. **Measurement Precision**: The app supports 1/16 inch precision for accurate measurements
2. **Offline First**: Field experts can work offline and sync later
3. **Rate Privacy**: Field experts cannot see rates or pricing information
4. **PDF Note**: All estimates include: "This is an estimate based on the measurements provided. Final amount may vary based on actual installation and material availability. Please verify all measurements before confirming the order. GST extra."
5. **WhatsApp Integration**: Direct sharing to WhatsApp for quick customer communication

## 🔧 Maintenance

### Adding New Window Types
Admin → Window Types (SOPs) → Add Button → Enter Name → Save

### Changing Default Rate
Admin → Settings → Update Default Rate per Sq Ft → Save

### Managing Estimates
Admin → All Estimates → Select Estimate → Edit → Update Rates/Discount/Payment Status → Save

## 📞 Support

For technical support or feature requests, please contact the development team.

## 📜 Version

Current Version: **1.0.0**

---

Built with ❤️ for Anurag Aluminium & Glass House
