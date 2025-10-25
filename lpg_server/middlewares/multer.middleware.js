import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the upload directory
const uploadDir = path.join(__dirname, '../uploads/temp');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null, uploadDir);
    },
    filename: function(req,file,cb){
        cb(null,Date.now() + '-' + file.originalname)
    }
})

export const upload = multer({storage: storage});