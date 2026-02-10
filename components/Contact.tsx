import React from "react";

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 px-4 md:px-8 bg-[#080808]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
        <div className="w-full lg:w-1/3 space-y-8">
          <div>
            <h2 className="text-amber-400 text-sm tracking-[0.4em] uppercase mb-4">
              Inquiries
            </h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Secure Your Date
            </h3>
            <p className="text-gray-400">
              For runway bookings, pageant coaching, commercial inquiries, or
              guest appearances, please use the form or reach out directly.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:gold-bg group-hover:text-black transition-all">
                <i className="fas fa-envelope"></i>
              </div>
              <div>
                <span className="block text-xs text-gray-500 uppercase tracking-widest">
                  Email
                </span>
                <span className="text-lg text-white">
                  bookings@chantel.queen
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:gold-bg group-hover:text-black transition-all">
                <i className="fas fa-phone"></i>
              </div>
              <div>
                <span className="block text-xs text-gray-500 uppercase tracking-widest">
                  Phone
                </span>
                <span className="text-lg text-white">+27 82 000 0000</span>
              </div>
            </div>
            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:gold-bg group-hover:text-black transition-all">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div>
                <span className="block text-xs text-gray-500 uppercase tracking-widest">
                  Base
                </span>
                <span className="text-lg text-white">
                  Johannesburg, South Africa
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-2/3">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-white/5 rounded-3xl border border-white/5">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full bg-black/40 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-black/40 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs uppercase tracking-widest text-gray-400">
                Inquiry Type
              </label>
              <select
                className="w-full bg-black/40 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-amber-400 appearance-none"
                title="Select inquiry type"
              >
                <option>Runway Modeling</option>
                <option>Pageant Coaching</option>
                <option>Commercial/Print</option>
                <option>Brand Collaboration</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs uppercase tracking-widest text-gray-400">
                Message
              </label>
              <textarea
                rows={5}
                placeholder="Tell us more about your inquiry..."
                className="w-full bg-black/40 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-amber-400"
              ></textarea>
            </div>
            <div className="md:col-span-2 pt-4">
              <button className="w-full py-4 gold-bg text-black font-bold uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-transform">
                Send Booking Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
