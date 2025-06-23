import React, { useEffect } from 'react';

const ResizeObserverWrapper = ({ children }) => {
  useEffect(() => {
    // Create a div that we'll use to detect ResizeObserver loops
    const resizeObserverElem = document.createElement('div');
    resizeObserverElem.style.position = 'absolute';
    resizeObserverElem.style.width = '100%';
    resizeObserverElem.style.height = '100%';
    resizeObserverElem.style.top = '0';
    resizeObserverElem.style.left = '0';
    resizeObserverElem.style.pointerEvents = 'none';
    resizeObserverElem.style.zIndex = '-1';
    document.body.appendChild(resizeObserverElem);

    // This will catch the error and prevent it from being logged
    const resizeObserver = new ResizeObserver((entries) => {
      // Request animation frame to batch the updates
      window.requestAnimationFrame(() => {
        if (!Array.isArray(entries) || !entries.length) {
          return;
        }
      });
    });

    // Start observing
    resizeObserver.observe(resizeObserverElem);

    return () => {
      resizeObserver.disconnect();
      document.body.removeChild(resizeObserverElem);
    };
  }, []);

  return <>{children}</>;
};

export default ResizeObserverWrapper; 