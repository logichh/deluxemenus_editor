import React, { useState } from 'react';
import { Tooltip } from 'react-tooltip';

const CollapsibleSection = ({ title = 'Section', children, tooltip, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const sectionId = `section-${(typeof title === 'string' ? title : 'section').toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="collapsible-section">
      <div 
        className="collapsible-header"
        onClick={() => setIsOpen(!isOpen)}
        data-tooltip-id={sectionId}
        data-tooltip-content={tooltip}
      >
        <h3>
          <span className={`arrow ${isOpen ? 'open' : ''}`}></span>
          {title}
        </h3>
      </div>
      <Tooltip id={sectionId} />
      <div className={`collapsible-content ${isOpen ? 'open' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default CollapsibleSection; 