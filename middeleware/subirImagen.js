import multer from "multer";
import path from 'path'
import {generarId} from '../helpers/tokens.js'

const storage = multer.diskStorage({
    destination: function(req,archivo,callback){
        callback(null,'public/uploads')
    },
    filename: function(req,archivo,callback){
        callback(null,generarId() + path.extname(archivo.originalname))
    }
})

const upload = multer({storage})

export default upload;