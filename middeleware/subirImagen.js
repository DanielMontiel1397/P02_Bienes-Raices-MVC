import multer from "multer";
import path from 'path'
import {generarId} from '../helpers/tokens.js'
import { CloudinaryStorage } from "multer-storage-cloudinary";
import {v2 as cloudinary} from 'cloudinary';

/*
const storage = multer.diskStorage({
    destination: function(req,archivo,callback){
        callback(null,'public/uploads')
    },
    filename: function(req,archivo,callback){
        callback(null,generarId() + path.extname(archivo.originalname))
    }
})

const upload = multer({storage})
*/

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'public/bienesraices',
        allowed_formats: ['jpg','jpeg','png','gif', 'webp'],
        public_id: (req, file) => generarId()
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

export default upload; 