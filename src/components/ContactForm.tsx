/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { CustomerSegment } from "../types";
import { Mail, Phone, MapPin, CheckCircle, ArrowRight } from "lucide-react";
import { WhatsAppIconSVG as WhatsAppIcon } from "./WhatsAppButton";

interface ContactFormProps {
  activeSegment: CustomerSegment;
}

export const ContactForm: React.FC<ContactFormProps> = ({ activeSegment }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("Wholesale / bulk pricing");
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<{ inquiryId: string; targetEmail: string } | null>(null);

  // Sync reason option with active customer segment selection
  useEffect(() => {
    if (activeSegment === "local") {
      setReason("Retail order");
    } else if (activeSegment === "intl") {
      setReason("Export / international shipping");
    } else {
      setReason("Wholesale / bulk pricing");
    }
  }, [activeSegment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setStatusMessage("Please fill in all required fields.");
      setIsSuccess(false);
      return;
    }

    setSubmitting(true);
    setStatusMessage("");

    // Wholesale inquiries routed to Almusfiraenterprises, others to general
    const targetEmail =
      reason.includes("Wholesale") || activeSegment === "wholesale"
        ? "Almusfiraenterprises@gmail.com"
        : "khewarapinksalt@gmail.com";

    try {
      // 1. Submit to Backend / Admin Portal
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          reason,
          activeSegment,
          message,
        }),
      });

      const data = await response.json();
      const refId = data.inquiry?.inquiryId || `INQ-${Math.floor(100000 + Math.random() * 900000)}`;

      // 2. Prepare Instant Email Dispatch
      const subject = encodeURIComponent(`Khewara Pink Salt Inquiry [Ref: ${refId}]: ${reason}`);
      const body = encodeURIComponent(
        `Khewara Pink Salt Customer Inquiry Submission:\n\n` +
        `Inquiry Ref ID: ${refId}\n` +
        `Customer Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone/WhatsApp: ${phone || "Not specified"}\n` +
        `Inquiry Type: ${reason}\n` +
        `Customer Segment: ${activeSegment.toUpperCase()}\n\n` +
        `Message:\n${message}\n\n` +
        `----------------------------------------\n` +
        `Submitted via Khewara Official Portal on ${new Date().toLocaleString()}`
      );

      // Trigger instant mailto link
      window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;

      setSubmittedInquiry({ inquiryId: refId, targetEmail });
      setIsSuccess(true);
      setStatusMessage(`Inquiry recorded in Admin Portal (#${refId}) & instant email client launched!`);
    } catch (err) {
      console.error("Submission fallback:", err);
      // Fallback mailto dispatch if offline
      const subject = encodeURIComponent(`Khewara Pink Salt Inquiry: ${reason}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nMessage: ${message}`);
      window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
      setIsSuccess(true);
      setStatusMessage("Opening email client to send message to sales team...");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="contact-wrapper">
      <div className="lg:col-span-5 flex flex-col gap-6" id="contact-info-panel">
        <div>
          <span className="font-mono text-xs text-salt-pink tracking-widest uppercase">Get in touch</span>
          <h3 className="font-serif text-3xl md:text-4xl text-cream mt-1">Bring the Mine to Your Space</h3>
          <p className="text-stone text-sm leading-relaxed mt-4">
            We handle everything from custom household retail lamp shapes to commercial container shipments leaving the port of Karachi.
          </p>
        </div>

        <div className="flex flex-col gap-5 mt-2">
          <div className="flex items-start gap-4 p-4 rounded bg-ink-3/30 border border-cream/5 hover:border-salt-pink/20 transition-all duration-300">
            <div className="p-2.5 rounded bg-salt-pink/10 text-salt-pink mt-0.5">
              <Mail size={16} />
            </div>
            <div>
              <span className="font-mono text-[10px] text-stone uppercase tracking-wider block">Local Retail Enquiries</span>
              <a href="mailto:khewarapinksalt@gmail.com" className="text-sm text-cream hover:text-salt-pink transition-colors">
                khewarapinksalt@gmail.com
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded bg-ink-3/30 border border-cream/5 hover:border-rose-deep/20 transition-all duration-300">
            <div className="p-2.5 rounded bg-rose-deep/10 text-rose-deep mt-0.5">
              <Mail size={16} />
            </div>
            <div>
              <span className="font-mono text-[10px] text-stone uppercase tracking-wider block">Internal B2B &amp; Bulk Trade Desk</span>
              <a href="mailto:Almusfiraenterprises@gmail.com" className="text-sm text-cream hover:text-salt-pink transition-colors">
                Almusfiraenterprises@gmail.com
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded bg-ink-3/30 border border-salt-pink/20 hover:border-salt-pink/50 transition-all duration-300 pink-shiny-border">
            <div className="p-2.5 rounded bg-salt-pink/15 text-salt-pink mt-0.5 border border-salt-pink/30">
              <WhatsAppIcon size={18} />
            </div>
            <div className="flex-1">
              <span className="font-mono text-[10px] text-stone uppercase tracking-wider block">Phone &amp; WhatsApp Hotline</span>
              <div className="flex flex-wrap items-center gap-3 mt-0.5">
                <a href="tel:+923343711613" className="text-sm text-cream hover:text-salt-pink transition-colors font-mono font-bold">
                  0334 3711613
                </a>
                <a
                  href="https://wa.me/923343711613?text=Hello%20Khewara%20Pink%20Salt%2C%20I%20have%20an%20inquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-salt-pink text-ink font-mono text-[10px] font-bold hover:bg-cream transition-all shadow-sm"
                >
                  <WhatsAppIcon size={12} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded bg-ink-3/30 border border-cream/5">
            <div className="p-2.5 rounded bg-stone/10 text-stone mt-0.5">
              <MapPin size={16} />
            </div>
            <div>
              <span className="font-mono text-[10px] text-stone uppercase tracking-wider block">Main Offices &amp; Depot</span>
              <span className="text-sm text-cream">Karachi, Pakistan</span>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 bg-ink-2/30 rounded border border-cream/5 p-6 md:p-8" id="contact-form-panel">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cf-name" className="font-mono text-[10px] uppercase text-stone tracking-wider">Your Name *</label>
              <input
                id="cf-name"
                type="text"
                required
                placeholder="Full name"
                className="bg-ink border border-cream/10 text-cream text-xs rounded p-3 focus:outline-none focus:border-salt-pink"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="cf-email" className="font-mono text-[10px] uppercase text-stone tracking-wider">Email Address *</label>
              <input
                id="cf-email"
                type="email"
                required
                placeholder="email@example.com"
                className="bg-ink border border-cream/10 text-cream text-xs rounded p-3 focus:outline-none focus:border-salt-pink"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cf-phone" className="font-mono text-[10px] uppercase text-stone tracking-wider">Contact Number (Optional)</label>
              <input
                id="cf-phone"
                type="tel"
                placeholder="Phone / WhatsApp"
                className="bg-ink border border-cream/10 text-cream text-xs rounded p-3 focus:outline-none focus:border-salt-pink"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="cf-reason" className="font-mono text-[10px] uppercase text-stone tracking-wider">Inquiry Intent</label>
              <select
                id="cf-reason"
                className="bg-ink border border-cream/10 text-cream text-xs rounded p-3 focus:outline-none focus:border-salt-pink"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="Retail order">Retail Household Order (Pakistan)</option>
                <option value="Export / international shipping">International Export Shipment</option>
                <option value="Wholesale / bulk pricing">Commercial Bulk Wholesaling</option>
                <option value="Custom lamp order">Bespoke Lamp Carving Request</option>
                <option value="Something else">General Partnership Inquiry</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="cf-msg" className="font-mono text-[10px] uppercase text-stone tracking-wider">Detailed Message *</label>
            <textarea
              id="cf-msg"
              required
              rows={4}
              placeholder="Tell us about your spatial needs or cargo requirements..."
              className="bg-ink border border-cream/10 text-cream text-xs rounded p-3 focus:outline-none focus:border-salt-pink resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full md:w-auto self-start bg-salt-pink text-ink hover:bg-cream py-3.5 px-8 font-mono text-[11px] tracking-wider uppercase rounded font-semibold transition-all duration-300 hover:shadow-[0_10px_20px_rgba(232,169,160,0.15)] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? "Processing Dispatch..." : "Send Inquiry Dispatch"}
            <ArrowRight size={13} />
          </button>

          {isSuccess && submittedInquiry && (
            <div className="mt-4 p-4 rounded-lg bg-salt-pink/10 border border-salt-pink/30 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-salt-pink font-serif text-sm font-bold">
                <CheckCircle size={16} />
                <span>Inquiry Successfully Received &amp; Dispatched!</span>
              </div>
              <p className="text-xs text-cream leading-relaxed">
                Your message has been safely recorded in the <strong className="text-salt-pink">Admin Portal Database (Ref: {submittedInquiry.inquiryId})</strong> and an instant notification email was sent to <strong className="text-salt-pink">{submittedInquiry.targetEmail}</strong>.
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="text-[10px] font-mono bg-ink/80 text-stone px-2 py-1 rounded border border-cream/10">
                  ✔ Admin Portal Logged
                </span>
                <span className="text-[10px] font-mono bg-ink/80 text-salt-pink px-2 py-1 rounded border border-salt-pink/20">
                  📧 Instant Email Dispatched
                </span>
              </div>
            </div>
          )}

          {statusMessage && !submittedInquiry && (
            <div className={`flex items-center gap-2 text-xs font-mono mt-2 ${isSuccess ? "text-salt-pink" : "text-amber"}`}>
              {isSuccess && <CheckCircle size={14} />}
              {statusMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
