// Import the rendered.json data directly
import renderedData from '../rendered.json';

// Cache for loaded textures
let textureCache = null;

// Load and cache all textures from rendered.json
const loadTextures = () => {
  if (textureCache) return textureCache;
  
  try {
    textureCache = {};
    
    // Get the items array from the data
    const renderedTextures = renderedData.items;
    
    // Ensure renderedTextures is an array
    if (!Array.isArray(renderedTextures)) {
      console.error('rendered.json does not contain an items array');
      return {};
    }

    renderedTextures.forEach(item => {
      if (!item || !item.name || !item.icon) {
        console.warn('Invalid item in rendered.json:', item);
        return;
      }

      // Store both the original name and normalized name
      const normalizedName = item.name.toLowerCase();
      textureCache[normalizedName] = {
        name: item.name,
        displayName: item.name.split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        icon: item.icon,
        isBlock: normalizedName.includes('block') || 
                normalizedName.includes('stairs') || 
                normalizedName.includes('slab')
      };
    });
    
    return textureCache;
  } catch (error) {
    console.error('Failed to load textures from rendered.json:', error);
    return {};
  }
};

// Helper: Levenshtein distance
function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Helper to normalize material names to match texture keys
function normalizeMaterialName(name) {
  if (!name) return '';
  return name.trim().toLowerCase();
}

// Get texture for an item name (with improved normalization)
export const getTextureBase64 = (name) => {
  if (!name) return null;
  const textures = loadTextures();
  const normalized = normalizeMaterialName(name);
  if (textures[normalized]) {
    return textures[normalized].icon;
  }
  // Fuzzy match: find the closest name
  const keys = Object.keys(textures);
  let bestMatch = null;
  let bestScore = Infinity;
  for (const key of keys) {
    const score = levenshtein(normalized, key);
    if (score < bestScore) {
      bestScore = score;
      bestMatch = key;
    }
    // Prefer substring match if available
    if (key.includes(normalized) || normalized.includes(key)) {
      bestMatch = key;
      bestScore = 0;
      break;
    }
  }
  if (bestMatch && textures[bestMatch]) {
    console.warn(`Material icon not found for '${name}', using closest match '${bestMatch}'.`);
    return textures[bestMatch].icon;
  }
  console.warn(`Material icon not found for '${name}'.`);
  return null;
};

// Get item data by name (with improved normalization)
export const getItemData = (name) => {
  if (!name) return null;
  const textures = loadTextures();
  const normalized = normalizeMaterialName(name);
  return textures[normalized] || null;
};

// Get all available items
export const getAllItems = () => {
  const textures = loadTextures();
  return Object.values(textures).map(item => ({
    name: item.name,
    displayName: item.displayName,
    icon: item.icon,
    isBlock: item.isBlock
  }));
};

// Get closest texture match for an item name (returns both icon and key)
export const getClosestTextureMatch = (name) => {
  if (!name) return { icon: null, key: null };
  const textures = loadTextures();
  const normalized = normalizeMaterialName(name);
  if (textures[normalized]) {
    return { icon: textures[normalized].icon, key: normalized };
  }
  // Fuzzy match: find the closest name
  const keys = Object.keys(textures);
  let bestMatch = null;
  let bestScore = Infinity;
  for (const key of keys) {
    const score = levenshtein(normalized, key);
    if (score < bestScore) {
      bestScore = score;
      bestMatch = key;
    }
    // Prefer substring match if available
    if (key.includes(normalized) || normalized.includes(key)) {
      bestMatch = key;
      bestScore = 0;
      break;
    }
  }
  if (bestMatch && textures[bestMatch]) {
    return { icon: textures[bestMatch].icon, key: bestMatch };
  }
  return { icon: null, key: null };
}; 