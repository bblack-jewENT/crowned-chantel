import React, { useState } from "react";
import { CHANTEL_IMAGES } from "../constants";
import { ModelImage } from "../types";

const Gallery: React.FC = () => {
  const [filter, setFilter] = useState<string>("All");
  const [selectedImage, setSelectedImage] = useState<ModelImage | null>(null);

  const categories = ["All", "Pageant", "High Fashion", "Casual", "Studio"];

  const filteredImages =
    filter === "All"
      ? CHANTEL_IMAGES
      : CHANTEL_IMAGES.filter((img) => img.category === filter);

  return (
    <section id="gallery" className="py-24 px-4 md:px-8 bg-[#080808]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm tracking-[0.4em] text-amber-400 uppercase mb-4">
            The Portfolio
          </h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold mb-8">
            Iconic Moments
          </h3>

          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full border transition-all uppercase text-xs tracking-widest ${
                  filter === cat
                    ? "gold-bg text-black border-transparent"
                    : "bg-transparent text-gray-400 border-white/10 hover:border-amber-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {filteredImages.map((img, idx) => (
            <div
              key={idx}
              className="relative group overflow-hidden rounded-xl cursor-pointer"
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img.url}
                alt={img.title || "Chantel Modeling"}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-amber-400 text-xs tracking-widest uppercase mb-1">
                  {img.category}
                </span>
                <h4 className="text-white text-lg font-serif">{img.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-8 right-8 text-white text-3xl hover:text-amber-400 transition-colors"
            title="Close image"
          >
            <i className="fas fa-times"></i>
          </button>
          <div
            className="relative max-w-full max-h-full flex flex-col md:flex-row items-center gap-8"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl shadow-gold/10"
            />
            <div className="text-center md:text-left space-y-4">
              <span className="text-amber-400 tracking-[0.3em] uppercase text-sm">
                {selectedImage.category}
              </span>
              <h4 className="text-4xl font-serif font-bold text-white">
                {selectedImage.title}
              </h4>
              <p className="text-gray-400 max-w-xs italic">
                Capture by Professional Photography Suite. All rights reserved ©
                2024.
              </p>
              <div className="flex gap-4 pt-4">
                <button
                  className="p-3 rounded-full bg-white/5 hover:bg-amber-400 hover:text-black transition-all"
                  title="Instagram"
                >
                  <i className="fab fa-instagram"></i>
                </button>
                <button
                  className="p-3 rounded-full bg-white/5 hover:bg-amber-400 hover:text-black transition-all"
                  title="Share"
                >
                  <i className="fas fa-share-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
