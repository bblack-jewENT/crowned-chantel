
import React from 'react';
import { STATS } from '../constants';

const Stats: React.FC = () => {
  return (
    <section id="stats" className="py-24 px-4 md:px-8 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto border-y border-white/5 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12">
          {STATS.map((stat, idx) => (
            <div key={idx} className="text-center group">
              <span className="block text-gray-500 text-xs tracking-[0.3em] uppercase mb-2 group-hover:text-amber-400 transition-colors">
                {stat.label}
              </span>
              <span className="text-3xl font-serif text-white block">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-20 p-12 gold-bg rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-gold/10">
          <div className="text-center md:text-left text-black">
            <h4 className="text-3xl font-serif font-bold mb-2">Ready for International Representation</h4>
            <p className="font-medium opacity-80">Download Professional Comp Card (Digital & Print versions)</p>
          </div>
          <button className="px-10 py-4 bg-black text-white rounded-full font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl">
            Download Comp Card
          </button>
        </div>
      </div>
    </section>
  );
};

export default Stats;
