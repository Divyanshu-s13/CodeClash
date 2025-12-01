import React, { useState, useEffect } from 'react';
import './PageTransition.css';
import codeClashLogo from '../assets/codeClashLogo.png';

const PageTransition = ({ isTransitioning, onTransitionComplete, children }) => {
  const [phase, setPhase] = useState('idle'); // idle, closing, closed, opening, complete

  useEffect(() => {
    if (isTransitioning) {
      // Immediately set closing to prevent any flash
      setPhase('closing');
      
      // Phase 2: Pause at center (2000-4500ms) - 2.5 seconds pause for navigation
      const closedTimer = setTimeout(() => {
        setPhase('closed');
      }, 2000);

      // Phase 3: Doors open (4500-6000ms) - After navigation completes
      const openingTimer = setTimeout(() => {
        setPhase('opening');
      }, 4500);

      // Phase 4: Complete (6000ms)
      const completeTimer = setTimeout(() => {
        setPhase('complete');
        if (onTransitionComplete) {
          onTransitionComplete();
        }
      }, 6000);

      return () => {
        clearTimeout(closedTimer);
        clearTimeout(openingTimer);
        clearTimeout(completeTimer);
      };
    } else {
      setPhase('idle');
    }
  }, [isTransitioning, onTransitionComplete]);

  if (phase === 'idle' || phase === 'complete') {
    return <>{children}</>;
  }

  return (
    <>
      {/* Keep current page visible during closing phase */}
      <div style={{ 
        visibility: (phase === 'closing' || phase === 'idle') ? 'visible' : 'hidden',
        position: 'relative',
        zIndex: 1
      }}>
        {children}
      </div>
      
      <div className={`page-transition-overlay ${phase}`}>
        {/* Left Door */}
        <div className={`steel-door left-door ${phase}`}>
          <div className="door-texture"></div>
          <div className="door-edge-glow"></div>
          <div className="door-highlights"></div>
          <div className="logo-half left-half">
            <img src={codeClashLogo} alt="Logo Left" />
          </div>
        </div>

        {/* Right Door */}
        <div className={`steel-door right-door ${phase}`}>
          <div className="door-texture"></div>
          <div className="door-edge-glow"></div>
          <div className="door-highlights"></div>
          <div className="logo-half right-half">
            <img src={codeClashLogo} alt="Logo Right" />
          </div>
        </div>

        {/* Center Seam Fog Glow */}
        <div className={`center-seam-glow ${phase}`}></div>
      </div>
    </>
  );
};

export default PageTransition;
