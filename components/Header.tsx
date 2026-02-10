import React, { useState } from "react";
import { Section } from "../types";

interface HeaderProps {
  activeSection: Section;
  onNavClick: (section: Section) => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, onNavClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: Section.HERO, label: "Home" },
    { id: Section.GALLERY, label: "Portfolio" },
    { id: Section.ABOUT, label: "About" },
    { id: Section.STATS, label: "Stats" },
    { id: Section.ASSISTANT, label: "Assistant" },
    { id: Section.CHARITY, label: "Charity" },
    { id: Section.CONTACT, label: "Booking" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => onNavClick(Section.HERO)}
        >
          <div className="w-10 h-10 rounded-full gold-bg flex items-center justify-center text-black font-bold text-xl shadow-lg shadow-gold/20">
            C
          </div>
          <span className="text-xl font-serif font-bold tracking-widest gold-gradient uppercase">
            Crowned Chantel
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavClick(item.id)}
              className={`text-sm tracking-widest uppercase transition-colors hover:text-amber-400 ${
                activeSection === item.id ? "text-amber-400" : "text-gray-400"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          title="Toggle menu"
        >
          <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"}`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/95 border-b border-white/5 p-8 flex flex-col gap-6 items-center animate-fadeIn">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavClick(item.id);
                setIsMenuOpen(false);
              }}
              className={`text-lg tracking-widest uppercase ${
                activeSection === item.id ? "text-amber-400" : "text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
