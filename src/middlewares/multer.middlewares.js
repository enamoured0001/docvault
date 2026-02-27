import multer from 'multer';

// Configure multer storage (you can customize this as needed)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp'); // Save files to the 'uploads' directory
    },
    filename: function (req, file, cb) {
       
        cb(null, file.originalname); // Use a unique filename
    }
});

export const upload = multer({ storage});