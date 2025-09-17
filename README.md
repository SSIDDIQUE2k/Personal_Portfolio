# AI Portfolio Agent

A modern, full-stack portfolio application with Angular frontend, Node.js backend, and file upload capabilities.

## Features

- 🎨 **Modern Angular Frontend** - Beautiful, responsive portfolio design
- 🛡️ **Admin Portal** - Easy content management with authentication
- 📤 **File Upload** - Upload images directly from your computer
- 🔄 **Real-time Updates** - Changes reflect immediately
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🔒 **Secure Backend** - Node.js/Express API with file validation

## Quick Start

### 1. Install Dependencies

```bash
# Install both frontend and backend dependencies
npm run install-deps
```

### 2. Start Development Servers

**Option A: Manual (Recommended for development)**
```bash
# Terminal 1 - Start Backend API
npm run dev:backend

# Terminal 2 - Start Frontend 
npm run dev:frontend
```

**Option B: Check individual servers**
```bash
# Test backend only
cd backend && npm run dev

# Test frontend only  
cd ng-portfolio && npm start
```

### 3. Access the Application

- **Portfolio**: http://localhost:4200
- **Admin Portal**: http://localhost:4200/admin
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/api/health

## File Upload Setup

The backend automatically handles:
- ✅ File validation (JPEG, PNG, GIF, WebP)
- ✅ Size limits (5MB max)
- ✅ Image optimization with Sharp
- ✅ Unique filename generation
- ✅ Secure file storage

## Project Structure

```
ai-portfolio-agent/
├── ng-portfolio/          # Angular frontend
│   ├── src/app/
│   │   ├── admin/         # Admin portal
│   │   ├── core/          # Services & utilities
│   │   └── sections/      # Portfolio sections
├── backend/               # Node.js API
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Upload & validation
│   │   └── utils/         # Helper functions
│   └── uploads/           # Uploaded files
└── package.json           # Root scripts
```

## API Endpoints

### File Upload
- `POST /api/upload/image` - Upload a single image
- `GET /api/upload/images` - List uploaded images  
- `DELETE /api/upload/image/:filename` - Delete an image

### Portfolio Data
- `GET /api/portfolio/data` - Get portfolio content
- `POST /api/portfolio/data` - Save portfolio content
- `POST /api/portfolio/reset` - Reset to default content

## Development

### Frontend (Angular)
```bash
cd ng-portfolio
npm start          # Development server
npm run build      # Production build
npm test           # Run tests
```

### Backend (Node.js)
```bash
cd backend
npm run dev        # Development with hot reload
npm run build      # Compile TypeScript
npm start          # Production server
```

## Production Deployment

```bash
# Build everything
npm run backend:build
npm run build

# Start production servers
npm run backend:start  # Backend on port 3001
# Serve ng-portfolio/dist with your web server
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3001 and 4200 are available
2. **Upload errors**: Check backend logs and file permissions
3. **CORS issues**: Verify backend is running on port 3001
4. **Build errors**: Run `npm run install-deps` to ensure all packages are installed

### File Upload Issues

- Ensure backend is running before uploading
- Check file size (max 5MB) and format (JPEG, PNG, GIF, WebP)
- Verify uploads directory has write permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

## License

MIT License - see LICENSE file for details
# Personal_Portfolio
