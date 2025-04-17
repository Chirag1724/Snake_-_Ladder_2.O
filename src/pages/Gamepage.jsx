import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function GameSetup() {
  const navigate = useNavigate();
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState(['', '', '', '']);
  const [selectedTheme, setSelectedTheme] = useState('classic');

  const handlePlayerNameChange = (index, name) => {
    const newPlayerNames = [...playerNames];
    newPlayerNames[index] = name;
    setPlayerNames(newPlayerNames);
  };

  const handlePlayerCountChange = (count) => {
    setPlayerCount(count);
  };

  const handleStartGame = () => {
    const activePlayers = playerNames.slice(0, playerCount).map((name, index) => 
      name || `Player ${index + 1}`
    );
    
    // For twist mode, all features are automatically included
    const twistFeatures = selectedTheme === 'twist' ? {
      pushAttack: true,
      doubleDice: true,
      ghostMode: true
    } : {};
    
    // Create game state to pass to the game component
    const gameState = {
      playerCount,
      players: activePlayers,
      theme: selectedTheme,
      ...(selectedTheme === 'twist' ? twistFeatures : {})
    };
    
    console.log('Starting game with settings:', gameState);
    
    // Navigate to appropriate route based on theme with state
    if (selectedTheme === 'classic') {
      navigate('/classicmode', { state: gameState });
    } else {
      navigate('/twistmode', { state: gameState });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900">
      {/* Navbar - Fixed at top */}
      <Navbar />
      
      {/* Main Content - Added padding-top to ensure content starts below navbar */}
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">Snakes & Ladders</h1>
          <p className="text-gray-300 mt-2">Configure your game and start playing!</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section - Game Preview with Animations */}
          <div className="w-full lg:w-1/2 bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700 flex flex-col">
            <h2 className="text-2xl font-semibold text-blue-400 mb-6 flex items-center">
              <span className="mr-2">🎮</span> Game Preview
            </h2>
            
            <div className="flex-grow flex flex-col items-center justify-center p-4">
              <div className="relative w-full max-w-md aspect-square rounded-xl overflow-hidden border-4 border-yellow-500 shadow-2xl transition-all duration-700 hover:scale-105 animate-pulse-subtle">
                <img 
                  src="./Twist mode.jpg" 
                  alt="Snakes and Ladders Board" 
                  className="w-full h-full object-cover"
                />
                
                {/* Animated elements overlaying the board */}
                <div className="absolute inset-0">
                  {/* Snake animation element */}
                  <div className="absolute top-1/4 left-1/3 w-16 h-16 animate-bounce opacity-80">
                    <span className="text-3xl">🐍</span>
                  </div>
                  
                  {/* Ladder animation element */}
                  <div className="absolute bottom-1/3 right-1/4 w-16 h-16 animate-pulse opacity-80">
                    <span className="text-3xl">🪜</span>
                  </div>
                  
                  {/* Dice animation element */}
                  <div className="absolute bottom-1/4 left-1/4 w-16 h-16 animate-spin-slow opacity-80">
                    <span className="text-3xl">🎲</span>
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                  <h3 className="text-2xl font-bold text-white shadow-text">
                    {selectedTheme === 'classic' ? 'Classic Mode' : 'Twist Mode'}
                  </h3>
                  <p className ="text-yellow-300 font-medium">
                    {selectedTheme === 'classic' 
                      ? 'Traditional fun for everyone!' 
                      : 'New challenges await you!'}
                  </p>
                </div>
              </div>
              
              <div className="mt-8 bg-gray-900 bg-opacity-50 p-4 rounded-lg w-full max-w-md transform transition-all duration-500 hover:bg-opacity-70">
                <h3 className="text-lg font-medium text-yellow-400 mb-2">
                  {selectedTheme === 'classic' ? 'Classic Rules:' : 'Twist Mode Features:'}
                </h3>
                <ul className="text-gray-300 space-y-2 list-disc pl-5">
                  {selectedTheme === 'classic' ? (
                    <>
                      <li>Roll the dice to move your token</li>
                      <li>Climb ladders to advance quickly</li>
                      <li>Avoid snakes or slide back down</li>
                      <li>First player to reach 100 wins!</li>
                    </>
                  ) : (
                    <>
                      <li><span className="text-pink-400">Push Attack:</span> Send opponents backwards</li>
                      <li><span className="text-cyan-400">Double Dice:</span> Get extra rolls on ladders</li>
                      <li><span className="text-purple-400">Ghost Mode:</span> Pass through snakes once</li>
                      <li>All special abilities included for maximum fun!</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Right Section - Player Setup */}
          <div className="w-full lg:w-1/2 bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-blue-400 mb-6 flex items-center">
              <span className="mr-2">🧑‍🤝‍🧑</span> Player Setup
            </h2>
            
            {/* Number of Players */}
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-300 mb-3">Number of Players:</h3>
              <div className="grid grid-cols-3 gap-3">
                {[2, 3, 4].map((count) => (
                  <div
                    key={count}
                    className={`border rounded-lg p-3 text-center cursor-pointer transition-all transform hover:scale-105 ${
                      playerCount === count
                        ? 'border-blue-400 bg-blue-700 bg-opacity-40 text-white shadow-glow'
                        : 'border-gray-600 text-gray-300 hover:border-blue-400 hover:text-white'
                    }`}
                    onClick={() => handlePlayerCountChange(count)}
                  >
                    {count} Players
                  </div>
                ))}
              </div>
            </div>
            
            {/* Player Names - Now displayed horizontally in a grid */}
            <div className="mb-8">
              <h3 className="text-md font-medium text-gray-300 mb-3">Player Names:</h3>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: playerCount }).map((_, index) => (
                  <div key={index} className="transform transition-all duration-300 hover:translate-y-1">
                    <div className="flex flex-col">
                      <label htmlFor={`player${index + 1}`} className="block font-medium text-gray-300 mb-1">
                        Player {index + 1}:
                      </label>
                      <input 
                        type="text" 
                        id={`player${index + 1}`} 
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                        value={playerNames[index]}
                        onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                        placeholder={`Enter name`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Theme Selection */}
            <div className="mb-8">
              <h3 className="text-md font-medium text-gray-300 mb-3">Game Mode:</h3>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all transform hover:scale-105 ${
                    selectedTheme === 'classic' 
                      ? 'border-blue-400 bg-gradient-to-r from-green-600 to-green-400 bg-opacity-30 text-white shadow-glow' 
                      : 'border-gray- 600 bg-gray-800 text-gray-300 hover:border-blue-400 hover:text-white'
                  }`}
                  onClick={() => setSelectedTheme('classic')}
                >
                  <div className="text-2xl mb-1 animate-pulse">🎯</div>
                  <div className="font-medium">Classic Mode</div>
                  <div className="text-xs mt-1 opacity-75">Traditional rules</div>
                </div>
                
                <div 
                  className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all transform hover:scale-105 ${
                    selectedTheme === 'twist' 
                      ? 'border-blue-400 bg-gradient-to-r from-purple-600 to-pink-400 bg-opacity-30 text-white shadow-glow' 
                      : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-blue-400 hover:text-white'
                  }`}
                  onClick={() => setSelectedTheme('twist')}
                >
                  <div className="text-2xl mb-1 animate-spin-slow">💫</div>
                  <div className="font-medium">Twist Mode</div>
                  <div className="text-xs mt-1 opacity-75">All special abilities included</div>
                </div>
              </div>
            </div>
            
            {/* Game Details */}
            {selectedTheme === 'twist' && (
              <div className="mb-8 p-4 bg-purple-900 bg-opacity-30 rounded-lg border border-purple-500 transform transition-all duration-500">
                <h3 className="text-md font-medium text-purple-300 mb-2 flex items-center">
                  <span className="mr-2">✨</span> Twist Mode Includes:
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-purple-800 bg-opacity-40 p-3 rounded-lg text-center">
                    <div className="text-xl mb-1">🔙</div>
                    <div className="text-sm font-medium text-white">Push Attack</div>
                  </div>
                  <div className="bg-blue-800 bg-opacity-40 p-3 rounded-lg text-center">
                    <div className="text-xl mb-1">🎲</div>
                    <div className="text-sm font-medium text-white">Double Dice</div>
                  </div>
                  <div className="bg-pink-800 bg-opacity-40 p-3 rounded-lg text-center">
                    <div className="text-xl mb-1">👻</div>
                    <div className="text-sm font-medium text-white">Ghost Mode</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Start Game Button */}
            <button 
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-4 px-4 rounded-md text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center"
              onClick={handleStartGame}
            >
              <span className="mr-2 animate-bounce-subtle">🚀</span> START GAME NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}