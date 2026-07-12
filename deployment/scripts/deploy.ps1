@echo off
REM KPB Travels Deployment Script for Windows

setlocal enabledelayedexpansion

echo =========================================
echo KPB Travels Deployment Script
echo =========================================

set DOCKER_REGISTRY=kpbtravels
set BACKEND_IMAGE=%DOCKER_REGISTRY%/api:latest
set FRONTEND_IMAGE=%DOCKER_REGISTRY%/frontend:latest
set NAMESPACE=kpb-travels

:menu
cls
echo.
echo Select deployment option:
echo 1) Docker Compose (Local)
echo 2) Kubernetes (Local)
echo 3) Build and Push Images
echo 4) Exit
echo.

set /p choice="Enter your choice [1-4]: "

if "%choice%"=="1" goto docker_compose
if "%choice%"=="2" goto kubernetes
if "%choice%"=="3" goto build_push
if "%choice%"=="4" goto end

goto menu

:docker_compose
echo [INFO] Deploying with Docker Compose...
cd /d "%~dp0..\..\deployment\docker"
docker-compose up -d
echo [INFO] Deployment complete!
echo [INFO] Backend: http://localhost:5000
echo [INFO] Frontend: http://localhost:3000
pause
goto menu

:kubernetes
echo [INFO] Deploying to Kubernetes...
echo [INFO] Creating namespace...
kubectl create namespace %NAMESPACE% --dry-run=client -o yaml | kubectl apply -f -

echo [INFO] Applying MongoDB StatefulSet...
kubectl apply -f "%~dp0..\kubernetes\mongodb-statefulset.yml"

echo [INFO] Applying deployments...
kubectl apply -f "%~dp0..\kubernetes\kpb-deployment.yml"

echo [INFO] Applying network policies...
kubectl apply -f "%~dp0..\kubernetes\network-policy.yml"

echo [INFO] Kubernetes deployment complete!
echo [INFO] Getting service information...
kubectl get services -n %NAMESPACE%
pause
goto menu

:build_push
echo [INFO] Building Docker images...
echo [INFO] Building backend image...
docker build -t %BACKEND_IMAGE% -f deployment\docker\Dockerfile.backend .

echo [INFO] Building frontend image...
docker build -t %FRONTEND_IMAGE% -f deployment\docker\Dockerfile.frontend frontend\

echo [INFO] Pushing images to registry...
docker push %BACKEND_IMAGE%
docker push %FRONTEND_IMAGE%

echo [INFO] Images built and pushed successfully
pause
goto menu

:end
echo [INFO] Exiting...
endlocal
