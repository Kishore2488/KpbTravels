# KPB Travels Installation & Configuration Guide

## Prerequisites

### System Requirements
- **CPU**: Minimum 2 cores (4+ recommended for production)
- **RAM**: Minimum 4GB (8GB+ recommended for production)
- **Storage**: Minimum 20GB (100GB+ for MongoDB data)
- **OS**: Linux, macOS, or Windows with WSL2

### Required Software
- **Git**: 2.0+
- **Node.js**: 18.0+
- **npm**: 8.0+
- **Docker**: 20.10+
- **Docker Compose**: 2.0+ (for local development)
- **kubectl**: 1.25+ (for Kubernetes deployment)
- **MongoDB**: 6.0+ (or use Docker)

## Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/Enterprise-Azure-DevOps/enterprise-devops-platform.git
cd enterprise-devops-platform/github/KpbTravels
```

### 2. Local Development Setup

#### Option A: Docker Compose (Recommended for Quick Start)

```bash
# Navigate to deployment directory
cd deployment/docker

# Build and start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f backend
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

#### Option B: Manual Installation

**Backend Setup:**
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kpb-travels
NODE_ENV=development
JWT_SECRET=kpb-travels-dev-secret
JWT_EXPIRE=7d
EOF

# Start MongoDB (in another terminal)
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=mongodb123 mongo:6.0

# Seed database (optional)
npm run seed

# Start server
npm run dev
```

**Frontend Setup:**
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### 3. Configure Environment Variables

**Backend (.env file):**
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/kpb-travels

# Authentication
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d

# Logging (optional)
LOG_LEVEL=info
```

**Frontend Configuration (in app.js):**
```javascript
const API_URL = '/api';  // Change for different environment
```

### 4. Kubernetes Deployment

#### Prerequisites
- Kubernetes cluster (v1.25+)
- kubectl configured
- Docker images pushed to registry

#### Deployment Steps

```bash
# 1. Create namespace
kubectl create namespace kpb-travels

# 2. Create secrets
kubectl create secret generic kpb-secrets \
  --from-literal=mongodb-uri="mongodb+srv://admin:password@cluster.mongodb.net/kpb-travels" \
  --from-literal=jwt-secret="kpb-travels-jwt-secret-key" \
  --from-literal=node-env="production" \
  -n kpb-travels

# 3. Apply MongoDB StatefulSet
kubectl apply -f deployment/kubernetes/mongodb-statefulset.yml

# 4. Apply deployments
kubectl apply -f deployment/kubernetes/kpb-deployment.yml

# 5. Apply network policies
kubectl apply -f deployment/kubernetes/network-policy.yml

# 6. Check status
kubectl get pods -n kpb-travels
kubectl get svc -n kpb-travels
```

### 5. Azure Deployment

#### Prerequisites
- Azure subscription
- Azure CLI installed and authenticated
- Azure Container Registry (ACR)
- Azure Kubernetes Service (AKS) cluster

#### Steps

```bash
# 1. Login to Azure
az login

# 2. Create resource group
az group create --name kpb-travels --location eastus

# 3. Create container registry
az acr create --resource-group kpb-travels --name kpbtravels --sku Basic

# 4. Build and push images
az acr build --registry kpbtravels --image api:latest -f deployment/docker/Dockerfile.backend .
az acr build --registry kpbtravels --image frontend:latest -f deployment/docker/Dockerfile.frontend frontend/

# 5. Create AKS cluster
az aks create \
  --resource-group kpb-travels \
  --name kpb-cluster \
  --node-count 3 \
  --vm-set-type VirtualMachineScaleSets \
  --load-balancer-sku standard \
  --enable-managed-identity \
  --attach-acr kpbtravels

# 6. Get credentials
az aks get-credentials --resource-group kpb-travels --name kpb-cluster

# 7. Deploy using Kubernetes manifests
kubectl apply -f deployment/kubernetes/kpb-deployment.yml
```

## Verification & Testing

### Health Checks

```bash
# Backend health
curl http://localhost:5000/api/health

# Frontend access
curl http://localhost:3000

# Kubernetes pod status
kubectl get pods -n kpb-travels
kubectl describe pod <pod-name> -n kpb-travels
```

### API Testing

```bash
# Create test user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@kpbtravels.com","password":"test123","userType":"customer"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@kpbtravels.com","password":"test123"}'

# Get all journeys
curl http://localhost:5000/api/journeys
```

## Troubleshooting

### Common Issues

#### MongoDB Connection Failed
```bash
# Check if MongoDB is running
docker ps | grep mongo

# Check MongoDB logs
docker logs <mongo-container-id>

# Verify connection string in .env
MONGODB_URI=mongodb://admin:mongodb123@localhost:27017/kpb-travels?authSource=admin
```

#### Port Already in Use
```bash
# Linux/macOS
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

#### Kubernetes Pod CrashLoopBackOff
```bash
# Check logs
kubectl logs <pod-name> -n kpb-travels

# Describe pod for events
kubectl describe pod <pod-name> -n kpb-travels

# Check resource limits
kubectl top pods -n kpb-travels
```

#### CORS Error in Frontend
```javascript
// Update CORS in backend/server.js
app.use(cors({
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  credentials: true
}));
```

## Database Management

### MongoDB Commands

```bash
# Connect to MongoDB
docker exec -it kpb-travels-db mongosh -u admin -p mongodb123

# Inside MongoDB shell
use kpb-travels
show collections
db.users.find()
db.journeys.find()
```

### Backup & Restore

```bash
# Backup database
docker exec kpb-travels-db mongodump --out /tmp/backup --authenticationDatabase admin -u admin -p mongodb123

# Restore database
docker exec -i kpb-travels-db mongorestore --authenticationDatabase admin -u admin -p mongodb123 /tmp/backup
```

## Performance Tuning

### Node.js
```bash
# Increase memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm start

# Enable clustering (production)
# Implement with node:cluster module
```

### MongoDB
```bash
# Create indexes for frequently queried fields
db.journeys.createIndex({ "departureTime": 1 })
db.journeys.createIndex({ "source.city": 1, "destination.city": 1 })
db.bookings.createIndex({ "passenger": 1 })
```

## Scaling

### Horizontal Scaling (Kubernetes)
```bash
# Manual scaling
kubectl scale deployment kpb-api --replicas=5 -n kpb-travels

# Autoscaling (via HPA)
kubectl autoscale deployment kpb-api --min=3 --max=10 --cpu-percent=70 -n kpb-travels
```

### Database Scaling
```bash
# MongoDB replica set for redundancy
# Configure in mongodb-statefulset.yml
```

## Monitoring & Logs

### Local Development
```bash
# View combined logs
docker-compose logs -f

# Backend logs
docker-compose logs -f backend

# Database logs
docker-compose logs -f mongo
```

### Kubernetes Logging
```bash
# View pod logs
kubectl logs <pod-name> -n kpb-travels

# Tail logs
kubectl logs -f <pod-name> -n kpb-travels

# View logs from multiple pods
kubectl logs -l app=kpb-api -n kpb-travels --tail=100
```

## Updating & Maintenance

### Update Dependencies
```bash
# Backend
cd backend
npm update

# Frontend
cd frontend
npm update
```

### Database Migration
```bash
# Create migration script in backend/migrations/
# Run migrations on startup or manually
npm run migrate
```

## Security Hardening

1. Change default credentials
2. Update JWT_SECRET to strong random value
3. Enable HTTPS in production
4. Configure firewall rules
5. Implement rate limiting
6. Enable CORS for specific origins only
7. Use environment variables for sensitive data
8. Implement API key rotation
9. Enable audit logging
10. Regular security updates

## Support & Documentation

- Full API documentation: See API_DOCUMENTATION.md
- Architecture details: See ARCHITECTURE.md
- Troubleshooting: See TROUBLESHOOTING.md
- Contributing guidelines: See CONTRIBUTING.md
