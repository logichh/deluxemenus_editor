import React from 'react';
import './DraggableSlot.css';
import { getTextureBase64 } from '../utils/textureLoader';

const DraggableSlot = ({
  id,
  index,
  item,
  onDrop,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDragEnd,
  selectedSlot,
  onRightClick,
  isDisabled,
  isSelected
}) => {
  const handleDrop = (e) => {
    if (!isDisabled) {
      onDrop(e, index);
    }
  };

  const getItemContent = () => {
    if (!item?.material || item.material === 'none') {
      return null;
    }

    const displayName = item.display_name || item.material.toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Get icon from texture loader or use default transparent icon
    const icon = item.icon || getTextureBase64(item.material) || 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAF0lEQVRIDWMYBaNgFIyCUTAKRsEoQAMACCAAATXQUGAAAAAASUVORK5CYII=';

    return (
      <div className="slot-content">
        <img
          src={`data:image/png;base64,${icon}`}
          alt={displayName}
          className="item-icon"
          style={{
            width: '28px',
            height: '28px',
            imageRendering: 'pixelated',
            margin: '2px'
          }}
        />
        <div className="item-name">{displayName}</div>
      </div>
    );
  };

  return (
    <div
      className={`slot ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''} ${item?.material ? 'has-item' : ''}`}
      onDrop={handleDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragEnd={onDragEnd}
      onContextMenu={(e) => {
        e.preventDefault();
        if (onRightClick) onRightClick(index);
      }}
      onClick={() => !isDisabled && selectedSlot(index)}
      draggable={!!item?.material}
    >
      {getItemContent()}
    </div>
  );
};

export default DraggableSlot; 