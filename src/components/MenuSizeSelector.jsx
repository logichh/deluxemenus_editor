import React from 'react';

const MenuSizeSelector = ({ currentSize, onSizeChange }) => {
  const sizes = [
    { rows: 1, size: 9, name: '1 Row (Dispenser/Dropper)' },
    { rows: 3, size: 27, name: '3 Rows (Chest)' },
    { rows: 4, size: 36, name: '4 Rows (Large)' },
    { rows: 5, size: 45, name: '5 Rows (Large)' },
    { rows: 6, size: 54, name: '6 Rows (Double Chest)' }
  ];

  return (
    <div className="menu-size-selector">
      <label htmlFor="menu-size">Menu Size:</label>
      <select
        id="menu-size"
        value={currentSize}
        onChange={(e) => onSizeChange(parseInt(e.target.value))}
        className="minecraft-select"
      >
        {sizes.map(({ size, name }) => (
          <option key={size} value={size}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MenuSizeSelector; 