import React from 'react';
import LANG from '../lang/english.json';

const RequirementFields = ({ requirement, onChange }) => {
  const handleChange = (field, value) => {
    onChange({
      ...requirement,
      [field]: value
    });
  };

  const renderFields = () => {
    switch (requirement.type) {
      case 'has permission':
      case '!has permission':
        return (
          <div className="requirement-fields">
            <label>{LANG.requirement_permission}</label>
            <input
              type="text"
              value={requirement.permission || ''}
              onChange={(e) => handleChange('permission', e.target.value)}
              placeholder="Permission node"
            />
          </div>
        );

      case 'has money':
        return (
          <div className="requirement-fields">
            <label>{LANG.requirement_money}</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={requirement.amount || ''}
              onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
              placeholder="Amount"
            />
          </div>
        );

      case 'has item':
        return (
          <div className="requirement-fields">
            <label>{LANG.requirement_item}</label>
            <input
              type="text"
              value={requirement.material || ''}
              onChange={(e) => handleChange('material', e.target.value)}
              placeholder="Material name"
            />
            <input
              type="number"
              min="1"
              max="64"
              value={requirement.amount || '1'}
              onChange={(e) => handleChange('amount', parseInt(e.target.value))}
              placeholder="Amount"
            />
            <input
              type="text"
              value={requirement.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Item name (optional)"
            />
            <textarea
              value={requirement.lore?.join('\n') || ''}
              onChange={(e) => handleChange('lore', e.target.value.split('\n').filter(line => line.trim()))}
              placeholder="Item lore (optional, one line per entry)"
            />
            <div className="item-flags">
              <label>
                <input
                  type="checkbox"
                  checked={requirement.check_meta || false}
                  onChange={(e) => handleChange('check_meta', e.target.checked)}
                />
                Check item meta data
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={requirement.check_amount || false}
                  onChange={(e) => handleChange('check_amount', e.target.checked)}
                />
                Check item amount
              </label>
            </div>
          </div>
        );

      case 'string contains':
      case 'string equals':
      case 'string equals ignorecase':
        return (
          <div className="requirement-fields">
            <label>{LANG.requirement_equals}</label>
            <input
              type="text"
              value={requirement.input || ''}
              onChange={(e) => handleChange('input', e.target.value)}
              placeholder="Input text or placeholder"
            />
            <input
              type="text"
              value={requirement.output || ''}
              onChange={(e) => handleChange('output', e.target.value)}
              placeholder="Text to match"
            />
            {requirement.type === 'string contains' && (
              <label>
                <input
                  type="checkbox"
                  checked={requirement.ignorecase || false}
                  onChange={(e) => handleChange('ignorecase', e.target.checked)}
                />
                Ignore case
              </label>
            )}
          </div>
        );

      case '>':
      case '>=':
      case '==':
      case '<=':
      case '<':
        return (
          <div className="requirement-fields">
            <label>Numeric Comparison</label>
            <input
              type="text"
              value={requirement.input || ''}
              onChange={(e) => handleChange('input', e.target.value)}
              placeholder="Input number or placeholder"
            />
            <input
              type="number"
              step="any"
              value={requirement.output || ''}
              onChange={(e) => handleChange('output', parseFloat(e.target.value))}
              placeholder="Number to compare"
            />
          </div>
        );

      case 'regex matches':
        return (
          <div className="requirement-fields">
            <label>{LANG.requirement_regex}</label>
            <input
              type="text"
              value={requirement.input || ''}
              onChange={(e) => handleChange('input', e.target.value)}
              placeholder="Input text or placeholder"
            />
            <input
              type="text"
              value={requirement.regex || ''}
              onChange={(e) => handleChange('regex', e.target.value)}
              placeholder="Regular expression pattern"
            />
          </div>
        );

      case 'javascript':
        return (
          <div className="requirement-fields">
            <label>{LANG.requirement_javascript}</label>
            <textarea
              value={requirement.expression || ''}
              onChange={(e) => handleChange('expression', e.target.value)}
              placeholder="JavaScript expression that returns true/false"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="requirement-container">
      {renderFields()}
      <div className="deny-commands">
        <label>{LANG.deny_commands}</label>
        <textarea
          value={requirement.deny_commands?.join('\n') || ''}
          onChange={(e) => handleChange('deny_commands', e.target.value.split('\n').filter(cmd => cmd.trim()))}
          placeholder="Commands to execute when requirement fails (one per line)"
        />
        <div className="command-delay">
          <label>{LANG.command_delay}</label>
          <input
            type="number"
            min="0"
            value={requirement.command_delay || '0'}
            onChange={(e) => handleChange('command_delay', parseInt(e.target.value))}
            placeholder="Delay in ticks"
          />
        </div>
      </div>
    </div>
  );
};

export default RequirementFields; 