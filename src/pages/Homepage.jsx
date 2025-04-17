import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, Dice1, MousePointer, SkipForward, Smile, Info, X, Award, Users, Settings } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Homepage() {
  const navigate = useNavigate();
  const [rulesModalOpen, setRulesModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);

  // Navigation functions
  const navigateToStartGame = () => {
    navigate('/game');
  };

  // Scroll to section functions
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to href anchor
  const scrollToAnchor = (anchorId) => {
    const element = document.getElementById(anchorId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Add IDs to sections for anchor navigation
  useEffect(() => {
    // Add IDs to existing refs if they don't have them
    if (heroRef.current && !heroRef.current.id) {
      heroRef.current.id = 'home';
    }
    if (featuresRef.current && !featuresRef.current.id) {
      featuresRef.current.id = 'features';
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Navbar />

      <section
        ref={heroRef}
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(16, 24, 39, 0.8) 0%, rgba(9, 16, 29, 0.95) 100%)'
        }}
      >
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/5 w-64 h-64 bg-green-500 rounded-full filter blur-3xl opacity-20"
            style={{ transform: `translateY(${scrollY * 0.05}px)` }}></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl opacity-10"
            style={{ transform: `translateY(${-scrollY * 0.07}px)` }}></div>
          <div className="absolute top-20 left-20 text-6xl animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.1}px) rotate(${scrollY * 0.05}deg)` }}>⚄</div>
          <div className="absolute bottom-40 right-20 text-4xl animate-pulse"
            style={{ transform: `translateY(${-scrollY * 0.12}px) rotate(${-scrollY * 0.08}deg)` }}>⚂</div>
          <div className="absolute top-1/3 left-1/4 text-5xl animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.15}px)` }}>🐍</div>
          <div className="absolute bottom-1/3 right-1/3 text-4xl animate-pulse"
            style={{ transform: `translateY(${-scrollY * 0.08}px)` }}>🪜</div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className={`md:w-1/2 transform transition-all duration-700 ${scrollY < 100 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
                Snake & Ladder 2.0
              </h1>
              <h2 className="text-2xl text-cyan-400 mb-4">
                ✨ Reinventing the Classic – With a Twist!
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Welcome to a whole new <strong>Snake & Ladder</strong> experience — where strategy meets chaos, and the board is full of surprises! 🐍🪜
              </p>
              <div className="space-y-4">
                <button
                  onClick={navigateToStartGame}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white text-lg font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="absolute top-0 left-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  <span className="relative flex items-center justify-center">
                    🎮 Start Game <ChevronRight className="ml-2 h-5 w-5" />
                  </span>
                </button>
              </div>
            </div>

            <div className={`md:w-1/2 mt-10 md:mt-0 flex justify-center transform transition-all duration-700 ${scrollY < 100 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="relative w-full max-w-md">
                <div className="relative animate-float">
                  <img
                    src="https://img.freepik.com/premium-vector/snakes-ladders-board-game-children_600323-3834.jpg?semt=ais_hybrid&w=740"
                    alt="Snake and Ladder Game Board"
                    className="rounded-2xl shadow-2xl shadow-blue-500/20 border-4 border-gray-700"
                  />

                  <div className="absolute -top-6 -right-6 text-5xl animate-bounce-slow">🎲</div>
                  <div className="absolute -bottom-6 -left-6 text-5xl animate-pulse">🐍</div>

                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/20 to-blue-600/20 opacity-60 blur-md -z-10"></div>
                </div>

                <div className="absolute top-1/4 -left-6 bg-red-500 w-8 h-8 rounded-full border-2 border-white shadow-lg animate-orbit-1"></div>
                <div className="absolute top-1/2 -right-6 bg-blue-500 w-8 h-8 rounded-full border-2 border-white shadow-lg animate-orbit-2"></div>
                <div className="absolute bottom-1/4 -left-6 bg-yellow-500 w-8 h-8 rounded-full border-2 border-white shadow-lg animate-orbit-3"></div>
                <div className="absolute top-1/3 -right-10 bg-green-500 w-8 h-8 rounded-full border-2 border-white shadow-lg animate-orbit-4"></div>
              </div>
            </div>
          </div>
        </div>

        <div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
          onClick={() => scrollToSection(featuresRef)}
        >
          <svg className="w-6 h-6 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* Featured Twists Section */}
      <section id="play" className="py-24 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/5 w-64 h-64 bg-cyan-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">🧠 New Gameplay Twists</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Not your childhood Snake & Ladder—we've added chaos, strategy, and a dash of mischief
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Twist 1 */}
            <div className="bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700 transform transition duration-300 hover:scale-105 hover:border-green-500/50 hover:shadow-green-500/20 group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:animate-pulse">
                <Dice1 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="mr-2">🎯</span>
                Push Attack
              </h3>
              <p className="text-gray-400">Land on opponent? Push them 3 tiles back!</p>
            </div>

            {/* Twist 2 */}
            <div className="bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700 transform transition duration-300 hover:scale-105 hover:border-purple-500/50 hover:shadow-purple-500/20 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:animate-pulse">
                <MousePointer className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="mr-2">🎲</span>
                Double Dice
              </h3>
              <p className="text-gray-400">Roll twice — but risk landing on a snake!</p>
            </div>

            {/* Twist 3 */}
            <div className="bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700 transform transition duration-300 hover:scale-105 hover:border-blue-500/50 hover:shadow-blue-500/20 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:animate-pulse">
                <SkipForward className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="mr-2">👻</span>
                Ghost Mode
              </h3>
              <p className="text-gray-400">Become invisible to snakes for 3 moves</p>
            </div>

            {/* Twist 4 */}
            <div className="bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700 transform transition duration-300 hover:scale-105 hover:border-cyan-500/50 hover:shadow-cyan-500/20 group">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:animate-pulse">
                <Smile className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="mr-2">🔀</span>
                Reverse Ladder
              </h3>
              <p className="text-gray-400">One ladder secretly sends you down 😈</p>
            </div>

            {/* Twist 5 */}
            <div className="bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700 transform transition duration-300 hover:scale-105 hover:border-red-500/50 hover:shadow-red-500/20 group">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:animate-pulse">
                <X className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="mr-2">💣</span>
                Trap Tile
              </h3>
              <p className="text-gray-400">Random tile explodes and pulls you back</p>
            </div>

            {/* Twist 6 */}
            <div className="bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700 transform transition duration-300 hover:scale-105 hover:border-yellow-500/50 hover:shadow-yellow-500/20 group">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center mb-6 group-hover:animate-pulse">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="mr-2">🎭</span>
                Mystery Powerup
              </h3>
              <p className="text-gray-400">Unlock a random ability: boost or curse!</p>
            </div>
          </div>

          {/* New Rules Section */}
          <div className="mt-16 bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4">🚀 New Rules. More Fun.</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Play fair… or play <strong className="text-purple-400">dirty</strong> 👀</li>
              <li>Choose your fate: classic or chaos mode</li>
              <li>Surprise your friends and outsmart your opponents</li>
            </ul>

            <div className="mt-8 text-center">
              <button
                onClick={() => setRulesModalOpen(true)}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl text-lg font-medium shadow-lg hover:shadow-purple-500/30 transition-all duration-300 inline-flex items-center group relative overflow-hidden"
              >
                <span className="absolute top-0 left-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <span className="relative flex items-center">
                  <Info className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                  Learn More About These Twists
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Rules Modal */}
      {rulesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl shadow-purple-500/10">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">Game Twist Details</h3>
              <button
                onClick={() => setRulesModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-green-400 flex items-center mb-2">
                    <span className="mr-2">🎯</span> Push Attack
                  </h4>
                  <p className="text-gray-300">When your piece lands on the same tile as another player, you can push them back 3 spaces. Use this to strategically block opponents from reaching ladders or push them onto snakes!</p>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-purple-400 flex items-center mb-2">
                    <span className="mr-2">🎲</span> Double Dice
                  </h4>
                  <p className="text-gray-300">Take a risk by rolling two dice instead of one! Move the sum of both dice, but if either die shows a 1, you automatically land on the nearest snake. High risk, high reward!</p>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-blue-400 flex items-center mb-2">
                    <span className="mr-2">👻</span> Ghost Mode
                  </h4>
                  <p className="text-gray-300">Activate Ghost Mode to become invisible to snakes for your next 3 moves. If you land on a snake while in Ghost Mode, you simply stay on that tile instead of sliding down.</p>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-cyan-400 flex items-center mb-2">
                    <span className="mr-2">🔀</span> Reverse Ladder
                  </h4>
                  <p className="text-gray-300">One ladder on the board is secretly a trap! It looks like a normal ladder, but will send you down instead of up. The position changes each game, so climb ladders at your own risk!</p>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-red-400 flex items-center mb-2">
                    <span className="mr-2">💣</span> Trap Tile
                  </h4>
                  <p className="text-gray-300">Random tiles become explosive traps during gameplay. Step on one, and you'll be pulled back to a previous position. No one knows where they are until someone triggers them!</p>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-yellow-400 flex items-center mb-2">
                    <span className="mr-2">🎭</span> Mystery Powerup
                  </h4>
                  <p className="text-gray-300">Collect mystery powerups throughout the game. They could give you amazing abilities like teleportation or immunity, or they might curse you with penalties! Open at your own risk.</p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setRulesModalOpen(false)}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section
        ref={featuresRef}
        id="features"
        className="py-24 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-1/3 left-1/5 w-72 h-72 bg-blue-600 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">🧩 Features That Make It Legendary</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We didn't just rebuild Snake & Ladder. We reimagined it — with stunning design, addictive gameplay, and modern twists.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-700 transform transition duration-300 hover:scale-105 hover:border-blue-500/50 hover:shadow-blue-500/20 group">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:animate-pulse">
                <div className="text-white text-2xl">🎮</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Local Multiplayer</h3>
              <p className="text-gray-400">Play with friends on the same device — turn-based fun, just like old-school gaming!</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-700 transform transition duration-300 hover:scale-105 hover:border-purple-500/50 hover:shadow-purple-500/20 group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:animate-pulse">
                <div className="text-white text-2xl">🧠</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Smart Game Logic</h3>
              <p className="text-gray-400">Handles dice rolls, player turns, snakes, ladders, and even edge cases — smoothly and fairly.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-700 transform transition duration-300 hover:scale-105 hover:border-cyan-500/50 hover:shadow-cyan-500/20 group">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:animate-pulse">
                <div className="text-white text-2xl">🪄</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Game Twists</h3>
              <p className="text-gray-400">Push opponents back, trigger traps, or go invisible with crazy new rules to spice up gameplay.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-700 transform transition duration-300 hover:scale-105 hover:border-green-500/50 hover:shadow-green-500/20 group">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:animate-pulse">
                <div className="text-white text-2xl">📱</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Fully Responsive UI</h3>
              <p className="text-gray-400">Designed for mobile, tablet, and desktop — play anytime, anywhere.</p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-700 transform transition duration-300 hover:scale-105 hover:border-yellow-500/50 hover:shadow-yellow-500/20 group">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:animate-pulse">
                <div className="text-white text-2xl">🔊</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Sound Effects</h3>
              <p className="text-gray-400">Feel every move with immersive audio: dice roll, snake bite, ladder climb & more!</p>
            </div>

            {/* Feature 6 - Coming Soon */}
            <div className="bg-gradient-to-br from-gray-800/40 to-purple-900/20 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-purple-700/30 transform transition duration-300 hover:scale-105 hover:border-purple-500/50 hover:shadow-purple-500/20 group relative overflow-hidden">
              {/* Sparkle animation in background */}
              <div className="absolute -right-4 -top-4 text-2xl animate-pulse">✨</div>
              <div className="absolute right-12 top-16 text-lg animate-pulse-slow">✨</div>
              <div className="absolute right-8 bottom-12 text-xl animate-pulse-fast">✨</div>

              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:animate-pulse">
                <div className="text-white text-2xl">✨</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Coming Soon</h3>
              <p className="text-gray-400">Online Multiplayer (via Socket.IO), AI mode, and even more wild game twists!</p>

              {/* "Coming Soon" badge */}
              <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider animate-pulse">
                Soon
              </div>
            </div>
          </div>

          {/* Feature highlight banner */}
          <div className="mt-16 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm p-6 rounded-2xl border border-blue-700/30 shadow-lg transform transition hover:shadow-blue-500/20">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-3/4">
                <h3 className="text-2xl font-bold text-white mb-2">Ready to experience our New Snake & Ladder 2.O?</h3>
                <p className="text-gray-300">Six innovative features, Join thousands of players already enjoying Snake & Ladder 2.0</p>
              </div>
              <div className="mt-6 md:mt-0">
                <button 
                  onClick={navigateToStartGame}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl text-lg font-medium shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1 transition-all duration-300"
                >
                  Start Playing Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">🐍 Snake & Ladder — Modern Edition</div>
              <p className="text-gray-500 mt-2">Reimagining classic games for modern players</p>
            </div>
            <div className="flex space-x-6">
              <a href="#features" onClick={(e) => {
                e.preventDefault();
                scrollToAnchor('features');
              }} className="text-gray-400 hover:text-white transition-colors duration-200">Features</a>
              <a href="#play" onClick={(e) => {
                e.preventDefault();
                scrollToAnchor('play');
              }} className="text-gray-400 hover:text-white transition-colors duration-200">New Twists</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-sm">Built with ❤️ by Team VIZION 2.O</p>
            <p className="text-xs mt-4 text-gray-500">© 2025 VIZION 2.O. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}