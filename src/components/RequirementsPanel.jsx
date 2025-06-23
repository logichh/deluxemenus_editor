import React from 'react';
import CollapsibleSection from './CollapsibleSection';

const RequirementsPanel = ({ requirements, onUpdate, LANG }) => {
  const requirementTypes = [
    { value: 'has permission', label: 'Has Permission' },
    { value: 'has money', label: 'Has Money' },
    { value: 'has item', label: 'Has Item' },
    { value: 'has meta', label: 'Has Meta' },
    { value: 'has exp', label: 'Has Exp' },
    { value: 'is near', label: 'Is Near' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'string equals', label: 'String Equals' },
    { value: 'string equals ignorecase', label: 'String Equals (Ignore Case)' },
    { value: 'string contains', label: 'String Contains' },
    { value: 'regex matches', label: 'Regex Matches' },
    { value: '==', label: 'Equal to (==)' },
    { value: '>=', label: 'Greater than or equal to (>=)' },
    { value: '<=', label: 'Less than or equal to (<=)' },
    { value: '!=', label: 'Not equal to (!=)' },
    { value: '>', label: 'Greater than (>)' },
    { value: '<', label: 'Less than (<)' }
  ];

  const clickTypes = [
    'left_click',
    'right_click',
    'middle_click',
    'shift_left_click',
    'shift_right_click',
    'number_key',
    'double_click',
    'drag'
  ];

  const handleRequirementChange = (type, field, value) => {
    onUpdate({
      ...requirements,
      [type]: {
        ...(requirements[type] || {}),
        [field]: value
      }
    });
  };

  const handleCommandsChange = (type, field, value) => {
    onUpdate({
      ...requirements,
      [type]: {
        ...(requirements[type] || {}),
        [field]: value.split('\n').filter(line => line.trim() !== '')
      }
    });
  };

  const renderRequirementFields = (type) => {
    const requirement = requirements[type] || {};
    
    return (
      <div className="requirement-group">
        <h4>{type}</h4>
        <select 
          className="requirement-type-select"
          value={requirement.type || ''}
          onChange={(e) => handleRequirementChange(type, 'type', e.target.value)}
          aria-label="Select requirement type"
        >
          <option value="">Select type...</option>
          {requirementTypes.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        {requirement.type && (
            <div className="requirement-fields">
              {requirement.type === 'has permission' && (
                <div className="option-field">
                <label>Permission</label>
                  <input
                    type="text"
                    value={requirement.permission || ''}
                    onChange={(e) => handleRequirementChange(type, 'permission', e.target.value)}
                    placeholder="Permission node"
                  />
                </div>
              )}

              {requirement.type === 'has money' && (
                <div className="option-field">
                <label>Amount</label>
                  <input
                    type="number"
                  value={requirement.amount || 0}
                    onChange={(e) => handleRequirementChange(type, 'amount', parseFloat(e.target.value))}
                    step="0.01"
                    min="0"
                  placeholder="Amount of money"
                  />
                </div>
              )}

              {requirement.type === 'has item' && (
                <>
                  <div className="option-field">
                  <label>Material</label>
                    <input
                      type="text"
                      value={requirement.material || ''}
                      onChange={(e) => handleRequirementChange(type, 'material', e.target.value)}
                    placeholder="Material (e.g. DIAMOND)"
                    />
                  </div>
                  <div className="option-field">
                  <label>Amount</label>
                    <input
                      type="number"
                    value={requirement.amount || 1}
                      onChange={(e) => handleRequirementChange(type, 'amount', parseInt(e.target.value))}
                      min="1"
                    placeholder="Amount"
                    />
                  </div>
                  <div className="option-field">
                  <label>Item Name</label>
                    <input
                      type="text"
                      value={requirement.name || ''}
                      onChange={(e) => handleRequirementChange(type, 'name', e.target.value)}
                    placeholder="Item name (optional)"
                    />
                  </div>
                  <div className="option-field">
                  <label>Lore</label>
                    <textarea
                      value={requirement.lore?.join('\n') || ''}
                      onChange={(e) => handleRequirementChange(type, 'lore', e.target.value.split('\n'))}
                      placeholder="Item lore (one per line)"
                    />
                  </div>
                <div className="option-field">
                  <label>Custom Model Data</label>
                  <input
                    type="number"
                    value={requirement.modeldata || ''}
                    onChange={(e) => handleRequirementChange(type, 'modeldata', parseInt(e.target.value))}
                    placeholder="Custom model data"
                  />
                </div>
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={requirement.name_contains || false}
                      onChange={(e) => handleRequirementChange(type, 'name_contains', e.target.checked)}
                    />
                    Name contains (partial match)
                  </label>
                </div>
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={requirement.name_ignorecase || false}
                      onChange={(e) => handleRequirementChange(type, 'name_ignorecase', e.target.checked)}
                    />
                    Ignore case for name
                  </label>
                </div>
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={requirement.lore_contains || false}
                      onChange={(e) => handleRequirementChange(type, 'lore_contains', e.target.checked)}
                    />
                    Lore contains (partial match)
                  </label>
                </div>
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={requirement.strict || false}
                      onChange={(e) => handleRequirementChange(type, 'strict', e.target.checked)}
                    />
                    Strict matching
                  </label>
                </div>
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={requirement.armor || false}
                      onChange={(e) => handleRequirementChange(type, 'armor', e.target.checked)}
                    />
                    Check armor slots
                  </label>
                </div>
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={requirement.offhand || false}
                      onChange={(e) => handleRequirementChange(type, 'offhand', e.target.checked)}
                    />
                    Check off hand
                  </label>
                </div>
                </>
              )}

              {requirement.type === 'has meta' && (
                <>
                  <div className="option-field">
                  <label>Meta Key</label>
                    <input
                      type="text"
                      value={requirement.key || ''}
                      onChange={(e) => handleRequirementChange(type, 'key', e.target.value)}
                      placeholder="Meta key"
                    />
                  </div>
                  <div className="option-field">
                  <label>Meta Type</label>
                    <select
                      value={requirement.meta_type || ''}
                      onChange={(e) => handleRequirementChange(type, 'meta_type', e.target.value)}
                    >
                      <option value="">Select type...</option>
                      <option value="STRING">String</option>
                      <option value="BOOLEAN">Boolean</option>
                      <option value="DOUBLE">Double</option>
                      <option value="LONG">Long</option>
                      <option value="INTEGER">Integer</option>
                    </select>
                  </div>
                  <div className="option-field">
                  <label>Meta Value</label>
                    <input
                      type="text"
                      value={requirement.value || ''}
                      onChange={(e) => handleRequirementChange(type, 'value', e.target.value)}
                      placeholder="Meta value"
                    />
                  </div>
                </>
              )}

              {requirement.type === 'has exp' && (
                <>
                  <div className="option-field">
                  <label>Amount</label>
                    <input
                      type="number"
                    value={requirement.amount || 0}
                      onChange={(e) => handleRequirementChange(type, 'amount', parseInt(e.target.value))}
                      min="0"
                    placeholder="Experience amount"
                    />
                  </div>
                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={requirement.level || false}
                        onChange={(e) => handleRequirementChange(type, 'level', e.target.checked)}
                      />
                    Check for levels instead of points
                    </label>
                  </div>
                </>
              )}

              {requirement.type === 'is near' && (
                <>
                  <div className="option-field">
                  <label>Location</label>
                    <input
                      type="text"
                      value={requirement.location || ''}
                      onChange={(e) => handleRequirementChange(type, 'location', e.target.value)}
                    placeholder="Location (world,x,y,z)"
                    />
                  </div>
                  <div className="option-field">
                  <label>Distance</label>
                    <input
                      type="number"
                    value={requirement.distance || 0}
                      onChange={(e) => handleRequirementChange(type, 'distance', parseFloat(e.target.value))}
                      min="0"
                      step="0.1"
                    placeholder="Distance"
                    />
                  </div>
                </>
              )}

              {requirement.type === 'javascript' && (
                <div className="option-field">
                <label>JavaScript Expression</label>
                  <textarea
                    value={requirement.expression || ''}
                    onChange={(e) => handleRequirementChange(type, 'expression', e.target.value)}
                    placeholder="JavaScript expression that returns true/false"
                  />
                </div>
              )}

              {(requirement.type === 'string equals' || 
                requirement.type === 'string equals ignorecase' || 
                requirement.type === 'string contains') && (
                <>
                  <div className="option-field">
                  <label>Input</label>
                    <input
                      type="text"
                      value={requirement.input || ''}
                      onChange={(e) => handleRequirementChange(type, 'input', e.target.value)}
                      placeholder="Input text or placeholder"
                    />
                  </div>
                  <div className="option-field">
                  <label>Output</label>
                    <input
                      type="text"
                      value={requirement.output || ''}
                      onChange={(e) => handleRequirementChange(type, 'output', e.target.value)}
                      placeholder="Text to match"
                    />
                  </div>
                </>
              )}

              {requirement.type === 'regex matches' && (
                <>
                  <div className="option-field">
                  <label>Input</label>
                    <input
                      type="text"
                      value={requirement.input || ''}
                      onChange={(e) => handleRequirementChange(type, 'input', e.target.value)}
                      placeholder="Input text or placeholder"
                    />
                  </div>
                  <div className="option-field">
                  <label>Regex Pattern</label>
                    <input
                      type="text"
                      value={requirement.regex || ''}
                      onChange={(e) => handleRequirementChange(type, 'regex', e.target.value)}
                      placeholder="Regular expression pattern"
                    />
                  </div>
                </>
              )}

              {['==', '>=', '<=', '!=', '>', '<'].includes(requirement.type) && (
                <>
                  <div className="option-field">
                  <label>Input</label>
                  <input
                    type="text"
                    value={requirement.input || ''}
                    onChange={(e) => handleRequirementChange(type, 'input', e.target.value)}
                    placeholder="Input value or placeholder"
                  />
                </div>
                <div className="option-field">
                  <label>Output</label>
                    <input
                    type="text"
                    value={requirement.output || ''}
                    onChange={(e) => handleRequirementChange(type, 'output', e.target.value)}
                    placeholder="Value to compare against"
                    />
                  </div>
                </>
              )}

            {/* Common fields for all requirement types */}
              <div className="option-field">
              <label>Success Commands</label>
                <textarea
                  value={requirement.success_commands?.join('\n') || ''}
                onChange={(e) => handleCommandsChange(type, 'success_commands', e.target.value)}
                placeholder="Success commands (one per line)"
                />
              </div>

              <div className="option-field">
              <label>Deny Commands</label>
                <textarea
                  value={requirement.deny_commands?.join('\n') || ''}
                onChange={(e) => handleCommandsChange(type, 'deny_commands', e.target.value)}
                placeholder="Deny commands (one per line)"
                />
              </div>

              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={requirement.optional || false}
                    onChange={(e) => handleRequirementChange(type, 'optional', e.target.checked)}
                  />
                Optional
                </label>
              </div>
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="requirements-section">
      {clickTypes.map(clickType => (
        <CollapsibleSection key={clickType} title={LANG[clickType] || clickType.replace(/_/g, ' ').toUpperCase()}>
          {renderRequirementFields(clickType)}
      </CollapsibleSection>
      ))}

      <CollapsibleSection title={LANG['Global Requirements']}>
        <div className="requirement-group">
          <div className="option-field">
            <label>{LANG['minimum_requirements']}</label>
            <input
              type="number"
              value={requirements.minimum_requirements || 0}
              onChange={(e) => handleRequirementChange('minimum_requirements', 'value', parseInt(e.target.value))}
              min="0"
            />
          </div>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={requirements.stop_at_success || false}
                onChange={(e) => handleRequirementChange('stop_at_success', 'value', e.target.checked)}
              />
              {LANG['stop_at_success']}
            </label>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default RequirementsPanel; 