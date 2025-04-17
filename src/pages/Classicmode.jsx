import { useState, useEffect, useRef } from 'react';

export default function EnhancedClassicSnakesAndLadders() {
  // Board configuration
  const [boardSize, setBoardSize] = useState(10);
  const [squareSize, setSquareSize] = useState(60);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [playerPositions, setPlayerPositions] = useState({ 1: 1, 2: 1 });
  const [diceValue, setDiceValue] = useState(null);
  const [gameMessage, setGameMessage] = useState("Roll the dice to start!");
  const [isRolling, setIsRolling] = useState(false);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [lastMove, setLastMove] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [isComputerPlayer, setIsComputerPlayer] = useState(false);
  const [gameMode, setGameMode] = useState('two-player'); // 'two-player' or 'computer'
  
  // Animation states
  const [animatingPlayer, setAnimatingPlayer] = useState(null);
  const [animationPath, setAnimationPath] = useState([]);
  const [currentAnimationStep, setCurrentAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Player tokens (emojis)
  const playerTokens = {
    1: "🦁", // Lion for player 1
    2: "🐯"  // Tiger for player 2
  };
  
  // Token size configuration
  const [tokenSize, setTokenSize] = useState(32);
  
  // Audio refs - Enhanced with voice effects
  const rollSoundRef = useRef(null);
  const snakeSoundRef = useRef(null);
  const ladderSoundRef = useRef(null);
  const winSoundRef = useRef(null);
  const bgMusicRef = useRef(null);
  const voiceRollRef = useRef(null);
  const voiceSnakeRef = useRef(null);
  const voiceLadderRef = useRef(null);
  const voiceWinRef = useRef(null);
  
  // Responsive state
  const [isMobile, setIsMobile] = useState(false);
  
  // Define snakes and ladders - traditional setup
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
    laddersClimbed: { 1: 0, 2: 0 }
  });

  // Sound effects
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [voiceEffectsEnabled, setVoiceEffectsEnabled] = useState(true);
  
  // Load audio elements
  useEffect(() => {
    // Create audio elements for sound effects
    rollSoundRef.current = new Audio('/api/placeholder/400/320'); // Replace with actual dice roll sound
    snakeSoundRef.current = new Audio('/api/placeholder/400/320'); // Replace with actual snake hiss sound
    ladderSoundRef.current = new Audio('/api/placeholder/400/320'); // Replace with actual ladder climbing sound
    winSoundRef.current = new Audio('/api/placeholder/400/320'); // Replace with actual victory fanfare
    bgMusicRef.current = new Audio('/api/placeholder/400/320'); // Replace with actual background music
    
    // Create audio elements for voice effects
    voiceRollRef.current = new Audio('/api/placeholder/400/320'); // Replace with "Roll the dice!" voice
    voiceSnakeRef.current = new Audio('/api/placeholder/400/320'); // Replace with "Oh no! Snake bite!" voice
    voiceLadderRef.current = new Audio('/api/placeholder/400/320'); // Replace with "Going up!" voice
    voiceWinRef.current = new Audio('/api/placeholder/400/320'); // Replace with "Congratulations!" voice
    
    // Set audio properties
    if (bgMusicRef.current) {
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.5;
    }
    
    // Set voice effect volumes
    const voiceEffects = [voiceRollRef, voiceSnakeRef, voiceLadderRef, voiceWinRef];
    voiceEffects.forEach(effect => {
      if (effect.current) {
        effect.current.volume = 0.8;
      }
    });
    
    return () => {
      // Cleanup
      const audioElements = [
        bgMusicRef, rollSoundRef, snakeSoundRef, ladderSoundRef, winSoundRef,
        voiceRollRef, voiceSnakeRef, voiceLadderRef, voiceWinRef
      ];
      
      audioElements.forEach(audio => {
        if (audio.current) {
          audio.current.pause();
          audio.current = null;
        }
      });
    };
  }, []);
  
  // Toggle background music
  useEffect(() => {
    if (bgMusicRef.current) {
      if (musicEnabled && soundEnabled) {
        bgMusicRef.current.play().catch(e => console.log('Music play error:', e));
      } else {
        bgMusicRef.current.pause();
      }
    }
  }, [musicEnabled, soundEnabled]);
  
  // Check window size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      
      // Adjust square size based on screen width
      if (window.innerWidth < 480) {
        setSquareSize(32); // Smallest screens
        setTokenSize(20);
      } else if (window.innerWidth < 768) {
        setSquareSize(38); // Mobile screens
        setTokenSize(24);
      } else if (window.innerWidth < 1024) {
        setSquareSize(45); // Tablet screens
        setTokenSize(28);
      } else {
        setSquareSize(60); // Desktop
        setTokenSize(32);
      }
    };
    
    // Check on mount
    checkScreenSize();
    
    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // Animation effect for player movement
  useEffect(() => {
    let animationTimer;
    
    if (isAnimating && animationPath.length > 0 && currentAnimationStep < animationPath.length) {
      animationTimer = setTimeout(() => {
        // Move to next step in animation path
        setCurrentAnimationStep(prevStep => prevStep + 1);
        
        // If reached end of path, finish animation
        if (currentAnimationStep === animationPath.length - 1) {
          setIsAnimating(false);
          
          // Check for snake or ladder at final position
          const finalPosition = animationPath[animationPath.length - 1];
          
          if (snakes[finalPosition]) {
            // Snake bite animation
            animatePlayerMovement(animatingPlayer, finalPosition, snakes[finalPosition], "snake");
          } else if (ladders[finalPosition]) {
            // Ladder climb animation
            animatePlayerMovement(animatingPlayer, finalPosition, ladders[finalPosition], "ladder");
          } else {
            // Regular move completed, switch player
            setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
          }
        }
      }, 200); // Animation speed
    }
    
    return () => clearTimeout(animationTimer);
  }, [isAnimating, animationPath, currentAnimationStep, animatingPlayer]);
  
  // Computer player logic
  useEffect(() => {
    let computerMoveTimer;
    
    if (gameMode === 'computer' && currentPlayer === 2 && !showWinAnimation && !isAnimating) {
      computerMoveTimer = setTimeout(() => {
        rollDice();
      }, 1500);
    }
    
    return () => clearTimeout(computerMoveTimer);
  }, [currentPlayer, gameMode, showWinAnimation, isAnimating]);

  // Enhanced sound and voice effect player
  const playSound = (soundType) => {
    if (!soundEnabled) return;
    
    try {
      switch (soundType) {
        case 'roll':
          if (rollSoundRef.current) {
            rollSoundRef.current.currentTime = 0;
            rollSoundRef.current.play().catch(e => console.log('Sound play error:', e));
          }
          if (voiceEffectsEnabled && voiceRollRef.current) {
            // Slight delay for the voice effect
            setTimeout(() => {
              voiceRollRef.current.currentTime = 0;
              voiceRollRef.current.play().catch(e => console.log('Voice play error:', e));
            }, 300);
          }
          break;
        case 'snake':
          if (snakeSoundRef.current) {
            snakeSoundRef.current.currentTime = 0;
            snakeSoundRef.current.play().catch(e => console.log('Sound play error:', e));
          }
          if (voiceEffectsEnabled && voiceSnakeRef.current) {
            // Play voice effect right after the hiss
            setTimeout(() => {
              voiceSnakeRef.current.currentTime = 0;
              voiceSnakeRef.current.play().catch(e => console.log('Voice play error:', e));
            }, 500);
          }
          break;
        case 'ladder':
          if (ladderSoundRef.current) {
            ladderSoundRef.current.currentTime = 0;
            ladderSoundRef.current.play().catch(e => console.log('Sound play error:', e));
          }
          if (voiceEffectsEnabled && voiceLadderRef.current) {
            voiceLadderRef.current.currentTime = 0;
            voiceLadderRef.current.play().catch(e => console.log('Voice play error:', e));
          }
          break;
        case 'win':
          if (winSoundRef.current) {
            winSoundRef.current.currentTime = 0;
            winSoundRef.current.play().catch(e => console.log('Sound play error:', e));
          }
          if (voiceEffectsEnabled && voiceWinRef.current) {
            // Slight delay for the voice congratulation
            setTimeout(() => {
              voiceWinRef.current.currentTime = 0;
              voiceWinRef.current.play().catch(e => console.log('Voice play error:', e));
            }, 1000);
          }
          break;
      }
    } catch (error) {
      console.log('Sound error:', error);
    }
  };

  // Get pixel coordinates for a position with flipped board (top to bottom)
  const getPositionCoordinates = (position) => {
    // Convert position to 0-indexed
    const positionIndex = position - 1;
    
    // Calculate row and column (0-indexed)
    // Row 0 is at the bottom, row 9 is at the top
    const row = boardSize - 1 - Math.floor(positionIndex / boardSize);
    
    // Calculate column
    let col;
    // If row is even (0, 2, 4...) from the bottom, numbers go right to left
    if ((boardSize - 1 - row) % 2 === 0) {
      col = positionIndex % boardSize;
    } else {
      // If row is odd (1, 3, 5...) from the bottom, numbers go left to right
      col = boardSize - 1 - (positionIndex % boardSize);
    }
    
    // Calculate center point of the square
    const x = col * squareSize + (squareSize / 2);
    const y = row * squareSize + (squareSize / 2);
    
    return { x, y };
  };

  // Generate animation path between positions (including intermediary squares)
  const generateAnimationPath = (startPos, endPos) => {
    const path = [];
    
    // Add current position
    path.push(startPos);
    
    // Add each step along the way
    for (let pos = startPos + 1; pos <= endPos; pos++) {
      path.push(pos);
    }
    
    return path;
  };
  
  // Start animation for player movement
  const animatePlayerMovement = (player, fromPos, toPos, moveType = "normal") => {
    // Generate path through intermediate positions
    const path = generateAnimationPath(fromPos, toPos);
    
    // Set animation state
    setAnimatingPlayer(player);
    setAnimationPath(path);
    setCurrentAnimationStep(0);
    setIsAnimating(true);
    
    // Play appropriate sound
    if (moveType === "snake") {
      playSound("snake");
    } else if (moveType === "ladder") {
      playSound("ladder");
    }
    
    // Update player position immediately (visually the animation will show movement)
    const newPositions = {...playerPositions};
    newPositions[player] = toPos;
    setPlayerPositions(newPositions);
  };

  // Define a set of alternating colors for the board
  const getSquareColor = (position) => {
    // Special positions
    if (position === 100) return "bg-emerald-600"; // Finish square
    if (position === 1) return "bg-rose-600";     // Start square
    
    // Create a checkerboard pattern with dark theme colors
    const row = Math.floor((position - 1) / boardSize);
    const col = (position - 1) % boardSize;
    
    if ((row + col) % 2 === 0) {
      return "bg-indigo-900";
    } else {
      return "bg-indigo-800";
    }
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

  // Create individual square with dark theme styling
  const createSquare = (number, row, col) => {
    const colorClass = getSquareColor(number);
    const isLastMove = lastMove === number;
    
    return (
      <div 
        key={number} 
        className={`flex items-center justify-center relative font-bold border border-indigo-700
          ${colorClass} ${isLastMove ? 'ring-2 ring-pink-500' : ''}`}
        style={{ width: squareSize, height: squareSize }}
      >
        <div className={`${isMobile ? 'text-xs' : 'text-xl'} font-bold text-gray-100`}>
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
          // Get current animated position if player is animating
          let displayPosition = pos;
          if (isAnimating && animatingPlayer === parseInt(player) && currentAnimationStep < animationPath.length) {
            displayPosition = animationPath[currentAnimationStep];
          }
          
          if (displayPosition === position) {
            return (
              <div 
                key={player}
                className={`flex items-center justify-center
                  ${currentPlayer === parseInt(player) ? 'animate-bounce' : ''}`}
                style={{ 
                  fontSize: tokenSize, 
                  filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.7))'
                }}
              >
                {playerTokens[player]}
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
    playSound('roll');
    
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
    const newDiceValue = Math.floor(Math.random() * 6) + 1;
    setDiceValue(newDiceValue);
    
    let newPosition = playerPositions[currentPlayer] + newDiceValue;
    const oldPosition = playerPositions[currentPlayer];
    const moveData = { player: currentPlayer, from: oldPosition, to: newPosition, dice: newDiceValue };
    
    // Check if player won
    if (newPosition >= 100) {
      newPosition = 100;
      setGameMessage(`Player ${currentPlayer} wins!`);
      
      // Start animation to move to position 100
      animatePlayerMovement(currentPlayer, oldPosition, 100);
      
      // Show win animation when movement is done
      setTimeout(() => {
        setShowWinAnimation(true);
        setLastMove(newPosition);
        setGameHistory([...gameHistory, {...moveData, to: 100, event: "Win"}]);
        playSound('win');
      }, (100 - oldPosition) * 200); // Timing based on squares to travel
      
      return;
    }
    
    let eventType = "Move";
    
    // Set last move
    setLastMove(newPosition);
    
    // Start the animation for regular movement
    animatePlayerMovement(currentPlayer, oldPosition, newPosition);
    
    // Check for snakes - will be handled after animation completes
    if (snakes[newPosition]) {
      setGameMessage(`Player ${currentPlayer} got bitten by a snake! Slides down to ${snakes[newPosition]}`);
      const oldPos = newPosition;
      newPosition = snakes[newPosition];
      setStats({
        ...stats,
        rolls: stats.rolls + 1,
        snakeBites: {...stats.snakeBites, [currentPlayer]: stats.snakeBites[currentPlayer] + 1}
      });
      eventType = "Snake";
      setGameHistory([...gameHistory, {...moveData, event: eventType, via: oldPos}]);
      
      // Snake movement will be triggered by animation completion effect
    }
    
    // Check for ladders - will be handled after animation completes
    else if (ladders[newPosition]) {
      let newPos = ladders[newPosition];
      setGameMessage(`Player ${currentPlayer} climbed a ladder! Jumps up to ${newPos}`);
      const oldPos = newPosition;
      newPosition = newPos;
      
      setStats({
        ...stats,
        rolls: stats.rolls + 1,
        laddersClimbed: {...stats.laddersClimbed, [currentPlayer]: stats.laddersClimbed[currentPlayer] + 1}
      });
      
      eventType = "Ladder";
      setGameHistory([...gameHistory, {...moveData, event: eventType, via: oldPos}]);
      
      // Ladder movement will be triggered by animation completion effect
    }
    
    else {
      setGameMessage(`Player ${currentPlayer} moved to ${newPosition}`);
      setStats({...stats, rolls: stats.rolls + 1});
      setGameHistory([...gameHistory, {...moveData, event: "Move"}]);
      
      // Player switch will happen after normal animation completes
    }
  };

  // Handle dice roll
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
    setIsAnimating(false);
    setAnimationPath([]);
    setCurrentAnimationStep(0);
    setAnimatingPlayer(null);
    setStats({
      rolls: 0,
      snakeBites: { 1: 0, 2: 0 },
      laddersClimbed: { 1: 0, 2: 0 }
    });
  };

  // Toggle game mode
  const toggleGameMode = () => {
    const newMode = gameMode === 'two-player' ? 'computer' : 'two-player';
    setGameMode(newMode);
    resetGame();
  };

  // Toggle sound effects
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (soundEnabled && musicEnabled) {
      setMusicEnabled(false);
    }
  };
  
  // Toggle background music
  const toggleMusic = () => {
    setMusicEnabled(!musicEnabled);
  };
  
  // Toggle voice effects - new function
  const toggleVoiceEffects = () => {
    setVoiceEffectsEnabled(!voiceEffectsEnabled);
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
    
    // Create a wiggly path with multiple curves - improve control point calculation
    for (let i = 0; i < numSegments; i++) {
      const t1 = (i + 0.5) / numSegments;
      const t2 = (i + 1) / numSegments;
      
      const midX1 = startPos.x + dx * t1;
      const midY1 = startPos.y + dy * t1;
      
      const midX2 = startPos.x + dx * t2;
      const midY2 = startPos.y + dy * t2;
      
      // Calculate perpendicular vector for proper curvature
      const perpX = -dy / distance;
      const perpY = dx / distance;
      
      // Alternate the curve direction
      const wiggleAmount = (isMobile ? 12 : 20) * (i % 2 === 0 ? 1 : -1);
      
      // Control points - adjust to keep within board bounds
      const cpX1 = midX1 + perpX * wiggleAmount;
      const cpY1 = midY1 + perpY * wiggleAmount;
      
      path += `Q${cpX1},${cpY1} ${midX2},${midY2} `;
    }
    
    return path;
  };

  // Get snake color
  const getSnakeColor = (snakeStart) => {
    const snakeColors = {
      16: "#FF5555", // Red
      46: "#FF9E3D", // Orange
      49: "#FFD93D", // Yellow
      62: "#4BD670", // Green
      64: "#55CDFF", // Light Blue
      74: "#3D7DFF", // Blue
      89: "#9E55FF", // Purple
      92: "#FF55BD", // Pink
      95: "#FF3D77", // Hot Pink
      99: "#55FFBD"  // Turquoise
    };
    
    return snakeColors[snakeStart] || "#FF5555"; // Default Red
  };

  // Function to create ladder
  const createLadder = (start, end) => {
    const startPos = getPositionCoordinates(start);
    const endPos = getPositionCoordinates(end);
    
    // Calculate angle
    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;
    const angle = Math.atan2(dy, dx);
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Ladder width - adjusted for better appearance
    const ladderWidth = Math.min(isMobile ? 7 : 14, distance * 0.15);
    
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
    const rungCount = Math.max(3, Math.floor(distance / (isMobile ? 40 : 30)));
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
          stroke="#FFD700" 
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
          stroke="#FFD700" 
          strokeWidth={isMobile ? "2" : "3"} 
        />
        <line 
          x1={line2.x1} 
          y1={line2.y1} 
          x2={line2.x2} 
          y2={line2.y2} 
          stroke="#FFD700" 
          strokeWidth={isMobile ? "2" : "3"} 
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
      <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} border-2 border-indigo-400 bg-indigo-900 rounded shadow-lg flex items-center justify-center`}>
        <span className="text-indigo-300">Roll</span>
      </div>
    );

    return (
      <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} grid grid-cols-3 grid-rows-3 p-2 gap-1 border-2 
        border-indigo-400 bg-indigo-900 rounded shadow-lg ${isRolling ? 'animate-spin' : ''}`}>
        {dots[diceValue].map((dot, index) => (
          <div 
            key={index} 
            className="bg-pink-400 rounded-full shadow-inner"
            style={{ gridColumn: dot[0] + 1, gridRow: dot[1] + 1 }}
          ></div>
        ))}
      </div>
    );
  };

  // Game Info for mobile view with tabs
  const [activeTab, setActiveTab] = useState('instructions');

  const renderMobileTabs = () => {
    return (
      <div className="w-full bg-indigo-900 rounded-t-xl p-2 flex border-b border-indigo-700">
        <button 
          onClick={() => setActiveTab('instructions')} 
          className={`flex-1 py-2 px-3 rounded-t-lg text-sm font-medium ${
             activeTab === 'instructions' ? 'bg-indigo-800 text-pink-400' : 'text-gray-300'
          }`}
        >
          How to Play
        </button>
        <button 
          onClick={() => setActiveTab('log')} 
          className={`flex-1 py-2 px-3 rounded-t-lg text-sm font-medium ${
            activeTab === 'log' ? 'bg-indigo-800 text-pink-400' : 'text-gray-300'
          }`}
        >
          Game Log
        </button>
        <button 
          onClick={() => setActiveTab('stats')} 
          className={`flex-1 py-2 px-3 rounded-t-lg text-sm font-medium ${
            activeTab === 'stats' ? 'bg-indigo-800 text-pink-400' : 'text-gray-300'
          }`}
        >
          Stats
        </button>
      </div>
    );
  };

  const renderMobileTabContent = () => {
    switch(activeTab) {
      case 'instructions':
        return (
          <div className="space-y-3 text-gray-300 p-3">
            <p className="text-sm">
              <span className="font-bold">Objective:</span> Be the first player to reach square 100!
            </p>
            
            <div className="text-sm">
              <p className="font-bold mb-1">Rules:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Players take turns rolling the dice</li>
                <li>Move your piece the number of squares shown on the dice</li>
                <li>If you land on a ladder base, climb up!</li>
                <li>If you land on a snake head, slide down!</li>
                <li>You must roll the exact number to reach square 100</li>
              </ul>
            </div>
            
            <div className="flex items-center space-x-2 mt-2">
              <div className="text-xl">{playerTokens[1]}</div>
              <div className="text-sm">Player 1</div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="text-xl">{playerTokens[2]}</div>
              <div className="text-sm">{gameMode === 'computer' ? 'Computer' : 'Player 2'}</div>
            </div>
          </div>
        );
      case 'log':
        return (
          <div className="p-3">
            <div className="max-h-32 overflow-y-auto text-sm space-y-1">
              <p className="font-medium text-gray-300">{gameMessage}</p>
              
              {/* Show last 5 moves */}
              {gameHistory.slice(-5).reverse().map((move, index) => {
                let eventEmoji = "🎲";
                if (move.event === "Snake") eventEmoji = "🐍";
                if (move.event === "Ladder") eventEmoji = "🪜";
                 if (move.event === "Win") eventEmoji = "🏆";
                
                const playerLabel = move.player === 2 && gameMode === 'computer' ? 'Computer' : `P${move.player}`;
                
                return (
                  <div key={index} className="text-gray-400 text-xs">
                    {eventEmoji} {playerLabel} rolled {move.dice}: 
                    {(move.event === "Snake" || move.event === "Ladder") 
                      ? ` ${move.from} → ${move.via} → ${move.to}`
                      : ` ${move.from} → ${move.to}`
                    }
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'stats':
        return (
          <div className="p-3 space-y-3">
            {/* Player 1 stats */}
            <div className="bg-blue-900 bg-opacity-30 rounded-lg p-2 border border-blue-700">
              <div className="flex items-center mb-1">
                <div className="h-3 w-3 rounded-full bg-blue-500 border-2 border-indigo-700 mr-2"></div>
                <h3 className="font-bold text-xs text-blue-300">Player 1</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-1 text-xs">
                <div className="flex flex-col">
                  <div className="text-gray-400">Position:</div>
                  <div className="font-medium text-gray-200">{playerPositions[1]}/100</div>
                </div>
                <div className="flex flex-col">
                  <div className="text-gray-400">Snakes:</div>
                  <div className="font-medium text-gray-200">{stats.snakeBites[1]}</div>
                </div>
                <div className="flex flex-col">
                  <div className="text-gray-400">Ladders:</div>
                  <div className="font-medium text-gray-200">{stats.laddersClimbed[1]}</div>
                </div>
              </div>
            </div>
            
            {/* Player 2 stats */}
            <div className="bg-red-900 bg-opacity-30 rounded-lg p-2 border border-red-700">
              <div className="flex items-center mb-1">
                <div className="h-3 w-3 rounded-full bg-red-500 border-2 border-indigo-700 mr-2"></div>
                <h3 className="font-bold text-xs text-red-300">{gameMode === 'computer' ? 'Computer' : 'Player 2'}</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-1 text-xs">
                <div className="flex flex-col">
                  <div className="text-gray-400">Position:</div>
                  <div className="font-medium text-gray-200">{playerPositions[2]}/100</div>
                </div>
                <div className="flex flex-col">
                  <div className="text-gray-400">Snakes:</div>
                  <div className="font-medium text-gray-200">{stats.snakeBites[2]}</div>
                </div>
                <div className="flex flex-col">
                  <div className="text-gray-400">Ladders:</div>
                  <div className="font-medium text-gray-200">{stats.laddersClimbed[2]}</div>
                </div>
              </div>
            </div>
            
            {/* Game info - compact */}
            <div className="bg-indigo-950 rounded-lg p-2 border border-indigo-800">
              <div className="grid grid-cols-3 gap-1 text-xs">
                <div className="flex flex-col">
                  <div className="text-gray-400">Total Rolls:</div>
                  <div className="font-medium text-gray-200">{stats.rolls}</div>
                </div>
                <div className="flex flex-col">
                  <div className="text-gray-400">Current:</div>
                  <div className="font-medium text-gray-200">
                    {currentPlayer === 2 && gameMode === 'computer' ? 'PC' : `P${currentPlayer}`}
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="text-gray-400">Mode:</div>
                  <div className="font-medium text-gray-200">
                    {gameMode === 'computer' ? 'vs PC' : '2P'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Render settings panel - for both desktop and mobile
  const renderSettings = () => {
    return (
      <div className={`w-full ${isMobile ? 'p-2 mt-2' : 'lg:w-1/4 p-2 mt-4'}`}>
        <div className="bg-indigo-900 rounded-xl shadow-lg p-4 border border-indigo-700">
          <h2 className="text-xl font-bold mb-4 text-center text-pink-400">Game Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Game Mode:</span>
              <div className="flex items-center">
                <button 
                  onClick={toggleGameMode}
                  className={`px-3 py-1 rounded-lg text-sm font-medium shadow-md ${
                    gameMode === 'two-player' 
                      ? 'bg-pink-600 text-white' 
                      : 'bg-indigo-700 text-gray-300'
                  }`}
                >
                  2 Players
                </button>
                <button 
                  onClick={toggleGameMode}
                  className={`ml-2 px-3 py-1 rounded-lg text-sm font-medium shadow-md ${
                    gameMode === 'computer' 
                      ? 'bg-pink-600 text-white' 
                      : 'bg-indigo-700 text-gray-300'
                  }`}
                >
                  vs Computer
                </button>
              </div>
            </div>
          
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Sound Effects:</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={soundEnabled}
                  onChange={toggleSound}
                />
                <div className="w-11 h-6 bg-indigo-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Return the game component with dark theme layout
  return (
    <div className="flex flex-col items-center p-4 bg-gradient-to-b from-indigo-950 to-indigo-900 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-pink-400">
        Classic Snakes & Ladders
      </h1>
      
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-wrap">
          {/* LEFT PANEL - Game Instructions */}
          <div className="w-full lg:w-1/4 p-2">
            <div className="bg-indigo-900 rounded-xl shadow-lg p-4 mb-4 border border-indigo-700">
              <h2 className="text-xl font-bold mb-4 text-center text-pink-400">How to Play</h2>
              
              <div className="space-y-3 text-gray-300">
                <p className="text-sm">
                  <span className="font-bold">Objective:</span> Be the first player to reach square 100!
                </p>
                
                <div className="text-sm">
                  <p className="font-bold mb-1">Rules:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Players take turns rolling the dice</li>
                    <li>Move your piece the number of squares shown on the dice</li>
                    <li>If you land on a ladder base, climb up!</li>
                    <li>If you land on a snake head, slide down!</li>
                    <li>You must roll the exact number to reach square 100</li>
                  </ul>
                </div>
                
                <div className="flex items-center space-x-2 mt-2">
                  <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                  <div className="text-sm">Player 1</div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 rounded-full bg-red-500"></div>
                  <div className="text-sm">{gameMode === 'computer' ? 'Computer' : 'Player 2'}</div>
                </div>
              </div>
              
              {/* Game Log */}
              <div className="mt-6 bg-indigo-950 rounded-lg p-3 border border-indigo-800">
                <h3 className="font-bold mb-2 text-pink-400">Game Log</h3>
                <div className="max-h-40 overflow-y-auto text-sm space-y-1">
                  <p className="font-medium text-gray-300">{gameMessage}</p>
                  
                  {/* Show last 5 moves */}
                  {gameHistory.slice(-5).reverse().map((move, index) => {
                    let eventEmoji = "🎲";
                    if (move.event === "Snake") eventEmoji = "🐍";
                    if (move.event === "Ladder") eventEmoji = "🪜";
                    if (move.event === "Win") eventEmoji = "🏆";
                    
                    const playerLabel = move.player === 2 && gameMode === 'computer' ? 'Computer' : `P${move.player}`;
                    
                    return (
                      <div key={index} className="text-gray-400 text-xs">
                        {eventEmoji} {playerLabel} rolled {move.dice}: 
                        {(move.event === "Snake" || move.event === "Ladder") 
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
              <div className="border-4 border-indigo-600 rounded-lg bg-indigo-950 shadow-xl overflow-hidden">
                <div className="grid grid-cols-1">
                  {createBoard()}
                </div>
                
                {/* SVG for snakes and ladders */}
                <svg 
                  className="absolute inset-0 w-full h-full" 
                  style={{ pointerEvents: 'none' }}
                  viewBox={`0 0 ${boardSize * squareSize} ${boardSize * squareSize}`}
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Ladders - draw first so they appear behind snakes */}
                  <g>
                    {Object.entries(ladders).map(([start, end]) => (
                      <g key={`ladder-${start}-${end}`}>
                        {createLadder(parseInt(start), parseInt(end))}
                      </g>
                    ))}
                  </g>
                  
                  {/* Snakes */}
                  <g>
                    {Object.entries(snakes).map(([start, end]) => {
                      const snakeColor = getSnakeColor(start);
                      return (
                      <g key={`snake-${end}-${start}`}>
                        <path 
                          d={createSnakePath(parseInt(end), parseInt(start))} 
                          stroke={snakeColor} 
                          strokeWidth="8" 
                          strokeLinecap="round"
                          fill="none" 
                          opacity="0.8"
                        />
                        <path 
                          d={createSnakePath(parseInt(end), parseInt(start))} 
                          stroke="#FFFFFF" 
                          strokeWidth="4" 
                          strokeLinecap="round"
                          fill="none" 
                          opacity="0.4"
                          strokeDasharray="3 3"
                        />
                        
                        {/* Snake head */}
                        <circle 
                          cx={getPositionCoordinates(parseInt(start)).x} 
                          cy={getPositionCoordinates(parseInt(start)).y} 
                          r="6" 
                          fill={snakeColor} 
                        />
                        
                        {/* Snake eyes */}
                        <circle 
                          cx={getPositionCoordinates(parseInt(start)).x - 2} 
                          cy={getPositionCoordinates(parseInt(start)).y - 2} 
                          r="1.5" 
                          fill="#FFFFFF" 
                        />
                        <circle 
                          cx={getPositionCoordinates(parseInt(start)).x + 2} 
                          cy={getPositionCoordinates(parseInt(start)).y - 2} 
                          r="1.5" 
                          fill="#FFFFFF" 
                        />
                      </g>
                    )})}
                  </g>
                </svg>
                
                {/* Win animation overlay */}
                {showWinAnimation && (
                  <div className="absolute inset-0 bg-indigo-900 bg-opacity-80 flex items-center justify-center">
                    <div className="bg-indigo-800 p-6 rounded-xl shadow-2xl text-center border-2 border-pink-500">
                      <div className="text-5xl mb-4">🏆</div>
                      <div className="text-3xl font-bold text-pink-400 mb-2">
                        {currentPlayer === 2 && gameMode === 'computer' ? 'Computer' : `Player ${currentPlayer}`} Wins!
                      </div>
                      <div className="text-gray-300">
                        In {stats.rolls} moves
                      </div>
                      <button 
                        onClick={resetGame}
                        className="mt-4 px-6 py-2 bg-pink-600 text-white rounded-lg font-bold shadow-lg hover:bg-pink-700 transition-colors"
                      >
                        Play Again
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Controls underneath board */}
            <div className="bg-indigo-900 mt-4 p-4 rounded-lg shadow-lg border border-indigo-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center mr-8">
                <div className=" flex items-center text-lg font-medium text-gray-300 "><span className='mr-2'>Turn:</span></div>
                <div className={`h-8 w-8 rounded-full ${currentPlayer === 1 ? 'bg-blue-500' : 'bg-red-500'} border-2 border-indigo-700 shadow-md`}></div>
                <div className="text-lg font-medium text-gray-300 ml-2">
                  {currentPlayer === 2 && gameMode === 'computer' ? 'Computer' : `Player ${currentPlayer}`}
                </div>
              </div>
              
              <div className="flex items-center mr-8">
                {renderDice()}
              </div>
              
              <button 
                onClick={rollDice}
                disabled={isRolling || showWinAnimation && (currentPlayer === 2 && gameMode === 'computer')}
                className={`px-6 py-2 rounded-lg font-bold shadow-lg transition-all
                  ${(isRolling || (showWinAnimation || currentPlayer === 2 && gameMode === 'computer'))
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-pink-600 text-white hover:bg-pink-700'
                  }`}
              >
                {isRolling ? 'Rolling...' : 'Roll Dice'}
              </button>
            </div>
          </div>
          
          {/* RIGHT PANEL - Game stats */}
          <div className="w-full lg:w-1/4 p-2">
            <div className="bg-indigo-900 rounded-xl shadow-lg p-4 mb-4 border border-indigo-700">
              <h2 className="text-xl font-bold mb-4 text-center text-pink-400">Game Stats</h2>
              
              {/* Player 1 stats */}
              <div className="bg-blue-900 bg-opacity-30 rounded-lg p-3 mb-4 border border-blue-700">
                <div className="flex items-center mb-2">
                  <div className="h-5 w-5 rounded-full bg-blue-500 border-2 border-indigo-700 mr-2"></div>
                  <h3 className="font-bold text-blue-300">Player 1</h3>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <div className="text-gray-400">Position:</div>
                    <div className="font-medium text-gray-200">{playerPositions[1]}/100</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-400">Snake Bites:</div>
                    <div className="font-medium text-gray-200">{stats.snakeBites[1]}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-400">Ladders Climbed:</div>
                    <div className="font-medium text-gray-200">{stats.laddersClimbed[1]}</div>
                  </div>
                </div>
              </div>
              
              {/* Player 2 stats */}
              <div className="bg-red-900 bg-opacity-30 rounded-lg p-3 mb-4 border border-red-700">
                <div className="flex items-center mb-2">
                  <div className="h-5 w-5 rounded-full bg-red-500 border-2 border-indigo-700 mr-2"></div>
                  <h3 className="font-bold text-red-300">{gameMode === 'computer' ? 'Computer' : 'Player 2'}</h3>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <div className="text-gray-400">Position:</div>
                    <div className="font-medium text-gray-200">{playerPositions[2]}/100</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-400">Snake Bites:</div>
                    <div className="font-medium text-gray-200">{stats.snakeBites[2]}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-400">Ladders Climbed:</div>
                    <div className="font-medium text-gray-200">{stats.laddersClimbed[2]}</div>
                  </div>
                </div>
              </div>
              
              {/* Game info */}
              <div className="bg-indigo-950 rounded-lg p-3 border border-indigo-800">
                <h3 className="font-bold mb-2 text-pink-400">Game Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <div className="text-gray-400">Total Rolls:</div>
                    <div className="font-medium text-gray-200">{stats.rolls}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-400">Current Player:</div>
                    <div className="font-medium text-gray-200">
                      {currentPlayer === 2 && gameMode === 'computer' ? 'Computer' : `Player ${currentPlayer}`}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-400">Game Mode:</div>
                    <div className="font-medium text-gray-200">
                      {gameMode === 'computer' ? 'vs Computer' : '2 Players'}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Game controls */}
              <div className="mt-4 space-y-2">
                <button 
                  onClick={resetGame}
                  className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white rounded-lg font-bold shadow-md"
                >
                  Reset Game
                </button>
                
                <button 
                  onClick={toggleGameMode}
                  className="w-full px-4 py-2 bg-indigo-700 hover:bg-indigo-800 transition-colors text-white rounded-lg font-bold shadow-md"
                >
                  {gameMode === 'computer' ? 'Switch to 2 Players' : 'Play vs Computer'}
                </button>
                
                <button 
                  onClick={toggleSound}
                  className="w-full px-4 py-2 bg-indigo-800 hover:bg-indigo-900 transition-colors text-white rounded-lg font-bold shadow-md flex items-center justify-center"
                >
                  <span className="mr-2">{soundEnabled ? '🔊' : '🔇'}</span>
                  {soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Audio Components (invisible) */}
      <audio id="roll-sound" preload="auto">
        <source src="/src/assets/roll.mp3" type="audio/mpeg" />
      </audio>
      <audio id="snake-sound" preload="auto">
        <source src="/src/assets/snake.mp3" type="audio/mpeg" />
      </audio>
      <audio id="ladder-sound" preload="auto">
        <source src="/src/assets/ladder.mp3" type="audio/mpeg" />
      </audio>
      <audio id="win-sound" preload="auto">
        <source src="/src/assets/win.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}