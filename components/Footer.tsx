import React from "react";
import { Section } from "../types";

interface FooterProps {
  onNavClick: (section: Section) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  return (
    <footer className="bg-black border-t border-white/5 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div
          className="flex items-center gap-2 mb-8 cursor-pointer"
          onClick={() => onNavClick(Section.HERO)}
        >
          <div className="w-8 h-8 rounded-full gold-bg flex items-center justify-center text-black font-bold text-sm">
            C
          </div>
          <span className="text-lg font-serif font-bold gold-gradient uppercase tracking-widest">
            Crowned Chantel
          </span>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-12 gap-y-4 mb-12">
          {[
            { id: Section.HERO, label: "Home" },
            { id: Section.GALLERY, label: "Portfolio" },
            { id: Section.ABOUT, label: "About" },
            { id: Section.STATS, label: "Stats" },
            { id: Section.ASSISTANT, label: "Assistant" },
            { id: Section.CHARITY, label: "Charity" },
            { id: Section.CONTACT, label: "Booking" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavClick(item.id)}
              className="text-gray-400 uppercase text-xs tracking-widest hover:text-amber-400 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex gap-8 mb-12">
          {[
            {
              icon: "instagram",
              url: "https://www.instagram.com/sithole_nkanyani/",
            },
            {
              icon: "facebook-f",
              url: "https://www.facebook.com/share/1FxmZWSe9X/?mibextid=wwXIfr",
            },
            {
              icon: "tiktok",
              url: "https://www.tiktok.com/@chantelkulani?_r=1&_t=ZS-93pK4zXP5of",
            },
          ].map((social, idx) => (
            <a
              key={idx}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:gold-bg hover:text-black hover:border-transparent transition-all"
            >
              <i className={`fab fa-${social.icon}`}></i>
            </a>
          ))}
        </div>

        <div className="text-gray-600 text-xs tracking-widest uppercase text-center">
          © 2026 Crowned Chantel. All Rights Reserved.{" "}
          <br className="md:hidden" />
          <span className="hidden md:inline mx-2">|</span>
          Empowering the next generation.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
