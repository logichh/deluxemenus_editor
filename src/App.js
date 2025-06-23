import React, { useState, useEffect } from 'react';
import './App.css';
import ItemOptionsPanel from './components/ItemOptionsPanel';
import MenuSettings from './components/MenuSettings';
import RequirementsPanel from './components/RequirementsPanel';
import MenuTypeSelector from './components/MenuTypeSelector';
import PresetManager from './components/PresetManager';
import MenuSizeSelector from './components/MenuSizeSelector';
import CollapsibleSection from './components/CollapsibleSection';
import Modal from 'react-modal';
import YAML from 'js-yaml';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-monokai';
import { Search } from './search';
import { Slot } from './slot';
import { getTextureBase64, getItemData, getClosestTextureMatch } from './utils/textureLoader';
import YamlEditor from './components/YamlEditor';

// Set the app element for accessibility
Modal.setAppElement('#root');

// Add modal styles
const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  content: {
    position: 'relative',
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    padding: 0,
    border: 'none',
    background: 'none',
    overflow: 'visible'
  }
};

// Convert any ID to material name
const getMaterialName = (identifier) => {
  if (!identifier) return null;
  
  // If it's already a valid material name (contains no numbers), return it
  if (!/\d/.test(identifier)) {
    return identifier.toUpperCase();
  }
  
  // If it's a numeric ID, just return it as is since we don't support legacy IDs anymore
  return identifier.toUpperCase();
};

// Get icon for a material
const getItemIcon = (material) => {
  if (!material) return null;
  return getTextureBase64(material);
};

function App() {
  const [menuTitle, setMenuTitle] = useState('&6Menu Title');
  const [menuSize, setMenuSize] = useState(27);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSlotItemIndex, setSelectedSlotItemIndex] = useState(0);
  const [showItemPicker, setShowItemPicker] = useState(false);
  const [menuConfig, setMenuConfig] = useState({
    title: '&6Menu Title',
    size: 27,
    items: {},
    raw: ''
  });
  const [yamlView, setYamlView] = useState(false);

  // Function to safely parse YAML and update menu config
  const handleYamlUpdate = (yamlContent) => {
    try {
      // Store the raw YAML
      const newConfig = {
        raw: yamlContent
      };

      // Try to parse the YAML
      const parsed = YAML.load(yamlContent) || {};
      
      // Ensure open_command is an array
      if (parsed.open_command) {
        if (!Array.isArray(parsed.open_command)) {
          parsed.open_command = [parsed.open_command];
        }
      }

      // Update the menu configuration
      if (parsed.menu_title) {
        setMenuTitle(parsed.menu_title);
        newConfig.title = parsed.menu_title;
      }
      
      if (parsed.open_command) {
        newConfig.open_command = parsed.open_command;
      }
      
      if (parsed.size) {
        setMenuSize(parsed.size);
        newConfig.size = parsed.size;
      }

      // Handle items if they exist
      if (parsed.items) {
        newConfig.items = {};
        Object.entries(parsed.items).forEach(([key, item]) => {
          if (item && item.material) {
            // Get item data from texture loader if material exists
            const itemData = item.material ? getItemData(item.material) : null;
            
            // Create the item with all its properties
            const newItem = {
              ...item,
              // Use the item's slot property if it exists, otherwise use the key
              slot: item.slot || parseInt(key),
              icon: itemData?.icon,
              // Preserve NBT data format
              nbt_int: item.nbt_int,
              // Preserve priority
              priority: item.priority,
              // Preserve view requirements
              view_requirement: item.view_requirement ? {
                requirements: {
                  ...(item.view_requirement.requirements || {}),
                }
              } : undefined
            };

            // Use the key as is (don't parse it as a number)
            newConfig.items[key] = newItem;
          }
        });
      }

      // Add open requirement if it exists
      if (parsed.open_requirement) {
        newConfig.open_requirement = parsed.open_requirement;
      }

      setMenuConfig(prev => ({
        ...prev,
        ...newConfig
      }));
    } catch (error) {
      console.error('Error parsing YAML:', error);
      // On error, just store the raw YAML without modifying the visual editor
      setMenuConfig(prev => ({
        ...prev,
        raw: yamlContent
      }));
    }
  };

  const handleSizeChange = (newSize) => {
    setMenuSize(newSize);
    
    // Update menu config with new size and preserve existing items
    setMenuConfig(prev => {
      const newItems = {};
      // Preserve existing items if they're within the new size
      Object.entries(prev.items).forEach(([slot, item]) => {
        if (parseInt(slot) < newSize) {
          newItems[slot] = item;
        }
      });
      // Fill remaining slots with empty items
      for (let i = 0; i < newSize; i++) {
        if (!newItems[i]) {
          newItems[i] = { slot: i };
        }
      }
      return {
        ...prev,
        size: newSize,
        items: newItems
      };
    });

    // If selected slot is outside new size, deselect it
    if (selectedSlot >= newSize) {
      setSelectedSlot(null);
    }
  };

  const handleItemUpdate = (itemData) => {
    if (selectedSlot === null) return;

    // Update icon based on material name only if icon is not already present
    if (itemData.material && !itemData.icon) {
      const itemInfo = getItemData(itemData.material);
      if (itemInfo) {
        itemData.icon = itemInfo.icon;
      }
    }
    
    // Preserve the existing icon if it exists
    const existingItem = menuConfig.items[selectedSlot];
    if (existingItem && existingItem.icon && !itemData.icon) {
      itemData.icon = existingItem.icon;
    }

    // Ensure display_name is properly preserved
    const updatedItem = {
      ...existingItem,
      ...itemData,
      slot: selectedSlot,
      // Preserve display_name if it exists in either the existing item or the new data
      display_name: itemData.display_name || existingItem?.display_name || ''
    };
    
    setMenuConfig(prev => ({
      ...prev,
      items: {
        ...prev.items,
        [selectedSlot]: updatedItem
      }
    }));
  };

  const handleMenuUpdate = (newConfig) => {
    setMenuConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  };

  const handleYamlChange = (newValue) => {
    try {
      const config = YAML.load(newValue);
      // Ensure required properties exist
      const safeConfig = {
        title: config.title || menuTitle,
        size: config.size || menuSize,
        items: config.items || {}
      };
      setMenuConfig(safeConfig);
    } catch (e) {
      console.error('Invalid YAML:', e);
      // Don't update state on error to preserve current valid state
    }
  };

  // Legacy Minecraft ID to modern name mapping
  const legacyIdMap = {
    // Sandstone variants
    '24:0': 'sandstone',
    '24:1': 'red_sandstone',
    '24:2': 'smooth_sandstone',
    // Add more mappings as needed
  };

  // Helper function to get texture path
  const getTexturePath = (material) => {
    // Handle modern material names
    const name = material.toLowerCase()
      .replace('minecraft:', '')
      .replace(/_/g, '_');

    // Try item path first, fallback to block path
    return `item/${name}`;
  };

  const handleItemSelect = (item) => {
    if (selectedSlot !== null) {
      // Preserve existing item properties when selecting new item
      const existingItem = menuConfig.items[selectedSlot] || {};
      const itemData = {
        ...existingItem,
        material: item.name,
        display_name: existingItem.display_name || item.displayName || '',
        amount: existingItem.amount || 1,
        lore: existingItem.lore || [],
        icon: item.icon,
        isBlock: item.isBlock,
        slot: selectedSlot
      };
      
      setMenuConfig(prev => ({
        ...prev,
        items: {
          ...prev.items,
          [selectedSlot]: itemData
        }
      }));
      setShowItemPicker(false);
    }
  };

  const handleLoadPreset = (preset) => {
    if (preset) {
      console.log('Loading preset:', preset);
      // Update menu title
      setMenuTitle(preset.title || '&6Menu Title');
      // Update menu size
      setMenuSize(preset.size || 27);
      // Update menu configuration
      setMenuConfig(preset);
      
      // Convert preset items to our format if needed
      if (preset.items) {
        const newItems = new Array(preset.size || 27).fill(null)
          .map((_, i) => ({ id: i }));
        
        Object.entries(preset.items).forEach(([slot, item]) => {
          const slotNum = parseInt(slot);
          if (!isNaN(slotNum) && slotNum >= 0 && slotNum < newItems.length) {
            newItems[slotNum] = {
              ...item,
              id: slotNum
            };
          }
        });
        
        setMenuConfig(prev => ({
          ...prev,
          items: newItems
        }));
      }
    }
  };

  // Helper: get all items for a slot, sorted by priority (lowest first)
  const getItemsForSlot = (slotNum) => {
    return Object.values(menuConfig.items)
      .filter(item => item && item.slot === slotNum)
      .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
  };

  // Update renderSlot to use the highest-priority item for display
  const renderSlot = (index) => {
    const items = getItemsForSlot(index);
    const item = items[0] || { slot: index };
    let icon = item.icon;
    let isFuzzyMatch = false;
    let fuzzyKey = null;
    if (!icon && item.material) {
      // Try to get the exact icon first
      const itemData = getItemData(item.material);
      if (itemData && itemData.icon) {
        icon = itemData.icon;
      } else {
        // Fallback: use fuzzy matching to get the closest icon and key
        const { icon: fuzzyIcon, key: matchedKey } = getClosestTextureMatch(item.material);
        if (fuzzyIcon) {
          icon = fuzzyIcon.startsWith('data:') ? fuzzyIcon : `data:image/png;base64,${fuzzyIcon}`;
          isFuzzyMatch = true;
          fuzzyKey = matchedKey;
          console.warn(`Fuzzy match used for material '${item.material}'. Displaying closest icon: '${matchedKey}'.`);
        } else {
          // Final fallback: use stone
          const fallbackTexture = getTextureBase64('stone');
          icon = fallbackTexture ? (fallbackTexture.startsWith('data:') ? fallbackTexture : `data:image/png;base64,${fallbackTexture}`) : '';
        }
      }
    }
    return (
      <div 
        key={index}
        className={`slot ${selectedSlot === index ? 'selected' : ''}`}
        onClick={() => {
          setSelectedSlot(index);
          setSelectedSlotItemIndex(0); // default to first item
        }}
      >
        {item?.material && (
          <Slot
            id={index}
            icon={icon}
            amount={item.amount || 1}
            lore={item.display_name || item.material}
            isFuzzyMatch={isFuzzyMatch}
            fuzzyKey={fuzzyKey}
            onClick={() => {
              setSelectedSlot(index);
              setSelectedSlotItemIndex(0);
            }}
          />
        )}
      </div>
    );
  };

  // Add this function to format the menu config
  const formatMenuConfig = (config) => {
    // Ensure config is an object
    const safeConfig = config || {};
    
    const formattedConfig = {
      menu_title: safeConfig.title || '&6Menu Title',
      size: safeConfig.size || 27,
      items: {}
    };

    // Format open_command - remove forward slash if it exists
    if (safeConfig.open_command) {
      // Convert to string and remove forward slash if it exists
      formattedConfig.open_command = String(safeConfig.open_command).replace(/^\//, '');
    }

    // Format items
    if (safeConfig.items) {
      Object.entries(safeConfig.items).forEach(([slot, item]) => {
        if (item && item.material) {
          // Create a new item object without the icon and isBlock
          const formattedItem = {
            slot: parseInt(slot), // Add slot property
            material: item.material,
            amount: item.amount || 1
          };

          // Only add optional properties if they exist and are not empty
          if (item.display_name) formattedItem.display_name = item.display_name;
          if (item.lore && item.lore.length > 0) formattedItem.lore = item.lore;
          if (item.priority) formattedItem.priority = item.priority;
          if (item.update) formattedItem.update = item.update;
          if (item.hide_attributes) formattedItem.hide_attributes = item.hide_attributes;
          // Explicitly exclude the icon and isBlock properties
          delete formattedItem.icon;
          delete formattedItem.isBlock;

          // Use the slot number as the key in items object
          formattedConfig.items[slot] = formattedItem;
        }
      });
    }

    // Add requirements if they exist
    if (safeConfig.requirements) {
      if (safeConfig.requirements.open_requirement) {
        formattedConfig.open_requirement = {
          requirements: {
            requirement: safeConfig.requirements.open_requirement
          }
        };
      }
      if (safeConfig.requirements.view_requirement) {
        formattedConfig.view_requirement = {
          requirements: {
            requirement: safeConfig.requirements.view_requirement
          }
        };
      }
      if (safeConfig.requirements.left_click_requirement) {
        formattedConfig.left_click_requirement = {
          requirements: {
            requirement: safeConfig.requirements.left_click_requirement
          }
        };
      }
    }

    // Add other optional properties
    if (safeConfig.minimum_requirements) formattedConfig.minimum_requirements = safeConfig.minimum_requirements;
    if (safeConfig.update_interval) formattedConfig.update_interval = safeConfig.update_interval;
    if (safeConfig.open_commands) formattedConfig.open_commands = safeConfig.open_commands;

    return formattedConfig;
  };

  const handleCloseItemPicker = () => {
    setShowItemPicker(false);
  };

  return (
    <div className="app-container">
      {/* Left Column - YAML and Presets */}
      <div className="left-column">
        <YamlEditor 
          menuConfig={menuConfig}
          onConfigChange={(newConfig) => {
            if (newConfig.raw !== undefined) {
              handleYamlUpdate(newConfig.raw);
            }
          }}
        />

        <div className="presets-section">
          <h3 className="section-title">Presets</h3>
            <PresetManager
              currentConfig={menuConfig}
              onLoadPreset={handleLoadPreset}
            />
        </div>
      </div>

      {/* Center Column - Menu Editor */}
      <div className="center-column">
        <div className="menu-preview">
          {/* Menu Title Input */}
          <div className="menu-title">
            <input
              type="text"
              value={menuTitle}
              onChange={(e) => {
                setMenuTitle(e.target.value);
                setMenuConfig(prev => ({
                  ...prev,
                  title: e.target.value
                }));
              }}
              placeholder="Menu Title"
            />
          </div>

          {/* Menu Size Selector */}
          <MenuSizeSelector
            currentSize={menuSize}
            onSizeChange={(newSize) => {
              setMenuSize(newSize);
              setMenuConfig(prev => {
                const newItems = {};
                Object.entries(prev.items).forEach(([slot, item]) => {
                  if (parseInt(slot) < newSize) {
                    newItems[slot] = item;
                  }
                });
                for (let i = 0; i < newSize; i++) {
                  if (!newItems[i]) {
                    newItems[i] = { slot: i };
                  }
                }
                return {
                  ...prev,
                  size: newSize,
                  items: newItems
                };
              });
            }}
          />

          {/* Inventory Grid */}
          <div className="inventory-container">
            <div className="menu-grid" style={{
              gridTemplateRows: `repeat(${Math.ceil(menuSize / 9)}, 32px)`,
              gap: '4px',
              padding: '8px'
            }}>
              {Array.from({ length: menuSize }, (_, i) => renderSlot(i))}
            </div>
          </div>

          {/* Menu Settings */}
          <MenuSettings
            config={menuConfig}
            onUpdate={handleMenuUpdate}
            LANG={require('./lang/english.json')}
          />

          {/* Requirements Sections */}
          <div className="requirements-container">
            {/* Open Requirements */}
            <CollapsibleSection title="Open Requirements">
              <RequirementsPanel
                requirements={menuConfig.open_requirements || {}}
                onUpdate={(requirements) => handleMenuUpdate({ open_requirements: requirements })}
                LANG={require('./lang/english.json')}
              />
            </CollapsibleSection>

            {/* View Requirements */}
            <CollapsibleSection title="View Requirements">
              <RequirementsPanel
                requirements={menuConfig.view_requirements || {}}
                onUpdate={(requirements) => handleMenuUpdate({ view_requirements: requirements })}
                LANG={require('./lang/english.json')}
              />
            </CollapsibleSection>

            {/* Click Requirements */}
            <CollapsibleSection title="Click Requirements">
              <RequirementsPanel
                requirements={menuConfig.click_requirements || {}}
                onUpdate={(requirements) => handleMenuUpdate({ click_requirements: requirements })}
                LANG={require('./lang/english.json')}
              />
            </CollapsibleSection>

            {/* Global Requirements */}
            <CollapsibleSection title="Global Requirements">
              <RequirementsPanel
                requirements={menuConfig.global_requirements || {}}
                onUpdate={(requirements) => handleMenuUpdate({ global_requirements: requirements })}
                LANG={require('./lang/english.json')}
              />
            </CollapsibleSection>
            </div>
        </div>
      </div>

      {/* Right Column - Item Options */}
      <div className="right-column">
        {selectedSlot !== null && (
          <ItemOptionsPanel
            items={getItemsForSlot(selectedSlot)}
            selectedIndex={selectedSlotItemIndex}
            onSelectIndex={setSelectedSlotItemIndex}
            item={getItemsForSlot(selectedSlot)[selectedSlotItemIndex] || { slot: selectedSlot }}
            onUpdate={(itemData) => handleItemUpdate(itemData)}
            onChangeItem={() => setShowItemPicker(true)}
            LANG={require('./lang/english.json')}
          />
        )}
      </div>

      {/* Item Picker Modal */}
      <Modal
        isOpen={showItemPicker}
        onRequestClose={handleCloseItemPicker}
        style={customStyles}
        contentLabel="Select an Item"
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
      >
        <Search onSelect={handleItemSelect} />
      </Modal>
    </div>
  );
}

export default App;

