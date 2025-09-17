"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processImage = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
const sharp_1 = __importDefault(require("sharp"));
const promises_1 = __importDefault(require("fs/promises"));
// Configure storage
const storage = multer_1.default.diskStorage({
    destination: async (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, '../../uploads/images');
        try {
            await promises_1.default.mkdir(uploadPath, { recursive: true });
            cb(null, uploadPath);
        }
        catch (error) {
            cb(error, uploadPath);
        }
    },
    filename: (req, file, cb) => {
        const uniqueName = `${(0, crypto_1.randomUUID)()}-${Date.now()}${path_1.default.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});
// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp'
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error(`File type ${file.mimetype} not allowed. Allowed types: ${allowedTypes.join(', ')}`));
    }
};
// Configure multer
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
        files: 1
    }
});
// Image processing middleware
const processImage = async (req, res, next) => {
    if (!req.file) {
        return next();
    }
    try {
        const { filename, path: filePath } = req.file;
        const outputPath = path_1.default.join(path_1.default.dirname(filePath), `optimized-${filename}`);
        // Process image with Sharp
        await (0, sharp_1.default)(filePath)
            .resize(800, 800, {
            fit: 'inside',
            withoutEnlargement: true
        })
            .jpeg({
            quality: 85,
            progressive: true
        })
            .toFile(outputPath);
        // Remove original file
        await promises_1.default.unlink(filePath);
        // Update req.file with processed file info
        req.file.filename = `optimized-${filename}`;
        req.file.path = outputPath;
        next();
    }
    catch (error) {
        console.error('Image processing error:', error);
        next(error);
    }
};
exports.processImage = processImage;
exports.default = { upload: exports.upload, processImage: exports.processImage };
//# sourceMappingURL=upload.js.map