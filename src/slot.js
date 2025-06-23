import './App.css';
import React from 'react';
import McText from 'mctext-react';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';
import { getTextureBase64 } from './utils/textureLoader';
import { renderColoredText } from './utils/colorCodes';

export function Slot({ id, icon, amount, lore, onClick, isSearch = false, isBlock = false, isFuzzyMatch = false, fuzzyKey = null }) {
  const [currentIcon, setCurrentIcon] = React.useState(icon);
  const [loadError, setLoadError] = React.useState(false);

  React.useEffect(() => {
    if (!icon) {
      setLoadError(true);
      return;
    }

    // Always wrap in data URL if not already
    if (icon.startsWith('data:')) {
      setCurrentIcon(icon);
      setLoadError(false);
      return;
    }

    setCurrentIcon(`data:image/png;base64,${icon}`);
    setLoadError(false);
  }, [icon]);

  const tooltipContent = (
    <div className="item-tooltip" style={{ whiteSpace: 'nowrap' }}>
      {renderColoredText(lore || 'Unknown Item')}
      {isFuzzyMatch && (
        <div style={{ color: 'red', fontSize: '11px', marginTop: '4px' }}>
          Fuzzy match: <b>{fuzzyKey}</b>
        </div>
      )}
    </div>
  );

  return (
    <Tooltip
      placement="right"
      overlay={tooltipContent}
      mouseEnterDelay={0.1}
      mouseLeaveDelay={0.1}
      trigger={['hover']}
      overlayClassName="minecraft-tooltip"
      overlayStyle={{ whiteSpace: 'nowrap' }}
    >
      <div
        className={`slot ${isSearch ? 'search-slot' : ''} ${isBlock ? 'block-slot' : ''} ${isFuzzyMatch ? 'fuzzy-match-slot' : ''}`}
        onClick={onClick}
        style={isFuzzyMatch ? { border: '2px solid red', position: 'relative' } : {}}
      >
        {currentIcon && (
          <img
            src={currentIcon}
            alt={lore || ''}
            style={{
              imageRendering: 'pixelated',
              width: '28px',
              height: '28px',
              margin: '2px'
            }}
            onError={() => {
              console.warn('Failed to load image:', icon);
              setLoadError(true);
              // Try to get the fallback texture
              const fallbackTexture = getTextureBase64('stone');
              if (fallbackTexture) {
                setCurrentIcon(`data:image/png;base64,${fallbackTexture}`);
              }
            }}
          />
        )}
        {isFuzzyMatch && (
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            color: 'red',
            fontWeight: 'bold',
            fontSize: '16px',
            pointerEvents: 'none',
            textShadow: '1px 1px 2px #000'
          }}>!</span>
        )}
        {amount > 1 && <span className="item-amount">{amount}</span>}
      </div>
    </Tooltip>
  );
}
