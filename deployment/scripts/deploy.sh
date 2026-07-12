#!/bin/bash

# KPB Travels Deployment Script

set -e

echo "========================================="
echo "KPB Travels Deployment Script"
echo "========================================="

# Configuration
DOCKER_REGISTRY="kpbtravels"
BACKEND_IMAGE="${DOCKER_REGISTRY}/api:latest"
FRONTEND_IMAGE="${DOCKER_REGISTRY}/frontend:latest"
NAMESPACE="kpb-travels"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed"
        exit 1
    fi
    
    log_info "Prerequisites check passed"
}

# Build Docker images
build_images() {
    log_info "Building Docker images..."
    
    log_info "Building backend image..."
    docker build -t ${BACKEND_IMAGE} -f deployment/docker/Dockerfile.backend .
    
    log_info "Building frontend image..."
    docker build -t ${FRONTEND_IMAGE} -f deployment/docker/Dockerfile.frontend frontend/
    
    log_info "Images built successfully"
}

# Push images to registry
push_images() {
    log_info "Pushing images to registry..."
    
    docker push ${BACKEND_IMAGE}
    docker push ${FRONTEND_IMAGE}
    
    log_info "Images pushed successfully"
}

# Deploy with Docker Compose (Local)
deploy_docker_compose() {
    log_info "Deploying with Docker Compose..."
    
    docker-compose -f deployment/docker/docker-compose.yml up -d
    
    log_info "Deployment complete!"
    log_info "Backend: http://localhost:5000"
    log_info "Frontend: http://localhost:3000"
}

# Deploy to Kubernetes
deploy_kubernetes() {
    log_info "Deploying to Kubernetes..."
    
    log_info "Creating namespace..."
    kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -
    
    log_info "Applying MongoDB StatefulSet..."
    kubectl apply -f deployment/kubernetes/mongodb-statefulset.yml
    
    log_info "Applying deployments..."
    kubectl apply -f deployment/kubernetes/kpb-deployment.yml
    
    log_info "Applying network policies..."
    kubectl apply -f deployment/kubernetes/network-policy.yml
    
    log_info "Waiting for deployments to be ready..."
    kubectl rollout status deployment/kpb-api -n ${NAMESPACE}
    kubectl rollout status deployment/kpb-frontend -n ${NAMESPACE}
    
    log_info "Kubernetes deployment complete!"
    
    log_info "Getting service information..."
    kubectl get services -n ${NAMESPACE}
}

# Azure deployment
deploy_azure() {
    log_info "Preparing for Azure deployment..."
    
    if ! command -v az &> /dev/null; then
        log_error "Azure CLI is not installed"
        exit 1
    fi
    
    log_info "Creating Azure Container Registry..."
    az acr create --resource-group kpb-travels --name kpbtravels --sku Basic
    
    log_info "Building and pushing images to ACR..."
    az acr build --registry kpbtravels --image api:latest -f deployment/docker/Dockerfile.backend .
    az acr build --registry kpbtravels --image frontend:latest -f deployment/docker/Dockerfile.frontend frontend/
    
    log_info "Azure deployment prepared. Use Azure Portal for final deployment."
}

# Menu
show_menu() {
    echo ""
    echo "Select deployment option:"
    echo "1) Docker Compose (Local)"
    echo "2) Kubernetes (Local)"
    echo "3) Build and Push Images"
    echo "4) Azure Deployment"
    echo "5) Exit"
    echo ""
}

# Main
main() {
    check_prerequisites
    
    while true; do
        show_menu
        read -p "Enter your choice [1-5]: " choice
        
        case $choice in
            1)
                deploy_docker_compose
                ;;
            2)
                build_images
                deploy_kubernetes
                ;;
            3)
                build_images
                push_images
                ;;
            4)
                build_images
                deploy_azure
                ;;
            5)
                log_info "Exiting..."
                exit 0
                ;;
            *)
                log_error "Invalid option"
                ;;
        esac
    done
}

main
