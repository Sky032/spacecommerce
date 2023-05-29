import multer from "multer";
import { __dirname } from '../dirname.js';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = `${__dirname}/public/uploads/${file.fieldname}`;

        switch (file.fieldname) {
            case "profile":
                cb(null, path);
                break;
            case "products":
                cb(null, path);
                break;
            case "documents":
                cb(null, path);
                break;
            default:
                break;
        }
    },
    filename(req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({storage})


export default upload;