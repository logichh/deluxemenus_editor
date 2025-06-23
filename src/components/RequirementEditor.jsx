import React, { useState, useEffect } from 'react';
import './RequirementEditor.css';

const RequirementEditor = ({ requirement, onUpdate, LANG }) => {
  const [data, setData] = useState({
    type: 'has permission',
    permission: '',
    deny_commands: [],
    expression: ''
  });

  useEffect(() => {
    if (requirement) {
      setData(prev => ({
        ...prev,
        ...requirement,
        deny_commands: requirement.deny_commands || []
      }));
    }
  }, [requirement]);

  const handleChange = (field, value) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onUpdate(newData);
  };

  const handleDenyCommandChange = (index, value) => {
    const newCommands = [...data.deny_commands];
    newCommands[index] = value;
    handleChange('deny_commands', newCommands);
  };

  const addDenyCommand = () => {
    handleChange('deny_commands', [...data.deny_commands, '']);
  };

  const removeDenyCommand = (index) => {
    const newCommands = data.deny_commands.filter((_, i) => i !== index);
    handleChange('deny_commands', newCommands);
  };

  const requirementTypes = [
    { id: 'has permission', name: LANG.requirement_permission || 'Permission' },
    { id: 'javascript', name: LANG.requirement_javascript || 'JavaScript Expression' }
  ];

  return (
    <div className="requirement-editor">
      <div className="form-group">
        <label>{LANG.requirement_type || 'Requirement Type'}</label>
        <select
          value={data.type}
          onChange={(e) => handleChange('type', e.target.value)}
        >
          {requirementTypes.map(type => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      {data.type === 'has permission' && (
        <div className="form-group">
          <label>{LANG.requirement_permission || 'Permission'}</label>
          <input
            type="text"
            value={data.permission}
            onChange={(e) => handleChange('permission', e.target.value)}
            placeholder="perm.example"
          />
        </div>
      )}

      {data.type === 'javascript' && (
        <div className="form-group">
          <label>{LANG.requirement_javascript || 'JavaScript Expression'}</label>
          <input
            type="text"
            value={data.expression}
            onChange={(e) => handleChange('expression', e.target.value)}
            placeholder="%checkitem_amount_namecontains:Fire Dust% >= 1"
          />
        </div>
      )}

      <div className="form-group">
        <label>{LANG.deny_commands || 'Deny Commands'}</label>
        {data.deny_commands.map((cmd, index) => (
          <div key={index} className="command-line">
            <input
              type="text"
              value={cmd}
              onChange={(e) => handleDenyCommandChange(index, e.target.value)}
              placeholder={`${LANG.command_value || 'Command'} ${index + 1}`}
            />
            <button onClick={() => removeDenyCommand(index)}>
              {LANG.button_Remove_row || 'Remove'}
            </button>
          </div>
        ))}
        <button onClick={addDenyCommand}>
          {LANG.button_Add_row || 'Add Command'}
        </button>
      </div>
    </div>
  );
};

export default RequirementEditor; 