import multer from "multer";

/**
 * Handle file uploads in Express with Multer
 * Create a storage engine for multer, which saves files to disk
 * Note: If using in AWS Lambda, it can be temporarily saved to /tmp
 * Another option, is to use S3 directly
 */
const storage = multer.diskStorage({
  destination: function (_req, _file, callback) {
    callback(null, "/tmp");
  },
  filename: function (_req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage });

export default upload;
