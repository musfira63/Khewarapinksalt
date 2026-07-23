/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CustomerSegment } from "../types";
import { DETAIL_PRICING_CATALOG, PRODUCTS_LIST } from "../data";
import { Calculator, Truck, Package, Shield, Info, DollarSign, ArrowRight, CheckCircle } from "lucide-react";

interface PricingEngineProps {
  activeSegment: CustomerSegment;
  onSegmentChange: (segment: CustomerSegment) => void;
}

export const PricingEngine: React.FC<PricingEngineProps> = ({
  activeSegment,
  onSegmentChange,
}) => {
  // B2B Trade Portal / Contact Form State
  const [b2bCompany, setB2bCompany] = useState("");
  const [b2bContact, setB2bContact] = useState("");
  const [b2bEmail, setB2bEmail] = useState("");
  const [b2bPhone, setB2bPhone] = useState("");
  const [b2bProduct, setB2bProduct] = useState("Culinary Pink Salt");
  const [b2bVolume, setB2bVolume] = useState("");
  const [b2bPort, setB2bPort] = useState("");
  const [b2bMessage, setB2bMessage] = useState("");
  const [b2bStatus, setB2bStatus] = useState("");
  const [b2bSuccess, setB2bSuccess] = useState(false);

  // Calculator state
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS_LIST[0].id);
  const [quantity, setQuantity] = useState<number>(1);
  const [calculatorSegment, setCalculatorSegment] = useState<CustomerSegment>("local");
  const [selectedSize, setSelectedSize] = useState<string>("medium");
  const [quoteCreated, setQuoteCreated] = useState(false);

  const handleB2bInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!b2bCompany || !b2bContact || !b2bEmail || !b2bMessage) {
      setB2bStatus("Please fill in all required fields marked with *");
      setB2bSuccess(false);
      return;
    }

    const subject = encodeURIComponent(`B2B Portal Trade Inquiry: ${b2bCompany}`);
    const body = encodeURIComponent(
      `Khewara B2B Trade Portal Form Submission:\n\n` +
      `Company Name: ${b2bCompany}\n` +
      `Contact Person: ${b2bContact}\n` +
      `Email Address: ${b2bEmail}\n` +
      `Phone/WhatsApp: ${b2bPhone || "Not specified"}\n` +
      `Product Interest: ${b2bProduct}\n` +
      `Estimated Volume (tons/units): ${b2bVolume || "Not specified"}\n` +
      `Destination Port: ${b2bPort || "Not specified"}\n\n` +
      `Message:\n${b2bMessage}`
    );

    window.location.href = `mailto:Almusfiraenterprises@gmail.com?subject=${subject}&body=${body}`;
    setB2bSuccess(true);
    setB2bStatus("Opening your email client to dispatch your trade request to Al-Musfira Enterprises...");
  };

  const getProductPriceVal = (prodId: string, segment: CustomerSegment): { pricePerUnit: number; unitStr: string; minQty: number; name: string } => {
    const prod = PRODUCTS_LIST.find((p) => p.id === prodId) || PRODUCTS_LIST[0];
    let customName = prod.name;
    if (prodId === "cylinder-lamp") {
      const sizeLabels = { small: "Small (6\" height)", medium: "Medium (8\" height)", large: "Large (10\" height)" };
      customName = `${prod.name} - ${sizeLabels[selectedSize]}`;
    } else if (prodId === "salt-tiles") {
      const sizeLabels = { small: "Small (8\"x4\"x1\")", medium: "Medium (8\"x8\"x2\")", large: "Large (12\"x8\"x2\")" };
      customName = `${prod.name} - ${sizeLabels[selectedSize]}`;
    } else if (prodId === "sole-starters") {
      const sizeLabels = { small: "250 ml", medium: "500 ml", large: "1 L" };
      customName = `${prod.name} - ${sizeLabels[selectedSize]}`;
    } else if (prodId === "salt-inhaler") {
      const sizeLabels = { small: "Standard", medium: "Premium Ceramic", large: "Premium Ceramic" };
      customName = `${sizeLabels[selectedSize]} ${prod.name}`;
    } else if (prodId === "massage-stones") {
      const sizeLabels: Record<string, string> = {
        small: "Small Massage Stone",
        medium: "Medium Massage Stone",
        large: "Large Massage Stone",
        premium: "Premium Massage Stone Set (4 pcs)",
        luxury: "Luxury Massage Stone Set (6 pcs)"
      };
      customName = sizeLabels[selectedSize] || prod.name;
    } else if (prodId === "usb-lamp") {
      const sizeLabels: Record<string, string> = {
        usb_mini: "USB Mini Salt Lamp",
        usb_desk: "USB Desk Salt Lamp",
        usb_led: "USB LED Salt Lamp",
        usb_premium: "Premium USB Salt Lamp",
        usb_color: "Color-Changing USB Salt Lamp"
      };
      customName = sizeLabels[selectedSize] || prod.name;
    } else if (prodId === "moon-lamp") {
      const sizeLabels: Record<string, string> = {
        moon_mini: "Mini Moon Lamp",
        moon_color: "Color-Changing Moon Lamp",
        moon_led: "Premium LED Moon Lamp",
        moon_luxury: "Luxury Moon Lamp (Remote + Multi-Color)"
      };
      customName = sizeLabels[selectedSize] || prod.name;
    } else if (prodId === "colored-lamp") {
      const sizeLabels: Record<string, string> = {
        colored_small: "Small Color Changing Lamp (1–2 kg)",
        colored_medium: "Medium Color Changing Lamp (2–4 kg)",
        colored_large: "Large Color Changing Lamp (4–6 kg)",
        colored_xl: "Extra Large Color Changing Lamp (6–8 kg)",
        colored_premium: "Premium XL Color Changing Lamp (8–10 kg)"
      };
      customName = sizeLabels[selectedSize] || prod.name;
    } else if (prodId === "gift-set") {
      const sizeLabels: Record<string, string> = {
        gift_mini: "Mini Gift Set",
        gift_classic: "Classic Gift Set",
        gift_premium: "Premium Gift Set",
        gift_luxury: "Luxury Gift Set",
        gift_executive: "Executive Gift Collection"
      };
      customName = sizeLabels[selectedSize] || prod.name;
    }
    
    if (segment === "local") {
      // Parse a representative number from Rs price
      const priceStr = prod.localPrice.replace(/[^0-9]/g, ""); // e.g. "Rs 350 - 600" -> "350600" -> let's take a base
      let price = 350;
      let unit = "kg";
      if (prodId === "culinary-salt") { price = 350; unit = "kg"; }
      else if (prodId === "natural-lamp") { price = 1200; unit = "unit"; }
      else if (prodId === "bath-soak") { price = 2800; unit = "jar"; }
      else if (prodId === "sphere-lamp") { price = 3500; unit = "unit"; }
      else if (prodId === "cylinder-lamp") {
        if (selectedSize === "small") price = 3000;
        else if (selectedSize === "medium") price = 7000;
        else price = 10000;
        unit = "unit";
      }
      else if (prodId === "black-salt") { price = 600; unit = "100g"; }
      else if (prodId === "salt-tiles") {
        if (selectedSize === "small") price = 2000;
        else if (selectedSize === "medium") price = 5000;
        else price = 8000;
        unit = "block";
      }
      else if (prodId === "animal-licks") { price = 900; unit = "block"; }
      else if (prodId === "deodorant-stone") { price = 1000; unit = "bar"; }
      else if (prodId === "sole-starters") {
        if (selectedSize === "small") price = 700;
        else if (selectedSize === "medium") price = 1200;
        else price = 2200;
        unit = "jar";
      }
      else if (prodId === "salt-inhaler") {
        if (selectedSize === "small") price = 3500;
        else price = 4500;
        unit = "unit";
      }
      else if (prodId === "massage-stones") {
        if (selectedSize === "small") price = 1500;
        else if (selectedSize === "medium") price = 2500;
        else if (selectedSize === "large") price = 3500;
        else if (selectedSize === "premium") price = 5500;
        else price = 7500;
        unit = (selectedSize === "premium" || selectedSize === "luxury") ? "set" : "stone";
      }
      else if (prodId === "usb-lamp") {
        if (selectedSize === "usb_mini") price = 2000;
        else if (selectedSize === "usb_desk") price = 2800;
        else if (selectedSize === "usb_led") price = 3500;
        else if (selectedSize === "usb_premium") price = 4500;
        else price = 5500;
        unit = "unit";
      }
      else if (prodId === "moon-lamp") {
        if (selectedSize === "moon_mini") price = 5000;
        else if (selectedSize === "moon_color") price = 6500;
        else if (selectedSize === "moon_led") price = 7500;
        else price = 8500;
        unit = "unit";
      }
      else if (prodId === "colored-lamp") {
        if (selectedSize === "colored_small") price = 7500;
        else if (selectedSize === "colored_medium") price = 10500;
        else if (selectedSize === "colored_large") price = 15500;
        else if (selectedSize === "colored_xl") price = 20500;
        else price = 27500;
        unit = "unit";
      }
      else if (prodId === "gift-set") {
        if (selectedSize === "gift_mini") price = 7500;
        else if (selectedSize === "gift_classic") price = 12500;
        else if (selectedSize === "gift_premium") price = 18500;
        else if (selectedSize === "gift_luxury") price = 27500;
        else price = 38500;
        unit = "set";
      }

      return { pricePerUnit: price, unitStr: unit, minQty: 1, name: customName };
    } else if (segment === "intl") {
      let price = 3.0;
      let unit = "kg";
      if (prodId === "culinary-salt") { price = 3.0; unit = "kg"; }
      else if (prodId === "natural-lamp") { price = 18.0; unit = "unit"; }
      else if (prodId === "bath-soak") { price = 5.95; unit = "jar"; }
      else if (prodId === "sphere-lamp") { price = 45.0; unit = "unit"; }
      else if (prodId === "cylinder-lamp") {
        if (selectedSize === "small") price = 18.0;
        else if (selectedSize === "medium") price = 20.0;
        else price = 22.0;
        unit = "unit";
      }
      else if (prodId === "black-salt") { price = 7.5; unit = "100g"; }
      else if (prodId === "salt-tiles") {
        if (selectedSize === "small") price = 15.0;
        else if (selectedSize === "medium") price = 18.0;
        else price = 23.0;
        unit = "block";
      }
      else if (prodId === "animal-licks") { price = 4.99; unit = "block"; }
      else if (prodId === "deodorant-stone") { price = 7.99; unit = "bar"; }
      else if (prodId === "sole-starters") {
        if (selectedSize === "small") price = 12.0;
        else if (selectedSize === "medium") price = 18.0;
        else price = 30.0;
        unit = "jar";
      }
      else if (prodId === "salt-inhaler") {
        if (selectedSize === "small") price = 35.0;
        else price = 45.0;
        unit = "unit";
      }
      else if (prodId === "massage-stones") {
        if (selectedSize === "small") price = 18.0;
        else if (selectedSize === "medium") price = 28.0;
        else if (selectedSize === "large") price = 38.0;
        else if (selectedSize === "premium") price = 55.0;
        else price = 75.0;
        unit = (selectedSize === "premium" || selectedSize === "luxury") ? "set" : "stone";
      }
      else if (prodId === "usb-lamp") {
        if (selectedSize === "usb_mini") price = 20.0;
        else if (selectedSize === "usb_desk") price = 28.0;
        else if (selectedSize === "usb_led") price = 35.0;
        else if (selectedSize === "usb_premium") price = 45.0;
        else price = 55.0;
        unit = "unit";
      }
      else if (prodId === "moon-lamp") {
        if (selectedSize === "moon_mini") price = 35.0;
        else if (selectedSize === "moon_color") price = 45.0;
        else if (selectedSize === "moon_led") price = 55.0;
        else price = 65.0;
        unit = "unit";
      }
      else if (prodId === "colored-lamp") {
        if (selectedSize === "colored_small") price = 45.0;
        else if (selectedSize === "colored_medium") price = 65.0;
        else if (selectedSize === "colored_large") price = 90.0;
        else if (selectedSize === "colored_xl") price = 125.0;
        else price = 165.0;
        unit = "unit";
      }
      else if (prodId === "gift-set") {
        if (selectedSize === "gift_mini") price = 55.0;
        else if (selectedSize === "gift_classic") price = 85.0;
        else if (selectedSize === "gift_premium") price = 125.0;
        else if (selectedSize === "gift_luxury") price = 175.0;
        else price = 250.0;
        unit = "set";
      }

      return { pricePerUnit: price, unitStr: unit, minQty: 1, name: customName };
    } else {
      // Wholesale
      let price = 60; // Rs wholesale
      let unit = "kg";
      let moq = 1000; // 1 Ton

      if (prodId === "culinary-salt") { price = 60; unit = "kg"; moq = 1000; }
      else if (prodId === "natural-lamp") { price = 450; unit = "unit"; moq = 100; }
      else if (prodId === "bath-soak") { price = 950; unit = "jar"; moq = 200; }
      else if (prodId === "sphere-lamp") { price = 1200; unit = "unit"; moq = 50; }
      else if (prodId === "cylinder-lamp") {
        if (selectedSize === "small") { price = 1000; moq = 50; }
        else if (selectedSize === "medium") { price = 2500; moq = 50; }
        else { price = 4000; moq = 50; }
        unit = "unit";
      }
      else if (prodId === "black-salt") { price = 180; unit = "kg"; moq = 500; }
      else if (prodId === "salt-tiles") {
        if (selectedSize === "small") { price = 800; moq = 100; }
        else if (selectedSize === "medium") { price = 2000; moq = 100; }
        else { price = 3500; moq = 50; }
        unit = "block";
      }
      else if (prodId === "animal-licks") { price = 180; unit = "block"; moq = 500; }
      else if (prodId === "deodorant-stone") { price = 280; unit = "bar"; moq = 300; }
      else if (prodId === "sole-starters") {
        if (selectedSize === "small") { price = 450; moq = 100; }
        else if (selectedSize === "medium") { price = 800; moq = 100; }
        else { price = 1500; moq = 50; }
        unit = "jar";
      }
      else if (prodId === "salt-inhaler") {
        if (selectedSize === "small") { price = 1500; moq = 100; }
        else { price = 2500; moq = 100; }
        unit = "unit";
      }
      else if (prodId === "massage-stones") {
        if (selectedSize === "small") { price = 700; moq = 100; }
        else if (selectedSize === "medium") { price = 1200; moq = 80; }
        else if (selectedSize === "large") { price = 1800; moq = 50; }
        else if (selectedSize === "premium") { price = 2800; moq = 50; }
        else { price = 4000; moq = 30; }
        unit = (selectedSize === "premium" || selectedSize === "luxury") ? "set" : "stone";
      }
      else if (prodId === "usb-lamp") {
        if (selectedSize === "usb_mini") { price = 800; moq = 100; }
        else if (selectedSize === "usb_desk") { price = 1200; moq = 100; }
        else if (selectedSize === "usb_led") { price = 1600; moq = 100; }
        else if (selectedSize === "usb_premium") { price = 2000; moq = 100; }
        else { price = 2500; moq = 100; }
        unit = "unit";
      }
      else if (prodId === "moon-lamp") {
        if (selectedSize === "moon_mini") { price = 2500; moq = 50; }
        else if (selectedSize === "moon_color") { price = 3200; moq = 50; }
        else if (selectedSize === "moon_led") { price = 3800; moq = 50; }
        else { price = 4500; moq = 50; }
        unit = "unit";
      }
      else if (prodId === "colored-lamp") {
        if (selectedSize === "colored_small") { price = 3750; moq = 30; }
        else if (selectedSize === "colored_medium") { price = 5250; moq = 30; }
        else if (selectedSize === "colored_large") { price = 7750; moq = 30; }
        else if (selectedSize === "colored_xl") { price = 10250; moq = 30; }
        else { price = 13750; moq = 30; }
        unit = "unit";
      }
      else if (prodId === "gift-set") {
        if (selectedSize === "gift_mini") { price = 3750; moq = 10; }
        else if (selectedSize === "gift_classic") { price = 6250; moq = 10; }
        else if (selectedSize === "gift_premium") { price = 9250; moq = 10; }
        else if (selectedSize === "gift_luxury") { price = 13750; moq = 10; }
        else { price = 19250; moq = 5; }
        unit = "set";
      }

      return { pricePerUnit: price, unitStr: unit, minQty: moq, name: customName };
    }
  };

  const calcDetails = getProductPriceVal(selectedProduct, calculatorSegment);
  const totalBaseCost = calcDetails.pricePerUnit * quantity;

  // Shipping cost logic
  let shippingCost = 0;
  if (calculatorSegment === "local") {
    shippingCost = quantity * 120; // 120 Rs per kg/unit
  } else if (calculatorSegment === "intl") {
    shippingCost = quantity * 15; // 15 USD per kg/unit air cargo
  } else {
    // Wholesale - freight container estimates
    shippingCost = quantity * 18; // Rs ex-factory loading / warehousing costs
  }

  const currencySymbol = calculatorSegment === "local" ? "Rs" : calculatorSegment === "intl" ? "$" : "Rs";
  const wholesaleSymbolUsd = calculatorSegment === "wholesale" ? ` ($${(calcDetails.pricePerUnit / 278).toFixed(2)})` : "";

  const moqMet = quantity >= calcDetails.minQty;

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteCreated(true);
    setTimeout(() => {
      setQuoteCreated(false);
    }, 4000);

    const subject = encodeURIComponent(`Khewara Commercial Quote Request: ${calcDetails.name}`);
    const body = encodeURIComponent(
      `Hello Khewara Pink Salt Team,\n\n` +
      `I would like to request a formal quote for:\n` +
      `- Product: ${calcDetails.name}\n` +
      `- Segment Portal: ${calculatorSegment.toUpperCase()}\n` +
      `- Quantity: ${quantity} ${calcDetails.unitStr}\n` +
      `- Calculated Base cost: ${currencySymbol} ${totalBaseCost.toLocaleString()}\n` +
      `- Delivery Logistics: ${calculatorSegment === "wholesale" ? "FOB Karachi Cargo" : "Doorstep Courier"}\n\n` +
      `Please contact me back with the official proforma invoice and bank transfer instructions.\n` +
      `Thank you.`
    );
    window.location.href = `mailto:Almusfiraenterprises@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="w-full flex flex-col gap-10" id="pricing-engine-container">
      {/* 1. Customer Segment Navigation Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-cream/10 pb-4 gap-4">
        <div>
          <span className="font-mono text-xs text-salt-pink tracking-widest uppercase">Target Audiences</span>
          <h3 className="font-serif text-2xl text-cream mt-1">Different Channels, Unified Quality</h3>
        </div>
        <div className="flex flex-wrap gap-1 bg-ink/80 p-1 rounded-md border border-cream/5" role="tablist" aria-label="Customer Portals">
          <button
            type="button"
            className={`px-4 py-2.5 font-mono text-[11px] tracking-wider uppercase transition-all duration-300 rounded ${
              activeSegment === "local"
                ? "bg-salt-pink text-ink font-semibold"
                : "text-stone hover:text-cream hover:bg-cream/5"
            }`}
            onClick={() => onSegmentChange("local")}
            id="tab-local"
          >
            🇵🇰 Pakistan (Local)
          </button>
          <button
            type="button"
            className={`px-4 py-2.5 font-mono text-[11px] tracking-wider uppercase transition-all duration-300 rounded ${
              activeSegment === "intl"
                ? "bg-salt-pink text-ink font-semibold"
                : "text-stone hover:text-cream hover:bg-cream/5"
            }`}
            onClick={() => onSegmentChange("intl")}
            id="tab-intl"
          >
            🌎 International (Export)
          </button>
          <button
            type="button"
            className={`px-4 py-2.5 font-mono text-[11px] tracking-wider uppercase transition-all duration-300 rounded ${
              activeSegment === "wholesale"
                ? "bg-salt-pink text-ink font-semibold"
                : "text-stone hover:text-cream hover:bg-cream/5"
            }`}
            onClick={() => onSegmentChange("wholesale")}
            id="tab-wholesale"
          >
            💼 B2B Trade Portal
          </button>
        </div>
      </div>

      {/* 2. Customer Segment Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="segment-info-cards">
        <div className="bg-ink-3/40 p-6 rounded border border-cream/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-salt-pink/5 rounded-full blur-2xl group-hover:bg-salt-pink/10 transition-all duration-500" />
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded bg-salt-pink/10 text-salt-pink">
              <Truck size={18} />
            </div>
            <h4 className="font-serif text-lg text-cream">Logistics &amp; Delivery</h4>
          </div>
          <p className="text-stone text-xs leading-relaxed" id="info-delivery">
            {activeSegment === "local" &&
              "Fast courier and cargo partners across Pakistan. Doorstep shipping to Karachi within 24-48 hours. Inland trucking to Punjab & KPK within 3-5 working days."}
            {activeSegment === "intl" &&
              "Fully accredited air cargo and DHL/FedEx worldwide courier integrations. Customized documentation with Phyto-sanitary health clearances for hassle-free custom passings."}
            {activeSegment === "wholesale" &&
              "Ex-factory dispatch from Khewra / Karachi. FOB Karachi Seaport terms for 20ft/40ft containers. Bulk maritime logistics with third-party inspection certifications."}
          </p>
        </div>

        <div className="bg-ink-3/40 p-6 rounded border border-cream/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-deep/5 rounded-full blur-2xl group-hover:bg-rose-deep/10 transition-all duration-500" />
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded bg-rose-deep/10 text-rose-deep">
              <Package size={18} />
            </div>
            <h4 className="font-serif text-lg text-cream">Packaging Guidelines</h4>
          </div>
          <p className="text-stone text-xs leading-relaxed" id="info-packing">
            {activeSegment === "local" &&
              "Packaged in Khewara eco-pouches, high-strength transparent bags, or raw cotton bags. Hand-placed inside double-wall craft cartons to prevent lamp chips."}
            {activeSegment === "intl" &&
              "Double-layered vapor-barrier bags to protect culinary salt from sea humidity. Heavy-duty wooden stands and vacuum-shrink wrap for export lamp protection."}
            {activeSegment === "wholesale" &&
              "High-durability 25kg/50kg PP woven bags, or 1 Metric Ton heavy-duty jumbo builder sacks. Custom palletization with shrink wrap and protective wooden corners."}
          </p>
        </div>

        <div className="bg-ink-3/40 p-6 rounded border border-cream/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber/5 rounded-full blur-2xl group-hover:bg-amber/10 transition-all duration-500" />
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded bg-amber/10 text-amber">
              <Shield size={18} />
            </div>
            <h4 className="font-serif text-lg text-cream">Trade Compliance</h4>
          </div>
          <p className="text-stone text-xs leading-relaxed" id="info-compliance">
            {activeSegment === "local" &&
              "Registered local trading license. Clean, unadulterated grade certified by local health departments. Zero chemicals or artificial anticaking agents."}
            {activeSegment === "intl" &&
              "SGS Tested, FDA Registered facilities, CE/UL Certified lamp electronics (cords, plugs, bulbs) matching your country's voltage specifications perfectly."}
            {activeSegment === "wholesale" &&
              "Full Chamber of Commerce backing, Certificates of Origin, custom tariff code listings, and transparent container sealing reports on all export lines."}
          </p>
        </div>
      </div>

      {/* 3. Comparative Interactive Pricing Tables / B2B Trade Portal */}
      {activeSegment !== "wholesale" ? (
        <>
          <div className="bg-ink-3/20 rounded border border-cream/5 p-6" id="pricing-tables-wrapper">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
              <div>
                <h4 className="font-serif text-xl text-cream">
                  {activeSegment === "local" && "Pakistan Local Market Prices (PKR)"}
                  {activeSegment === "intl" && "International Export Market Prices (USD)"}
                </h4>
                <p className="text-xs text-stone mt-1">
                  {activeSegment === "local" && "Rates quoted ex-factory Karachi. Nationwide home shipping computed during checkout."}
                  {activeSegment === "intl" && "Rates quoted in USD, excluding global customs/duties of destination country."}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-stone bg-ink p-2 rounded border border-cream/5">
                <span className="w-2 h-2 rounded-full bg-salt-pink animate-pulse" />
                July 2026 Batch Active
              </div>
            </div>

            <div className="flex flex-col gap-8">
              {DETAIL_PRICING_CATALOG.map((cat, catIdx) => (
                <div key={catIdx} className="border-t border-cream/5 pt-5 first:border-none first:pt-0">
                  <h5 className="font-serif text-md text-salt-pink mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-salt-pink" />
                    {cat.categoryTitle}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cat.items.map((item, itemIdx) => {
                      let displayedPrice = "";
                      let displayedLabel = "";

                      if (activeSegment === "local") {
                        displayedPrice = item.localPrice;
                        displayedLabel = "ex-factory PK";
                      } else {
                        displayedPrice = item.intlPrice;
                        displayedLabel = "export retail";
                      }

                      return (
                        <div
                          key={itemIdx}
                          className="bg-ink-2/30 hover:bg-ink-3/30 p-4 rounded border border-cream/5 hover:border-salt-pink/20 transition-all duration-300 flex justify-between items-center relative overflow-hidden group"
                        >
                          {/* Faint Khewara watermark stamp */}
                          <span className="absolute -right-2 -bottom-1 font-serif text-[22px] font-black tracking-widest text-cream/[0.04] uppercase select-none pointer-events-none group-hover:text-salt-pink/[0.08] transition-colors">
                            KHEWARA
                          </span>
                          <div className="flex flex-col gap-1 pr-2 relative z-10">
                            <span className="text-cream text-xs font-medium flex items-center gap-1.5">
                              {item.name}
                              <span className="text-[8px] font-mono text-salt-pink/70 uppercase border border-salt-pink/20 px-1 py-0.2 rounded tracking-widest">
                                Khewara®
                              </span>
                            </span>
                            <span className="text-[10px] font-mono text-stone tracking-wider uppercase">
                              {displayedLabel}
                            </span>
                          </div>
                          <div className="text-right flex flex-col items-end relative z-10">
                            <span className="font-mono text-sm text-salt-pink font-semibold">{displayedPrice}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Interactive Calculator & Quotation Engine */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-ink-2/40 rounded border border-cream/10 p-6 md:p-8" id="calculator-section">
            <div className="lg:col-span-7 flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <Calculator className="text-salt-pink" size={20} />
                <span className="font-mono text-xs text-stone tracking-widest uppercase">Quotation Engine</span>
              </div>
              <h4 className="font-serif text-2xl text-cream">Calculate Your Custom Order Estimate</h4>
              <p className="text-stone text-xs leading-relaxed max-w-[500px]">
                Input your requirements to instantly calculate standard estimates, transport parameters, and check Minimum Order Quantity bounds.
              </p>

              <form onSubmit={handleInquirySubmit} className="flex flex-col gap-4 mt-2">
                {/* Calculator Segment selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] uppercase text-stone tracking-wider">Browsing Category</label>
                  <div className="grid grid-cols-2 gap-2 bg-ink/60 p-1 rounded border border-cream/5">
                    <button
                      type="button"
                      className={`py-2 text-[10px] font-mono uppercase tracking-wider rounded ${
                        calculatorSegment === "local" ? "bg-salt-pink/20 text-salt-pink font-medium border border-salt-pink/20" : "text-stone hover:text-cream"
                      }`}
                      onClick={() => {
                        setCalculatorSegment("local");
                        setQuantity(1);
                      }}
                    >
                      Local
                    </button>
                    <button
                      type="button"
                      className={`py-2 text-[10px] font-mono uppercase tracking-wider rounded ${
                        calculatorSegment === "intl" ? "bg-salt-pink/20 text-salt-pink font-medium border border-salt-pink/20" : "text-stone hover:text-cream"
                      }`}
                      onClick={() => {
                        setCalculatorSegment("intl");
                        setQuantity(1);
                      }}
                    >
                      Intl
                    </button>
                  </div>
                </div>

                <div className={`grid grid-cols-1 ${(selectedProduct === "cylinder-lamp" || selectedProduct === "salt-tiles" || selectedProduct === "sole-starters" || selectedProduct === "salt-inhaler" || selectedProduct === "massage-stones" || selectedProduct === "usb-lamp" || selectedProduct === "moon-lamp" || selectedProduct === "colored-lamp" || selectedProduct === "gift-set") ? "md:grid-cols-3" : "md:grid-cols-2"} gap-4`}>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="calc-product" className="font-mono text-[10px] uppercase text-stone tracking-wider">Select Product Line</label>
                    <select
                      id="calc-product"
                      className="bg-ink border border-cream/10 text-cream text-xs rounded p-3 focus:outline-none focus:border-salt-pink"
                      value={selectedProduct}
                      onChange={(e) => {
                        const prodId = e.target.value;
                        setSelectedProduct(prodId);
                        if (prodId === "usb-lamp") {
                          setSelectedSize("usb_mini");
                        } else if (prodId === "moon-lamp") {
                          setSelectedSize("moon_mini");
                        } else if (prodId === "colored-lamp") {
                          setSelectedSize("colored_small");
                        } else if (prodId === "gift-set") {
                          setSelectedSize("gift_mini");
                        } else if (prodId === "salt-inhaler" && (selectedSize === "large" || selectedSize === "premium" || selectedSize === "luxury" || selectedSize.startsWith("usb_") || selectedSize.startsWith("moon_") || selectedSize.startsWith("colored_") || selectedSize.startsWith("gift_"))) {
                          setSelectedSize("medium");
                        } else if (prodId !== "massage-stones" && (selectedSize === "premium" || selectedSize === "luxury" || selectedSize.startsWith("usb_") || selectedSize.startsWith("moon_") || selectedSize.startsWith("colored_") || selectedSize.startsWith("gift_"))) {
                          setSelectedSize("medium");
                        } else if (selectedSize.startsWith("usb_") || selectedSize.startsWith("moon_") || selectedSize.startsWith("colored_") || selectedSize.startsWith("gift_")) {
                          setSelectedSize("medium");
                        }
                        const details = getProductPriceVal(prodId, calculatorSegment);
                        setQuantity(details.minQty);
                      }}
                    >
                      {PRODUCTS_LIST.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {(selectedProduct === "cylinder-lamp" || selectedProduct === "salt-tiles" || selectedProduct === "sole-starters" || selectedProduct === "salt-inhaler" || selectedProduct === "massage-stones" || selectedProduct === "usb-lamp" || selectedProduct === "moon-lamp" || selectedProduct === "colored-lamp" || selectedProduct === "gift-set") && (
                    <div className="flex flex-col gap-1.5 animate-fade-in">
                      <label htmlFor="calc-size" className="font-mono text-[10px] uppercase text-stone tracking-wider">Select Size / Tier</label>
                      <select
                        id="calc-size"
                        className="bg-ink border border-cream/10 text-cream text-xs rounded p-3 focus:outline-none focus:border-salt-pink"
                        value={selectedSize}
                        onChange={(e) => {
                          setSelectedSize(e.target.value);
                        }}
                      >
                        {selectedProduct === "cylinder-lamp" ? (
                          <>
                            <option value="small">Small (6") - {calculatorSegment === "local" ? "Rs 3,000" : calculatorSegment === "wholesale" ? "Rs 1,000" : "$18.00"}</option>
                            <option value="medium">Medium (8") - {calculatorSegment === "local" ? "Rs 7,000" : calculatorSegment === "wholesale" ? "Rs 2,500" : "$20.00"}</option>
                            <option value="large">Large (10") - {calculatorSegment === "local" ? "Rs 10,000" : calculatorSegment === "wholesale" ? "Rs 4,000" : "$22.00"}</option>
                          </>
                        ) : selectedProduct === "salt-tiles" ? (
                          <>
                            <option value="small">Small (8"x4"x1") - {calculatorSegment === "local" ? "Rs 2,000" : calculatorSegment === "wholesale" ? "Rs 800" : "$15.00"}</option>
                            <option value="medium">Medium (8"x8"x2") - {calculatorSegment === "local" ? "Rs 5,000" : calculatorSegment === "wholesale" ? "Rs 2,000" : "$18.00"}</option>
                            <option value="large">Large (12"x8"x2") - {calculatorSegment === "local" ? "Rs 8,000" : calculatorSegment === "wholesale" ? "Rs 3,500" : "$23.00"}</option>
                          </>
                        ) : selectedProduct === "salt-inhaler" ? (
                          <>
                            <option value="small">Standard - {calculatorSegment === "local" ? "Rs 3,500" : calculatorSegment === "wholesale" ? "Rs 1,500" : "$35.00"}</option>
                            <option value="medium">Premium Ceramic - {calculatorSegment === "local" ? "Rs 4,500" : calculatorSegment === "wholesale" ? "Rs 2,500" : "$45.00"}</option>
                          </>
                        ) : selectedProduct === "massage-stones" ? (
                          <>
                            <option value="small">Small Massage Stone - {calculatorSegment === "local" ? "Rs 1,500" : calculatorSegment === "wholesale" ? "Rs 700" : "$18.00"}</option>
                            <option value="medium">Medium Massage Stone - {calculatorSegment === "local" ? "Rs 2,500" : calculatorSegment === "wholesale" ? "Rs 1,200" : "$28.00"}</option>
                            <option value="large">Large Massage Stone - {calculatorSegment === "local" ? "Rs 3,500" : calculatorSegment === "wholesale" ? "Rs 1,800" : "$38.00"}</option>
                            <option value="premium">Premium Set (4 pcs) - {calculatorSegment === "local" ? "Rs 5,500" : calculatorSegment === "wholesale" ? "Rs 2,800" : "$55.00"}</option>
                            <option value="luxury">Luxury Set (6 pcs) - {calculatorSegment === "local" ? "Rs 7,500" : calculatorSegment === "wholesale" ? "Rs 4,000" : "$75.00"}</option>
                          </>
                        ) : selectedProduct === "usb-lamp" ? (
                          <>
                            <option value="usb_mini">USB Mini Salt Lamp - {calculatorSegment === "local" ? "Rs 2,000" : calculatorSegment === "wholesale" ? "Rs 800" : "$20.00"}</option>
                            <option value="usb_desk">USB Desk Salt Lamp - {calculatorSegment === "local" ? "Rs 2,800" : calculatorSegment === "wholesale" ? "Rs 1,200" : "$28.00"}</option>
                            <option value="usb_led">USB LED Salt Lamp - {calculatorSegment === "local" ? "Rs 3,500" : calculatorSegment === "wholesale" ? "Rs 1,600" : "$35.00"}</option>
                            <option value="usb_premium">Premium USB Salt Lamp - {calculatorSegment === "local" ? "Rs 4,500" : calculatorSegment === "wholesale" ? "Rs 2,000" : "$45.00"}</option>
                            <option value="usb_color">Color-Changing USB Salt Lamp - {calculatorSegment === "local" ? "Rs 5,500" : calculatorSegment === "wholesale" ? "Rs 2,500" : "$55.00"}</option>
                          </>
                        ) : selectedProduct === "moon-lamp" ? (
                          <>
                            <option value="moon_mini">Mini Moon Lamp - {calculatorSegment === "local" ? "Rs 5,000" : calculatorSegment === "wholesale" ? "Rs 2,500" : "$35.00"}</option>
                            <option value="moon_color">Color-Changing Moon Lamp - {calculatorSegment === "local" ? "Rs 6,500" : calculatorSegment === "wholesale" ? "Rs 3,200" : "$45.00"}</option>
                            <option value="moon_led">Premium LED Moon Lamp - {calculatorSegment === "local" ? "Rs 7,500" : calculatorSegment === "wholesale" ? "Rs 3,800" : "$55.00"}</option>
                            <option value="moon_luxury">Luxury Moon Lamp (Remote + Multi-Color) - {calculatorSegment === "local" ? "Rs 8,500" : calculatorSegment === "wholesale" ? "Rs 4,500" : "$65.00"}</option>
                          </>
                        ) : selectedProduct === "colored-lamp" ? (
                          <>
                            <option value="colored_small">Small (1–2 kg) - {calculatorSegment === "local" ? "Rs 7,500" : calculatorSegment === "wholesale" ? "Rs 3,750" : "$45.00"}</option>
                            <option value="colored_medium">Medium (2–4 kg) - {calculatorSegment === "local" ? "Rs 10,500" : calculatorSegment === "wholesale" ? "Rs 5,250" : "$65.00"}</option>
                            <option value="colored_large">Large (4–6 kg) - {calculatorSegment === "local" ? "Rs 15,500" : calculatorSegment === "wholesale" ? "Rs 7,750" : "$90.00"}</option>
                            <option value="colored_xl">Extra Large (6–8 kg) - {calculatorSegment === "local" ? "Rs 20,500" : calculatorSegment === "wholesale" ? "Rs 10,250" : "$125.00"}</option>
                            <option value="colored_premium">Premium XL (8–10 kg) - {calculatorSegment === "local" ? "Rs 27,500" : calculatorSegment === "wholesale" ? "Rs 13,750" : "$165.00"}</option>
                          </>
                        ) : selectedProduct === "gift-set" ? (
                          <>
                            <option value="gift_mini">Mini Gift Set - {calculatorSegment === "local" ? "Rs 7,500" : calculatorSegment === "wholesale" ? "Rs 3,750" : "$55.00"}</option>
                            <option value="gift_classic">Classic Gift Set - {calculatorSegment === "local" ? "Rs 12,500" : calculatorSegment === "wholesale" ? "Rs 6,250" : "$85.00"}</option>
                            <option value="gift_premium">Premium Gift Set - {calculatorSegment === "local" ? "Rs 18,500" : calculatorSegment === "wholesale" ? "Rs 9,250" : "$125.00"}</option>
                            <option value="gift_luxury">Luxury Gift Set - {calculatorSegment === "local" ? "Rs 27,500" : calculatorSegment === "wholesale" ? "Rs 13,750" : "$175.00"}</option>
                            <option value="gift_executive">Executive Gift Collection - {calculatorSegment === "local" ? "Rs 38,500" : calculatorSegment === "wholesale" ? "Rs 19,250" : "$250.00"}</option>
                          </>
                        ) : (
                          <>
                            <option value="small">250 ml - {calculatorSegment === "local" ? "Rs 700" : calculatorSegment === "wholesale" ? "Rs 450" : "$12.00"}</option>
                            <option value="medium">500 ml - {calculatorSegment === "local" ? "Rs 1,200" : calculatorSegment === "wholesale" ? "Rs 800" : "$18.00"}</option>
                            <option value="large">1 L - {calculatorSegment === "local" ? "Rs 2,200" : calculatorSegment === "wholesale" ? "Rs 1,500" : "$30.00"}</option>
                          </>
                        )}
                      </select>
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="calc-qty" className="font-mono text-[10px] uppercase text-stone tracking-wider">
                      Quantity ({calcDetails.unitStr})
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        id="calc-qty"
                        min="1"
                        className="w-full bg-ink border border-cream/10 text-cream text-xs rounded p-3 focus:outline-none focus:border-salt-pink"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 font-mono text-[11px] tracking-wider uppercase transition-all duration-300 rounded flex items-center justify-center gap-2 font-semibold bg-salt-pink text-ink hover:bg-cream hover:shadow-[0_10px_20px_rgba(232,169,160,0.15)] hover:-translate-y-0.5"
                >
                  Request Certified Invoice Quote
                  <ArrowRight size={13} />
                </button>
                
                {quoteCreated && (
                  <div className="flex items-center gap-2 text-salt-pink font-mono text-xs justify-center animate-fade-in">
                    <CheckCircle size={14} />
                    Connecting to Al-Musfira Enterprises mail portal...
                  </div>
                )}
              </form>
            </div>

            {/* 5. Custom Quote Board Receipt */}
            <div className="lg:col-span-5 bg-ink/70 rounded border border-cream/10 p-5 md:p-6 flex flex-col justify-between relative overflow-hidden" id="estimate-receipt">
              <div className="absolute top-0 right-0 w-36 h-36 bg-salt-pink/[0.02] rounded-full blur-3xl pointer-events-none" />
              
              <div>
                <div className="flex justify-between items-center border-b border-cream/10 pb-4 mb-4">
                  <span className="font-mono text-[10px] text-stone uppercase tracking-widest">Est. Invoice Statement</span>
                  <span className="font-mono text-[10px] text-stone tracking-wide">Ref: #KS-{Math.floor(1000 + Math.random() * 9000)}</span>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <span className="text-[10px] font-mono text-stone uppercase block mb-0.5">Product Selected</span>
                    <span className="font-serif text-md text-cream">{calcDetails.name}</span>
                    <span className="text-[11px] text-stone block mt-0.5">Specifications: {calcDetails.unitStr} graded, double packed</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-stone uppercase block mb-0.5">Purchase Tier</span>
                    <span className="font-mono text-xs text-salt-pink uppercase tracking-wider font-semibold">
                      {calculatorSegment === "local" ? "🇵🇰 Pakistan Retail / Local Customer" : "🌎 International Export Customer"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-b border-cream/5 py-4 my-2">
                    <div>
                      <span className="text-[10px] font-mono text-stone uppercase block">Base Price</span>
                      <span className="font-mono text-xs text-cream mt-1 block">
                        {currencySymbol} {calcDetails.pricePerUnit.toLocaleString()} / {calcDetails.unitStr}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-stone uppercase block">Requested Qty</span>
                      <span className="font-mono text-xs text-cream mt-1 block">
                        {quantity.toLocaleString()} {calcDetails.unitStr}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs text-stone">
                  <span>Subtotal Product</span>
                  <span className="font-mono text-cream">
                    {currencySymbol} {totalBaseCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-stone">
                  <span>Estimated Logistics / Warehousing</span>
                  <span className="font-mono text-cream">
                    {currencySymbol} {shippingCost.toLocaleString()}
                  </span>
                </div>
                
                <div className="border-t border-cream/10 pt-3 mt-2 flex justify-between items-baseline">
                  <span className="font-serif text-sm text-cream font-medium">Total Cost Estimate</span>
                  <div className="text-right">
                    <span className="font-mono text-lg text-salt-pink font-semibold">
                      {currencySymbol} {(totalBaseCost + shippingCost).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* INTERNATIONAL EXCHANGE RATE WARNING WITH ANIMATED SHINY GRADIENT BORDER */}
                {calculatorSegment !== "local" && (
                  <div className="relative p-[1.5px] rounded-lg overflow-hidden pink-shiny-border animate-fade-in mt-4 shadow-[0_4px_12px_rgba(232,169,160,0.1)]">
                    <div className="bg-ink rounded-[7px] p-3 flex flex-col gap-1 leading-relaxed text-[10px]">
                      <span className="font-mono text-[8px] text-salt-pink uppercase tracking-widest font-bold flex items-center gap-1">
                        🌍 Currency Exchange Notice
                      </span>
                      <p className="text-cream/90 font-bold">
                        USD prices are converted from PKR and may fluctuate slightly with currency exchange rate movements at the time your order is placed.
                      </p>
                    </div>
                  </div>
                )}

                <span className="text-[9px] text-stone/70 leading-normal text-center block mt-3 border-t border-cream/5 pt-3">
                  *Calculated estimates represent raw production costs for July 2026. Official quotes are finalized by Al-Musfira Enterprises based on maritime diesel rates.
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* B2B Trade Portal - Contact Us Page (No Prices) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-ink-2/40 rounded border border-cream/10 p-6 md:p-8" id="b2b-contact-section">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 text-salt-pink font-mono text-xs uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-salt-pink animate-pulse" />
              Direct-to-Karachi Shipping Desk
            </div>
            <h4 className="font-serif text-2xl md:text-3xl text-cream">Sovereign Wholesaling &amp; Container Logistics</h4>
            
            <p className="text-stone text-xs leading-relaxed">
              Khewara coordinates bulk shipping and industrial grade distributions via registered partner warehouses and our primary shipping desk in Karachi, Pakistan. All commercial quotes are fully personalized to order specifications.
            </p>

            <div className="p-4 rounded bg-ink/50 border border-cream/5 flex flex-col gap-3">
              <h5 className="font-serif text-sm text-salt-pink font-semibold">Standard Commercial Specifications</h5>
              <ul className="text-xs text-stone flex flex-col gap-2 list-none pl-0">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-salt-pink" />
                  <span><strong>Sourcing Grades:</strong> Dark pink premium, medium pink, or white crystal seams</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-salt-pink" />
                  <span><strong>Sieving Sizes:</strong> Fine grain (0.2–0.5mm), coarse (2–5mm), or extra coarse chunks</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-salt-pink" />
                  <span><strong>FOB / CIF Shipping:</strong> Standard 20ft / 40ft container line dispatches from Karachi Port</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded bg-ink/50 border border-cream/5">
              <h5 className="font-serif text-sm text-cream font-semibold mb-2">Direct Contact Channels</h5>
              <div className="flex flex-col gap-1 text-xs text-stone font-mono">
                <span>Email: <a href="mailto:Almusfiraenterprises@gmail.com" className="text-salt-pink hover:underline">Almusfiraenterprises@gmail.com</a></span>
                <span>Hotline/WhatsApp: <a href="tel:+923132213228" className="text-salt-pink hover:underline">0313 2213228</a></span>
                <span className="text-[10px] text-stone/70 mt-1">Managed by Al-Musfira Enterprises, Karachi.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-ink/60 rounded border border-cream/5 p-5 md:p-6" id="b2b-form-wrapper">
            <h5 className="font-serif text-lg text-cream mb-1">Submit B2B Trade Request</h5>
            <p className="text-stone text-[11px] mb-5">
              No general prices are posted. Quotes are calibrated strictly according to container size, sieve specification, and maritime logistics.
            </p>

            <form onSubmit={handleB2bInquirySubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="b2b-company" className="font-mono text-[9px] uppercase text-stone tracking-wider">Company Name *</label>
                  <input
                    id="b2b-company"
                    type="text"
                    required
                    placeholder="e.g. Salt Distributors Ltd"
                    className="bg-ink border border-cream/10 text-cream text-xs rounded p-2.5 focus:outline-none focus:border-salt-pink"
                    value={b2bCompany}
                    onChange={(e) => setB2bCompany(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="b2b-contact" className="font-mono text-[9px] uppercase text-stone tracking-wider">Contact Person *</label>
                  <input
                    id="b2b-contact"
                    type="text"
                    required
                    placeholder="Full name"
                    className="bg-ink border border-cream/10 text-cream text-xs rounded p-2.5 focus:outline-none focus:border-salt-pink"
                    value={b2bContact}
                    onChange={(e) => setB2bContact(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="b2b-email" className="font-mono text-[9px] uppercase text-stone tracking-wider">Corporate Email *</label>
                  <input
                    id="b2b-email"
                    type="email"
                    required
                    placeholder="email@company.com"
                    className="bg-ink border border-cream/10 text-cream text-xs rounded p-2.5 focus:outline-none focus:border-salt-pink"
                    value={b2bEmail}
                    onChange={(e) => setB2bEmail(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="b2b-phone" className="font-mono text-[9px] uppercase text-stone tracking-wider">Phone / WhatsApp</label>
                  <input
                    id="b2b-phone"
                    type="tel"
                    placeholder="With country code"
                    className="bg-ink border border-cream/10 text-cream text-xs rounded p-2.5 focus:outline-none focus:border-salt-pink"
                    value={b2bPhone}
                    onChange={(e) => setB2bPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="b2b-prod" className="font-mono text-[9px] uppercase text-stone tracking-wider">Product of Interest</label>
                  <select
                    id="b2b-prod"
                    className="bg-ink border border-cream/10 text-cream text-xs rounded p-2.5 focus:outline-none focus:border-salt-pink"
                    value={b2bProduct}
                    onChange={(e) => setB2bProduct(e.target.value)}
                  >
                    <option value="Culinary Pink Salt">Culinary Pink Salt (Fine/Coarse)</option>
                    <option value="Natural Crystal Lamps">Natural Crystal Lamps</option>
                    <option value="Bath &amp; Body Soak">Bath &amp; Body Soak</option>
                    <option value="Polished Lamps">Sphere/Pyramid Polished Lamps</option>
                    <option value="Specialty Blocks &amp; Tiles">Salt Tiles &amp; Cooking Bricks</option>
                    <option value="Livestock Mineral Licks">Hanging Livestock Licks</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="b2b-vol" className="font-mono text-[9px] uppercase text-stone tracking-wider">Est. Volume Request</label>
                  <input
                    id="b2b-vol"
                    type="text"
                    placeholder="e.g. 5 Tons / 1,000 Units"
                    className="bg-ink border border-cream/10 text-cream text-xs rounded p-2.5 focus:outline-none focus:border-salt-pink"
                    value={b2bVolume}
                    onChange={(e) => setB2bVolume(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="b2b-port" className="font-mono text-[9px] uppercase text-stone tracking-wider">Destination Port / Delivery Address</label>
                <input
                  id="b2b-port"
                  type="text"
                  placeholder="e.g. Hamburg Port, Germany / CIF terms"
                  className="bg-ink border border-cream/10 text-cream text-xs rounded p-2.5 focus:outline-none focus:border-salt-pink"
                  value={b2bPort}
                  onChange={(e) => setB2bPort(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="b2b-msg" className="font-mono text-[9px] uppercase text-stone tracking-wider">Inquiry Details *</label>
                <textarea
                  id="b2b-msg"
                  required
                  rows={3}
                  placeholder="Specify grain sieving, customized labeling, or packaging preferences..."
                  className="bg-ink border border-cream/10 text-cream text-xs rounded p-2.5 focus:outline-none focus:border-salt-pink resize-none"
                  value={b2bMessage}
                  onChange={(e) => setB2bMessage(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-salt-pink text-ink hover:bg-cream transition-all font-semibold font-mono text-[10px] uppercase tracking-wider rounded flex items-center justify-center gap-2 hover:shadow-[0_10px_20px_rgba(232,169,160,0.15)]"
              >
                Send B2B Trade Dispatch
                <ArrowRight size={13} />
              </button>

              {b2bStatus && (
                <div className="flex items-center gap-1.5 text-[10px] font-mono mt-1 text-salt-pink">
                  <CheckCircle size={12} />
                  {b2bStatus}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
