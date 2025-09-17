import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';

// Import routes
import uploadRoutes from './routes/upload';
import portfolioRoutes from './routes/portfolio';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration - Allow multiple origins for development and production
const allowedOrigins = [
  'http://localhost:4200',
  'http://localhost:52885',
  'http://localhost:57893',
  'https://personalportfolio-production-24b0.up.railway.app',
  process.env.CORS_ORIGIN
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In production, be more permissive for Railway deployment
    if (process.env.NODE_ENV === 'production') {
      // Allow Railway domains
      if (origin.includes('.railway.app') || origin.includes('.up.railway.app')) {
        return callback(null, true);
      }
      // Allow same-origin requests (when frontend and backend are served from same domain)
      if (!origin || origin === process.env.RAILWAY_PUBLIC_DOMAIN) {
        return callback(null, true);
      }
    }
    
    if (allowedOrigins.some(allowedOrigin => allowedOrigin && origin.startsWith(allowedOrigin))) {
      return callback(null, true);
    }
    
    // For development, allow any localhost origin
    if (origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    
    console.log('CORS blocked origin:', origin);
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve Angular static files
app.use(express.static(path.join(__dirname, '../../ng-portfolio/dist/ng-portfolio/browser')));

// API routes
app.use('/api/upload', uploadRoutes);
app.use('/api/portfolio', portfolioRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Catch-all handler: send back Angular's index.html file for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../ng-portfolio/dist/ng-portfolio/browser/index.html'));
});

// 404 handler for API routes only
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Portfolio Backend Server running on port ${PORT}`);
  console.log(`📁 Uploads directory: ${path.join(__dirname, '../uploads')}`);
  console.log(`🌐 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:4200'}`);
});

export default app;
