import React from 'react';

export const RequirementFields = ({ requirement, onChange }) => {
  if (!requirement) return null;

  const updateField = (field, value) => {
    const updatedReq = { ...requirement };
    updatedReq[field] = value;
    onChange(updatedReq);
  };

  switch (requirement.type) {
    case 'has permission':
      return (
        <div className="requirement-fields">
          <input
            type="text"
            placeholder="Permission node"
            value={requirement.permission || ''}
            onChange={(e) => updateField('permission', e.target.value)}
          />
        </div>
      );

    case 'has money':
      return (
        <div className="requirement-fields">
          <input
            type="number"
            placeholder="Amount"
            value={requirement.amount || ''}
            onChange={(e) => updateField('amount', parseFloat(e.target.value))}
          />
        </div>
      );

    case 'has item':
      return (
        <div className="requirement-fields">
          <input
            type="text"
            placeholder="Material"
            value={requirement.material || ''}
            onChange={(e) => updateField('material', e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={requirement.amount || ''}
            onChange={(e) => updateField('amount', parseInt(e.target.value))}
          />
          <input
            type="text"
            placeholder="Name (optional)"
            value={requirement.name || ''}
            onChange={(e) => updateField('name', e.target.value)}
          />
          <textarea
            placeholder="Lore (one line per entry)"
            value={requirement.lore ? requirement.lore.join('\n') : ''}
            onChange={(e) => updateField('lore', e.target.value.split('\n'))}
          />
          <label>
            <input
              type="checkbox"
              checked={requirement.name_contains || false}
              onChange={(e) => updateField('name_contains', e.target.checked)}
            />
            Name contains
          </label>
          <label>
            <input
              type="checkbox"
              checked={requirement.lore_contains || false}
              onChange={(e) => updateField('lore_contains', e.target.checked)}
            />
            Lore contains
          </label>
        </div>
      );

    case 'has meta':
      return (
        <div className="requirement-fields">
          <input
            type="text"
            placeholder="Key"
            value={requirement.key || ''}
            onChange={(e) => updateField('key', e.target.value)}
          />
          <select
            value={requirement.meta_type || ''}
            onChange={(e) => updateField('meta_type', e.target.value)}
          >
            <option value="">Select type...</option>
            <option value="STRING">String</option>
            <option value="BOOLEAN">Boolean</option>
            <option value="DOUBLE">Double</option>
            <option value="LONG">Long</option>
            <option value="INTEGER">Integer</option>
          </select>
          <input
            type="text"
            placeholder="Value"
            value={requirement.value || ''}
            onChange={(e) => updateField('value', e.target.value)}
          />
        </div>
      );

    case 'has exp':
      return (
        <div className="requirement-fields">
          <input
            type="number"
            placeholder="Amount"
            value={requirement.amount || ''}
            onChange={(e) => updateField('amount', parseInt(e.target.value))}
          />
          <label>
            <input
              type="checkbox"
              checked={requirement.level || false}
              onChange={(e) => updateField('level', e.target.checked)}
            />
            Check for levels instead of points
          </label>
        </div>
      );

    case 'is near':
      return (
        <div className="requirement-fields">
          <input
            type="text"
            placeholder="Location (world,x,y,z)"
            value={requirement.location || ''}
            onChange={(e) => updateField('location', e.target.value)}
          />
          <input
            type="number"
            placeholder="Distance"
            value={requirement.distance || ''}
            onChange={(e) => updateField('distance', parseFloat(e.target.value))}
          />
        </div>
      );

    case 'javascript':
      return (
        <div className="requirement-fields">
          <textarea
            placeholder="JavaScript expression"
            value={requirement.expression || ''}
            onChange={(e) => updateField('expression', e.target.value)}
          />
        </div>
      );

    case 'string equals':
    case 'string equals ignorecase':
    case 'string contains':
      return (
        <div className="requirement-fields">
          <input
            type="text"
            placeholder="Input"
            value={requirement.input || ''}
            onChange={(e) => updateField('input', e.target.value)}
          />
          <input
            type="text"
            placeholder="Output"
            value={requirement.output || ''}
            onChange={(e) => updateField('output', e.target.value)}
          />
        </div>
      );

    case 'regex matches':
      return (
        <div className="requirement-fields">
          <input
            type="text"
            placeholder="Input"
            value={requirement.input || ''}
            onChange={(e) => updateField('input', e.target.value)}
          />
          <input
            type="text"
            placeholder="Regex pattern"
            value={requirement.regex || ''}
            onChange={(e) => updateField('regex', e.target.value)}
          />
        </div>
      );

    default:
      if (requirement.type && ['==', '>=', '<=', '!=', '>', '<'].includes(requirement.type)) {
        return (
          <div className="requirement-fields">
            <input
              type="text"
              placeholder="Input"
              value={requirement.input || ''}
              onChange={(e) => updateField('input', e.target.value)}
            />
            <input
              type="text"
              placeholder="Output"
              value={requirement.output || ''}
              onChange={(e) => updateField('output', e.target.value)}
            />
          </div>
        );
      }
      return null;
  }
}; 