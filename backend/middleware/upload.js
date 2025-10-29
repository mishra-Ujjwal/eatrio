import multer from "multer";

// Store files temporarily in memory
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error("Only JPEG and PNG images are allowed");
      error.status = 400;
      return cb(error);
    }
    cb(null, true);
  },
});

export default upload;
