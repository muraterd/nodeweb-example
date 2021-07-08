import multer from "multer";

function getExtention(filename: string) {
  return filename.substr(filename.lastIndexOf(".") + 1);
}

const ImagesStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function(req, file, cb) {
    const extention = getExtention(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}.${extention}`);
  }
});

export const Upload = {
  images: multer({ storage: ImagesStorage })
};
