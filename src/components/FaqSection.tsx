import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, ShieldCheck, Truck, CreditCard, ChevronDown } from "lucide-react";

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  icon: React.ReactNode;
}

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>("authenticity");

  const faqs: FaqItem[] = [
    {
      id: "authenticity",
      category: "Authenticity",
      question: "How is the authenticity and purity of Khewara salt verified?",
      answer: "Every single crystal of Khewara salt is hand-mined directly from the ancient geological strata of the primary Khewra Salt Range. We coordinate exclusively with licensed generational miners and package our selections in our verified Karachi facility. Our salt contains 0% artificial flow agents, bleaching chemicals, or added iodine. It is certified 98%+ pure NaCl, naturally retaining 84+ essential trace minerals that give it its distinctive rose-pink hue.",
      icon: <ShieldCheck className="text-salt-pink shrink-0" size={18} />
    },
    {
      id: "shipping-local",
      category: "Local Trade",
      question: "What are the shipping timelines and logistics methods for local domestic orders?",
      answer: "For retail shipments within Pakistan, we partner with leading domestic courier services. Orders are processed at our Karachi depot within 24-48 hours and typically arrive at your doorstep within 2 to 5 business days. For bulk, heavy, or high-volume commercial items (like custom salt bricks, tiles, or mass cosmetic bath grains), we dispatch via secure overland cargo trailers to offer the most economical freight rates.",
      icon: <Truck className="text-salt-pink shrink-0" size={18} />
    },
    {
      id: "shipping-intl",
      category: "International Trade",
      question: "How does international export logistics and customs handling work?",
      answer: "International retail and premium gift sets are dispatched worldwide using global express air carriers (DHL/FedEx). For container-load commercial exports (B2B), we handle full port-of-loading logistics out of Karachi Port. We offer FOB (Free on Board), CFR, or CIF terms. All export batches undergo strict quarantine, phytosanitary clearance, and custom laboratory certificates of analysis (COA) to guarantee hassle-free customs entry into Europe, North America, and East Asia.",
      icon: <Truck className="text-salt-pink shrink-0" size={18} />
    },
    {
      id: "payments-local",
      category: "Local Trade",
      question: "What payment methods are supported for customers within Pakistan?",
      answer: "Local buyers can complete their transactions smoothly using secure online credit/debit card processing, Interbank Funds Transfer (IBFT/Direct Bank Deposit), or popular mobile wallets including EasyPaisa and JazzCash. Cash on Delivery (COD) is also gladly accepted for retail orders valued under PKR 10,000.",
      icon: <CreditCard className="text-salt-pink shrink-0" size={18} />
    },
    {
      id: "payments-intl",
      category: "International Trade",
      question: "What payment structures and terms apply to international orders?",
      answer: "International retail buyers can pay securely in USD or EUR via integrated credit card channels and global payment portals. For bulk commercial exports, trade is secured via standard international banking instruments: either an Irrevocable Letter of Credit (L/C at sight) or Telegraphic Transfer (T/T) with 30% advance deposit and the remaining 70% balance settled upon presenting the Bill of Lading.",
      icon: <CreditCard className="text-salt-pink shrink-0" size={18} />
    }
  ];

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="w-full mt-20 border-t border-cream/10 pt-16" id="faq-section">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-salt-pink/5 border border-salt-pink/10 text-[9px] font-mono text-salt-pink uppercase tracking-widest mb-3">
            <HelpCircle size={10} />
            Frequently Asked Questions
          </div>
          <h3 className="font-serif text-2xl md:text-3xl text-cream">Trade & Authenticity FAQ</h3>
          <p className="text-stone text-xs mt-2 max-w-lg mx-auto leading-relaxed">
            Essential guidelines on sourcing authenticity, local deliveries, international container logistics, and payment safety.
          </p>
        </div>

        <div className="flex flex-col gap-3" id="faq-accordion-container">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded border transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? "bg-ink-3/40 border-salt-pink/20 shadow-md" 
                    : "bg-ink-3/10 border-cream/5 hover:border-cream/10"
                }`}
                id={`faq-item-${faq.id}`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-5 flex items-start justify-between gap-4 transition-colors duration-200"
                  aria-expanded={isOpen}
                >
                  <div className="flex gap-3.5 items-start">
                    <span className="mt-0.5">{faq.icon}</span>
                    <div>
                      <span className="text-[9px] font-mono text-salt-pink/60 uppercase tracking-widest block mb-0.5">
                        {faq.category}
                      </span>
                      <h4 className={`font-serif text-sm md:text-base leading-snug transition-colors duration-200 ${
                        isOpen ? "text-salt-pink" : "text-cream hover:text-cream-light"
                      }`}>
                        {faq.question}
                      </h4>
                    </div>
                  </div>
                  <span className="mt-1 text-stone shrink-0">
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={16} />
                    </motion.div>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 pt-1 pl-[50px] border-t border-cream/5 text-stone text-xs md:text-sm leading-relaxed bg-ink-3/20">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
