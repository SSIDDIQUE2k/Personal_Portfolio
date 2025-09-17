"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_1 = require("../middleware/upload");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const router = express_1.default.Router();
// Upload single image
router.post('/image', upload_1.upload.single('image'), upload_1.processImage, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/images/${req.file.filename}`;
        res.json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                filename: req.file.filename,
                originalname: req.file.originalname,
                size: req.file.size,
                url: imageUrl,
                path: `/uploads/images/${req.file.filename}`
            }
        });
    }
    catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            error: 'Upload failed',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Get uploaded images list
router.get('/images', async (req, res) => {
    try {
        const uploadsDir = path_1.default.join(__dirname, '../../uploads/images');
        const files = await promises_1.default.readdir(uploadsDir);
        const imageFiles = files
            .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
            .map(file => ({
            filename: file,
            url: `${req.protocol}://${req.get('host')}/uploads/images/${file}`,
            path: `/uploads/images/${file}`
        }));
        res.json({
            success: true,
            data: imageFiles
        });
    }
    catch (error) {
        console.error('Error reading uploads directory:', error);
        res.status(500).json({
            error: 'Failed to retrieve images',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Delete uploaded image
router.delete('/image/:filename', async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path_1.default.join(__dirname, '../../uploads/images', filename);
        // Check if file exists
        try {
            await promises_1.default.access(filePath);
        }
        catch {
            return res.status(404).json({ error: 'File not found' });
        }
        // Delete file
        await promises_1.default.unlink(filePath);
        res.json({
            success: true,
            message: 'Image deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            error: 'Delete failed',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=upload.js.map