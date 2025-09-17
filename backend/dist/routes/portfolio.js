"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
// Portfolio data file path
const DATA_FILE = path_1.default.join(__dirname, '../../data/portfolio.json');
// Ensure data directory exists
const ensureDataDir = async () => {
    const dataDir = path_1.default.dirname(DATA_FILE);
    try {
        await promises_1.default.mkdir(dataDir, { recursive: true });
    }
    catch (error) {
        console.error('Error creating data directory:', error);
    }
};
// Initialize default portfolio data
const defaultPortfolioData = {
    name: 'Your Name',
    role: 'Software Engineer / AWS Practitioner',
    location: 'City, Country',
    bio: 'I build modern, scalable applications with a focus on performance and delightful user experiences.',
    profileImage: '',
    email: 'user@gmail.com',
    phone: '999-888-777',
    messenger: 'user.fb123',
    socials: {
        facebook: 'https://www.facebook.com',
        instagram: 'https://www.instagram.com',
        twitter: 'https://www.x.com',
        github: 'https://github.com/',
        linkedin: 'https://linkedin.com/',
        youtube: 'https://youtube.com/'
    },
    skillsTabs: [],
    education: [],
    experience: [],
    projects: [],
    services: [],
    testimonials: []
};
// Get portfolio data
router.get('/data', async (req, res) => {
    try {
        await ensureDataDir();
        try {
            const data = await promises_1.default.readFile(DATA_FILE, 'utf-8');
            const portfolioData = JSON.parse(data);
            res.json({
                success: true,
                data: portfolioData
            });
        }
        catch (error) {
            // File doesn't exist, return default data
            res.json({
                success: true,
                data: defaultPortfolioData
            });
        }
    }
    catch (error) {
        console.error('Error reading portfolio data:', error);
        res.status(500).json({
            error: 'Failed to retrieve portfolio data',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Save portfolio data
router.post('/data', async (req, res) => {
    try {
        await ensureDataDir();
        const portfolioData = req.body;
        // Validate required fields
        if (!portfolioData.name || !portfolioData.email) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'Name and email are required'
            });
        }
        await promises_1.default.writeFile(DATA_FILE, JSON.stringify(portfolioData, null, 2));
        res.json({
            success: true,
            message: 'Portfolio data saved successfully',
            data: portfolioData
        });
    }
    catch (error) {
        console.error('Error saving portfolio data:', error);
        res.status(500).json({
            error: 'Failed to save portfolio data',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Reset portfolio data to defaults
router.post('/reset', async (req, res) => {
    try {
        await ensureDataDir();
        await promises_1.default.writeFile(DATA_FILE, JSON.stringify(defaultPortfolioData, null, 2));
        res.json({
            success: true,
            message: 'Portfolio data reset to defaults',
            data: defaultPortfolioData
        });
    }
    catch (error) {
        console.error('Error resetting portfolio data:', error);
        res.status(500).json({
            error: 'Failed to reset portfolio data',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=portfolio.js.map