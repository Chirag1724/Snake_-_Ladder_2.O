import { useState, useEffect } from 'react';
import SpinTheWheel from '../components/SpinTheWheel';

export default function SnakesAndLaddersBoard() {
  // Board configuration
  const boardSize = 10;
  const squareSize = 60;
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [playerPositions, setPlayerPositions] = useState({ 1: 1, 2: 1 });
  const [diceValue, setDiceValue] = useState(null);
  const [gameMessage, setGameMessage] = useState("Roll the dice to start!");
  const [isRolling, setIsRolling] = useState(false);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [lastMove, setLastMove] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  
  // Power-up related states
  const [activePowerUp, setActivePowerUp] = useState(null);
  const [showPowerWheel, setShowPowerWheel] = useState(false);
  const [powerupCounter, setPowerupCounter] = useState(0); // Count turns for power-up availability

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

  // Increment power-up counter on every move and show wheel every 5 turns
  useEffect(() => {
    if (stats.rolls > 0 && stats.rolls % 5 === 0 && !showPowerWheel && !activePowerUp) {
      setShowPowerWheel(true);
    }
  }, [stats.rolls]);

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

  // Get pixel coordinates for a position with flipped board (top to bottom)
  const getPositionCoordinates = (position) => {
    // For flipped board: 100 at top-left, 1 at bottom-right
    const adjustedPosition = 101 - position; // Convert position for the flipped board
    
    // Calculate row and column (0-indexed)
    const row = Math.floor((adjustedPosition - 1) / boardSize);
    let col;
    
    // For even-numbered rows (0, 2, 4...), numbering goes left to right
    if (row % 2 === 0) {
      col = (adjustedPosition - 1) % boardSize;
    } 
    // For odd-numbered rows (1, 3, 5...), numbering goes right to left
    else {
      col = boardSize - 1 - ((adjustedPosition - 1) % boardSize);
    }
    
    // Convert row/col to pixel coordinates
    const x = col * squareSize + squareSize / 2;
    const y = row * squareSize + squareSize / 2;
    
    return { x, y };
  };

  // Calculate winning probability based on position
  const calculateWinningChance = (position) => {
    if (position >= 90) return "High";
    if (position >= 70) return "Medium";
    if (position >= 50) return "Low";
    return "Very Low";
  };

  // Define a set of vibrant colors for the board
  const getSquareColor = (position) => {
    // Special positions
    if (position === 100) return "bg-green-500"; // Finish square
    if (position === 1) return "bg-red-500";     // Start square
    
    // Create a pattern of colors
    const colorOptions = [
      "bg-indigo-400", "bg-blue-400", "bg-purple-400", 
      "bg-pink-400", "bg-teal-400", "bg-amber-400"
    ];
    
    return colorOptions[(position + Math.floor(position/10)) % colorOptions.length];
  };

  // Create board squares with flipped layout (top to bottom)
  const createBoard = () => {
    const board = [];
    
    // Create rows from top to bottom
    for (let row = 0; row < boardSize; row++) {
      const rowSquares = [];
      
      for (let col = 0; col < boardSize; col++) {
        // Calculate position based on the flipped layout
        let position;
        const isEvenRow = row % 2 === 0;
        
        if (isEvenRow) {
          // For even rows (top row is 0): left to right
          position = 100 - (row * boardSize) - col;
        } else {
          // For odd rows: right to left
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

  // Create individual square with vibrant styling
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
        <div className="text-xl font-bold text-gray-800">
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
          if (pos === position) {
            const isGhostMode = activePowerUp && activePowerUp.name === "Ghost Mode" && parseInt(player) === currentPlayer;
            
            return (
              <div 
                key={player}
                className={`h-6 w-6 rounded-full ${player === '1' ? 'bg-blue-600' : 'bg-green-600'} 
                  m-1 border-2 border-white shadow-lg transform ${currentPlayer === parseInt(player) ? 'scale-110 animate-pulse' : ''}
                  ${isGhostMode ? 'opacity-50' : ''}`}
              />
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

  // Complete the move after dice animation finishes
  const completeMove = () => {
    // Base dice roll
    let newDiceValue = Math.floor(Math.random() * 6) + 1;
    
    // Apply "Double Dice" power-up if active
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
      setPlayerPositions({...playerPositions, [currentPlayer]: newPosition});
      setShowWinAnimation(true);
      setLastMove(newPosition);
      setGameHistory([...gameHistory, {...moveData, to: 100, event: "Win"}]);
      return;
    }
    
    let eventType = "Move";
    
    // Check for snakes - skip if Ghost Mode is active
    if (snakes[newPosition] && !(activePowerUp && activePowerUp.name === "Ghost Mode")) {
      setGameMessage(`🐍 Player ${currentPlayer} got bitten by a snake! Slides down to ${snakes[newPosition]}`);
      const oldPos = newPosition;
      newPosition = snakes[newPosition];
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
      // Reverse ladder usage (if power-up active)
      else if (activePowerUp && activePowerUp.name === "Reverse Ladder") {
        // Find the ladder start for this end position
        const ladderStart = Object.entries(ladders).find(([start, end]) => end === newPosition);
        if (ladderStart) {
          newPos = parseInt(ladderStart[0]);
          setGameMessage(`🔁 Player ${currentPlayer} used Reverse Ladder! Slides down to ${newPos}`);
          eventType = "ReverseLadder";
        }
      }
      
      newPosition = newPos;
      
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
    
    // Update position and switch players
    setPlayerPositions({...playerPositions, [currentPlayer]: newPosition});
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    setLastMove(newPosition);
    
    // Clear power-up after use
    if (activePowerUp) {
      setActivePowerUp(null);
    }
  };

  // Handle dice roll
  const rollDice = () => {
    if (isRolling || showWinAnimation) return;
    
    // Start the dice animation
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
    setStats({
      rolls: 0,
      snakeBites: { 1: 0, 2: 0 },
      laddersClimbed: { 1: 0, 2: 0 },
      powerupsUsed: { 1: 0, 2: 0 }
    });
  };

  // Function to create snake path with bezier curves
  const createSnakePath = (start, end) => {
    const startPos = getPositionCoordinates(start);
    const endPos = getPositionCoordinates(end);
    
    // Calculate distance
    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Multiple control points for more complex snake shape
    const numSegments = Math.max(2, Math.floor(distance / 80));
    
    let path = `M${startPos.x},${startPos.y} `;
    
    // Create a wiggly path with multiple curves
    for (let i = 0; i < numSegments; i++) {
      const t1 = (i + 0.5) / numSegments;
      const t2 = (i + 1) / numSegments;
      
      const midX1 = startPos.x + dx * t1;
      const midY1 = startPos.y + dy * t1;
      
      const midX2 = startPos.x + dx * t2;
      const midY2 = startPos.y + dy * t2;
      
      // Alternate the curve direction
      const offset = 15 * (i % 2 === 0 ? 1 : -1);
      
      // Control points
      const cpX1 = midX1 + offset;
      const cpY1 = midY1 - offset;
      
      path += `Q${cpX1},${cpY1} ${midX2},${midY2} `;
    }
    
    return path;
  };

  // Get snake color based on the image
  const getSnakeColor = (snakeStart) => {
    const snakeColors = {
      16: "#FFCC00", // Yellow snake
      46: "#FFCC00", 
      49: "#6B8E23", // Olive green snake
      62: "#000000", // Black snake
      64: "#9400D3", // Purple snake
      74: "#FF4500", // Orange-red snake
      89: "#FF4500", 
      92: "#FF4500", 
      95: "#FF69B4", // Pink snake
      99: "#FFCC00"  
    };
    
    return snakeColors[snakeStart] || "#FF0000"; // Default red if not specified
  };

  // Function to create ladder
  const createLadder = (start, end) => {
    const startPos = getPositionCoordinates(start);
    const endPos = getPositionCoordinates(end);
    
    // Calculate angle
    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;
    const angle = Math.atan2(dy, dx);
    
    // Ladder width
    const ladderWidth = 12;
    
    // Perpendicular offset for the two sides of the ladder
    const offsetX = Math.sin(angle) * (ladderWidth / 2);
    const offsetY = -Math.cos(angle) * (ladderWidth / 2);
    
    // Create the two sides of the ladder
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
    
    // Calculate rungs
    const distance = Math.sqrt(dx * dx + dy * dy);
    const rungCount = Math.floor(distance / 20);
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
          strokeWidth="2"
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
          strokeWidth="3" 
        />
        <line 
          x1={line2.x1} 
          y1={line2.y1} 
          x2={line2.x2} 
          y2={line2.y2} 
          stroke="#FF0000" 
          strokeWidth="3" 
        />
        {rungs}
      </>
    );
  };

  // Render dice with animation
  const renderDice = () => {
    const dots = {
      1: [[1, 1]],
      2: [[0, 0], [2, 2]],
      3: [[0, 0], [1, 1], [2, 2]],
      4: [[0, 0], [0, 2], [2, 0], [2, 2]],
      5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
      6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]]
    };

    if (!diceValue) return (
      <div className="w-16 h-16 border-2 border-gray-800 bg-white rounded shadow-md flex items-center justify-center">
        <span className="text-gray-800">Roll</span>
      </div>
    );
    
    // For double dice power-up, show a special indicator
    const isDoubleDice = activePowerUp && activePowerUp.name === "Double Dice";

    return (
      <div className={`w-16 h-16 grid grid-cols-3 grid-rows-3 p-2 gap-1 border-2 
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

  // Return the game component with redesigned layout
  return (
    <div className="flex flex-col items-center p-4 bg-gradient-to-b from-gray-900 to-indigo-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center">
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
      
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <p className="text-lg font-medium text-blue-300">
            Not your childhood Snake & Ladder—we've added chaos, strategy, and a dash of mischief
          </p>
        </div>
        
        <div className="flex flex-wrap">
          {/* LEFT PANEL - Power-ups */}
          <div className="w-full lg:w-1/4 p-2">
            <div className="bg-gray-800 bg-opacity-70 rounded-xl shadow-xl p-4 mb-4 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-center flex items-center justify-center">
                <span className="text-pink-400 mr-2">🧠</span> Power-ups
              </h2>
              
              <div className="space-y-3">
                {powerUps.map((powerUp, index) => (
                  <div 
                    key={index} 
                    className="bg-gradient-to-r rounded-lg p-3 shadow-md transition-all hover:shadow-lg border border-gray-700"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${powerUp.color.split(' ')[0].replace('from-', '#')}, ${powerUp.color.split(' ')[1].replace('to-', '#')})`
                    }}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-2">{powerUp.emoji}</div>
                      <div>
                        <div className="font-bold">{powerUp.name}</div>
                        <div className="text-sm opacity-90">{powerUp.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Active Power-up */}
              {activePowerUp && (
                <div className="mt-4 p-3 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-lg text-center shadow-lg border border-yellow-300">
                  <div className="text-2xl mb-1">{activePowerUp.emoji}</div>
                  <div className="font-bold">{activePowerUp.name} Active!</div>
                  <div className="text-sm mt-1">Player {currentPlayer}</div>
                </div>
              )}
              
              {/* Game rules */}
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2 text-center flex items-center justify-center">
                  <span className="text-blue-400 mr-2">🚀</span> New Rules. More Fun.
                </h3>
                
                <ul className="space-y-2 text-sm ml-2">
                  <li className="flex items-center">
                    <span className="mr-2">•</span> 
                    Play fair... or play <span className="text-purple-400 font-bold">dirty</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> 
                    Choose your fate: classic or chaos mode
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> 
                    Surprise your friends and outsmart opponents
                  </li>
                </ul>
              </div>
              
              {/* Game Log */}
              <div className="mt-6 bg-gray-900 bg-opacity-60 rounded-lg p-3 border border-gray-700">
                <h3 className="font-bold mb-2 text-blue-300">Game Log</h3>
                <div className="max-h-32 overflow-y-auto text-sm space-y-1">
                  <p className="font-medium text-white">{gameMessage}</p>
                  
                  {/* Show last 3 moves */}
                  {gameHistory.slice(-3).reverse().map((move, index) => {
                    let eventEmoji = "🎲";
                    if (move.event === "Snake") eventEmoji = "🐍";
                    if (move.event === "Ladder") eventEmoji = "🪜";
                    if (move.event === "Win") eventEmoji = "🏆";
                    if (move.event === "ReverseLadder") eventEmoji = "🔁";
                    
                    return (
                      <div key={index} className="text-gray-300 text-xs">
                        {eventEmoji} P{move.player} rolled {move.dice}: 
                        {(move.event === "Snake" || move.event === "Ladder" || move.event === "ReverseLadder") 
                          ? ` ${move.from} → ${move.via} → ${move.to}`
                          : ` ${move.from} → ${move.to}`
                        }
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
          {/* CENTER - Game Board */}
          <div className="w-full lg:w-2/4 p-2">
            <div className="relative">
              <div className="border-4 border-gray-700 rounded-lg bg-gray-800 bg-opacity-70 shadow-2xl overflow-hidden">
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
                          strokeWidth="10" 
                          strokeLinecap="round"
                          fill="none" 
                          opacity="0.8"
                        />
                        <path 
                          d={createSnakePath(parseInt(start), parseInt(end))} 
                          stroke={snakeColor === "#000000" ? "#333333" : "#FFFF00"} 
                          strokeWidth="6" 
                          strokeLinecap="round"
                          fill="none" 
                          opacity="0.6"
                        />
                        
                        {/* Snake head */}
                        <circle 
                          cx={getPositionCoordinates(parseInt(end)).x} 
                          cy={getPositionCoordinates(parseInt(end)).y} 
                          r="8" 
                          fill={snakeColor} 
                        />
                        
                        {/* Snake eyes */}
                        <circle 
                          cx={getPositionCoordinates(parseInt(end)).x - 3} 
                          cy={getPositionCoordinates(parseInt(end)).y - 3} 
                          r="2" 
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