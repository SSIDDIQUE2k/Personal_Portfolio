"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Import routes
const upload_1 = __importDefault(require("./routes/upload"));
const portfolio_1 = __importDefault(require("./routes/portfolio"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
// Security middleware - Configure Helmet for Angular SPA
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://fonts.googleapis.com",
                "https://unicons.iconscout.com",
                "https://unpkg.com",
                "https://cdn.jsdelivr.net"
            ],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "'unsafe-eval'",
                "https://cdnjs.cloudflare.com",
                "https://cdn.jsdelivr.net"
            ],
            fontSrc: [
                "'self'",
                "https://fonts.gstatic.com",
                "https://fonts.googleapis.com"
            ],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            connectSrc: ["'self'"]
        }
    }
}));
// CORS configuration - Allow multiple origins for development and production
const allowedOrigins = [
    'http://localhost:4200',
    'http://localhost:52885',
    'http://localhost:57893',
    'https://personalportfolio-production-24b0.up.railway.app',
    process.env.CORS_ORIGIN
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
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
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Static file serving for uploads
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Serve static portfolio files
app.use(express_1.default.static(path_1.default.join(__dirname, '../../static-portfolio')));
// API routes
app.use('/api/upload', upload_1.default);
app.use('/api/portfolio', portfolio_1.default);
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});
// Catch-all handler: send back static portfolio index.html
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../static-portfolio/index.html'));
});
// 404 handler for API routes only
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});
app.listen(PORT, () => {
    console.log(`🚀 Portfolio Backend Server running on port ${PORT}`);
    console.log(`📁 Uploads directory: ${path_1.default.join(__dirname, '../uploads')}`);
    console.log(`🌐 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:4200'}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map