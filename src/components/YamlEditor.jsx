import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import YAML from 'js-yaml';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import './YamlEditor.css';
import { getItemData } from '../utils/textureLoader';

const YamlEditor = ({ menuConfig, onConfigChange }) => {
  const [yamlContent, setYamlContent] = useState('');
  const [lastMenuUpdate, setLastMenuUpdate] = useState(null);

  // Update YAML content when menuConfig changes from visual editor
  useEffect(() => {
    if (menuConfig && JSON.stringify(menuConfig) !== lastMenuUpdate) {
      try {
        // Create a clean version of the config with all properties preserved
        const cleanConfig = {
          menu_title: menuConfig.title,
          open_command: menuConfig.open_command,
          size: menuConfig.size,
          inventory_type: menuConfig.inventory_type || 'CHEST',
        };

        // Add optional properties in desired order
        if (menuConfig.update_interval) cleanConfig.update_interval = menuConfig.update_interval;
        if (menuConfig.register_command) cleanConfig.register_command = menuConfig.register_command;
        if (menuConfig.args) cleanConfig.args = menuConfig.args;
        if (menuConfig.args_usage_message) cleanConfig.args_usage_message = menuConfig.args_usage_message;
        if (menuConfig.open_commands) cleanConfig.open_commands = menuConfig.open_commands;
        if (menuConfig.close_commands) cleanConfig.close_commands = menuConfig.close_commands;
        if (menuConfig.open_requirement) cleanConfig.open_requirement = menuConfig.open_requirement;

        // Process items
        if (menuConfig.items) {
          cleanConfig.items = {};
          Object.entries(menuConfig.items).forEach(([slot, item]) => {
            if (item && item.material) {
              // Create a clean item object preserving all properties
              const cleanItem = { ...item };
              
              // Remove internal properties
              delete cleanItem.icon;
              delete cleanItem.isBlock;
              delete cleanItem._icon;
              delete cleanItem._isBlock;
              
              // Ensure slot is preserved exactly as in the original item
              const originalSlot = cleanItem.slot;
              
              // Ensure properties are in the correct order
              const orderedItem = {
                material: cleanItem.material,
                slot: originalSlot,
                priority: cleanItem.priority || 0
              };

              // Add optional properties in a specific order
              if (cleanItem.display_name) orderedItem.display_name = cleanItem.display_name;
              if (cleanItem.amount) orderedItem.amount = cleanItem.amount;
              if (cleanItem.nbt_int) orderedItem.nbt_int = cleanItem.nbt_int;
              if (cleanItem.hide_attributes !== undefined) orderedItem.hide_attributes = cleanItem.hide_attributes;
              if (cleanItem.lore && cleanItem.lore.length > 0) orderedItem.lore = cleanItem.lore;
              if (cleanItem.view_requirement) orderedItem.view_requirement = cleanItem.view_requirement;
              if (cleanItem.left_click_commands) orderedItem.left_click_commands = cleanItem.left_click_commands;
              if (cleanItem.right_click_commands) orderedItem.right_click_commands = cleanItem.right_click_commands;
              
              // Add any remaining properties that weren't explicitly ordered
              Object.entries(cleanItem).forEach(([key, value]) => {
                if (!(key in orderedItem) && value !== undefined && value !== '') {
                  orderedItem[key] = value;
                }
              });

              // Use a consistent key format for the items
              const itemKey = originalSlot.toString();
              cleanConfig.items[itemKey] = orderedItem;
            }
          });
        }

        // Custom YAML dumper options for consistent formatting
        const customOptions = {
          lineWidth: -1,
          noRefs: true,
          sortKeys: false,
          noCompatMode: true,
          quotingType: "'",
          forceQuotes: true
        };

        let newYaml = YAML.dump(cleanConfig, customOptions);
        
        // Only update if the content has actually changed
        if (newYaml !== yamlContent) {
          setYamlContent(newYaml);
          setLastMenuUpdate(JSON.stringify(menuConfig));
        }
      } catch (e) {
        console.error('Error formatting YAML:', e);
      }
    }
  }, [menuConfig, lastMenuUpdate, yamlContent]);

  // Handle raw YAML input with validation
  const handleRawInput = (newValue) => {
    setYamlContent(newValue);
    try {
      // Parse the YAML
      const parsed = YAML.load(newValue) || {};
      
      // Create new config object preserving original structure
      const newConfig = {
        title: parsed.menu_title,
        size: parsed.size,
        inventory_type: parsed.inventory_type,
        open_command: parsed.open_command,
        items: {},
        raw: newValue  // Store original YAML
      };

      // Process items while preserving original format
      if (parsed.items) {
        Object.entries(parsed.items).forEach(([key, item]) => {
          if (item && item.slot !== undefined) {
            // Use the slot number from the YAML directly
            const slotNum = parseInt(item.slot);
            if (!isNaN(slotNum)) {
              // Create new item preserving all original properties
              const newItem = {
                ...item,
                slot: slotNum,  // Keep the original slot number
                icon: item.material ? getItemData(item.material)?.icon : null
              };

              // Store the item using its slot number as the key
              newConfig.items[slotNum] = newItem;
            }
          }
        });
      }

      // Copy over any additional properties from the original YAML
      Object.entries(parsed).forEach(([key, value]) => {
        if (!(key in newConfig) && value !== undefined) {
          newConfig[key] = value;
        }
      });

      onConfigChange(newConfig);
    } catch (e) {
      console.error('Error parsing YAML:', e);
    }
  };

  return (
    <div className="yaml-editor">
      <div className="yaml-editor-header">
        <h3>YAML Configuration</h3>
        <div className="yaml-editor-actions">
          <button 
            className="yaml-button import"
            onClick={() => document.getElementById('yaml-import').click()}
          >
            Import YAML
          </button>
          <input
            id="yaml-import"
            type="file"
            accept=".yml,.yaml"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => handleRawInput(e.target.result);
                reader.readAsText(file);
              }
            }}
          />
          <button 
            className="yaml-button export"
            onClick={() => {
              const blob = new Blob([yamlContent], { type: 'text/yaml' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'menu_config.yml';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
          >
            Export YAML
          </button>
        </div>
      </div>
      <AceEditor
        mode="yaml"
        theme="monokai"
        onChange={handleRawInput}
        value={yamlContent}
        name="yaml-editor"
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          showLineNumbers: true,
          tabSize: 2,
        }}
        style={{ width: '100%', height: '500px' }}
      />
    </div>
  );
};

export default YamlEditor; 