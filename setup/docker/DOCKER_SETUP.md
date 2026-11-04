# Docker Setup Guide for EasyCRUD

This guide explains how to run the entire EasyCRUD application stack using Docker Compose.

## 🐳 Overview

The Docker setup includes:
- **MariaDB Database** - Persistent data storage
- **Spring Boot Backend** - REST API server
- **React Frontend** - User interface
- **Nginx Reverse Proxy** - Load balancer and SSL termination (optional)

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 4GB RAM available
- Ports 80, 3000, 8080, 3306 available

## 🚀 Quick Start

### 1. Clone and Navigate
```bash
git clone <your-repo-url>
cd EasyCRUD
```

### 2. Start All Services
```bash
# Start all services in detached mode
docker-compose up -d

# Or start with logs visible
docker-compose up
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Database**: localhost:3306
- **Nginx Proxy**: http://localhost:80

## 📁 Docker Files Structure

```
EasyCRUD/
├── docker-compose.yml          # Main orchestration file
├── backend/
│   ├── Dockerfile              # Backend container build
│   ├── .dockerignore           # Backend build exclusions
│   └── database_schema.sql     # Database initialization
├── frontend/
│   ├── Dockerfile              # Frontend container build
│   ├── .dockerignore           # Frontend build exclusions
│   └── nginx.conf              # Frontend nginx config
└── nginx/
    └── nginx.conf              # Main reverse proxy config
```

## 🔧 Service Configuration

### Database (MariaDB)
- **Image**: mariadb:10.11
- **Port**: 3306
- **Database**: student_db
- **User**: easycrud_user
- **Password**: easycrud_password
- **Root Password**: rootpassword
- **Volume**: db_data (persistent storage)
- **Schema**: Auto-imported from database_schema.sql

### Backend (Spring Boot)
- **Port**: 8080
- **Database Connection**: jdbc:mariadb://database:3306/student_db
- **Health Check**: /actuator/health
- **Dependencies**: Database service

### Frontend (React + Nginx)
- **Port**: 3000
- **Build**: Multi-stage with Node.js and Nginx
- **API Proxy**: /api/* → backend:8080
- **Health Check**: /health
- **Dependencies**: Backend service

### Nginx Reverse Proxy (Optional)
- **Ports**: 80 (HTTP), 443 (HTTPS)
- **Load Balancing**: Frontend and Backend
- **Rate Limiting**: API endpoints
- **SSL**: Configured for production

## 🛠️ Docker Commands

### Basic Operations
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild and start
docker-compose up --build -d

# View running containers
docker-compose ps
```

### Development Commands
```bash
# Rebuild specific service
docker-compose build backend

# Restart specific service
docker-compose restart backend

# Execute commands in running containers
docker-compose exec backend sh
docker-compose exec database mysql -u root -p

# View container resources
docker stats
```

### Database Operations
```bash
# Connect to database
docker-compose exec database mysql -u easycrud_user -p student_db

# Backup database
docker-compose exec database mysqldump -u root -prootpassword student_db > backup.sql

# Restore database
docker-compose exec -T database mysql -u root -prootpassword student_db < backup.sql

# View database logs
docker-compose logs database
```

## 🔍 Health Checks

All services include health checks:

```bash
# Check service health
docker-compose ps

# Manual health checks
curl http://localhost:3000/health          # Frontend
curl http://localhost:8080/actuator/health # Backend
curl http://localhost/health               # Nginx
```

## 📊 Monitoring

### View Resource Usage
```bash
# Container statistics
docker stats

# Service status
docker-compose ps

# Log monitoring
docker-compose logs -f --tail=100
```

### Performance Monitoring
```bash
# Check database performance
docker-compose exec database mysql -u root -p -e "SHOW PROCESSLIST;"

# Check nginx access logs
docker-compose exec nginx tail -f /var/log/nginx/access.log

# Check application logs
docker-compose logs -f backend
```

## 🔒 Security Configuration

### Environment Variables
Create a `.env` file for production:

```env
# Database
MYSQL_ROOT_PASSWORD=your_secure_root_password
MYSQL_DATABASE=student_db
MYSQL_USER=your_db_user
MYSQL_PASSWORD=your_secure_password

# Backend
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:mariadb://database:3306/student_db
SPRING_DATASOURCE_USERNAME=${MYSQL_USER}
SPRING_DATASOURCE_PASSWORD=${MYSQL_PASSWORD}

# Frontend
VITE_API_BASE_URL=https://your-domain.com
```

### SSL Configuration
For production HTTPS:

1. **Generate SSL certificates**
2. **Update nginx/nginx.conf**
3. **Uncomment HTTPS server block**
4. **Set proper domain name**

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :8080
lsof -i :8080

# Change ports in docker-compose.yml
ports:
  - "8081:8080"  # Use different host port
```

#### 2. Database Connection Issues
```bash
# Check database status
docker-compose logs database

# Test database connection
docker-compose exec backend curl -f http://localhost:8080/actuator/health

# Reset database
docker-compose down -v
docker-compose up -d
```

#### 3. Frontend Build Issues
```bash
# Rebuild frontend
docker-compose build --no-cache frontend
docker-compose up -d frontend

# Check build logs
docker-compose logs frontend
```

#### 4. Memory Issues
```bash
# Check available memory
free -h

# Increase Docker memory limit
# In Docker Desktop: Settings → Resources → Memory
```

### Debug Commands
```bash
# Inspect container
docker-compose exec backend sh
docker-compose exec frontend sh

# View container details
docker inspect easycrud-backend

# Check network connectivity
docker-compose exec backend ping database
docker-compose exec frontend ping backend
```

## 📈 Production Deployment

### 1. Environment Setup
```bash
# Create production environment file
cp .env.example .env.prod

# Edit production variables
nano .env.prod
```

### 2. SSL Certificate Setup
```bash
# Create SSL directory
mkdir -p nginx/ssl

# Add your certificates
cp your-cert.pem nginx/ssl/cert.pem
cp your-key.pem nginx/ssl/key.pem
```

### 3. Production Deployment
```bash
# Use production compose file
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Or set environment
export COMPOSE_ENV=production
docker-compose up -d
```

### 4. Backup Strategy
```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec database mysqldump -u root -prootpassword student_db > backup_$DATE.sql
```

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy with Docker Compose
        run: |
          docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MariaDB Docker Image](https://hub.docker.com/_/mariadb)
- [Nginx Docker Image](https://hub.docker.com/_/nginx)
- [Spring Boot Docker Guide](https://spring.io/guides/gs/spring-boot-docker/)

## 🆘 Support

For Docker-related issues:
1. Check the troubleshooting section
2. Review container logs: `docker-compose logs`
3. Verify Docker and Docker Compose versions
4. Check system resources and port availability
5. Ensure all prerequisites are met 