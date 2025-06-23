import React, { useState } from 'react';

const CollapsibleSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="collapsible-section">
      <div 
        className="collapsible-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3>
          <span className={`arrow ${isOpen ? 'open' : ''}`}>▶</span>
          {typeof title === 'string' ? title : 'Section'}
        </h3>
      </div>
      <div className={`collapsible-content ${isOpen ? 'open' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default CollapsibleSection; 