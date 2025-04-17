import { useState, useRef, useEffect } from 'react';

export default function SpinTheWheel({ onSelectItem, items }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const wheelRef = useRef(null);
  
  // Use the items prop if provided, otherwise use gameplay twists from the design
  const segments = items || [
    { id: 1, name: "Push Attack", color: "#FF5757", emoji: "🎯" },
    { id: 2, name: "Double Dice", color: "#8A79FF", emoji: "🎲" },
    { id: 3, name: "Ghost Mode", color: "#4DC7FF", emoji: "👻" },
    { id: 4, name: "Reverse Ladder", color: "#00C2CB", emoji: "🔄" },
    { id: 5, name: "Trap Tile", color: "#FF7F51", emoji: "💣" },
    { id: 6, name: "Mystery Powerup", color: "#FFD700", emoji: "🎁" }
  ];
  
  // Angle for each segment
  const segmentAngle = 360 / segments.length;
  
  // Function to handle transition end
  const handleTransitionEnd = () => {
    if (spinning) {
      setSpinning(false);
      
      // Calculate which segment is at the top after spinning
      const normalizedRotation = rotation % 360;
      const segmentIndex = Math.floor(((360 - normalizedRotation) % 360) / segmentAngle);
      const selectedSegment = segments[segmentIndex % segments.length];
      
      setSelectedItem(selectedSegment);
      setShowResultPopup(true);
      
      // We'll call onSelectItem after the user clicks "Continue" in the popup
    }
  };
  
  // Handle continue button click
  const handleContinue = () => {
    setShowResultPopup(false);
    
    // Notify parent component of selection
    if (onSelectItem && selectedItem) {
      onSelectItem(selectedItem);
    }
  };
  
  // Listen for transition end
  useEffect(() => {
    const wheelElement = wheelRef.current;
    if (wheelElement) {
      wheelElement.addEventListener('transitionend', handleTransitionEnd);
      return () => {
        wheelElement.removeEventListener('transitionend', handleTransitionEnd);
      };
    }
  }, [rotation, spinning, segmentAngle, segments]);
  
  // Function to spin the wheel with enhanced animation
  const spinWheel = () => {
    if (spinning) return;
    
    setSpinning(true);
    setSelectedItem(null);
    
    // Generate a random number of complete rotations (5-8) - increased for longer spin
    const rotations = 5 + Math.floor(Math.random() * 4);
    
    // Generate a random segment to land on
    const randomSegmentIndex = Math.floor(Math.random() * segments.length);
    
    // Calculate the target rotation
    // We add a small offset to make sure it lands in the middle of the segment
    const baseAngle = randomSegmentIndex * segmentAngle;
    const offset = Math.random() * (segmentAngle * 0.8) + segmentAngle * 0.1;
    const targetRotation = rotation + (rotations * 360) + baseAngle + offset;
    
    // Set the new rotation
    setRotation(targetRotation);
  };
  
  // Create the wheel segments
  const renderSegments = () => {
    return segments.map((segment, index) => {
      const startAngle = index * segmentAngle;
      const endAngle = (index + 1) * segmentAngle;
      
      // Convert angles to radians for calculations
      const startRad = (startAngle - 90) * Math.PI / 180;
      const endRad = (endAngle - 90) * Math.PI / 180;
      
      // Calculate SVG path
      const radius = 150;
      const x1 = radius + radius * Math.cos(startRad);
      const y1 = radius + radius * Math.sin(startRad);
      const x2 = radius + radius * Math.cos(endRad);
      const y2 = radius + radius * Math.sin(endRad);
      
      // Large arc flag is 0 for angles < 180, 1 for angles > 180
      const largeArcFlag = segmentAngle > 180 ? 1 : 0;
      
      // Path for the segment
      const path = `M${radius},${radius} L${x1},${y1} A${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2} Z`;
      
      // Calculate position for the emoji/icon
      const iconAngle = startAngle + segmentAngle / 2;
      const iconRad = (iconAngle - 90) * Math.PI / 180;
      const iconRadius = radius * 0.58; // Position closer to the center at 58% from center
      const iconX = radius + iconRadius * Math.cos(iconRad);
      const iconY = radius + iconRadius * Math.sin(iconRad);
      
      // Calculate rotation for the text and icon to be oriented correctly
      let textRotation = iconAngle;
      if (textRotation > 90 && textRotation < 270) {
        textRotation = textRotation + 180;
      }
      
      // Create linear gradient ID for each segment with darker inner edge
      const gradientId = `segmentGradient${index}`;
      
      return (
        <g key={segment.id || index}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={segment.color} stopOpacity="0.85" />
              <stop offset="100%" stopColor={segment.color} stopOpacity="1" />
            </linearGradient>
          </defs>
          <path 
            d={path} 
            fill={`url(#${gradientId})`} 
            stroke="#111827" 
            strokeWidth="1.5" 
          />
          
          {/* Icon/Emoji */}
          <g transform={`translate(${iconX}, ${iconY})`}>
            <circle 
              cx="0" 
              cy="0" 
              r="16" 
              fill="white" 
              opacity="0.95" 
              stroke="#111827" 
              strokeWidth="1"
            />
            <text 
              x="0" 
              y="0" 
              dy="5" 
              textAnchor="middle" 
              fontSize="18" 
              fontWeight="bold"
              transform={`rotate(${textRotation - iconAngle})`}
            >
              {segment.emoji}
            </text>
          </g>
        </g>
      );
    });
  };

  // Define animation constants for the wheel
  const spinDuration = '6s'; // Increased duration for longer animation
  const spinTimingFunction = 'cubic-bezier(0.13, 0.99, 0.25, 1.02)'; // Custom easing function for realistic physics
  const spinDelay = '0s';

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-900 bg-opacity-85 rounded-2xl border border-indigo-700 shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Spin for Power-ups</h2>
      
      {/* Selected powerup display (now only shown in popup) */}
      
      <div className="relative w-80 h-80 mb-8">
        {/* Outer glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 blur-md opacity-30"></div>
        
        {/* Wheel */}
        <div className="relative w-full h-full">
          <svg 
            width="300" 
            height="300" 
            viewBox="0 0 300 300" 
            className="w-full h-full"
            style={{ 
              filter: 'drop-shadow(0px 4px 16px rgba(79, 70, 229, 0.45))',
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 
                `transform ${spinDuration} ${spinTimingFunction} ${spinDelay}` : 
                'none',
            }}
            ref={wheelRef}
          >
            <circle cx="150" cy="150" r="150" fill="#1e293b" stroke="#4338ca" strokeWidth="2" />
            {renderSegments()}
            
            {/* Center circle */}
            <circle cx="150" cy="150" r="38" fill="url(#centerGradient)" stroke="#111827" strokeWidth="2" />
            <defs>
              <linearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4338ca" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-500 border-2 border-white shadow-lg transform rotate-45"></div>
        </div>
        
        {/* Visual feedback when spinning */}
        {spinning && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 opacity-10 animate-pulse"></div>
        )}
      </div>
      
      {/* Spin button */}
      <button 
        className={`bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold py-3 px-10 rounded-full shadow-lg 
          hover:from-indigo-700 hover:to-blue-600 transform transition-all duration-200
          ${spinning ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105 hover:shadow-indigo-500/30'}`}
        onClick={spinWheel}
        disabled={spinning}
        style={{
          boxShadow: spinning ? 'none' : '0 4px 14px 0 rgba(79, 70, 229, 0.4)',
          letterSpacing: '0.05em'
        }}
      >
        <div className="flex items-center">
          {spinning ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Spinning...</span>
            </>
          ) : (
            <>
              <span className="mr-2">🚀</span>
              <span>Spin the Wheel</span>
            </>
          )}
        </div>
      </button>

      {/* Result popup */}
      {showResultPopup && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          <div className="bg-gray-900 rounded-2xl border-2 border-indigo-500 shadow-2xl p-8 max-w-md w-full mx-4 animate-bounce-in">
            <div className="flex flex-col items-center text-center">
              <div className="text-6xl mb-4">{selectedItem.emoji}</div>
              <h3 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                {selectedItem.name}
              </h3>
              <div className="bg-gray-800 px-5 py-3 rounded-lg mb-6 mt-2 text-gray-200">
                {selectedItem.description || "Use this power-up wisely!"}
              </div>
              
              <button 
                onClick={handleContinue}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 
                  text-white font-bold py-3 px-10 rounded-full shadow-lg transform transition-all duration-200 
                  hover:scale-105 hover:shadow-green-500/30 flex items-center"
                style={{
                  boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.4)',
                  letterSpacing: '0.05em'
                }}
              >
                <span>Continue</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}