import cloudinary from 'cloudinary';
import fs from 'fs';

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadonCloudinary = async (localfilepath) => {
    try {
        if (!localfilepath) {
            throw new Error("Local file path is required");
        }
        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: "auto"
        });
        console.log("Cloudinary upload response:", response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localfilepath);
        console.error("Error uploading to Cloudinary:", error);
        throw error;
        
    }
}

export { uploadonCloudinary };