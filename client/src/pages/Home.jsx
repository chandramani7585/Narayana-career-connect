import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User, BookOpen, Users, Globe, MessageCircle, Layers } from "lucide-react";

const Home = () => {
  const [snowflakes, setSnowflakes] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Create lightweight snow effect
  useEffect(() => {
    // Generate a limited number of snowflakes for performance
    const generateSnowflakes = () => {
      const newSnowflakes = [];
      const flakeCount = Math.min(window.innerWidth / 100, 25); // Limit based on screen width, max 25
      
      for (let i = 0; i < flakeCount; i++) {
        newSnowflakes.push({
          id: i,
          left: Math.random() * 100, // percentage position
          size: Math.random() * 0.7 + 0.9, // between 0.9 and 1.6rem
          opacity: Math.random() * 0.6 + 0.3, // between 0.3 and 0.9
          delay: Math.random() * 5, // stagger the animation start
          duration: Math.random() * 15 + 15, // between 15 and 30 seconds
          character: Math.random() > 0.8 ? '❄' : '•', // Occasionally use snowflake symbol
          sway: 2 + Math.random() * 3, // Sway amount (for wiggle)
        });
      }
      setSnowflakes(newSnowflakes);
    };

    // Track mouse position for interactive effects
    const handleMouseMove = (e) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) * 2 - 1, 
        y: (e.clientY / window.innerHeight) * 2 - 1 
      });
    };

    generateSnowflakes();
    window.addEventListener('mousemove', handleMouseMove);

    // Clean up the effect
    return () => {
      setSnowflakes([]);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Features data with new icons and descriptions using original content
  const features = [
    {
      title: 'Mentorship',
      description: 'Connect with mentors who can guide you towards your goals.',
      icon: <User size={32} />,
      bgColor: 'from-blue-500 to-blue-400',
      link: '/connections'
    },
    {
      title: 'Resources',
      description: 'Explore valuable resources tailored for your growth.',
      icon: <BookOpen size={32} />,
      bgColor: 'from-purple-500 to-indigo-400',
      link: '/resources'
    },
    {
      title: 'Networking',
      description: 'Build meaningful connections with professionals and peers.',
      icon: <Users size={32} />,
      bgColor: 'from-green-500 to-teal-400',
      link: '/myconnections'
    },
    {
      title: 'Communication',
      description: 'Engage in meaningful conversations and discussions.',
      icon: <MessageCircle size={32} />,
      bgColor: 'from-orange-500 to-amber-400',
      link: '/messages'
    },
  ];

  return (
    <>
      <style jsx>{`
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .text-gradient {
          background: linear-gradient(to right, #ffffff, #a3c1ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hover-glow:hover {
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
        }
        .feature-card {
          transition: transform 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-5px);
        }
        .snowflake {
          position: fixed;
          pointer-events: none;
          z-index: 100;
          color: white;
          text-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
          will-change: transform, opacity;
          animation: snowfall calc(var(--duration) * 1s) linear infinite;
          filter: blur(0);
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }
        .pulse-effect {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes snowfall {
          0% {
            transform: translate3d(calc(var(--offset-x) * 1px), -10vh, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: var(--opacity);
            transform: translate3d(calc(var(--offset-x) * 1px), calc(10vh + var(--offset-y) * 1px), 0) rotate(45deg);
          }
          90% {
            opacity: var(--opacity);
            transform: translate3d(calc(var(--sway) * -1vw + var(--offset-x) * 1px), calc(90vh + var(--offset-y) * 1px), 0) rotate(315deg);
          }
          100% {
            transform: translate3d(calc(var(--sway) * 1vw + var(--offset-x) * 1px), calc(110vh + var(--offset-y) * 1px), 0) rotate(360deg);
            opacity: 0;
          }
        }
        
        /* Parallax hover effect on feature cards */
        .parallax-card {
          transform-style: preserve-3d;
          transform: perspective(1000px);
          transition: transform 0.3s ease;
        }
        .parallax-content {
          transform: translateZ(20px);
          transition: transform 0.3s ease;
        }
        
        /* Radial glow effect around mouse */
        .mouse-glow {
          position: fixed;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          pointer-events: none;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%);
          z-index: 80;
          transform: translate(-50%, -50%);
          filter: blur(5px);
          mix-blend-mode: screen;
        }
      `}</style>

      {/* Mouse glow effect */}
      <div 
        className="mouse-glow" 
        style={{ 
          left: `${mousePosition.x * 50 + 50}%`,
          top: `${mousePosition.y * 50 + 50}%`,
        }}
      ></div>

      {/* Snowflake Effect */}
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            fontSize: `${flake.size}rem`,
            '--opacity': flake.opacity,
            '--duration': flake.duration,
            '--offset-x': (mousePosition.x * 20).toFixed(1),
            '--offset-y': (mousePosition.y * 10).toFixed(1),
            '--sway': flake.sway,
            animationDelay: `${flake.delay}s`,
          }}
        >
          {flake.character}
        </div>
      ))}

      <div className="min-h-screen bg-gray-950 text-white">
        {/* Hero Section */}
        <header className="relative bg-blue-900 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-black"></div>
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.2) 0%, transparent 40%)' }}></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="py-24 sm:py-32">
              <div className="text-center">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gradient pulse-effect">
                  Empower Your Career <br/> <span className="text-blue-300">With Narayana Connect</span>
                </h1>
                <p className="mt-8 text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto">
                  Explore connections, share resources, find mentors, and create a network that helps you achieve your dreams.
                </p>
                <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
                  <Link
                    to="/register"
                    className="px-8 py-4 bg-white text-blue-900 font-semibold rounded-full hover-glow transition-all duration-300 border border-transparent hover:bg-blue-50"
                    aria-label="Get started with Narayana Career Connect"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/stories"
                    className="px-8 py-4 glass-effect text-white font-semibold rounded-full hover-glow transition-all duration-300"
                    aria-label="View success stories"
                  >
                    View Stories
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-gray-950 to-transparent"></div>
          <div className="absolute -bottom-1 left-0 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path fill="#030712" fillOpacity="1" d="M0,96L60,106.7C120,117,240,139,360,138.7C480,139,600,117,720,112C840,107,960,117,1080,133.3C1200,149,1320,171,1380,181.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
            </svg>
          </div>
        </header>

        {/* Features Section */}
        <section id="features" className="py-24 bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-5xl font-bold text-gradient">
                Features That Drive Your Success
              </h2>
              <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
                Discover the tools and resources designed to enhance your career journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, idx) => {
                // Custom parallax effect handler
                const handleMouseMove = (e) => {
                  const card = e.currentTarget;
                  const rect = card.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  
                  const centerX = rect.width / 2;
                  const centerY = rect.height / 2;
                  
                  const angleX = (y - centerY) / 25;
                  const angleY = (centerX - x) / 25;
                  
                  card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
                };
                
                const handleMouseLeave = (e) => {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
                };
                
                return (
                  <Link 
                    to={feature.link}
                    key={idx}
                    className="feature-card glass-effect rounded-3xl overflow-hidden parallax-card"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className={`h-1 w-full bg-gradient-to-r ${feature.bgColor}`}></div>
                    <div className="p-8 parallax-content">
                      <div className={`w-16 h-16 bg-gradient-to-br ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 text-white`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                      <p className="text-blue-100 mb-6">
                        {feature.description}
                      </p>
                      <div
                        className="inline-flex items-center text-blue-300 hover:text-white transition-colors group"
                      >
                        <span>Explore</span>
                        <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="py-24 bg-gradient-to-b from-gray-950 to-blue-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gradient mb-6">Experience the Difference</h2>
                <p className="text-xl text-blue-100 mb-8">
                  Our platform is designed to make your career journey smoother and more successful.
                </p>
                <ul className="space-y-4">
                  {[
                    "Connect with experienced mentors",
                    "Access valuable career resources",
                    "Build a powerful professional network",
                    "Engage in meaningful discussions"
                  ].map((item, idx) => (
                    <li 
                      key={idx}
                      className="flex items-start"
                    >
                      <svg className="w-6 h-6 text-blue-400 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-lg text-blue-100">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="hidden lg:block">
                <div className="glass-effect rounded-3xl overflow-hidden">
                  <img
                    src="/api/placeholder/600/400"
                    alt="Career Growth"
                    className="w-full h-full object-cover rounded-3xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 bg-blue-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950 to-blue-900"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h2 className="text-4xl sm:text-5xl font-bold text-gradient mb-6">
                Ready to Take the Next Step?
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
                Join the Narayana Career Connect platform and take control of your future.
              </p>

              <Link
                to="/register"
                className="inline-block px-10 py-5 bg-orange-500 text-white font-semibold rounded-full hover-glow transition-all text-lg hover:bg-orange-600"
                aria-label="Get started with Narayana Career Connect"
              >
                Get Started Now
              </Link>
              
              {/* Stats counters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
                {[
                  { number: "Connections", label: "Build Your Network" },
                  { number: "Resources", label: "For Your Growth" },
                  { number: "Mentors", label: "Guide Your Path" },
                  { number: "Success", label: "Achieve Your Goals" }
                ].map((stat, idx) => (
                  <div 
                    key={idx}
                    className="glass-effect rounded-2xl p-6"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-white mb-2">{stat.number}</div>
                    <div className="text-blue-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Bottom wave */}
          <div className="absolute bottom-0 left-0 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path fill="#030712" fillOpacity="1" d="M0,160L40,165.3C80,171,160,181,240,176C320,171,400,149,480,154.7C560,160,640,192,720,202.7C800,213,880,203,960,181.3C1040,160,1120,128,1200,117.3C1280,107,1360,117,1400,122.7L1440,128L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
            </svg>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;