import React from 'react';
import { Tooltip } from 'react-tooltip';

const FieldWithTooltip = ({ label, tooltip, children, id }) => {
  const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className="field-group">
      <label 
        htmlFor={fieldId}
        data-tooltip-id={fieldId}
        data-tooltip-content={tooltip}
      >
        {label}
        {tooltip && <span className="help-textimage.png">ⓘ</span>}
      </label>
      <Tooltip id={fieldId} />
      {React.cloneElement(children, { id: fieldId })}
    </div>
  );
};

export default FieldWithTooltip; 