// src/components/common/Tooltip.jsx
import React, { useState } from 'react';
import styles from './Tooltip.module.css';

/**
 * Reusable Tooltip Component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Element that triggers the tooltip
 * @param {string} props.content - Tooltip text content
 * @param {string} props.position - Tooltip position: 'top', 'bottom', 'left', 'right'
 * @param {number} props.delay - Delay before showing tooltip (ms)
 * @param {boolean} props.disabled - Disable tooltip
 * @param {string} props.className - Additional CSS classes
 */
const Tooltip = ({
  children,
  content,
  position = 'top',
  delay = 500,
  disabled = false,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const showTooltip = () => {
    if (disabled || !content) return;
    
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  if (disabled || !content) {
    return children;
  }

  return (
    <div 
      className={`${styles.tooltipContainer} ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <div className={`${styles.tooltip} ${styles[position]}`}>
          <div className={styles.tooltipContent}>
            {content}
          </div>
          <div className={styles.tooltipArrow} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;