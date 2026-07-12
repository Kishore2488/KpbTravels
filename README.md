# KPB Travels - Data Platform

## Overview

KPB Travels is a comprehensive data platform for managing travel journeys, vehicles, bookings, and analytics. It provides a complete solution for travel companies to manage their operations with a modern RESTful API and user-friendly web interface.

## Features

### Core Features
- **Journey Management**: Create and manage travel routes
- **Vehicle Management**: Track vehicles with maintenance history
- **Booking System**: Seamless ticket booking and cancellation
- **User Management**: Multi-role authentication (customer, driver, admin)
- **Payment Processing**: Support for multiple payment methods
- **Analytics Dashboard**: Revenue and operational insights
- **Review System**: Customer ratings and feedback

### Technical Features
- RESTful API with JWT authentication
- MongoDB database with rich schema
- Real-time availability tracking
- Containerized deployment (Docker)
- Kubernetes orchestration
- CI/CD pipeline with Azure Pipelines & GitHub Actions
- Horizontal pod autoscaling
- Network policies and security

## Project Structure

```
KpbTravels/
├── backend/
│   ├── models/              # Database schemas
│   ├── controllers/         # Business logic
│   ├── routes/             # API endpoints
│   ├── services/           # Service layer
│   ├── middleware/         # Express middleware
│   ├── config/             # Configuration files
│   ├── server.js          # Entry point
│   └── package.json        # Dependencies
├── frontend/
│   ├── public/
│   │   └── index.html      # Main HTML
│   ├── css/
│   │   └── style.css       # Styling
│   ├── js/
│   │   └── app.js          # Frontend logic
│   └── package.json        # Dependencies
├── database/
│   └── seed.js            # Database seeding
├── deployment/
│   ├── docker/            # Docker configurations
│   ├── kubernetes/        # K8s manifests
│   ├── scripts/           # Deployment scripts
│   └── azure-pipelines.yml # Azure CI/CD
├── .github/
│   └── workflows/         # GitHub Actions
└── README.md              # This file
```

## Prerequisites

- Node.js 18+
- MongoDB 6.0+
- Docker & Docker Compose
- kubectl (for Kubernetes)
- Azure CLI (for Azure deployment)

## Quick Start

### Local Development with Docker Compose

1. Clone the repository:
```bash
cd github/KpbTravels
```

2. Build and run with Docker Compose:
```bash
docker-compose -f deployment/docker/docker-compose.yml up -d
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

### Manual Setup

1. Install backend dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Start MongoDB:
```bash
# Use Docker
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=mongodb123 mongo:6.0
```

4. Seed database:
```bash
npm run seed
```

5. Start backend server:
```bash
npm run dev  # Development with nodemon
npm start   # Production
```

6. Setup frontend:
```bash
cd ../frontend
npm install
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile` - Get user profile (requires auth)
- `PUT /api/users/profile` - Update profile
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id/deactivate` - Deactivate user

### Journeys
- `GET /api/journeys` - Get all journeys
- `GET /api/journeys/:id` - Get journey by ID
- `POST /api/journeys` - Create journey (requires auth)
- `PUT /api/journeys/:id` - Update journey (requires auth)
- `DELETE /api/journeys/:id` - Delete journey (requires auth)

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get vehicle by ID
- `POST /api/vehicles` - Create vehicle (requires auth)
- `PUT /api/vehicles/:id` - Update vehicle (requires auth)
- `DELETE /api/vehicles/:id` - Delete vehicle (requires auth)

### Bookings
- `POST /api/bookings` - Create booking (requires auth)
- `GET /api/bookings` - Get user bookings (requires auth)
- `GET /api/bookings/:id` - Get booking details (requires auth)
- `PUT /api/bookings/:id/cancel` - Cancel booking (requires auth)

### Analytics
- `GET /api/analytics/dashboard/stats` - Dashboard statistics (requires auth)
- `GET /api/analytics/revenue` - Revenue analytics (requires auth)
- `GET /api/analytics/journeys` - Journey analytics (requires auth)

## Database Schema

### User
- name, email, password, phone
- address (street, city, state, zipcode, country)
- userType (customer, driver, admin)
- verified, isActive
- timestamps

### Vehicle
- registrationNumber, name, type
- manufacturer, model, year
- seatingCapacity, currentLocation
- owner (User reference)
- amenities, insurance info
- serviceStatus, mileage, fuelType

### Journey
- routeName, source, destination
- distance, estimatedDuration
- departureTime, arrivalTime
- vehicle (Vehicle reference)
- driver (User reference)
- totalSeats, availableSeats, pricePerSeat
- status (scheduled, in-progress, completed, cancelled)
- amenities, notes

### Booking
- bookingNumber, journey, passenger
- numberOfSeats, seatNumbers, totalPrice
- paymentStatus, paymentMethod, transactionId
- bookingStatus (confirmed, cancelled, completed)
- specialRequests, pickupPoint, dropPoint

### Payment
- transactionId, booking, amount
- paymentMethod, status, paymentGateway
- refundDetails

### Review
- journey, reviewer, rating
- title, comment, category
- verified, helpful count

## Deployment

### Docker Compose (Local)
```bash
docker-compose -f deployment/docker/docker-compose.yml up -d
```

### Kubernetes
```bash
kubectl apply -f deployment/kubernetes/kpb-deployment.yml
kubectl apply -f deployment/kubernetes/mongodb-statefulset.yml
kubectl apply -f deployment/kubernetes/network-policy.yml
```

### Azure Container Instances
```bash
# Use deployment script
bash deployment/scripts/deploy.sh
```

### Using Deployment Scripts

**Linux/macOS:**
```bash
chmod +x deployment/scripts/deploy.sh
./deployment/scripts/deploy.sh
```

**Windows:**
```powershell
powershell -ExecutionPolicy Bypass -File .\deployment\scripts\deploy.ps1
```

## CI/CD Pipelines

### Azure Pipelines
- Location: `deployment/azure-pipelines.yml`
- Triggered on: push to main, feature branches
- Stages: Build → Test → Push → Deploy

### GitHub Actions
- Location: `.github/workflows/ci-cd.yml`
- Triggered on: push, pull requests
- Tests on: Node 18.x, 20.x

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kpb-travels
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
```

## Testing

```bash
# Backend tests
cd backend
npm test

# Lint code
npm run lint
```

## Performance Optimization

- Kubernetes HPA configured for auto-scaling (3-10 replicas)
- MongoDB indexing on frequently queried fields
- Caching strategies for journey searches
- CDN ready frontend assets

## Security

- JWT token-based authentication
- Password hashing with bcryptjs
- Network policies in Kubernetes
- Environment variables for sensitive data
- CORS configuration
- Input validation with express-validator

## Monitoring & Logging

- Kubernetes liveness and readiness probes
- Health check endpoint: `GET /api/health`
- Container resource limits and requests
- Structured logging ready

## Contributing

1. Create feature branch: `git checkout -b feature/new-feature`
2. Commit changes: `git commit -am 'Add new feature'`
3. Push to branch: `git push origin feature/new-feature`
4. Create Pull Request

## License

MIT License - See LICENSE file for details

## Support

For support, contact:
- Email: support@kpbtravels.com
- Phone: +91 1234567890

## Version

Current Version: 1.0.0
Last Updated: 2024

## Roadmap

- [ ] Mobile app (iOS/Android)
- [ ] Real-time GPS tracking
- [ ] AI-based dynamic pricing
- [ ] Insurance integration
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Loyalty program
- [ ] Social features (carpooling recommendations)
