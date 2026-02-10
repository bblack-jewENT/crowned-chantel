
import React from 'react';
import { ACHIEVEMENTS } from '../constants';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 px-4 md:px-8 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="w-full lg:w-1/2 relative">
          <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-white/5 group">
            <img 
              src="/img/WhatsApp Image 2026-01-28 at 13.53.50.jpeg" 
              alt="Chantel Coronation" 
              className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-1000"
            />
          </div>
          {/* Decorative floating square */}
          <div className="absolute -top-10 -right-10 w-48 h-48 gold-bg rounded-2xl -z-10 opacity-20 blur-2xl"></div>
          <div className="absolute -bottom-6 -left-6 px-8 py-6 bg-amber-400 text-black font-bold rounded-lg shadow-xl animate-float">
            <span className="block text-3xl">5+</span>
            <span className="text-xs uppercase tracking-widest">Titles Won</span>
          </div>
        </div>

        <div className="w-full lg:w-1/2 space-y-8">
          <div>
            <h2 className="text-amber-400 text-sm tracking-[0.4em] uppercase mb-4">Her Story</h2>
            <h3 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6">
              Grace Under <br /> The Crown
            </h3>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              Chantel is more than a model; she is a visionary in the world of pageantry and fashion. Beginning her journey on the local runways of South Africa, she quickly rose to prominence through her unique blend of traditional grace and contemporary high-fashion edge.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              Her recent victory as Miss Dauntless Models Queen 2024 has solidified her place as a leader and role model for aspiring models across the continent. She advocates for authenticity, discipline, and the power of presence.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm">Key Achievements</h4>
            <ul className="space-y-3">
              {ACHIEVEMENTS.map((ach, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-300">
                  <i className="fas fa-crown text-amber-400 text-sm"></i>
                  <span>{ach}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}</style>
    </section>
  );
};

export default About;
