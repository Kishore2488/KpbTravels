# KPB Travels - Quick Start Guide

## 🚀 30-Second Start

### Docker Compose (Fastest)
```bash
cd deployment/docker
docker-compose up -d
```

Access:
- 🌐 Frontend: http://localhost:3000
- 🔌 API: http://localhost:5000
- 📊 DB: localhost:27017

### Stop Services
```bash
docker-compose down
```

---

## 📋 Common Commands

| Task | Command |
|------|---------|
| **Start Dev** | `docker-compose up -d` |
| **Stop Dev** | `docker-compose down` |
| **View Logs** | `docker-compose logs -f backend` |
| **Install Backend** | `cd backend && npm install` |
| **Install Frontend** | `cd frontend && npm install` |
| **Run Tests** | `cd backend && npm test` |
| **Seed DB** | `cd backend && npm run seed` |
| **Deploy K8s** | `kubectl apply -f deployment/kubernetes/kpb-deployment.yml` |
| **Deploy Azure** | `bash deployment/scripts/deploy.sh` |
| **Check Health** | `curl http://localhost:5000/api/health` |

---

## 🔑 Default Test Credentials

After seeding database:
```
Email: rajesh@kpbtravels.com
Password: driver123
Type: Driver
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `backend/server.js` | Express API entry point |
| `frontend/public/index.html` | Main website |
| `frontend/js/app.js` | Frontend logic |
| `deployment/docker/docker-compose.yml` | Local dev setup |
| `deployment/kubernetes/kpb-deployment.yml` | K8s deployment |
| `.github/workflows/ci-cd.yml` | GitHub CI/CD |

---

## 🧪 Quick API Test

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test User",
    "email":"test@example.com",
    "password":"test123",
    "userType":"customer"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get all journeys
curl http://localhost:5000/api/journeys
```

---

## ⚙️ Environment Variables

**Backend** (.env):
```env
PORT=5000
MONGODB_URI=mongodb://admin:mongodb123@mongo:27017/kpb-travels
NODE_ENV=development
JWT_SECRET=kpb-dev-secret
```

**Frontend** (app.js):
```javascript
const API_URL = '/api';
```

---

## 📚 Documentation

- **[README.md](README.md)** - Overview & features
- **[INSTALLATION.md](INSTALLATION.md)** - Detailed setup guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - All endpoints
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute

---

## 🛠️ Troubleshooting

### MongoDB Connection Error
```bash
# Check if mongo container is running
docker ps | grep mongo

# Restart docker-compose
docker-compose restart mongo
```

### Port Already in Use
```bash
# Kill process using port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Frontend Can't Connect to API
```bash
# Ensure backend is running
curl http://localhost:5000/api/health

# Check API_URL in frontend/js/app.js
# Should be: const API_URL = '/api';
```

### Database Seed Failed
```bash
# Clear existing data
docker exec kpb-travels-db mongosh -u admin -p mongodb123 --eval "db.dropDatabase()"

# Reseed
cd backend && npm run seed
```

---

## 🚢 Deployment Quick Links

### Kubernetes
```bash
# Deploy
kubectl apply -f deployment/kubernetes/kpb-deployment.yml

# Check status
kubectl get pods -n kpb-travels

# View logs
kubectl logs -f deployment/kpb-api -n kpb-travels
```

### Azure
```bash
# Run interactive deployment
bash deployment/scripts/deploy.sh

# Choose option 4 for Azure deployment
```

### GitHub Actions
```bash
# Automatically runs on push to main branch
# Check status: GitHub → Actions tab
# Requires secrets: KUBE_CONFIG
```

---

## 📊 Architecture Overview

```
Client (Browser) → Frontend (HTML/CSS/JS)
                     ↓
                  API Gateway
                     ↓
              Backend (Node.js/Express)
                     ↓
                  MongoDB
```

---

## 🔐 Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Update MongoDB credentials
- [ ] Enable HTTPS on production
- [ ] Configure CORS for your domain
- [ ] Set up firewall rules
- [ ] Enable audit logging
- [ ] Implement rate limiting
- [ ] Regular dependency updates

---

## 📞 Support & Help

| Resource | Link |
|----------|------|
| **Issues** | GitHub Issues |
| **Email** | support@kpbtravels.com |
| **Slack** | #kpbtravels-dev |
| **Docs** | See INSTALLATION.md |

---

## 🎯 Next Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/Enterprise-Azure-DevOps/enterprise-devops-platform.git
   cd github/KpbTravels
   ```

2. **Start Development**
   ```bash
   docker-compose -f deployment/docker/docker-compose.yml up -d
   ```

3. **Open Browser**
   ```
   http://localhost:3000
   ```

4. **Start Coding** 🚀

---

## 📈 Deployment Checklist

- [ ] Backend `.env` configured
- [ ] Database seeded
- [ ] Tests passing
- [ ] Docker images built
- [ ] Kubernetes manifests reviewed
- [ ] Secrets created
- [ ] SSL certificate ready
- [ ] Monitoring configured

---

**Happy coding with KPB Travels! 🚗✈️🚌**
