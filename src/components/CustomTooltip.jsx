import React from 'react';

const CustomTooltip = ({ text }) => {
  if (!text) return null;
  return (
    <div className="custom-tooltip">
      {text}
    </div>
  );
};

const FieldWithTooltip = ({ label, tooltip, children }) => {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const tooltipRef = React.useRef(null);

  return (
    <div className="field-with-tooltip">
      <label>
        {label}
        {tooltip && (
          <span 
            className="help-icon"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            ref={tooltipRef}
          >
            ?
          </span>
        )}
      </label>
      {children}
      {showTooltip && tooltip && (
        <CustomTooltip text={tooltip} />
      )}
    </div>
  );
};

export { CustomTooltip, FieldWithTooltip }; 