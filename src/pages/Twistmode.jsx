import { useState, useEffect, useRef } from 'react';
import SpinTheWheel from '../components/SpinTheWheel';

export default function SnakesAndLaddersBoard() {
  // Board configuration
  const boardSize = 10;
  const [squareSize, setSquareSize] = useState(60);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [playerPositions, setPlayerPositions] = useState({ 1: 1, 2: 1 });
  const [diceValue, setDiceValue] = useState(null);
  const [gameMessage, setGameMessage] = useState("Roll the dice to start!");
  const [isRolling, setIsRolling] = useState(false);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [lastMove, setLastMove] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  
  // Animation states
  const [animatingPlayer, setAnimatingPlayer] = useState(null);
  const [animationPath, setAnimationPath] = useState([]);
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimerRef = useRef(null);
  
  // Player token emojis
  const playerEmojis = {
    1: "👽",
    2: "😈"
  };
  
  // Power-up related states
  const [activePowerUp, setActivePowerUp] = useState(null);
  const [showPowerWheel, setShowPowerWheel] = useState(false);
  const [powerupCounter, setPowerupCounter] = useState(0);
  
  // New UI states
  const [isPowerSliderOpen, setIsPowerSliderOpen] = useState(false);
  const [selectedPowerInfo, setSelectedPowerInfo] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Define snakes and ladders
  const snakes = {
    16: 6,
    46: 25,
    49: 11,
    62: 19,
    64: 60,
    74: 53,
    89: 68,
    92: 88,
    95: 75,
    99: 80
  };

  const ladders = {
    2: 38,
    7: 14,
    8: 31,
    15: 26,
    21: 42,
    28: 84,
    36: 44,
    51: 67,
    71: 91,
    78: 98
  };

  // Game stats
  const [stats, setStats] = useState({
    rolls: 0,
    snakeBites: { 1: 0, 2: 0 },
    laddersClimbed: { 1: 0, 2: 0 },
    powerupsUsed: { 1: 0, 2: 0 }
  });

  // Power-ups
  const powerUps = [
    { name: "Push Attack", emoji: "🎯", description: "Push opponent back 5 spaces", color: "from-green-400 to-green-600" },
    { name: "Double Dice", emoji: "🎲", description: "Roll value is doubled!", color: "from-purple-400 to-purple-600" },
    { name: "Ghost Mode", emoji: "👻", description: "Pass through snakes", color: "from-blue-400 to-blue-600" },
    { name: "Reverse Ladder", emoji: "🔁", description: "Use ladders backwards", color: "from-teal-400 to-teal-600" },
    { name: "Trap Tile", emoji: "💣", description: "Place a trap for your opponent", color: "from-red-400 to-red-600" },
    { name: "Mystery Powerup", emoji: "🎁", description: "Random helpful effect", color: "from-yellow-400 to-yellow-600" }
  ];

  // Check for mobile device and adjust square size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      
      // Adjust square size based on screen width
      if (width < 375) {
        setSquareSize(30); // Smallest screens
      } else if (width < 640) {
        setSquareSize(35); // Small mobile
      } else if (width < 768) {
        setSquareSize(40); // Larger mobile
      } else if (width < 1024) {
        setSquareSize(50); // Tablet
      } else {
        setSquareSize(60); // Desktop
      }
    };

    handleResize(); // Call once on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Increment power-up counter on every move and show wheel every 5 turns
  useEffect(() => {
    if (stats.rolls > 0 && stats.rolls % 5 === 0 && !showPowerWheel && !activePowerUp) {
      setShowPowerWheel(true);
    }
  }, [stats.rolls]);

  // Handle animation effect
  useEffect(() => {
    if (isAnimating && animationPath.length > 0) {
      if (animationStep < animationPath.length) {
        animationTimerRef.current = setTimeout(() => {
          setAnimationStep(prev => prev + 1);
        }, 300); // Animation speed: adjust for faster/slower movement
      } else {
        // Animation complete
        setIsAnimating(false);
        setAnimatingPlayer(null);
        // Complete the move process after animation
        finalizeMoveAfterAnimation();
      }
    }
    
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, [isAnimating, animationStep, animationPath]);

  // Generate a path for animation between two positions
  const generateAnimationPath = (start, end) => {
    const path = [];
    
    // If we hit a snake or ladder, we need to animate through intermediate positions
    if (Math.abs(end - start) > 6) {
      // This is a snake or ladder jump
      const directPath = [start, end];
      return directPath;
    } else {
      // Regular move with dice - create intermediate steps
      for (let i = start; i <= end; i++) {
        path.push(i);
      }
      return path;
    }
  };

  // Finalize move after animation completes
  const finalizeMoveAfterAnimation = () => {
    // Switch players
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    
    // Clear power-up after use
    if (activePowerUp) {
      setActivePowerUp(null);
    }
  };

  // Handle powerup selection
  const handlePowerupSelected = (powerup) => {
    setActivePowerUp(powerup);
    setShowPowerWheel(false);
    
    // Update stats
    setStats({
      ...stats,
      powerupsUsed: {
        ...stats.powerupsUsed,
        [currentPlayer]: stats.powerupsUsed[currentPlayer] + 1
      }
    });
    
    // Display message about powerup
    setGameMessage(`🎁 Player ${currentPlayer} activated ${powerup.name}! ${powerup.emoji}`);
  };

  // Get pixel coordinates for a position with flipped board
  const getPositionCoordinates = (position) => {
    const adjustedPosition = 101 - position;
    const row = Math.floor((adjustedPosition - 1) / boardSize);
    let col;
    
    if (row % 2 === 0) {
      col = (adjustedPosition - 1) % boardSize;
    } else {
      col = boardSize - 1 - ((adjustedPosition - 1) % boardSize);
    }
    
    const x = col * squareSize + squareSize / 2;
    const y = row * squareSize + squareSize / 2;
    
    return { x, y };
  };

  // Calculate winning probability
  const calculateWinningChance = (position) => {
    if (position >= 90) return "High";
    if (position >= 70) return "Medium";
    if (position >= 50) return "Low";
    return "Very Low";
  };

  // Define square colors
  const getSquareColor = (position) => {
    if (position === 100) return "bg-green-500";
    if (position === 1) return "bg-red-500";
    
    const colorOptions = [
      "bg-indigo-400", "bg-blue-400", "bg-purple-400", 
      "bg-pink-400", "bg-teal-400", "bg-amber-400"
    ];
    
    return colorOptions[(position + Math.floor(position/10)) % colorOptions.length];
  };

  // Create board
  const createBoard = () => {
    const board = [];
    
    for (let row = 0; row < boardSize; row++) {
      const rowSquares = [];
      
      for (let col = 0; col < boardSize; col++) {
        let position;
        const isEvenRow = row % 2 === 0;
        
        if (isEvenRow) {
          position = 100 - (row * boardSize) - col;
        } else {
          position = 100 - (row * boardSize) - (boardSize - col - 1);
        }
        
        rowSquares.push(createSquare(position, row, col));
      }
      
      board.push(
        <div key={row} className="flex">
          {rowSquares}
        </div>
      );
    }
    
    return board;
  };

  // Create individual square
  const createSquare = (number, row, col) => {
    const colorClass = getSquareColor(number);
    const isLastMove = lastMove === number;
    
    return (
      <div 
        key={number} 
        className={`flex items-center justify-center relative font-bold border border-gray-800
          ${colorClass} ${isLastMove ? 'ring-2 ring-white' : ''}`}
        style={{ width: squareSize, height: squareSize }}
      >
        <div className={`${isMobile ? 'text-sm' : 'text-xl'} font-bold text-gray-800`}>
          {number}
        </div>
        
        {renderPlayers(number)}
      </div>
    );
  };

  // Render player pieces
  const renderPlayers = (position) => {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        {Object.entries(playerPositions).map(([player, pos]) => {
          // Show fixed player position normally
          if (pos === position && !(animatingPlayer === parseInt(player))) {
            const isGhostMode = activePowerUp && activePowerUp.name === "Ghost Mode" && parseInt(player) === currentPlayer;
            
            return (
              <div 
                key={player}
                className={`${isMobile ? 'text-2xl' : 'text-3xl'} ${isGhostMode ? 'opacity-50' : ''} 
                  ${currentPlayer === parseInt(player) ? 'animate-bounce' : ''}`}
              >
                {playerEmojis[player]}
              </div>
            );
          }
          
          // Show animated player if this is one of the positions in the path
          if (animatingPlayer === parseInt(player) && 
              animationPath.length > 0 && 
              animationStep < animationPath.length && 
              animationPath[animationStep] === position) {
            
            return (
              <div 
                key={player}
                className={`${isMobile ? 'text-2xl' : 'text-3xl'} transition-all duration-300 animate-bounce`}
              >
                {playerEmojis[player]}
              </div>
            );
          }
          
          return null;
        })}
      </div>
    );
  };

  // Animate dice roll
  const animateDiceRoll = () => {
    setIsRolling(true);
    let rollCount = 0;
    const maxRolls = 10;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      if (rollCount >= maxRolls) {
        clearInterval(interval);
        setIsRolling(false);
        completeMove();
      }
    }, 100);
  };

  // Complete the move after dice animation
  const completeMove = () => {
    let newDiceValue = Math.floor(Math.random() * 6) + 1;
    
    // Apply "Double Dice" power-up
    if (activePowerUp && activePowerUp.name === "Double Dice") {
      newDiceValue *= 2;
      setGameMessage(`🎲 Double Dice power-up! Player ${currentPlayer} moves ${newDiceValue} spaces!`);
    }
    
    setDiceValue(newDiceValue);
    
    let newPosition = playerPositions[currentPlayer] + newDiceValue;
    const oldPosition = playerPositions[currentPlayer];
    const moveData = { player: currentPlayer, from: oldPosition, to: newPosition, dice: newDiceValue };
    
    // Check if player won
    if (newPosition >= 100) {
      newPosition = 100;
      setGameMessage(`🏆 Player ${currentPlayer} wins! 🏆`);
      
      // Create animation path to the final position
      const finalPath = generateAnimationPath(oldPosition, 100);
      setAnimationPath(finalPath);
      setAnimationStep(0);
      setAnimatingPlayer(currentPlayer);
      setIsAnimating(true);
      
      // Update position
      setPlayerPositions({...playerPositions, [currentPlayer]: newPosition});
      setShowWinAnimation(true);
      setLastMove(newPosition);
      setGameHistory([...gameHistory, {...moveData, to: 100, event: "Win"}]);
      return;
    }
    
    let eventType = "Move";
    let finalDestination = newPosition;
    
    // Check for snakes - skip if Ghost Mode is active
    if (snakes[newPosition] && !(activePowerUp && activePowerUp.name === "Ghost Mode")) {
      setGameMessage(`🐍 Player ${currentPlayer} got bitten by a snake! Slides down to ${snakes[newPosition]}`);
      const oldPos = newPosition;
      finalDestination = snakes[newPosition];
      setStats({
        ...stats,
        rolls: stats.rolls + 1,
        snakeBites: {...stats.snakeBites, [currentPlayer]: stats.snakeBites[currentPlayer] + 1}
      });
      eventType = "Snake";
      setGameHistory([...gameHistory, {...moveData, event: eventType, via: oldPos}]);
    }
    
    // Check for ladders - Reverse Ladder logic
    else if (ladders[newPosition] || (activePowerUp && activePowerUp.name === "Reverse Ladder" && Object.values(ladders).includes(newPosition))) {
      let newPos = newPosition;
      let oldPos = newPosition;
      
      // Normal ladder usage
      if (ladders[newPosition]) {
        newPos = ladders[newPosition];
        setGameMessage(`🪜 Player ${currentPlayer} climbed a ladder! Jumps up to ${newPos}`);
        eventType = "Ladder";
      } 
      // Reverse ladder usage
      else if (activePowerUp && activePowerUp.name === "Reverse Ladder") {
        const ladderStart = Object.entries(ladders).find(([start, end]) => end === newPosition);
        if (ladderStart) {
          newPos = parseInt(ladderStart[0]);
          setGameMessage(`🔁 Player ${currentPlayer} used Reverse Ladder! Slides down to ${newPos}`);
          eventType = "ReverseLadder";
        }
      }
      
      finalDestination = newPos;
      
      setStats({
        ...stats,
        rolls: stats.rolls + 1,
        laddersClimbed: {...stats.laddersClimbed, [currentPlayer]: stats.laddersClimbed[currentPlayer] + 1}
      });
      
      setGameHistory([...gameHistory, {...moveData, event: eventType, via: oldPos}]);
    }
    
    else {
      setGameMessage(`Player ${currentPlayer} moved to ${newPosition}`);
      setStats({...stats, rolls: stats.rolls + 1});
      setGameHistory([...gameHistory, {...moveData, event: "Move"}]);
    }
    
    // Create animation path including intermediate steps
    const path = generateAnimationPath(oldPosition, finalDestination);
    setAnimationPath(path);
    setAnimationStep(0);
    setAnimatingPlayer(currentPlayer);
    setIsAnimating(true);
    
    // Update position
    setPlayerPositions({...playerPositions, [currentPlayer]: finalDestination});
    setLastMove(finalDestination);
  };

  // Roll dice
  const rollDice = () => {
    if (isRolling || showWinAnimation || isAnimating) return;
    animateDiceRoll();
  };

  // Reset game
  const resetGame = () => {
    setPlayerPositions({ 1: 1, 2: 1 });
    setCurrentPlayer(1);
    setDiceValue(null);
    setGameMessage("Game reset! Roll the dice to start!");
    setIsRolling(false);
    setShowWinAnimation(false);
    setLastMove(null);
    setGameHistory([]);
    setShowPowerWheel(false);
    setActivePowerUp(null);
    setIsPowerSliderOpen(false);
    setSelectedPowerInfo(null);
    
    // Reset animation states
    setAnimatingPlayer(null);
    setAnimationPath([]);
    setAnimationStep(0);
    setIsAnimating(false);
    
    setStats({
      rolls: 0,
      snakeBites: { 1: 0, 2: 0 },
      laddersClimbed: { 1: 0, 2: 0 },
      powerupsUsed: { 1: 0, 2: 0 }
    });
  };

  // Create snake path
  const createSnakePath = (start, end) => {
    const startPos = getPositionCoordinates(start);
    const endPos = getPositionCoordinates(end);
    
    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const numSegments = Math.max(2, Math.floor(distance / (isMobile ? 40 : 80)));
    
    let path = `M${startPos.x},${startPos.y} `;
    
    for (let i = 0; i < numSegments; i++) {
      const t1 = (i + 0.5) / numSegments;
      const t2 = (i + 1) / numSegments;
      
      const midX1 = startPos.x + dx * t1;
      const midY1 = startPos.y + dy * t1;
      
      const midX2 = startPos.x + dx * t2;
      const midY2 = startPos.y + dy * t2;
      
      const offset = (isMobile ? 8 : 15) * (i % 2 === 0 ? 1 : -1);
      
      const cpX1 = midX1 + offset;
      const cpY1 = midY1 - offset;
      
      path += `Q${cpX1},${cpY1} ${midX2},${midY2} `;
    }
    
    return path;
  };

  // Get snake color
  const getSnakeColor = (snakeStart) => {
    const snakeColors = {
      16: "#FFCC00",
      46: "#FFCC00", 
      49: "#6B8E23",
      62: "#000000",
      64: "#9400D3",
      74: "#FF4500",
      89: "#FF4500", 
      92: "#FF4500", 
      95: "#FF69B4",
      99: "#FFCC00"
    };
    
    return snakeColors[snakeStart] || "#FF0000";
  };

  // Create ladder
  const createLadder = (start, end) => {
    const startPos = getPositionCoordinates(start);
    const endPos = getPositionCoordinates(end);
    
    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;
    const angle = Math.atan2(dy, dx);
    
    const ladderWidth = isMobile ? 6 : 12;
    
    const offsetX = Math.sin(angle) * (ladderWidth / 2);
    const offsetY = -Math.cos(angle) * (ladderWidth / 2);
    
    const line1 = {
      x1: startPos.x + offsetX,
      y1: startPos.y + offsetY,
      x2: endPos.x + offsetX,
      y2: endPos.y + offsetY
    };
    
    const line2 = {
      x1: startPos.x - offsetX,
      y1: startPos.y - offsetY,
      x2: endPos.x - offsetX,
      y2: endPos.y - offsetY
    };
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    const rungCount = Math.floor(distance / (isMobile ? 10 : 20));
    const rungs = [];
    
    for (let i = 1; i < rungCount; i++) {
      const ratio = i / rungCount;
      const rungX1 = line1.x1 + (line1.x2 - line1.x1) * ratio;
      const rungY1 = line1.y1 + (line1.y2 - line1.y1) * ratio;
      const rungX2 = line2.x1 + (line2.x2 - line2.x1) * ratio;
      const rungY2 = line2.y1 + (line2.y2 - line2.y1) * ratio;
      
      rungs.push(
        <line 
          key={`rung-${start}-${end}-${i}`}
          x1={rungX1} 
          y1={rungY1} 
          x2={rungX2} 
          y2={rungY2} 
          stroke="#FF0000" 
          strokeWidth={isMobile ? "1" : "2"}
        />
      );
    }
    
    return (
      <>
        <line 
          x1={line1.x1} 
          y1={line1.y1} 
          x2={line1.x2} 
          y2={line1.y2} 
          stroke="#FF0000" 
          strokeWidth={isMobile ? "2" : "3"} 
        />
        <line 
          x1={line2.x1} 
          y1={line2.y1} 
          x2={line2.x2} 
          y2={line2.y2} 
          stroke="#FF0000" 
          strokeWidth={isMobile ? "2" : "3"} 
        />
        {rungs}
      </>
    );
  };

  // Render dice
  const renderDice = () => {
    const dots = {
      1: [[1, 1]],
      2: [[0, 0], [2, 2]],
      3: [[0, 0], [1, 1], [2, 2]],
      4: [[0, 0], [0, 2], [2, 0], [2, 2]],
      5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
      6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]]
    };

    const diceSize = isMobile ? "w-12 h-12" : "w-16 h-16";

    if (!diceValue) return (
      <div className={`${diceSize} border-2 border-gray-800 bg-white rounded shadow-md flex items-center justify-center`}>
        <span className="text-gray-800">Roll</span>
      </div>
    );
    
    const isDoubleDice = activePowerUp && activePowerUp.name === "Double Dice";

    return (
      <div className={`${diceSize} grid grid-cols-3 grid-rows-3 p-2 gap-1 border-2 
        ${isDoubleDice ? 'border-yellow-500 bg-yellow-100' : 'border-gray-800 bg-white'} 
        rounded shadow-lg ${isRolling ? 'animate-spin' : ''}`}>
        {dots[diceValue > 6 ? 6 : diceValue].map((dot, index) => (
          <div 
            key={index} 
            className={`${isDoubleDice ? 'bg-yellow-600' : 'bg-black'} rounded-full shadow-inner`}
            style={{ gridColumn: dot[0] + 1, gridRow: dot[1] + 1 }}
          ></div>
        ))}
        {isDoubleDice && diceValue > 6 && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full text-xs text-white font-bold flex items-center justify-center">
            x2
          </div>
        )}
      </div>
    );
  };

  // Toggle power-up slider
  const togglePowerSlider = () => {
    setIsPowerSliderOpen(!isPowerSliderOpen);
  };

  // Handle power-up info click
  const handlePowerInfoClick = (powerUp) => {
    setSelectedPowerInfo(powerUp);
  };

  return (
    <div className="flex flex-col items-center p-2 md:p-4 bg-gradient-to-b from-gray-900 to-indigo-900 text-white min-h-screen">
      <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-6 text-center">
        <span className="text-red-500">S</span>
        <span className="text-orange-500">n</span>
        <span className="text-yellow-500">a</span>
        <span className="text-green-500">k</span>
        <span className="text-blue-500">e</span>
        <span className="text-indigo-500">s</span>
        <span className="text-white"> & </span>
        <span className="text-indigo-500">L</span>
        <span className="text-blue-500">a</span>
        <span className="text-green-500">d</span>
        <span className="text-yellow-500">d</span>
        <span className="text-orange-500">e</span>
        <span className="text-red-500">r</span>
        <span className="text-indigo-500">s</span>
      </h1>
      
      {/* Game message display to show animations */}
      <div className="w-full text-center mb-4">
        <div className="bg-gray-800 bg-opacity-70 p-2 rounded-lg inline-block">
          <p className={`text-lg font-medium ${isAnimating ? 'text-yellow-300' : 'text-blue-300'}`}>
            {isAnimating ? `${playerEmojis[animatingPlayer]} Player ${animatingPlayer} is moving...` : gameMessage}
          </p>
        </div>
      </div>
      
      {/* Mobile Power-up Toggle at Top */}
      {isMobile && (
        <div className="w-full flex justify-center mb-4">
          <button
            onClick={togglePowerSlider}
            className="bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2 rounded-lg shadow-lg border border-purple-400 transition-all hover:from-pink-600 hover:to-purple-700"
          >
            <div className="flex items-center">
              <span className="text-xl mr-2">🎮</span>
              <span className="font-bold">POWER-UPS</span>
            </div>
          </button>
        </div>
      )}
      
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-2 md:mb-4">
          <p className="text-sm md:text-lg font-medium text-blue-300">
            Not your childhood Snake & Ladder—we've added chaos, strategy, and a dash of mischief
          </p>
        </div>
        
        <div className="flex flex-wrap relative">
          {/* LEFT PANEL - Power-ups Slider Button (desktop only) */}
          {!isMobile && (
            <div className="fixed left-0 top-1/2 z-20 transform -translate-y-1/2">
              <button
                onClick={togglePowerSlider}
                className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-r-lg shadow-lg border border-purple-400 transition-all hover:from-pink-600 hover:to-purple-700"
              >
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-1">🎮</span>
                  <span className="writing-mode-vertical text-xs font-bold">POWER-UPS</span>
                </div>
              </button>
            </div>
          )}
          
          {/* Power-up Slider */}
          <div 
            className={`fixed left-0 top-0 h-full z-30 bg-gray-900 bg-opacity-90 shadow-2xl border-r border-purple-500 transition-all duration-300 transform ${isPowerSliderOpen ? 'translate-x-0' : '-translate-x-full'}`}
            style={{ width: isMobile ? '100%' : '280px' }}
          >
            <div className="p-4 h-full overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-pink-400 flex items-center">
                  <span className="mr-2">🎮</span> Power-ups
                </h2>
                <button 
                  onClick={togglePowerSlider}
                  className="text-gray-300 hover:text-white"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {powerUps.map((powerUp, index) => (
                  <div 
                    key={index} 
                    className="bg-gradient-to-r rounded-lg p-4 shadow-md transition-all hover:shadow-lg cursor-pointer border border-gray-700 relative"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${powerUp.color.split(' ')[0].replace('from-', '#')}, ${powerUp.color.split(' ')[1].replace('to-', '#')})`
                    }}
                    onClick={() => handlePowerInfoClick(powerUp)}
                  >
                    <div className="flex items-center">
                      <div className="text-3xl mr-3">{powerUp.emoji}</div>
                      <div>
                        <div className="font-bold text-lg">{powerUp.name}</div>
                        <div className="text-sm opacity-90">{powerUp.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER - Game Board */}
          <div className="w-full max-w-fit p-1 md:p-2 mx-auto">
            <div className="relative">
              <div className="border-2 md:border-4 border-gray-700 rounded-lg bg-gray-800 bg-opacity-70 shadow-2xl overflow-hidden">
                <div className="grid grid-cols-1">
                  {createBoard()}
                </div>
                
                {/* SVG for snakes and ladders */}
                <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                  {/* Ladders */}
                  <g>
                    {Object.entries(ladders).map(([start, end]) => (
                      <g key={`ladder-${start}-${end}`}>
                        {createLadder(parseInt(start), parseInt(end))}
                      </g>
                    ))}
                  </g>
                  
                  {/* Snakes */}
                  <g>
                    {Object.entries(snakes).map(([end, start]) => {
                      const snakeColor = getSnakeColor(end);
                      return (
                      <g key={`snake-${start}-${end}`}>
                        <path 
                          d={createSnakePath(parseInt(start), parseInt(end))} 
                          stroke={snakeColor} 
                          strokeWidth={isMobile ? "5" : "10"} 
                          strokeLinecap="round"
                          fill="none" 
                          opacity="0.8"
                        />
                        <path 
                          d={createSnakePath(parseInt(start), parseInt(end))} 
                          stroke={snakeColor === "#000000" ? "#333333" : "#FFFF00"} 
                          strokeWidth={isMobile ? "3" : "6"} 
                          strokeLinecap="round"
                          fill="none" 
                          opacity="0.6"
                        />
                        
                        {/* Snake head */}
                        <circle 
                          cx={getPositionCoordinates(parseInt(end)).x} 
                          cy={getPositionCoordinates(parseInt(end)).y} 
                          r={isMobile ? "4" : "8"} 
                          fill={snakeColor} 
                        />
                        
                        {/* Snake eyes */}
                        <circle 
                          cx={getPositionCoordinates(parseInt(end)).x - (isMobile ? 1.5 : 3)} 
                          cy={getPositionCoordinates(parseInt(end)).y - (isMobile ? 1.5 : 3)} 
                          r={isMobile ? "1" : "2"} 
                          fill="#000000" 
                        
                        />
                        <circle 
                          cx={getPositionCoordinates(parseInt(end)).x + 3} 
                          cy={getPositionCoordinates(parseInt(end)).y - 3} 
                          r="2" 
                          fill="#000000" 
                        />
                      </g>
                    )})}
                  </g>
                </svg>
                
                {/* Win animation overlay */}
                {showWinAnimation && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-6xl font-bold text-yellow-400 animate-bounce">
                      Player {currentPlayer} Wins!
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Controls underneath board */}
            <div className="bg-gray-800 bg-opacity-70 mt-4 p-4 rounded-lg border border-gray-700 flex flex-wrap items-center justify-center">
              <div className="flex items-center mr-6">
                <div className="text-xl font-bold mr-3">Turn:</div>
                <div className={`h-8 w-8 rounded-full ${currentPlayer === 1 ? 'bg-blue-600' : 'bg-green-600'} border-2 border-white`}></div>
                <div className="text-xl font-bold ml-2">Player {currentPlayer}</div>
              </div>
              
              <div className="flex items-center mr-6">
                {renderDice()}
              </div>
              
              <div className="flex flex-col items-center">
                <button 
                  onClick={rollDice}
                  disabled={isRolling || showWinAnimation}
                  className={`px-6 py-2 rounded-lg font-bold shadow-lg transition-all
                    ${isRolling || showWinAnimation 
                      ? 'bg-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700'
                    }`}
                >
                  {isRolling ? 'Rolling...' : 'Roll Dice'}
                </button>
                
                {showWinAnimation && (
                  <button 
                    onClick={resetGame}
                    className="px-6 py-2 rounded-lg font-bold shadow-lg mt-2
              
                      bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                  >
                    Play Again
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* RIGHT PANEL - Game stats and player info */}
          <div className="w-full lg:w-1/4 p-2">
            <div className="bg-gray-800 bg-opacity-70 rounded-xl shadow-xl p-4 mb-4 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-center flex items-center justify-center">
                <span className="text-green-400 mr-2">📊</span> Game Stats
              </h2>
              
              {/* Player 1 stats */}
              <div className="bg-blue-900 bg-opacity-50 rounded-lg p-3 mb-4 border border-blue-700">
                <div className="flex items-center mb-2">
                  <div className="h-6 w-6 rounded-full bg-blue-600 border-2 border-white mr-2"></div>
                  <h3 className="font-bold text-lg">Player 1</h3>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <div>Position:</div>
                    <div className="font-medium">{playerPositions[1]}/100</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Win Chance:</div>
                    <div className={`font-medium ${
                      calculateWinningChance(playerPositions[1]) === "High" ? "text-green-400" : 
                      calculateWinningChance(playerPositions[1]) === "Medium" ? "text-yellow-400" : 
                      calculateWinningChance(playerPositions[1]) === "Low" ? "text-orange-400" : "text-red-400"
                    }`}>{calculateWinningChance(playerPositions[1])}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Snake Bites:</div>
                    <div className="font-medium">{stats.snakeBites[1]}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Ladders Climbed:</div>
                    <div className="font-medium">{stats.laddersClimbed[1]}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Power-ups Used:</div>
                    <div className="font-medium">{stats.powerupsUsed[1]}</div>
                  </div>
                </div>
              </div>
              
              {/* Player 2 stats */}
              <div className="bg-green-900 bg-opacity-50 rounded-lg p-3 mb-4 border border-green-700">
                <div className="flex items-center mb-2">
                  <div className="h-6 w-6 rounded-full bg-green-600 border-2 border-white mr-2"></div>
                  <h3 className="font-bold text-lg">Player 2</h3>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <div>Position:</div>
                    <div className="font-medium">{playerPositions[2]}/100</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Win Chance:</div>
                    <div className={`font-medium ${
                      calculateWinningChance(playerPositions[2]) === "High" ? "text-green-400" : 
                      calculateWinningChance(playerPositions[2]) === "Medium" ? "text-yellow-400" : 
                      calculateWinningChance(playerPositions[2]) === "Low" ? "text-orange-400" : "text-red-400"
                    }`}>{calculateWinningChance(playerPositions[2])}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Snake Bites:</div>
                    <div className="font-medium">{stats.snakeBites[2]}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Ladders Climbed:</div>
                    <div className="font-medium">{stats.laddersClimbed[2]}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Power-ups Used:</div>
                    <div className="font-medium">{stats.powerupsUsed[2]}</div>
                  </div>
                </div>
              </div>
              
              {/* Game info */}
              <div className="bg-gray-900 bg-opacity-60 rounded-lg p-3 border border-gray-700">
                <h3 className="font-bold mb-2 text-blue-300">Game Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <div>Total Rolls:</div>
                    <div className="font-medium">{stats.rolls}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Current Player:</div>
                    <div className="font-medium">Player {currentPlayer}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Power-up Ready:</div>
                    <div className="font-medium">{showPowerWheel ? "Yes!" : `In ${5 - (stats.rolls % 5)} turns`}</div>
                  </div>
                </div>
              </div>
              
              {/* Game controls */}
              <div className="mt-4">
                <button 
                  onClick={resetGame}
                  className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 rounded-lg font-bold shadow-lg"
                >
                  Reset Game
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Power-up wheel */}
      {showPowerWheel && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 border-2 border-yellow-500 shadow-2xl max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4 text-center text-yellow-400">
              🎁 Power-up Time! 🎁
            </h2>
            <p className="text-center mb-4">Spin the wheel to get a random power-up for Player {currentPlayer}</p>
            
            <SpinTheWheel 
              items={powerUps} 
              onSelectItem={handlePowerupSelected}
            />
          </div>
        </div>
      )}
    </div>
  );
}