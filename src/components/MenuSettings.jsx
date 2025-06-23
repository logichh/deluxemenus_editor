import React from 'react';
import CollapsibleSection from './CollapsibleSection';

const MenuSettings = ({ config, onUpdate, LANG }) => {
  const handleInputChange = (field, value) => {
    onUpdate({
      ...config,
      [field]: value
    });
  };

  return (
    <div className="options-panel">
      <CollapsibleSection title={LANG['Menu info']}>
        <div className="option-group">
          <div className="option-field">
            <label>{LANG['menu_title']}</label>
            <input
              type="text"
              value={config.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="&6My Menu"
            />
          </div>
          <div className="option-field">
            <label>{LANG['open_command']}</label>
            <input
              type="text"
              value={config.open_command || ''}
              onChange={(e) => handleInputChange('open_command', e.target.value)}
              placeholder="/mymenu"
            />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title={LANG['Menu Requirements']}>
        <div className="requirements-section">
          <div className="requirement-group">
            <div className="option-field">
              <label>{LANG['minimum_requirements']}</label>
              <input
                type="number"
                value={config.minimum_requirements || 0}
                onChange={(e) => handleInputChange('minimum_requirements', parseInt(e.target.value))}
                min="0"
              />
            </div>
            <div className="option-field">
              <label>
                <input
                  type="checkbox"
                  checked={config.stop_at_success || false}
                  onChange={(e) => handleInputChange('stop_at_success', e.target.checked)}
                />
                {LANG['stop_at_success']}
              </label>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title={LANG['Menu Commands']}>
        <div className="click-commands-section">
          <div className="click-type-group">
            <h4>{LANG['open_commands']}</h4>
            <textarea
              value={config.open_commands?.join('\n') || ''}
              onChange={(e) => handleInputChange('open_commands', e.target.value.split('\n'))}
              placeholder="Commands to execute when menu opens"
            />
          </div>
          <div className="click-type-group">
            <h4>{LANG['close_commands']}</h4>
            <textarea
              value={config.close_commands?.join('\n') || ''}
              onChange={(e) => handleInputChange('close_commands', e.target.value.split('\n'))}
              placeholder="Commands to execute when menu closes"
            />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title={LANG['Menu Options']}>
        <div className="option-group">
          <div className="option-field">
            <label>{LANG['update_interval']}</label>
            <input
              type="number"
              value={config.update_interval || ''}
              onChange={(e) => handleInputChange('update_interval', parseInt(e.target.value))}
              min="1"
              placeholder="Update interval in ticks"
            />
          </div>
          <div className="option-field">
            <label>
              <input
                type="checkbox"
                checked={config.register_command || false}
                onChange={(e) => handleInputChange('register_command', e.target.checked)}
              />
              {LANG['register_command']}
            </label>
          </div>
        </div>
      </CollapsibleSection>

      {config.register_command && (
        <CollapsibleSection title={LANG['Command Arguments']}>
          <div className="option-group">
            <div className="option-field">
              <label>{LANG['args']}</label>
              <textarea
                value={config.args?.join('\n') || ''}
                onChange={(e) => handleInputChange('args', e.target.value.split('\n'))}
                placeholder="One argument per line"
              />
            </div>
            <div className="option-field">
              <label>{LANG['args_usage_message']}</label>
              <input
                type="text"
                value={config.args_usage_message || ''}
                onChange={(e) => handleInputChange('args_usage_message', e.target.value)}
                placeholder="Usage message for arguments"
              />
            </div>
          </div>
        </CollapsibleSection>
      )}
    </div>
  );
};

export default MenuSettings; 