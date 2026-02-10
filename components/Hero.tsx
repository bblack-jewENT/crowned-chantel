
import React from 'react';

interface HeroProps {
  onCtaClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Video/Image Placeholder */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://storage.googleapis.com/public-media-artifacts/ai-generated/image-25.png" 
          alt="Chantel Hero"
          className="w-full h-full object-cover opacity-40 scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h2 className="text-amber-400 text-sm md:text-base font-medium tracking-[0.5em] uppercase animate-slideDown">
            Miss Dauntless Models Queen 2024
          </h2>
          <h1 className="text-5xl md:text-8xl font-serif font-bold gold-gradient drop-shadow-2xl animate-fadeIn">
            Chantel
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed animate-slideUp">
            Redefining grace, elegance, and high-fashion modeling on the global stage.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-fadeInDelay">
          <button 
            onClick={onCtaClick}
            className="px-10 py-4 gold-bg text-black font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-transform shadow-xl shadow-amber-500/20"
          >
            Explore Portfolio
          </button>
          <button className="px-10 py-4 bg-transparent border border-white/30 hover:border-amber-400 text-white font-bold uppercase tracking-widest rounded-full transition-all">
            Inquire Now
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <i className="fas fa-chevron-down text-2xl text-amber-400"></i>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDelay {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-fadeIn { animation: fadeIn 1s ease-out forwards; }
        .animate-fadeInDelay { animation: fadeIn 1.2s ease-out 0.4s forwards; opacity: 0; }
        .animate-slideDown { animation: slideDown 0.8s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.8s ease-out forwards; }
        .animate-slow-zoom { animation: slow-zoom 20s linear infinite alternate; }
      `}</style>
    </section>
  );
};

export default Hero;
