/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send } from "lucide-react";

export const WhatsAppIconSVG: React.FC<{ className?: string; size?: number }> = ({ className = "w-5 h-5", size }) => (
  <svg
    width={size || 20}
    height={size || 20}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.887-9.885 9.887m0-18.001c-6.108 0-11.077 4.969-11.079 11.078 0 1.95.511 3.858 1.482 5.54l-1.573 5.748 5.88-1.542a11.028 11.028 0 005.286 1.356h.005c6.108 0 11.077-4.969 11.079-11.078.001-2.96-1.15-5.74-3.253-7.843A11.002 11.002 0 0012.051 3.784" />
  </svg>
);

export const WhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = "923343711613";
  const defaultMsg = "Hello Khewara Pink Salt! I would like to inquire about salt products, rates, and availability.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMsg)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="mb-3 w-80 bg-ink-2/95 border-2 border-salt-pink/70 rounded-2xl p-4 shadow-[0_12px_45px_rgba(232,169,160,0.35)] backdrop-blur-xl text-cream pink-shiny-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-cream/15">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-salt-pink/20 border-2 border-salt-pink text-salt-pink flex items-center justify-center shrink-0 shadow-sm">
                  <WhatsAppIconSVG size={18} />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-cream flex items-center gap-1.5">
                    WhatsApp Chat
                    <span className="w-2.5 h-2.5 rounded-full bg-salt-pink animate-pulse inline-block" />
                  </h4>
                  <p className="text-[11px] font-mono font-bold text-salt-pink tracking-wide">
                    Al-Musfira Enterprises Desk
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-cream/10 text-stone hover:text-cream transition-colors"
                aria-label="Close WhatsApp chat popup"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs font-semibold text-cream/90 leading-relaxed mb-4">
              Need instant support, wholesale quotes, or custom orders? Chat directly with our Karachi operations desk on WhatsApp.
            </p>

            <div className="bg-ink-3/90 p-3 rounded-xl border border-salt-pink/30 mb-4 space-y-1.5 shadow-inner">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-stone font-medium">Hotline:</span>
                <span className="text-salt-pink font-extrabold tracking-wider">+92 334 3711613</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-stone font-medium">Status:</span>
                <span className="text-salt-pink font-extrabold flex items-center gap-1">
                  Online &amp; Active
                </span>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-salt-pink hover:bg-cream text-ink font-black rounded-xl text-xs sm:text-sm font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:shadow-[0_4px_25px_rgba(232,169,160,0.6)]"
            >
              <WhatsAppIconSVG size={18} />
              <span className="font-extrabold">Start Chat on WhatsApp</span>
              <Send size={14} className="ml-0.5" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2.5 px-5 py-3 rounded-full bg-salt-pink text-black font-black border-2 border-salt-pink shadow-[0_8px_30px_rgba(232,169,160,0.5)] hover:bg-cream hover:text-black transition-all duration-300 group cursor-pointer pink-shiny-border backdrop-blur-xl"
        aria-label="WhatsApp quick contact"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-salt-pink opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-ink border-2 border-salt-pink"></span>
        </span>
        <WhatsAppIconSVG size={20} className="text-black group-hover:text-black transition-colors" />
        <span className="font-mono text-xs sm:text-sm font-black tracking-wide uppercase text-black">
          WhatsApp
        </span>
      </motion.button>
    </div>
  );
};
