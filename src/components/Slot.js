import React from 'react';

export function Slot({ id, icon, amount, lore, onClick, isSearch = false }) {
  return (
    <div 
      className="item-slot"
      title={lore}
      onClick={onClick}
    >
      {icon && (
        <img 
          src={icon} 
          alt={lore || id}
          draggable={false}
          style={{
            width: '28px',
            height: '28px',
            imageRendering: 'pixelated',
            margin: '2px'
          }}
        />
      )}
    </div>
  );
} 