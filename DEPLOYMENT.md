# Railway Deployment Guide

This project is configured for easy deployment on Railway.

## Quick Deploy

1. **Connect to Railway:**
   - Go to [Railway](https://railway.app)
   - Click "Deploy from GitHub repo"
   - Select this repository

2. **Automatic Configuration:**
   - Railway will automatically detect the `railway.toml` configuration
   - The build process will install dependencies and build both frontend and backend
   - The app will start serving the Angular app with the Express backend

## Project Structure

```
├── ng-portfolio/          # Angular frontend application
├── backend/              # Express.js backend API
├── package.json          # Root package configuration
├── railway.toml          # Railway deployment configuration
└── DEPLOYMENT.md         # This file
```

## Build Process

The deployment follows these steps:

1. **Install Dependencies:** Installs packages for both frontend and backend
2. **Build Frontend:** Compiles Angular app to `ng-portfolio/dist/`
3. **Build Backend:** Compiles TypeScript backend to `backend/dist/`
4. **Start Server:** Runs the Express server which serves both API and static Angular files

## Environment Variables

The following environment variables are automatically configured:

- `NODE_ENV=production`
- `PORT` - Set by Railway automatically

Optional variables you can set in Railway dashboard:

- `CORS_ORIGIN` - Custom CORS origin (defaults to allow all origins)

## API Endpoints

- `/api/health` - Health check endpoint
- `/api/upload` - File upload functionality
- `/api/portfolio` - Portfolio data management
- `/*` - Serves Angular app (catch-all for SPA routing)

## Local Development

```bash
# Install all dependencies
npm run install

# Start development servers (frontend + backend)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Troubleshooting

1. **Build fails:** Check that all dependencies are properly specified in package.json files
2. **API not working:** Verify the backend is properly built and environment variables are set
3. **Angular app not loading:** Ensure the build completed successfully and static files are being served

## Features

- Angular frontend with modern UI
- Express.js backend API
- File upload functionality with image optimization
- Portfolio management system
- Admin portal for content management
- Responsive design
- Production-ready configuration

