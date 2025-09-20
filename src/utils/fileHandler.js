import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDirectory = path.join(__dirname, '..', '..', 'public', 'images');

const deleteFile = async (fileName) => {
    const filePath = path.join(uploadDirectory, fileName);
    try {
        await fs.promises.unlink(filePath);
        console.log(`Successfully deleted ${filePath}`);
    } catch (error) {
        console.error(`Error deleting file: ${error.message}`);
    }
};

export { deleteFile };