# KPB Travels Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Client Applications                    │
│              (Web Browser, Mobile Clients)               │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
    ┌──────────────────────────────────────────────┐
    │         API Gateway / Load Balancer          │
    │            (Azure/Kubernetes LB)             │
    └──────────────────────┬───────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
        ▼                                     ▼
    ┌─────────────────┐             ┌──────────────────┐
    │  API Server     │             │  API Server      │
    │  (Node.js)      │             │  (Node.js)       │
    │  - Routing      │             │  - Routing       │
    │  - Auth         │             │  - Auth          │
    │  - Controllers  │             │  - Controllers   │
    │  - Middleware   │             │  - Middleware    │
    └────────┬────────┘             └────────┬─────────┘
             │                               │
             └───────────────┬───────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   MongoDB       │
                    │   Cluster       │
                    │                 │
                    │ - Collections   │
                    │ - Indexes       │
                    │ - Replication   │
                    └─────────────────┘

    Cache Layer (Redis - Optional)
    Message Queue (RabbitMQ - Optional)
```

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB 6.0
- **Authentication**: JWT (jsonwebtoken)
- **Password Security**: bcryptjs
- **Validation**: express-validator

### Frontend
- **HTML5**, **CSS3**, **JavaScript (ES6+)**
- **Responsive Design**
- **RESTful API Integration**
- **Local Storage for Auth Tokens**

### Deployment
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Cloud**: Microsoft Azure
- **CI/CD**: Azure Pipelines, GitHub Actions

## Deployment Models

### 1. Docker Compose (Development/Testing)
- Single host deployment
- Simplified setup with docker-compose.yml
- Includes MongoDB, Backend, Frontend
- Suitable for development and testing

### 2. Kubernetes (Production)
- Multi-node cluster deployment
- High availability with 3+ API replicas
- StatefulSet for MongoDB
- Horizontal Pod Autoscaler (HPA)
- Network Policies for security
- Service mesh ready

### 3. Azure Deployment
- Azure Container Registry (ACR) for images
- Azure Kubernetes Service (AKS) orchestration
- Azure DevOps for CI/CD
- Azure Monitor for observability
- Azure Cosmos DB option for global scale

## Data Flow

### Journey Search Flow
1. User enters search criteria (from, to, date)
2. Frontend sends GET request to `/api/journeys`
3. Backend queries MongoDB for matching journeys
4. Results returned with vehicle and driver info
5. Frontend displays journey cards

### Booking Flow
1. User selects journey and clicks "Book Now"
2. Booking form opens with journey details
3. User fills: seats, payment method, special requests
4. Frontend sends POST to `/api/bookings`
5. Backend validates availability
6. Creates booking record
7. Updates journey available seats
8. Returns booking confirmation

### Authentication Flow
1. User registers/logs in
2. Credentials sent to `/api/auth/register` or `/api/auth/login`
3. Backend validates and hashes password
4. JWT token generated and returned
5. Frontend stores token in localStorage
6. Token included in Authorization header for protected routes
7. Backend verifies token via middleware

## Scalability Considerations

### Horizontal Scaling
- Stateless API servers can scale independently
- Kubernetes HPA scales based on CPU utilization (70% threshold)
- MongoDB replica set for data redundancy
- Load balancer distributes traffic

### Database Optimization
- Indexes on frequently queried fields (source, destination, departure)
- Query optimization for journey searches
- Connection pooling with MongoDB
- Pagination for large result sets

### Caching Strategy (Optional Future)
- Redis for session caching
- Journey availability caching (TTL-based)
- User profile caching
- Search result caching

## Security Architecture

### Authentication & Authorization
```
Request
  ↓
Middleware: Check Authorization Header
  ↓
Extract JWT Token
  ↓
Verify Token Signature & Expiration
  ↓
Extract User ID from Token
  ↓
Attach to request.user
  ↓
Route Handler Execution
```

### Data Security
- Passwords hashed with bcryptjs (10 salt rounds)
- Sensitive data in environment variables
- HTTPS/TLS for data in transit (production)
- Network Policies for pod-to-pod communication
- Secret management in Kubernetes

### API Security
- CORS enabled for frontend domain only
- Input validation on all endpoints
- Rate limiting ready (implement with rate-limiter-flexible)
- SQL injection prevention (using MongoDB + Mongoose)

## Performance Metrics

### Targets
- API Response Time: < 200ms (p95)
- Journey Search: < 500ms
- Booking Creation: < 300ms
- Database Query: < 100ms

### Monitoring Points
- API endpoint latency
- Database query performance
- Memory and CPU usage
- Pod restart rate
- Error rate (5xx responses)

## Disaster Recovery

### Backup Strategy
- MongoDB automated backups (cloud option)
- Persistent volumes with daily snapshots
- Database replication for redundancy

### Failover
- Kubernetes automatically restarts failed pods
- Load balancer redirects traffic from failed nodes
- MongoDB replica set automatic failover
- Data persistence with PersistentVolumes

## Development Workflow

```
Developer                 
    ↓
Create Feature Branch
    ↓
Code & Test Locally
    ↓
Push to Repository
    ↓
GitHub Actions Trigger
    ├─ Run Tests
    ├─ Build Images
    ├─ Push to Registry
    └─ Deploy to Dev (if main branch)
    ↓
Create Pull Request
    ↓
Code Review
    ↓
Merge to Main
    ↓
Deploy to Production
    ↓
Monitor & Alert
```

## Cost Optimization

### Development
- Use Docker Compose for local testing
- Minimal resource allocation for dev pods

### Production
- Right-size pod resources based on metrics
- Use spot instances for non-critical workloads
- MongoDB cost optimization with sharding

### Storage
- Archive old booking records
- Implement data retention policies
- Compress logs

## Compliance & Standards

- GDPR ready (user data management)
- PCI DSS consideration for payments
- ISO 27001 applicable standards
- OWASP top 10 protections
