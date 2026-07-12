# KPB Travels API Documentation

## Base URL
```
http://localhost:5000/api
Production: https://api.kpbtravels.com/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Response Format
```json
{
  "success": true/false,
  "message": "Response message",
  "data": {}
}
```

---

## Authentication Endpoints

### Register User
```
POST /auth/register

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "phone": "9876543210",
  "userType": "customer" // customer, driver, admin
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "userType": "customer"
  }
}
```

### Login
```
POST /auth/login

Request Body:
{
  "email": "john@example.com",
  "password": "securepass123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "userType": "customer"
  }
}
```

### Logout
```
POST /auth/logout
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## User Endpoints

### Get Profile
```
GET /users/profile
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipcode": "10001",
      "country": "USA"
    },
    "userType": "customer",
    "verified": true,
    "isActive": true
  }
}
```

### Update Profile
```
PUT /users/profile
Headers: Authorization: Bearer <token>

Request Body:
{
  "name": "Jane Doe",
  "phone": "9876543211",
  "address": {
    "street": "456 Oak Ave",
    "city": "Boston",
    "state": "MA",
    "zipcode": "02101",
    "country": "USA"
  }
}

Response:
{
  "success": true,
  "user": { ...updated user object... }
}
```

### Get All Users
```
GET /users?userType=customer&limit=10&page=1

Query Parameters:
- userType: optional (customer, driver, admin)
- limit: optional, default 10
- page: optional, default 1

Response:
{
  "success": true,
  "total": 150,
  "page": 1,
  "limit": 10,
  "users": [ ...user objects... ]
}
```

### Get User by ID
```
GET /users/:id

Response:
{
  "success": true,
  "user": { ...user object... }
}
```

### Deactivate User
```
PUT /users/:id/deactivate

Response:
{
  "success": true,
  "message": "User deactivated",
  "user": { ...updated user object... }
}
```

---

## Journey Endpoints

### Get All Journeys
```
GET /journeys?source=Delhi&destination=Mumbai&departureDate=2024-12-25&limit=10&page=1

Query Parameters:
- source: optional (city name)
- destination: optional (city name)
- departureDate: optional (YYYY-MM-DD)
- limit: optional, default 10
- page: optional, default 1

Response:
{
  "success": true,
  "total": 45,
  "page": 1,
  "limit": 10,
  "journeys": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "routeName": "Delhi to Mumbai Express",
      "source": {
        "city": "Delhi",
        "address": "Central Station",
        "coordinates": { "latitude": 28.6139, "longitude": 77.2090 }
      },
      "destination": {
        "city": "Mumbai",
        "address": "Main Terminal",
        "coordinates": { "latitude": 19.0760, "longitude": 72.8777 }
      },
      "distance": 1400,
      "estimatedDuration": 18,
      "departureTime": "2024-12-25T08:00:00Z",
      "arrivalTime": "2024-12-26T02:00:00Z",
      "vehicle": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Express Plus",
        "type": "bus",
        "seatingCapacity": 50
      },
      "driver": {
        "_id": "507f1f77bcf86cd799439013",
        "name": "Rajesh Kumar",
        "phone": "9876543210"
      },
      "totalSeats": 50,
      "availableSeats": 25,
      "pricePerSeat": 800,
      "status": "scheduled",
      "amenities": ["WiFi", "USB Charging", "AC"],
      "notes": "Premium service"
    }
  ]
}
```

### Get Journey by ID
```
GET /journeys/:id

Response:
{
  "success": true,
  "journey": { ...full journey object... }
}
```

### Create Journey
```
POST /journeys
Headers: Authorization: Bearer <token>

Request Body:
{
  "routeName": "Delhi to Mumbai Express",
  "source": {
    "city": "Delhi",
    "address": "Central Station",
    "coordinates": { "latitude": 28.6139, "longitude": 77.2090 }
  },
  "destination": {
    "city": "Mumbai",
    "address": "Main Terminal",
    "coordinates": { "latitude": 19.0760, "longitude": 72.8777 }
  },
  "distance": 1400,
  "estimatedDuration": 18,
  "departureTime": "2024-12-25T08:00:00Z",
  "arrivalTime": "2024-12-26T02:00:00Z",
  "vehicleId": "507f1f77bcf86cd799439012",
  "totalSeats": 50,
  "pricePerSeat": 800,
  "amenities": ["WiFi", "USB Charging", "AC"],
  "notes": "Premium service"
}

Response:
{
  "success": true,
  "journey": { ...created journey object... }
}
```

### Update Journey
```
PUT /journeys/:id
Headers: Authorization: Bearer <token>

Request Body: (partial update)
{
  "availableSeats": 20,
  "status": "in-progress"
}

Response:
{
  "success": true,
  "journey": { ...updated journey object... }
}
```

### Delete Journey
```
DELETE /journeys/:id
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Journey deleted"
}
```

---

## Vehicle Endpoints

### Get All Vehicles
```
GET /vehicles?type=bus&status=active&limit=10&page=1

Query Parameters:
- type: optional (bus, van, car, luxury, semi-luxury)
- status: optional (active, maintenance, retired)
- limit: optional, default 10
- page: optional, default 1

Response:
{
  "success": true,
  "total": 150,
  "vehicles": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "registrationNumber": "DL01AB1234",
      "name": "Express Plus",
      "type": "bus",
      "manufacturer": "Volvo",
      "model": "B7R",
      "year": 2022,
      "seatingCapacity": 50,
      "owner": { "_id": "...", "name": "Rajesh Kumar" },
      "amenities": ["WiFi", "USB Charging", "AC"],
      "serviceStatus": "active",
      "mileage": 45000,
      "fuelType": "diesel"
    }
  ]
}
```

### Create Vehicle
```
POST /vehicles
Headers: Authorization: Bearer <token>

Request Body:
{
  "registrationNumber": "DL01AB1234",
  "name": "Express Plus",
  "type": "bus",
  "manufacturer": "Volvo",
  "model": "B7R",
  "year": 2022,
  "seatingCapacity": 50,
  "amenities": ["WiFi", "USB Charging", "AC"],
  "fuelType": "diesel"
}

Response:
{
  "success": true,
  "vehicle": { ...created vehicle object... }
}
```

---

## Booking Endpoints

### Create Booking
```
POST /bookings
Headers: Authorization: Bearer <token>

Request Body:
{
  "journeyId": "507f1f77bcf86cd799439011",
  "numberOfSeats": 2,
  "seatNumbers": ["S1", "S2"],
  "paymentMethod": "credit_card",
  "pickupPoint": "Gate 5, Central Station",
  "dropPoint": "Main Terminal, Mumbai",
  "specialRequests": "Window seats preferred"
}

Response:
{
  "success": true,
  "booking": {
    "_id": "507f1f77bcf86cd799439014",
    "bookingNumber": "KPB170289439015201",
    "journey": { ...journey object... },
    "passenger": { "_id": "...", "name": "..." },
    "numberOfSeats": 2,
    "seatNumbers": ["S1", "S2"],
    "totalPrice": 1600,
    "paymentStatus": "pending",
    "paymentMethod": "credit_card",
    "bookingStatus": "confirmed",
    "createdAt": "2024-12-20T10:30:00Z"
  }
}
```

### Get User Bookings
```
GET /bookings
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "bookings": [ ...booking objects... ]
}
```

### Get Booking by ID
```
GET /bookings/:id
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "booking": { ...booking object... }
}
```

### Cancel Booking
```
PUT /bookings/:id/cancel
Headers: Authorization: Bearer <token>

Request Body:
{
  "reason": "Change of plans"
}

Response:
{
  "success": true,
  "message": "Booking cancelled",
  "booking": { ...updated booking object... }
}
```

---

## Analytics Endpoints

### Dashboard Statistics
```
GET /analytics/dashboard/stats
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "stats": {
    "totalUsers": 1250,
    "totalVehicles": 85,
    "totalJourneys": 450,
    "totalBookings": 3200,
    "completedBookings": 2950,
    "totalRevenue": 2560000
  }
}
```

### Revenue Analytics
```
GET /analytics/revenue?startDate=2024-12-01&endDate=2024-12-31
Headers: Authorization: Bearer <token>

Query Parameters:
- startDate: optional (YYYY-MM-DD)
- endDate: optional (YYYY-MM-DD)

Response:
{
  "success": true,
  "revenue": [
    {
      "_id": "2024-12-20",
      "total": 85000,
      "count": 42
    }
  ]
}
```

### Journey Analytics
```
GET /analytics/journeys
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "journeyStats": [
    {
      "_id": "scheduled",
      "count": 150,
      "avgPrice": 850
    }
  ],
  "topRoutes": [
    {
      "_id": "Delhi to Mumbai Express",
      "count": 125,
      "totalRevenue": 950000
    }
  ]
}
```

---

## Health Check

### API Health
```
GET /health

Response:
{
  "status": "KPB Travels API is running",
  "timestamp": "2024-12-20T10:30:00Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal Server Error"
}
```

---

## Rate Limiting

- Rate limit: 100 requests per minute per IP
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`

---

## Testing with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123","userType":"customer"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get profile
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/users/profile

# Search journeys
curl 'http://localhost:5000/api/journeys?source=Delhi&destination=Mumbai'
```

---

## Pagination

All list endpoints support pagination:
- `limit`: Number of results per page (default: 10, max: 100)
- `page`: Page number (default: 1)

Example:
```
GET /journeys?limit=20&page=2
```
