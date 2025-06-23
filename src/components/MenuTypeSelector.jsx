import React from 'react';
import CollapsibleSection from './CollapsibleSection';

const MENU_TYPES = {
  CHEST: { size: 27, label: 'Chest (27 slots)', title: 'Chest' },
  DOUBLE_CHEST: { size: 54, label: 'Double Chest (54 slots)', title: 'Large Chest' },
  HOPPER: { size: 5, label: 'Hopper (5 slots)', title: 'Hopper' },
  DROPPER: { size: 9, label: 'Dropper (9 slots)', title: 'Dropper' },
  DISPENSER: { size: 9, label: 'Dispenser (9 slots)', title: 'Dispenser' },
  WORKBENCH: { size: 9, label: 'Workbench (9 slots)', title: 'Crafting' },
  BREWING: { size: 5, label: 'Brewing Stand (5 slots)', title: 'Brewing' },
  FURNACE: { size: 3, label: 'Furnace (3 slots)', title: 'Furnace' },
  ENCHANTING: { size: 1, label: 'Enchanting Table (1 slot)', title: 'Enchant' },
  ANVIL: { size: 3, label: 'Anvil (3 slots)', title: 'Repair' },
  CARTOGRAPHY: { size: 3, label: 'Cartography Table (3 slots)', title: 'Cartography' },
  GRINDSTONE: { size: 3, label: 'Grindstone (3 slots)', title: 'Repair & Disenchant' },
  SMITHING: { size: 3, label: 'Smithing Table (3 slots)', title: 'Upgrade Gear' },
  LOOM: { size: 4, label: 'Loom (4 slots)', title: 'Banner' },
  STONECUTTER: { size: 2, label: 'Stonecutter (2 slots)', title: 'Cut Block' }
};

const MenuTypeSelector = ({ selectedType, onTypeChange, menuConfig, onConfigChange, onChangeItem, selectedSlot }) => {
  const handleTypeChange = (type) => {
    const newSize = MENU_TYPES[type].size;
    
    // Preserve existing items that fit in the new size
    const newItems = {};
    Object.entries(menuConfig.items || {}).forEach(([slot, item]) => {
      if (parseInt(slot) < newSize) {
        newItems[slot] = item;
      }
    });

    onConfigChange({
      ...menuConfig,
      type,
      inventory_type: type,
      size: newSize,
      items: newItems,
      title: MENU_TYPES[type].title
    });
  };

  const handleSizeChange = (size) => {
    const newSize = parseInt(size);
    onConfigChange({
      ...menuConfig,
      size: newSize
    });
  };

  const handleTitleChange = (title) => {
    onConfigChange({
      ...menuConfig,
      title
    });
  };

  const selectedMenuType = MENU_TYPES[selectedType] || MENU_TYPES.CHEST;

  return (
    <div className="menu-type-selector fade-in">
      <CollapsibleSection title="Menu Type">
        <div className="menu-types-grid">
          {Object.entries(MENU_TYPES).map(([type, info]) => (
            <div
              key={type}
              className={`menu-type-option ${selectedType === type ? 'selected' : ''}`}
              onClick={() => handleTypeChange(type)}
            >
              {info.label}
            </div>
          ))}
        </div>

        <div className="menu-size-selector">
          <label>Menu Size:</label>
          <select
            value={menuConfig.size}
            onChange={(e) => handleSizeChange(e.target.value)}
            className="size-select"
          >
            {Object.entries(MENU_TYPES).map(([type, info]) => (
              <option key={type} value={info.size}>
                {info.label}
              </option>
            ))}
          </select>
        </div>

        <div className="menu-title-input">
          <label>Custom Title:</label>
          <input
            type="text"
            value={menuConfig.title || ''}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Custom inventory title"
            className="title-input"
          />
        </div>
      </CollapsibleSection>

      <button 
        className="minecraft-btn"
        onClick={() => {
          if (selectedSlot !== null) {
            onChangeItem(selectedSlot);
          } else {
            alert('Please select a slot first');
          }
        }}
        style={{
          margin: '10px 0',
          width: '100%',
          background: '#4CAF50',
          border: '2px solid',
          borderColor: '#43A047 #2E7D32 #2E7D32 #43A047',
          color: 'white',
          textShadow: '1px 1px #1B5E20',
          fontWeight: 'bold',
          fontSize: '14px',
          padding: '8px 16px',
          cursor: 'pointer',
          display: 'block',
          position: 'relative',
          zIndex: 100
        }}
      >
        Change Selected Item
      </button>
    </div>
  );
};

export default MenuTypeSelector; 