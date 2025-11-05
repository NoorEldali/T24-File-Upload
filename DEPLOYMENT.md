# Deployment Guide - Document Upload System

## Overview
This guide provides instructions for deploying the Document Upload System in various environments.

## Prerequisites
- Node.js v18 or higher
- pnpm or npm
- Web server (for frontend hosting)
- Application server (for backend hosting)

## Deployment Options

### Option 1: Local Development (Current Setup)

**Backend:**
```bash
cd backend
pnpm install
pnpm start
# Server runs on http://localhost:5000
```

**Frontend:**
```bash
cd frontend
pnpm install
pnpm dev
# Development server runs on http://localhost:5173
```

### Option 2: Production Deployment

#### Step 1: Backend Deployment

**Using Node.js Server:**
```bash
cd backend
pnpm install --prod
node server.js
```

**Using PM2 (Process Manager):**
```bash
npm install -g pm2
cd backend
pm2 start server.js --name document-upload-backend
pm2 save
```

**Environment Variables (.env):**
```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=.pdf,.doc,.docx,.jpg,.jpeg,.png
```

#### Step 2: Frontend Deployment

**Build for Production:**
```bash
cd frontend
pnpm build
# Output: dist/ directory
```

**Deploy dist/ folder to:**
- Static hosting: Netlify, Vercel, AWS S3 + CloudFront
- Web server: Apache, Nginx
- Platform: Azure Static Web Apps, GitHub Pages

**Update Frontend Environment (.env.production):**
```env
VITE_API_URL=https://your-backend-domain.com/api
```

#### Step 3: Server Configuration

**Nginx Configuration Example:**
```nginx
# Frontend
server {
    listen 80;
    server_name your-frontend-domain.com;
    
    root /var/www/document-upload/frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Backend (Reverse Proxy)
server {
    listen 80;
    server_name your-backend-domain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 3: Docker Deployment

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - FRONTEND_URL=http://localhost:3000
    volumes:
      - ./backend/uploads:/app/uploads
  
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

### Option 4: Cloud Platform Deployment

#### AWS Deployment
- **Backend**: AWS Elastic Beanstalk or ECS
- **Frontend**: AWS S3 + CloudFront
- **Storage**: AWS S3 for file uploads

#### Azure Deployment
- **Backend**: Azure App Service
- **Frontend**: Azure Static Web Apps
- **Storage**: Azure Blob Storage

#### Google Cloud Deployment
- **Backend**: Google Cloud Run or App Engine
- **Frontend**: Firebase Hosting
- **Storage**: Google Cloud Storage

## Post-Deployment Configuration

### 1. Update CORS Settings
Ensure backend CORS is configured for your frontend domain:
```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}));
```

### 2. Configure File Storage
For production, consider using cloud storage:
- AWS S3
- Azure Blob Storage
- Google Cloud Storage

### 3. Security Enhancements
- Enable HTTPS/SSL certificates
- Implement rate limiting
- Add authentication/authorization
- Enable file scanning for malware
- Set up monitoring and logging

### 4. Environment-Specific Settings

**Development:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Debug logging enabled

**Production:**
- Frontend: https://your-domain.com
- Backend: https://api.your-domain.com
- Error logging only
- File size limits enforced
- Security headers enabled

## Monitoring and Maintenance

### Backend Monitoring
```bash
# Check PM2 processes
pm2 status

# View logs
pm2 logs document-upload-backend

# Restart service
pm2 restart document-upload-backend
```

### Health Check Endpoint
```bash
curl https://api.your-domain.com/api/health
```

### File Storage Management
- Regular cleanup of old uploads
- Monitor disk space usage
- Implement file retention policies

## Troubleshooting

### Backend Issues
- Check logs: `pm2 logs` or `node server.js`
- Verify environment variables
- Check port availability
- Verify file upload permissions

### Frontend Issues
- Clear browser cache
- Check API URL in environment variables
- Verify CORS configuration
- Check browser console for errors

### File Upload Issues
- Verify file size limits
- Check file type restrictions
- Ensure uploads directory exists and is writable
- Check disk space

## Security Checklist
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] CORS properly configured
- [ ] File size limits enforced
- [ ] File type validation active
- [ ] Rate limiting implemented
- [ ] Monitoring and logging enabled
- [ ] Regular security updates applied

## Future Enhancements
1. Replace mock SharePoint integration with Microsoft Graph API
2. Add user authentication
3. Implement database for document metadata
4. Add document retrieval and management features
5. Implement virus scanning
6. Add audit trail and compliance features

## Support
For issues or questions, refer to:
- README.md for setup instructions
- test-progress.md for testing documentation
- Backend logs for error details
