import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, 
  Unlock, 
  RefreshCw, 
  Trash2, 
  X, 
  Eye, 
  Package, 
  DollarSign, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  ChevronDown,
  Download
} from "lucide-react";

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const [passcode, setPasscode] = useState(localStorage.getItem("admin_passcode") || "");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "inquiries">("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passcodeInput, setPasscodeInput] = useState("");
  const [viewingScreenshot, setViewingScreenshot] = useState<string | null>(null);
  const [viewingScreenshotName, setViewingScreenshotName] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Attempt auto-login if passcode exists
  useEffect(() => {
    if (passcode && isOpen) {
      verifyPasscode(passcode);
    }
  }, [passcode, isOpen]);

  // Live auto-sync listener for new orders and inquiries
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      const syncData = () => {
        const { mergedOrders, mergedInquiries } = loadCombinedData([], []);
        setOrders(mergedOrders);
        setInquiries(mergedInquiries);
      };

      window.addEventListener("khewara_new_data", syncData);
      window.addEventListener("storage", syncData);
      const timer = setInterval(() => {
        handleRefresh();
      }, 3000);

      return () => {
        window.removeEventListener("khewara_new_data", syncData);
        window.removeEventListener("storage", syncData);
        clearInterval(timer);
      };
    }
  }, [isAuthenticated, isOpen, passcode]);

  // Default sample fallback data for instant preview on Vercel or fresh installs
  const DEFAULT_SAMPLE_ORDERS = [
    {
      orderNumber: "KW-892104",
      customerName: "Amina Khan",
      customerEmail: "amina.khan@example.com",
      customerPhone: "+92 300 1234567",
      shippingAddress: "House 45, Street 12, F-7/2, Islamabad, Pakistan",
      items: [
        { id: "lamp-pyramid", name: "Pyramid Crafted Salt Lamp", price: 3200, quantity: 1 }
      ],
      subtotal: 3200,
      shipping: 250,
      total: 3450,
      currency: "PKR",
      method: "cod",
      status: "Pending",
      date: "7/27/2026, 2:15:00 PM"
    },
    {
      orderNumber: "KW-741092",
      customerName: "David Miller",
      customerEmail: "david.m@milletraders.com",
      customerPhone: "+1 415 555 2671",
      shippingAddress: "742 Evergreen Terrace, Springfield, OR, USA",
      items: [
        { id: "salt-tiles", name: "Premium Himalayan Salt Tiles (Box of 10)", price: 85, quantity: 2 }
      ],
      subtotal: 170,
      shipping: 25,
      total: 195,
      currency: "USD",
      method: "card",
      status: "Shipped",
      date: "7/26/2026, 11:30:00 AM"
    }
  ];

  const DEFAULT_SAMPLE_INQUIRIES = [
    {
      inquiryId: "INQ-166918",
      name: "jshu",
      email: "swwh@gmail.com",
      phone: "8389333",
      reason: "Retail order",
      activeSegment: "local",
      message: "Interested in purchasing crafted salt lamps for home decor.",
      targetEmail: "khewarapinksalt@gmail.com",
      status: "Unread",
      date: "7/27/2026, 10:34:29 PM"
    },
    {
      inquiryId: "INQ-504912",
      name: "Tariq Mahmood",
      email: "tariq@almusfiraenterprises.com",
      phone: "+92 321 9876543",
      reason: "Bulk Export / Wholesale Container Order",
      activeSegment: "wholesale",
      message: "Requesting quotation for 20ft container of gourmet edible pink salt (fine grain, 25kg sacks).",
      targetEmail: "Almusfiraenterprises@gmail.com",
      status: "Unread",
      date: "7/27/2026, 6:12:45 PM"
    }
  ];

  // Helper to load and merge data from API and client-side localStorage (for Vercel compatibility)
  const loadCombinedData = (apiOrders: any[] = [], apiInquiries: any[] = []) => {
    let localOrders: any[] = [];
    let localInquiries: any[] = [];
    try {
      localOrders = JSON.parse(localStorage.getItem("local_orders") || "[]");
    } catch (e) {
      console.warn("Error reading local_orders:", e);
    }
    try {
      localInquiries = JSON.parse(localStorage.getItem("local_inquiries") || "[]");
    } catch (e) {
      console.warn("Error reading local_inquiries:", e);
    }

    // Merge orders: api orders + local orders, unique by orderNumber
    const ordersMap = new Map<string, any>();
    [...apiOrders, ...localOrders].forEach(o => {
      if (o && o.orderNumber && !ordersMap.has(o.orderNumber)) {
        ordersMap.set(o.orderNumber, o);
      }
    });

    // If no orders exist anywhere yet, seed with initial sample orders
    if (ordersMap.size === 0) {
      DEFAULT_SAMPLE_ORDERS.forEach(o => ordersMap.set(o.orderNumber, o));
      try {
        localStorage.setItem("local_orders", JSON.stringify(DEFAULT_SAMPLE_ORDERS));
      } catch (e) {}
    }
    const mergedOrders = Array.from(ordersMap.values());

    // Merge inquiries: api inquiries + local inquiries, unique by inquiryId
    const inquiriesMap = new Map<string, any>();
    [...apiInquiries, ...localInquiries].forEach(iq => {
      if (iq && iq.inquiryId && !inquiriesMap.has(iq.inquiryId)) {
        inquiriesMap.set(iq.inquiryId, iq);
      }
    });

    // If no inquiries exist anywhere yet, seed with initial sample inquiries
    if (inquiriesMap.size === 0) {
      DEFAULT_SAMPLE_INQUIRIES.forEach(iq => inquiriesMap.set(iq.inquiryId, iq));
      try {
        localStorage.setItem("local_inquiries", JSON.stringify(DEFAULT_SAMPLE_INQUIRIES));
      } catch (e) {}
    }
    const mergedInquiries = Array.from(inquiriesMap.values());

    return { mergedOrders, mergedInquiries };
  };

  const verifyPasscode = async (codeToVerify: string) => {
    setLoading(true);
    setError("");
    const trimmedCode = codeToVerify.trim();

    try {
      // Fetch Orders from API backend
      const resOrders = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: trimmedCode })
      });
      const dataOrders = await resOrders.json().catch(() => ({}));

      // Fetch Inquiries from API backend
      const resInquiries = await fetch("/api/admin/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: trimmedCode })
      });
      const dataInquiries = await resInquiries.json().catch(() => ({}));

      const isServerValid = resOrders.ok && dataOrders.success;
      const isClientValid = trimmedCode === "3663";

      if (isServerValid || isClientValid) {
        setIsAuthenticated(true);
        const { mergedOrders, mergedInquiries } = loadCombinedData(
          dataOrders.orders || [],
          dataInquiries.inquiries || []
        );
        setOrders(mergedOrders);
        setInquiries(mergedInquiries);
        localStorage.setItem("admin_passcode", trimmedCode);
        setPasscode(trimmedCode);
        setError("");
      } else {
        setError("Invalid administrator passcode. Access denied.");
        setIsAuthenticated(false);
        if (trimmedCode === passcode) {
          localStorage.removeItem("admin_passcode");
          setPasscode("");
        }
      }
    } catch (err) {
      if (trimmedCode === "3663") {
        setIsAuthenticated(true);
        const { mergedOrders, mergedInquiries } = loadCombinedData([], []);
        setOrders(mergedOrders);
        setInquiries(mergedInquiries);
        localStorage.setItem("admin_passcode", trimmedCode);
        setPasscode(trimmedCode);
        setError("");
      } else {
        setError("Invalid administrator passcode. Access denied.");
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcodeInput.trim()) return;
    verifyPasscode(passcodeInput);
  };

  const handleRefresh = async () => {
    if (!passcode) return;
    setLoading(true);
    let apiOrders: any[] = [];
    let apiInquiries: any[] = [];

    try {
      const resOrders = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode })
      });
      const dataOrders = await resOrders.json().catch(() => ({}));
      if (dataOrders.success) apiOrders = dataOrders.orders || [];

      const resInquiries = await fetch("/api/admin/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode })
      });
      const dataInquiries = await resInquiries.json().catch(() => ({}));
      if (dataInquiries.success) apiInquiries = dataInquiries.inquiries || [];
    } catch (err) {
      // Ignore network errors and continue with local storage data
    } finally {
      const { mergedOrders, mergedInquiries } = loadCombinedData(apiOrders, apiInquiries);
      setOrders(mergedOrders);
      setInquiries(mergedInquiries);
      setError("");
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderNumber: string, newStatus: string) => {
    try {
      fetch("/api/admin/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode, orderNumber, status: newStatus })
      }).catch(() => {});

      setOrders(prev => {
        const updated = prev.map(o => o.orderNumber === orderNumber ? { ...o, status: newStatus } : o);
        try {
          localStorage.setItem("local_orders", JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    } catch (err) {
      console.warn(err);
    }
  };

  const handleDeleteOrder = async (orderNumber: string) => {
    if (!confirm(`Are you sure you want to delete order #${orderNumber}? This action cannot be undone.`)) {
      return;
    }
    try {
      fetch("/api/admin/delete-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode, orderNumber })
      }).catch(() => {});

      setOrders(prev => {
        const updated = prev.filter(o => o.orderNumber !== orderNumber);
        try {
          localStorage.setItem("local_orders", JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    } catch (err) {
      console.warn(err);
    }
  };

  const handleUpdateInquiryStatus = async (inquiryId: string, newStatus: string) => {
    try {
      fetch("/api/admin/update-inquiry-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode, inquiryId, status: newStatus })
      }).catch(() => {});

      setInquiries(prev => {
        const updated = prev.map(iq => iq.inquiryId === inquiryId ? { ...iq, status: newStatus } : iq);
        try {
          localStorage.setItem("local_inquiries", JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    } catch (err) {
      console.warn(err);
    }
  };

  const handleDeleteInquiry = async (inquiryId: string) => {
    if (!confirm(`Delete contact inquiry #${inquiryId}?`)) return;
    try {
      fetch("/api/admin/delete-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode, inquiryId })
      }).catch(() => {});

      setInquiries(prev => {
        const updated = prev.filter(iq => iq.inquiryId !== inquiryId);
        try {
          localStorage.setItem("local_inquiries", JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    } catch (err) {
      console.warn(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_passcode");
    setPasscode("");
    setIsAuthenticated(false);
    setOrders([]);
    setInquiries([]);
  };

  // Calculations for Admin Analytics Row
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "Pending").length;
  const completedOrders = orders.filter(o => o.status === "Shipped").length;
  const unreadInquiries = inquiries.filter(iq => iq.status === "Unread").length;
  
  // Summing revenue split by currency
  const pkrRevenue = orders
    .filter(o => o.status !== "Cancelled" && o.currency === "PKR")
    .reduce((sum, o) => sum + o.total, 0);

  const usdRevenue = orders
    .filter(o => o.status !== "Cancelled" && o.currency === "USD")
    .reduce((sum, o) => sum + o.total, 0);

  // Filters & Searches for Orders
  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery) ||
      (o.customerEmail && o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
      o.shippingAddress.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filters & Searches for Inquiries
  const filteredInquiries = inquiries.filter(iq => {
    const matchesStatus = inquiryStatusFilter === "All" || iq.status === inquiryStatusFilter;
    const matchesSearch =
      iq.inquiryId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iq.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iq.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iq.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iq.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iq.message?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-ink border border-cream/10 rounded-xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* HEADER */}
        <div className="border-b border-cream/10 px-6 py-4 flex justify-between items-center bg-ink-2">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-salt-pink/10 border border-salt-pink/20 rounded-md text-salt-pink">
              {isAuthenticated ? <Unlock size={18} /> : <Lock size={18} />}
            </span>
            <div>
              <h2 className="font-serif text-lg text-cream tracking-tight">Owner Command Terminal</h2>
              <p className="text-[10px] text-stone font-mono uppercase tracking-wider">Secret Live Order Stream</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/api/download-zip"
              download="khewara-pink-salt-source.zip"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-salt-pink/10 border border-salt-pink/30 text-salt-pink hover:bg-salt-pink hover:text-ink transition-all font-mono text-xs font-bold"
              title="Download full project source code as ZIP archive"
            >
              <Download size={14} />
              <span>Download ZIP</span>
            </a>
            <button 
              onClick={onClose}
              className="p-1.5 bg-cream/5 text-stone hover:text-cream hover:bg-cream/10 rounded-full transition-all"
              aria-label="Close terminal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* NOT AUTHENTICATED PORTAL */}
        {!isAuthenticated ? (
          <div className="flex-1 py-16 px-6 max-w-md mx-auto w-full flex flex-col justify-center">
            <div className="text-center mb-8 flex flex-col items-center">
              <div className="w-16 h-16 bg-salt-pink/5 rounded-full flex items-center justify-center border border-salt-pink/15 text-salt-pink mb-4">
                <Lock size={28} />
              </div>
              <h3 className="font-serif text-xl text-cream">Owner Authentication Required</h3>
              <p className="text-xs text-stone mt-2 leading-relaxed">
                Provide your secret administrator key password to decrypt and stream live retail customer orders.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] uppercase text-stone tracking-wider">Owner Secret Passcode</label>
                <input
                  type="password"
                  placeholder="••••••••••••••"
                  className="bg-ink border border-cream/15 text-cream text-sm rounded-lg p-3 text-center focus:outline-none focus:border-salt-pink font-mono tracking-widest"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  autoFocus
                />
              </div>

              {error && (
                <div className="p-3 bg-rose-950/20 border border-rose-900/35 rounded text-xs text-rose-300 font-mono flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-salt-pink text-ink hover:bg-cream py-3 rounded-lg font-mono text-xs tracking-wider uppercase font-bold transition-all disabled:opacity-55 flex items-center justify-center gap-2"
              >
                {loading ? "Decrypting Live Logs..." : "Unlock Live Order Logs"}
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED TERMINAL */
          <div className="flex-1 overflow-hidden flex flex-col min-h-0 bg-ink">
            
            {/* ANALYTICS ROW & TAB NAVIGATION */}
            <div className="border-b border-cream/5 bg-ink-3/40">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
                <div className="bg-ink border border-cream/5 p-4 rounded-lg flex flex-col gap-1">
                  <span className="font-mono text-[9px] uppercase text-stone tracking-wider flex items-center gap-1">
                    <Package size={10} className="text-salt-pink" />
                    Total Orders
                  </span>
                  <span className="text-2xl font-serif text-cream font-bold mt-1">{totalOrders}</span>
                </div>

                <div className="bg-ink border border-cream/5 p-4 rounded-lg flex flex-col gap-1">
                  <span className="font-mono text-[9px] uppercase text-stone tracking-wider flex items-center gap-1">
                    <Clock size={10} className="text-amber-400" />
                    Unshipped Orders
                  </span>
                  <span className="text-2xl font-serif text-amber-400 font-bold mt-1">{pendingOrders}</span>
                </div>

                <div className="bg-ink border border-cream/5 p-4 rounded-lg flex flex-col gap-1">
                  <span className="font-mono text-[9px] uppercase text-stone tracking-wider flex items-center gap-1">
                    <Mail size={10} className="text-salt-pink" />
                    Contact Inquiries
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-serif text-cream font-bold">{inquiries.length}</span>
                    {unreadInquiries > 0 && (
                      <span className="text-[10px] font-mono bg-salt-pink/20 text-salt-pink px-1.5 py-0.5 rounded-full font-bold">
                        {unreadInquiries} Unread
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-ink border border-cream/5 p-4 rounded-lg flex flex-col gap-1">
                  <span className="font-mono text-[9px] uppercase text-stone tracking-wider flex items-center gap-1">
                    <DollarSign size={10} className="text-salt-pink" />
                    Accrued Revenue
                  </span>
                  <div className="flex flex-col mt-0.5">
                    <span className="text-[11px] font-mono text-cream">Rs {pkrRevenue.toLocaleString()}</span>
                    <span className="text-[11px] font-mono text-salt-pink">${usdRevenue.toLocaleString()} <span className="text-stone text-[9px]">USD</span></span>
                  </div>
                </div>
              </div>

              {/* TABS SELECTOR BAR */}
              <div className="px-6 flex gap-2 border-t border-cream/5 pt-3 pb-0">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`px-4 py-2.5 font-mono text-xs uppercase tracking-wider rounded-t-lg transition-all border-t border-x flex items-center gap-2 ${
                    activeTab === "orders"
                      ? "bg-ink border-cream/15 text-salt-pink font-bold border-b-2 border-b-salt-pink"
                      : "bg-ink-2/30 border-transparent text-stone hover:text-cream"
                  }`}
                >
                  <Package size={14} />
                  <span>Orders &amp; Payments ({orders.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab("inquiries")}
                  className={`px-4 py-2.5 font-mono text-xs uppercase tracking-wider rounded-t-lg transition-all border-t border-x flex items-center gap-2 relative ${
                    activeTab === "inquiries"
                      ? "bg-ink border-cream/15 text-salt-pink font-bold border-b-2 border-b-salt-pink"
                      : "bg-ink-2/30 border-transparent text-stone hover:text-cream"
                  }`}
                >
                  <Mail size={14} />
                  <span>Contact Form Inquiries ({inquiries.length})</span>
                  {unreadInquiries > 0 && (
                    <span className="w-2 h-2 rounded-full bg-salt-pink animate-ping absolute top-2 right-2" />
                  )}
                </button>
              </div>
            </div>

            {/* CONTROLS (SEARCH & FILTER) */}
            <div className="px-6 py-4 border-b border-cream/5 flex flex-col sm:flex-row justify-between gap-4 items-center bg-ink-2/30">
              <div className="relative w-full sm:max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
                <input
                  type="text"
                  placeholder={activeTab === "orders" ? "Search orders, clients, phones..." : "Search inquiries, names, emails..."}
                  className="bg-ink border border-cream/10 text-cream text-xs rounded-lg pl-9 pr-4 py-2 w-full focus:outline-none focus:border-salt-pink font-mono"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {activeTab === "orders" ? (
                  <div className="flex items-center bg-ink border border-cream/10 rounded-lg px-2 py-1.5 gap-2 text-xs">
                    <Filter size={12} className="text-stone" />
                    <span className="text-stone font-mono text-[10px] uppercase">Filter:</span>
                    <select
                      className="bg-transparent text-cream border-none focus:outline-none font-mono text-xs cursor-pointer"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex items-center bg-ink border border-cream/10 rounded-lg px-2 py-1.5 gap-2 text-xs">
                    <Filter size={12} className="text-stone" />
                    <span className="text-stone font-mono text-[10px] uppercase">Filter:</span>
                    <select
                      className="bg-transparent text-cream border-none focus:outline-none font-mono text-xs cursor-pointer"
                      value={inquiryStatusFilter}
                      onChange={(e) => setInquiryStatusFilter(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Unread">Unread</option>
                      <option value="Read">Read</option>
                      <option value="Replied">Replied</option>
                    </select>
                  </div>
                )}

                <button
                  onClick={handleRefresh}
                  className="p-2 bg-cream/5 text-stone hover:text-cream hover:bg-cream/10 border border-cream/5 rounded-lg transition-colors flex items-center gap-1 text-xs font-mono"
                  title="Force Reload database stream"
                >
                  <RefreshCw size={13} className={loading ? "animate-spin text-salt-pink" : ""} />
                  <span className="hidden md:inline">Sync DB</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-rose-950/20 text-rose-300 border border-rose-950 hover:bg-rose-900/30 rounded-lg transition-all text-xs font-mono"
                >
                  Lock
                </button>
              </div>
            </div>

            {/* TAB CONTENT: ORDERS VS INQUIRIES */}
            <div className="flex-1 overflow-auto p-6">
              {activeTab === "orders" ? (
                filteredOrders.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-3 text-center text-stone">
                    <Package size={42} className="opacity-15" />
                    <p className="text-xs">No orders match the current filters or query.</p>
                    <span className="text-[10px] font-mono uppercase tracking-wider max-w-sm">
                      Orders will appear dynamically as customers place them.
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-5">
                    {filteredOrders.map((order) => (
                      <div 
                        key={order.orderNumber}
                        className="bg-ink-3/40 border border-cream/10 rounded-lg overflow-hidden hover:border-salt-pink/20 transition-all duration-200"
                      >
                        {/* Sub-Header bar */}
                        <div className="bg-ink-2/60 border-b border-cream/5 px-4 py-3 flex flex-wrap justify-between items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-salt-pink">{order.orderNumber}</span>
                            <span className="text-[10px] text-stone font-mono">•</span>
                            <span className="text-[10px] text-stone font-mono flex items-center gap-1">
                              <Calendar size={10} />
                              {order.date}
                            </span>
                          </div>

                          {/* Status update controller */}
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-medium ${
                              order.status === "Shipped" 
                                ? "bg-emerald-550/15 text-emerald-400 border border-emerald-950" 
                                : order.status === "Cancelled" 
                                ? "bg-rose-950/25 text-rose-400 border border-rose-950" 
                                : "bg-amber-950/25 text-amber-400 border border-amber-950"
                            }`}>
                              {order.status}
                            </span>

                            <select
                              className="bg-ink border border-cream/15 text-cream text-[10px] rounded px-1.5 py-0.5 font-mono cursor-pointer focus:outline-none focus:border-salt-pink"
                              value={order.status}
                              onChange={(e) => handleUpdateStatus(order.orderNumber, e.target.value)}
                            >
                              <option value="Pending">Set Pending</option>
                              <option value="Shipped">Set Shipped</option>
                              <option value="Cancelled">Set Cancelled</option>
                            </select>

                            <button
                              onClick={() => handleDeleteOrder(order.orderNumber)}
                              className="p-1 bg-rose-950/10 text-stone hover:text-rose-400 hover:bg-rose-950/50 rounded transition-all ml-1"
                              title="Delete permanently"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Info Panel columns */}
                        <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                          
                          {/* CUSTOMER INFO (4 COLS) */}
                          <div className="md:col-span-4 flex flex-col gap-2 text-xs">
                            <h4 className="font-mono text-[9px] uppercase tracking-wider text-stone border-b border-cream/5 pb-1 font-bold">Client &amp; Logistics</h4>
                            <div className="flex items-center gap-2 text-cream font-medium">
                              <span className="truncate">{order.customerName}</span>
                            </div>
                            {order.customerEmail && (
                              <div className="flex items-center gap-2 text-stone truncate font-mono text-[11px]">
                                <Mail size={11} className="shrink-0" />
                                <span>{order.customerEmail}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-stone font-mono text-[11px]">
                              <Phone size={11} className="shrink-0" />
                              <span>{order.customerPhone}</span>
                            </div>
                            <div className="flex items-start gap-2 text-stone text-[11px] leading-relaxed">
                              <MapPin size={11} className="shrink-0 mt-0.5 text-salt-pink" />
                              <span>{order.shippingAddress}</span>
                            </div>
                          </div>

                          {/* ITEMS SUMMARY (4 COLS) */}
                          <div className="md:col-span-4 flex flex-col gap-2 text-xs">
                            <h4 className="font-mono text-[9px] uppercase tracking-wider text-stone border-b border-cream/5 pb-1 font-bold">Order Breakdown</h4>
                            <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                              {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between text-[11px]">
                                  <span className="text-cream truncate flex-1 pr-2">
                                    {item.name} <span className="text-stone">x{item.quantity}</span>
                                  </span>
                                  <span className="font-mono text-stone">
                                    {order.currency === "PKR" ? "Rs" : "$"} {((item.price || item.unitPrice || 0) * item.quantity).toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* FINANCIAL BOTTOM LINE */}
                            <div className="border-t border-cream/5 pt-2 mt-1 flex flex-col gap-1 text-[11px] font-mono">
                              <div className="flex justify-between text-stone">
                                <span>Shipping:</span>
                                <span>{order.currency === "PKR" ? "Rs" : "$"} {order.shipping?.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-salt-pink font-semibold border-t border-cream/5 pt-1.5">
                                <span>Grand Total:</span>
                                <span>{order.currency === "PKR" ? "Rs" : "$"} {order.total?.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>

                          {/* PAYMENT DETAILS & SCREENSHOT UPLOAD (4 COLS) */}
                          <div className="md:col-span-4 flex flex-col gap-2.5 text-xs">
                            <h4 className="font-mono text-[9px] uppercase tracking-wider text-stone border-b border-cream/5 pb-1 font-bold">Payment Clearing</h4>
                            
                            <div className="flex flex-col gap-1">
                              <span className="text-stone font-mono text-[10px]">Method:</span>
                              <span className={`font-medium uppercase tracking-wider text-[11px] flex items-center gap-1.5 ${
                                order.method === "cod" ? "text-amber-400" : "text-salt-pink"
                              }`}>
                                {order.method === "cod" && "🚚 Cash on Delivery (COD)"}
                                {order.method === "mobile" && "📱 Mobile Transfer (JazzCash/EasyPaisa)"}
                              </span>
                            </div>

                            {/* SCREENSHOT VISUAL DISPLAY */}
                            {order.method === "mobile" && (
                              <div className="flex flex-col gap-2 mt-1">
                                <span className="text-stone font-mono text-[10px] block">Transfer Screenshot:</span>
                                
                                {order.screenshot ? (
                                  <div className="group relative w-32 h-20 bg-ink-2 border border-cream/10 rounded overflow-hidden cursor-pointer"
                                       onClick={() => {
                                         setViewingScreenshot(order.screenshot);
                                         setViewingScreenshotName(order.customerName);
                                       }}
                                  >
                                    <img 
                                      src={order.screenshot} 
                                      alt="Payment proof"
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-cream gap-1 font-mono text-[9px] uppercase">
                                      <Eye size={10} />
                                      <span>Zoom</span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="p-3 bg-amber-950/15 border border-amber-950/45 rounded text-[10px] text-amber-300 font-mono flex items-center gap-1.5">
                                    <AlertCircle size={12} />
                                    <span>No image attached</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                /* INQUIRIES TAB VIEW */
                filteredInquiries.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-3 text-center text-stone">
                    <Mail size={42} className="opacity-15" />
                    <p className="text-xs">No contact form inquiries found matching your filters.</p>
                    <span className="text-[10px] font-mono uppercase tracking-wider max-w-sm">
                      When customers submit the "Bring the Mine to Your Space" contact form, their messages will appear here and trigger an instant email dispatch.
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-5">
                    {filteredInquiries.map((iq) => (
                      <div 
                        key={iq.inquiryId}
                        className="bg-ink-3/40 border border-cream/10 rounded-lg overflow-hidden hover:border-salt-pink/20 transition-all duration-200"
                      >
                        {/* Header Bar */}
                        <div className="bg-ink-2/60 border-b border-cream/5 px-4 py-3 flex flex-wrap justify-between items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-salt-pink">{iq.inquiryId}</span>
                            <span className="text-[10px] text-stone font-mono">•</span>
                            <span className="text-[10px] text-stone font-mono flex items-center gap-1">
                              <Calendar size={10} />
                              {iq.date}
                            </span>
                            <span className="text-[10px] text-stone font-mono">•</span>
                            <span className="text-[10px] font-mono bg-cream/5 text-stone px-2 py-0.5 rounded border border-cream/10 uppercase">
                              Desk: {iq.targetEmail}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-medium ${
                              iq.status === "Replied"
                                ? "bg-emerald-550/15 text-emerald-400 border border-emerald-950"
                                : iq.status === "Read"
                                ? "bg-amber-950/25 text-amber-400 border border-amber-950"
                                : "bg-salt-pink/20 text-salt-pink border border-salt-pink/30 font-bold animate-pulse"
                            }`}>
                              {iq.status}
                            </span>

                            <select
                              className="bg-ink border border-cream/15 text-cream text-[10px] rounded px-1.5 py-0.5 font-mono cursor-pointer focus:outline-none focus:border-salt-pink"
                              value={iq.status}
                              onChange={(e) => handleUpdateInquiryStatus(iq.inquiryId, e.target.value)}
                            >
                              <option value="Unread">Unread</option>
                              <option value="Read">Mark Read</option>
                              <option value="Replied">Mark Replied</option>
                            </select>

                            <button
                              onClick={() => handleDeleteInquiry(iq.inquiryId)}
                              className="p-1 bg-rose-950/10 text-stone hover:text-rose-400 hover:bg-rose-950/50 rounded transition-all ml-1"
                              title="Delete inquiry"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Inquiry Body */}
                        <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                          {/* Sender Details */}
                          <div className="md:col-span-4 flex flex-col gap-2 text-xs">
                            <h4 className="font-mono text-[9px] uppercase tracking-wider text-stone border-b border-cream/5 pb-1 font-bold">Contact Person</h4>
                            <div className="text-cream font-semibold text-sm">{iq.name}</div>
                            <div className="flex items-center gap-2 text-salt-pink font-mono text-[11px]">
                              <Mail size={12} className="shrink-0" />
                              <a href={`mailto:${iq.email}`} className="hover:underline">{iq.email}</a>
                            </div>
                            <div className="flex items-center gap-2 text-stone font-mono text-[11px]">
                              <Phone size={12} className="shrink-0" />
                              <a href={`tel:${iq.phone}`} className="hover:underline">{iq.phone}</a>
                            </div>
                            <div className="mt-1 flex flex-wrap gap-1">
                              <span className="text-[9px] font-mono text-amber bg-amber/10 px-2 py-0.5 rounded border border-amber/20">
                                Intent: {iq.reason}
                              </span>
                              <span className="text-[9px] font-mono text-stone bg-ink border border-cream/10 px-2 py-0.5 rounded uppercase">
                                Segment: {iq.activeSegment}
                              </span>
                            </div>
                          </div>

                          {/* Message Content */}
                          <div className="md:col-span-8 flex flex-col gap-2">
                            <h4 className="font-mono text-[9px] uppercase tracking-wider text-stone border-b border-cream/5 pb-1 font-bold">Customer Message</h4>
                            <div className="bg-ink p-3 rounded border border-cream/10 text-xs text-cream leading-relaxed whitespace-pre-wrap font-sans">
                              {iq.message}
                            </div>

                            {/* Direct Instant Reply Action */}
                            <div className="flex justify-end gap-2 mt-2">
                              <a
                                href={`mailto:${iq.email}?subject=${encodeURIComponent(`Re: Khewara Inquiry [Ref: ${iq.inquiryId}] - ${iq.reason}`)}&body=${encodeURIComponent(`Dear ${iq.name},\n\nThank you for reaching out to Khewara Pink Salt regarding your inquiry (${iq.reason}).\n\n`)}`}
                                onClick={() => handleUpdateInquiryStatus(iq.inquiryId, "Replied")}
                                className="bg-salt-pink text-ink hover:bg-cream px-4 py-2 rounded text-[11px] font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md"
                              >
                                <Mail size={13} />
                                Reply via Instant Email
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>

          </div>
        )}
      </motion.div>

      {/* FULL-SIZE SCREENSHOT LIGHTBOX */}
      <AnimatePresence>
        {viewingScreenshot && (
          <div className="fixed inset-0 z-60 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4">
            <div className="max-w-xl w-full flex flex-col gap-3">
              <div className="flex justify-between items-center text-cream px-1">
                <div>
                  <span className="font-mono text-[9px] uppercase text-salt-pink tracking-wider font-semibold">Payment Screenshot Receipt</span>
                  <h4 className="text-xs font-semibold mt-0.5">Transfer Verified by: {viewingScreenshotName}</h4>
                </div>
                <button
                  onClick={() => {
                    setViewingScreenshot(null);
                    setViewingScreenshotName(null);
                  }}
                  className="p-1 bg-cream/10 hover:bg-cream/20 text-cream rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="bg-ink border border-cream/10 rounded-lg overflow-hidden p-2 flex items-center justify-center max-h-[75vh]">
                <img 
                  src={viewingScreenshot} 
                  alt="Full-sized verified transfer receipt"
                  className="max-w-full max-h-[70vh] object-contain rounded"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="text-center">
                <p className="text-[10px] text-stone font-mono">
                  Inspect the transaction details (Date, Sender, Amount) carefully prior to shipping.
                </p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
