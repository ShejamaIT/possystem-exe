const multer = require('multer');

// Multer storage (Memory for processing images in memory)
const storage = multer.memoryStorage();

// File filter to allow only images (JPEG, PNG, WebP, GIF)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Invalid file type. Only images (JPG, PNG, WebP, GIF) are allowed."), false);
    }
};

// ✅ Updated Multer configuration with fieldSize
const upload = multer({
    storage,
    limits: {
        fileSize: 25 * 1024 * 1024,  // 25MB per file
        fieldSize: 30 * 1024 * 1024, // 30MB for form fields
    },
    fileFilter,
});

module.exports = upload;
