// Minecraft color code to CSS color mapping
const colorCodes = {
  '0': '#000000', // Black
  '1': '#0000AA', // Dark Blue
  '2': '#00AA00', // Dark Green
  '3': '#00AAAA', // Dark Aqua
  '4': '#AA0000', // Dark Red
  '5': '#AA00AA', // Dark Purple
  '6': '#FFAA00', // Gold
  '7': '#AAAAAA', // Gray
  '8': '#555555', // Dark Gray
  '9': '#5555FF', // Blue
  'a': '#55FF55', // Green
  'b': '#55FFFF', // Aqua
  'c': '#FF5555', // Red
  'd': '#FF55FF', // Light Purple
  'e': '#FFFF55', // Yellow
  'f': '#FFFFFF', // White
};

// Format codes
const formatCodes = {
  'k': 'obfuscated',
  'l': 'bold',
  'm': 'strikethrough',
  'n': 'underline',
  'o': 'italic',
  'r': 'reset'
};

export const parseColorCodes = (text) => {
  if (!text) return [];

  const parts = [];
  let currentPart = {
    text: '',
    color: null,
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    obfuscated: false
  };

  for (let i = 0; i < text.length; i++) {
    if (text[i] === '&' && i + 1 < text.length) {
      const code = text[i + 1].toLowerCase();
      
      // If we have accumulated text, push the current part
      if (currentPart.text) {
        parts.push({ ...currentPart });
        currentPart.text = '';
      }

      // Handle color codes
      if (colorCodes[code]) {
        currentPart.color = colorCodes[code];
        // Reset formatting when color changes
        currentPart.bold = false;
        currentPart.italic = false;
        currentPart.underline = false;
        currentPart.strikethrough = false;
        currentPart.obfuscated = false;
      }
      // Handle format codes
      else if (formatCodes[code]) {
        switch(code) {
          case 'l': currentPart.bold = true; break;
          case 'o': currentPart.italic = true; break;
          case 'n': currentPart.underline = true; break;
          case 'm': currentPart.strikethrough = true; break;
          case 'k': currentPart.obfuscated = true; break;
          case 'r':
            currentPart = {
              text: '',
              color: null,
              bold: false,
              italic: false,
              underline: false,
              strikethrough: false,
              obfuscated: false
            };
            break;
        }
      }
      i++; // Skip the next character (the code)
    } else {
      currentPart.text += text[i];
    }
  }

  // Push the last part if it has text
  if (currentPart.text) {
    parts.push(currentPart);
  }

  return parts;
};

export const renderColoredText = (text) => {
  const parts = parseColorCodes(text);
  return parts.map((part, index) => {
    const style = {
      color: part.color || 'inherit',
      fontWeight: part.bold ? 'bold' : 'normal',
      fontStyle: part.italic ? 'italic' : 'normal',
      textDecoration: [
        part.underline ? 'underline' : '',
        part.strikethrough ? 'line-through' : ''
      ].filter(Boolean).join(' ') || 'none',
    };
    
    // Handle obfuscated text
    if (part.obfuscated) {
      style.filter = 'blur(0.7px)';
    }
    
    return <span key={index} style={style}>{part.text}</span>;
  });
}; 