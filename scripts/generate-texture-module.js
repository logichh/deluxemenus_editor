const fs = require('fs');
const path = require('path');

// Function to read a file and convert it to base64
function fileToBase64(filePath) {
    try {
        const buffer = fs.readFileSync(filePath);
        return `data:image/png;base64,${buffer.toString('base64')}`;
    } catch (error) {
        console.error(`Failed to convert ${filePath}:`, error.message);
        return null;
    }
}

// Function to process a directory and get all PNG files
function processDirectory(dirPath) {
    const textures = {};
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
        if (file.endsWith('.png')) {
            const filePath = path.join(dirPath, file);
            const textureName = file.replace('.png', '');
            const base64Data = fileToBase64(filePath);
            if (base64Data) {
                textures[textureName] = base64Data;
            }
        }
    });
    
    return textures;
}

// Main execution
const blockTextures = processDirectory(path.join(__dirname, '../temp_mc_data/textures/block'));
const itemTextures = processDirectory(path.join(__dirname, '../temp_mc_data/textures/item'));

// Combine all textures
const allTextures = {
    ...blockTextures,
    ...itemTextures
};

// Generate the module content
const moduleContent = `// Auto-generated texture module
const textureData = ${JSON.stringify(allTextures, null, 2)};

export function getTextureBase64(name) {
    return textureData[name] || null;
}

export function getAllTextures() {
    return textureData;
}

export default {
    getTextureBase64,
    getAllTextures
};
`;

// Write the module
fs.writeFileSync(
    path.join(__dirname, '../src/generated-textures.js'),
    moduleContent,
    'utf8'
);

console.log(`Generated texture module with ${Object.keys(allTextures).length} textures`); 