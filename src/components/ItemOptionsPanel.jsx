import React, { useState, useEffect } from 'react';
import { FieldWithTooltip } from './CustomTooltip';
import './ItemOptionsPanel.css';
import CollapsibleSection from './CollapsibleSection';

const ItemOptionsPanel = ({ items = [], selectedIndex = 0, onSelectIndex = () => {}, item, onUpdate, onChangeItem, LANG }) => {
  const [itemData, setItemData] = useState({ ...item });

  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (item) {
      setItemData({ ...item });
    }
  }, [item]);

  const handleChange = (field, value) => {
    const newData = { ...itemData };
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      newData[parent] = { ...newData[parent], [child]: value };
    } else {
      newData[field] = value;
    }
    
    setItemData(newData);
    onUpdate(newData);
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...itemData[field]];
    newArray[index] = value;
    handleChange(field, newArray);
  };

  const addArrayItem = (field) => {
    handleChange(field, [...itemData[field], '']);
  };

  const removeArrayItem = (field, index) => {
    const newArray = itemData[field].filter((_, i) => i !== index);
    handleChange(field, newArray);
  };

  const handleInputChange = (field, value) => {
      onUpdate({
      ...itemData,
        [field]: value
      });
  };

  const handleNBTChange = (nbtString) => {
    try {
      const nbtData = JSON.parse(nbtString);
      handleInputChange('nbt_data', nbtData);
    } catch (e) {
      console.error('Invalid NBT JSON:', e);
    }
  };

  const handleEnchantmentChange = (enchantments) => {
    const enchantList = enchantments.split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [ench, level] = line.split(':').map(s => s.trim());
        return { enchantment: ench, level: parseInt(level) || 1 };
      });
    handleInputChange('enchantments', enchantList);
  };

  const handlePotionEffectChange = (effects) => {
    const effectList = effects.split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [effect, duration, amplifier] = line.split(':').map(s => s.trim());
        return {
          effect: effect,
          duration: parseInt(duration) || 200,
          amplifier: parseInt(amplifier) || 1
        };
      });
    handleInputChange('potion_effects', effectList);
  };

  const itemFlags = [
    'HIDE_ENCHANTS',
    'HIDE_ATTRIBUTES',
    'HIDE_UNBREAKABLE',
    'HIDE_DESTROYS',
    'HIDE_PLACED_ON',
    'HIDE_POTION_EFFECTS',
    'HIDE_DYE'
  ];

  // Dropdown for multiple items in this slot
  const hasMultiple = items.length > 1;

  return (
    <div className="item-options-panel">
      <h3>{LANG.item_options || 'Item Options'}</h3>
      {hasMultiple && (
        <div className="field-group">
          <label>{LANG['slot_variants'] || 'Slot Variants (by priority)'}</label>
          <select
            value={selectedIndex}
            onChange={e => onSelectIndex(Number(e.target.value))}
          >
            {items.map((it, idx) => (
              <option key={idx} value={idx}>
                {`Priority: ${it.priority ?? 0} ${it.display_name ? '— ' + it.display_name : ''}`}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Basic Properties */}
      <CollapsibleSection title={LANG['Basic Properties'] || 'Basic Properties'}>
        <div className="field-group">
          <label>{LANG['material'] || 'Material'}</label>
          <div className="material-selector">
            <input
              type="text"
              value={itemData.material || ''}
              onChange={(e) => handleChange('material', e.target.value)}
              placeholder="STONE"
            />
            <button onClick={onChangeItem}>{LANG['change_item'] || 'Change Item'}</button>
          </div>
        </div>

        <div className="field-group">
          <label>{LANG['display_name'] || 'Display Name'}</label>
          <input
            type="text"
            value={itemData.display_name || ''}
            onChange={(e) => handleChange('display_name', e.target.value)}
            placeholder="&6Cool Item"
          />
        </div>

        <div className="field-group">
          <label>{LANG['slot'] || 'Slot'}</label>
          <input
            type="number"
            value={itemData.slot || 0}
            onChange={(e) => handleChange('slot', parseInt(e.target.value))}
            min="0"
            max="53"
          />
      </div>

        <div className="field-group">
          <label>{LANG['amount'] || 'Amount'}</label>
        <input
          type="number"
            value={itemData.amount || 1}
            onChange={(e) => handleChange('amount', parseInt(e.target.value))}
            min="1"
            max="64"
        />
      </div>

        <div className="field-group">
          <label>{LANG['dynamic_amount'] || 'Dynamic Amount'}</label>
        <input
          type="text"
            value={itemData.dynamic_amount || ''}
            onChange={(e) => handleChange('dynamic_amount', e.target.value)}
            placeholder="%player_item_amount_DIAMOND%"
        />
      </div>
      </CollapsibleSection>

      {/* Lore */}
      <CollapsibleSection title={LANG['Lore'] || 'Lore'}>
        {(itemData.lore || []).map((line, index) => (
          <div key={index} className="array-line">
            <input
              type="text"
              value={line}
              onChange={(e) => handleArrayChange('lore', index, e.target.value)}
              placeholder={`${LANG['lore_line'] || 'Lore Line'} ${index + 1}`}
            />
            <button onClick={() => removeArrayItem('lore', index)}>{LANG['remove'] || 'Remove'}</button>
          </div>
        ))}
        <button onClick={() => addArrayItem('lore')}>{LANG['add_lore_line'] || 'Add Lore Line'}</button>
      </CollapsibleSection>

      {/* Commands */}
      <CollapsibleSection title={LANG['Commands'] || 'Commands'}>
        {/* Left Click Commands */}
        <CollapsibleSection title={LANG['left_click_commands'] || 'Left Click Commands'} nested>
          {(itemData.left_click_commands || []).map((cmd, index) => (
            <div key={index} className="array-line">
              <input
                type="text"
                value={cmd}
                onChange={(e) => handleArrayChange('left_click_commands', index, e.target.value)}
                placeholder={`${LANG['command'] || 'Command'} ${index + 1}`}
              />
              <button onClick={() => removeArrayItem('left_click_commands', index)}>{LANG['remove'] || 'Remove'}</button>
            </div>
          ))}
          <button onClick={() => addArrayItem('left_click_commands')}>{LANG['add_command'] || 'Add Command'}</button>
        </CollapsibleSection>

        {/* Right Click Commands */}
        <CollapsibleSection title={LANG['right_click_commands'] || 'Right Click Commands'} nested>
          {(itemData.right_click_commands || []).map((cmd, index) => (
            <div key={index} className="array-line">
              <input
                type="text"
                value={cmd}
                onChange={(e) => handleArrayChange('right_click_commands', index, e.target.value)}
                placeholder={`${LANG['command'] || 'Command'} ${index + 1}`}
              />
              <button onClick={() => removeArrayItem('right_click_commands', index)}>{LANG['remove'] || 'Remove'}</button>
            </div>
          ))}
          <button onClick={() => addArrayItem('right_click_commands')}>{LANG['add_command'] || 'Add Command'}</button>
        </CollapsibleSection>

        {/* Middle Click Commands */}
        <CollapsibleSection title={LANG['middle_click_commands'] || 'Middle Click Commands'} nested>
          {(itemData.middle_click_commands || []).map((cmd, index) => (
            <div key={index} className="array-line">
              <input
                type="text"
                value={cmd}
                onChange={(e) => handleArrayChange('middle_click_commands', index, e.target.value)}
                placeholder={`${LANG['command'] || 'Command'} ${index + 1}`}
              />
              <button onClick={() => removeArrayItem('middle_click_commands', index)}>{LANG['remove'] || 'Remove'}</button>
            </div>
          ))}
          <button onClick={() => addArrayItem('middle_click_commands')}>{LANG['add_command'] || 'Add Command'}</button>
        </CollapsibleSection>

        {/* Shift Click Commands */}
        <CollapsibleSection title={LANG['shift_click_commands'] || 'Shift Click Commands'} nested>
          {/* Shift + Left */}
          <CollapsibleSection title={LANG['shift_left_click_commands'] || 'Shift + Left Click'} nested>
            {(itemData.shift_left_click_commands || []).map((cmd, index) => (
              <div key={index} className="array-line">
                <input
                  type="text"
                  value={cmd}
                  onChange={(e) => handleArrayChange('shift_left_click_commands', index, e.target.value)}
                  placeholder={`${LANG['command'] || 'Command'} ${index + 1}`}
                />
                <button onClick={() => removeArrayItem('shift_left_click_commands', index)}>{LANG['remove'] || 'Remove'}</button>
              </div>
            ))}
            <button onClick={() => addArrayItem('shift_left_click_commands')}>{LANG['add_command'] || 'Add Command'}</button>
          </CollapsibleSection>

          {/* Shift + Right */}
          <CollapsibleSection title={LANG['shift_right_click_commands'] || 'Shift + Right Click'} nested>
            {(itemData.shift_right_click_commands || []).map((cmd, index) => (
              <div key={index} className="array-line">
                <input
                  type="text"
                  value={cmd}
                  onChange={(e) => handleArrayChange('shift_right_click_commands', index, e.target.value)}
                  placeholder={`${LANG['command'] || 'Command'} ${index + 1}`}
                />
                <button onClick={() => removeArrayItem('shift_right_click_commands', index)}>{LANG['remove'] || 'Remove'}</button>
              </div>
            ))}
            <button onClick={() => addArrayItem('shift_right_click_commands')}>{LANG['add_command'] || 'Add Command'}</button>
          </CollapsibleSection>
        </CollapsibleSection>
      </CollapsibleSection>

      {/* Advanced Properties */}
      <CollapsibleSection title={LANG['Advanced Properties']}>
        <div className="field-group">
          <label>{LANG['custom_model_data']}</label>
          <input
            type="number"
            value={itemData.nbt_data?.CustomModelData || ''}
            onChange={(e) => handleChange('nbt_data.CustomModelData', parseInt(e.target.value))}
            placeholder="1"
        />
      </div>

        <div className="field-group">
          <label>{LANG['durability']}</label>
          <input
            type="number"
            value={itemData.durability || ''}
            onChange={(e) => handleChange('durability', parseInt(e.target.value))}
            placeholder="-1"
          />
    </div>

        {/* Color options for leather armor */}
        {itemData.material?.includes('LEATHER_') && (
          <>
            <div className="field-group">
              <label>{LANG['base_color']}</label>
              <input
                type="text"
                value={itemData.base_color || ''}
                onChange={(e) => handleChange('base_color', e.target.value)}
                placeholder="RED"
              />
            </div>
            <div className="field-group">
              <label>{LANG['rgb']}</label>
        <input
          type="text"
                value={itemData.rgb || ''}
                onChange={(e) => handleChange('rgb', e.target.value)}
                placeholder="255,0,0"
        />
      </div>
          </>
        )}

        {/* Entity type for spawn eggs */}
        {itemData.material?.includes('SPAWN_EGG') && (
          <div className="field-group">
            <label>{LANG['entity_type']}</label>
        <input
          type="text"
              value={itemData.entity_type || ''}
              onChange={(e) => handleChange('entity_type', e.target.value)}
              placeholder="ZOMBIE"
        />
      </div>
        )}

        {/* Banner patterns */}
        {itemData.material?.includes('BANNER') && (
          <div className="field-group">
            <label>{LANG['banner_patterns']}</label>
        <textarea
              value={itemData.banner_patterns?.map(p => `${p.pattern}:${p.color}`).join('\n') || ''}
              onChange={(e) => {
                const patterns = e.target.value.split('\n')
                  .filter(line => line.trim())
                  .map(line => {
                    const [pattern, color] = line.split(':').map(s => s.trim());
                    return { pattern, color };
                  });
                handleChange('banner_patterns', patterns);
              }}
              placeholder="STRIPE_TOP:RED&#10;STRIPE_BOTTOM:BLACK"
              rows="4"
            />
          </div>
        )}

        {/* Player head options */}
        {itemData.material === 'PLAYER_HEAD' && (
          <>
            <div className="field-group">
              <label>{LANG['head_owner']}</label>
              <input
                type="text"
                value={itemData.head_owner || ''}
                onChange={(e) => handleChange('head_owner', e.target.value)}
                placeholder="Notch"
        />
      </div>
            <div className="field-group">
              <label>{LANG['head_texture']}</label>
        <textarea
                value={itemData.head_texture || ''}
                onChange={(e) => handleChange('head_texture', e.target.value)}
                placeholder="eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA..."
                rows="4"
              />
            </div>
          </>
        )}

        {/* Plugin Integrations */}
        <div className="field-group">
          <label>{LANG['head_database_id']}</label>
          <input
            type="text"
            value={itemData.head_database_id || ''}
            onChange={(e) => handleChange('head_database_id', e.target.value)}
            placeholder="12345"
        />
      </div>

        <div className="field-group">
          <label>{LANG['items_adder_id']}</label>
          <input
            type="text"
            value={itemData.items_adder_id || ''}
            onChange={(e) => handleChange('items_adder_id', e.target.value)}
            placeholder="namespace:item_id"
          />
    </div>

        <div className="field-group">
          <label>{LANG['oraxen_id']}</label>
          <input
            type="text"
            value={itemData.oraxen_id || ''}
            onChange={(e) => handleChange('oraxen_id', e.target.value)}
            placeholder="item_id"
        />
      </div>

        {/* NBT Data */}
        <div className="field-group">
          <label>{LANG['nbt_data']}</label>
        <textarea
            value={itemData.nbt ? JSON.stringify(itemData.nbt, null, 2) : ''}
            onChange={(e) => handleNBTChange(e.target.value)}
            placeholder='{"key": "value"}'
            rows="4"
        />
      </div>

        {/* Enchantments */}
        <div className="field-group">
          <label>{LANG['enchantments']}</label>
        <textarea
            value={itemData.enchantments?.map(e => `${e.enchantment}:${e.level}`).join('\n') || ''}
            onChange={(e) => handleEnchantmentChange(e.target.value)}
            placeholder="DAMAGE_ALL:1&#10;DURABILITY:3"
            rows="4"
        />
      </div>

        {/* Item Flags */}
        <div className="field-group">
          <label>{LANG['item_flags']}</label>
          {itemFlags.map(flag => (
            <div key={flag} className="checkbox-group">
              <input
                type="checkbox"
                id={flag}
                checked={!!itemData.item_flags?.includes(flag)}
                onChange={(e) => {
                  const flags = new Set(itemData.item_flags || []);
                  if (e.target.checked) {
                    flags.add(flag);
                  } else {
                    flags.delete(flag);
                  }
                  handleChange('item_flags', Array.from(flags));
                }}
              />
              <label htmlFor={flag}>{flag}</label>
            </div>
          ))}
        </div>

        <div className="field-group">
          <label>
            <input
              type="checkbox"
              checked={!!itemData.unbreakable}
              onChange={(e) => handleChange('unbreakable', e.target.checked)}
            />
            {LANG['unbreakable']}
          </label>
        </div>
      </CollapsibleSection>

      {/* Update Settings */}
      <CollapsibleSection title={LANG['Update Settings']}>
        <div className="field-group">
          <label>
            <input
              type="checkbox"
              checked={!!itemData.update}
              onChange={(e) => handleChange('update', e.target.checked)}
            />
            {LANG['update']}
          </label>
    </div>

        <div className="field-group">
          <label>{LANG['update_interval']}</label>
          <input
            type="number"
            value={itemData.update_interval || 20}
            onChange={(e) => handleChange('update_interval', parseInt(e.target.value))}
            min="1"
            placeholder="20"
          />
      </div>

        <div className="field-group">
          <label>{LANG['priority']}</label>
          <input
            type="number"
            value={itemData.priority || 0}
            onChange={(e) => handleChange('priority', parseInt(e.target.value))}
            min="0"
            placeholder="0"
          />
      </div>
      </CollapsibleSection>
    </div>
  );
};

export default ItemOptionsPanel; 