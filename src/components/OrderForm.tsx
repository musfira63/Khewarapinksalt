/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AdminDashboard } from "./AdminDashboard";
import { 
  CreditCard, 
  Wallet, 
  Truck, 
  Upload, 
  Trash2, 
  Plus, 
  Minus, 
  Receipt, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  ShoppingCart,
  Image as ImageIcon,
  Building,
  Mail,
  Phone,
  User,
  MapPin,
  Lock,
  Loader2
} from "lucide-react";
import { PRODUCTS_LIST } from "../data";

interface CartItem {
  id: string; // unique item instance id (productId + size)
  productId: string;
  name: string;
  size: string;
  quantity: number;
  unitPrice: number;
  currency: "PKR" | "USD";
}

// Helper to determine accurate prices for items in the cart
const getProductPrice = (productId: string, size: string, isLocal: boolean): { price: number; name: string } => {
  const prod = PRODUCTS_LIST.find(p => p.id === productId);
  if (!prod) return { price: 0, name: "" };

  // For complex products with specific size tiers, retrieve their exact price
  if (productId === "colored-lamp") {
    const sizePricesLocal: Record<string, number> = {
      colored_small: 7500,
      colored_medium: 10500,
      colored_large: 15500,
      colored_xl: 20500,
      colored_premium: 27500
    };
    const sizePricesIntl: Record<string, number> = {
      colored_small: 45,
      colored_medium: 65,
      colored_large: 90,
      colored_xl: 125,
      colored_premium: 165
    };
    const labels: Record<string, string> = {
      colored_small: "Small Color Changing Lamp (1–2 kg)",
      colored_medium: "Medium Color Changing Lamp (2–4 kg)",
      colored_large: "Large Color Changing Lamp (4–6 kg)",
      colored_xl: "Extra Large Color Changing Lamp (6–8 kg)",
      colored_premium: "Premium XL Color Changing Lamp (8–10 kg)"
    };
    const price = isLocal ? (sizePricesLocal[size] || 7500) : (sizePricesIntl[size] || 45);
    return { price, name: labels[size] || "Color Changing Lamp" };
  }

  if (productId === "gift-set") {
    const sizePricesLocal: Record<string, number> = {
      gift_mini: 7500,
      gift_classic: 12500,
      gift_premium: 18500,
      gift_luxury: 27500,
      gift_executive: 38500
    };
    const sizePricesIntl: Record<string, number> = {
      gift_mini: 55,
      gift_classic: 85,
      gift_premium: 125,
      gift_luxury: 175,
      gift_executive: 250
    };
    const labels: Record<string, string> = {
      gift_mini: "Mini Gift Set",
      gift_classic: "Classic Gift Set",
      gift_premium: "Premium Gift Set",
      gift_luxury: "Luxury Gift Set",
      gift_executive: "Executive Gift Collection"
    };
    const price = isLocal ? (sizePricesLocal[size] || 7500) : (sizePricesIntl[size] || 55);
    return { price, name: labels[size] || "Wellness Gift Set" };
  }

  if (productId === "moon-lamp") {
    const sizePricesLocal: Record<string, number> = {
      moon_mini: 5000,
      moon_color: 6500,
      moon_led: 7500,
      moon_luxury: 8500
    };
    const sizePricesIntl: Record<string, number> = {
      moon_mini: 35,
      moon_color: 45,
      moon_led: 55,
      moon_luxury: 65
    };
    const labels: Record<string, string> = {
      moon_mini: "Mini Moon Lamp",
      moon_color: "Color-Changing Moon Lamp",
      moon_led: "Premium LED Moon Lamp",
      moon_luxury: "Luxury Moon Lamp (Remote)"
    };
    const price = isLocal ? (sizePricesLocal[size] || 5000) : (sizePricesIntl[size] || 35);
    return { price, name: labels[size] || "Moon Lamp" };
  }

  if (productId === "usb-lamp") {
    const sizePricesLocal: Record<string, number> = {
      usb_mini: 2000,
      usb_desk: 3000,
      usb_led: 3500,
      usb_premium: 4500,
      usb_color: 5500
    };
    const sizePricesIntl: Record<string, number> = {
      usb_mini: 20,
      usb_desk: 30,
      usb_led: 35,
      usb_premium: 45,
      usb_color: 55
    };
    const labels: Record<string, string> = {
      usb_mini: "USB Mini Lamp",
      usb_desk: "USB Desk Lamp",
      usb_led: "USB LED Salt Lamp",
      usb_premium: "Premium USB Salt Lamp",
      usb_color: "Color-Changing USB Lamp"
    };
    const price = isLocal ? (sizePricesLocal[size] || 2000) : (sizePricesIntl[size] || 20);
    return { price, name: labels[size] || "USB Salt Lamp" };
  }

  // Fallbacks for standard simple products
  // Culinary Pink Salt
  if (productId === "culinary-salt") {
    return {
      price: isLocal ? 450 : 4.50,
      name: "Culinary Pink Salt (1 kg pouch)"
    };
  }
  // Natural Raw Chunks Lamp
  if (productId === "natural-lamp") {
    return {
      price: isLocal ? 2500 : 28.00,
      name: "Natural Raw Chunks Lamp"
    };
  }
  // Bath & Body Soak
  if (productId === "bath-soak") {
    return {
      price: isLocal ? 3500 : 12.00,
      name: "Bath & Body Soak (Botanical Bliss)"
    };
  }
  // Sphere Lamp
  if (productId === "sphere-lamp") {
    return {
      price: isLocal ? 4500 : 55.00,
      name: "Hand-Polished Sphere Lamp"
    };
  }
  // Cylinder Lamp
  if (productId === "cylinder-lamp") {
    return {
      price: isLocal ? 4000 : 20.00,
      name: "Modern Cylinder Lamp"
    };
  }

  // General defaults extracted from product description limits
  const baseLocal = parseInt(prod.localPrice.replace(/[^0-9]/g, "")) || 1500;
  const baseIntl = parseFloat(prod.intlPrice.replace(/[^0-9.]/g, "")) || 15;
  return {
    price: isLocal ? baseLocal : baseIntl,
    name: prod.name
  };
};

export const OrderForm: React.FC = () => {
  // Shipping details state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Pakistan");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Selection helpers
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS_LIST[0]?.id || "");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<"mobile" | "cod">("mobile");
  
  // Mobile Transfer screenshot state (JazzCash / EasyPaisa)
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState("");

  // App UI states
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState<any | null>(null);
  const [validationError, setValidationError] = useState("");
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Sync hash change for admin access
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#admin") {
        setIsAdminOpen(true);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Check on initial mount
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const isLocalCustomer = country.toLowerCase() === "pakistan" || country.toLowerCase() === "pk";
  const isKarachiCustomer = isLocalCustomer && city.toLowerCase().trim() === "karachi";

  // When country shifts, update existing cart items to reflect appropriate currency and prices
  useEffect(() => {
    if (cart.length > 0) {
      const updatedCart = cart.map(item => {
        const { price } = getProductPrice(item.productId, item.size, isLocalCustomer);
        return {
          ...item,
          currency: isLocalCustomer ? ("PKR" as const) : ("USD" as const),
          unitPrice: price
        };
      });
      setCart(updatedCart);
    }
    
    // Adjust payment method availability: 
    if (paymentMethod === "cod" && !isLocalCustomer) {
      setPaymentMethod("mobile");
    }
  }, [country]);

  // Set default size options when selected product changes
  useEffect(() => {
    if (selectedProductId === "colored-lamp") {
      setSelectedSize("colored_medium");
    } else if (selectedProductId === "gift-set") {
      setSelectedSize("gift_classic");
    } else if (selectedProductId === "moon-lamp") {
      setSelectedSize("moon_color");
    } else if (selectedProductId === "usb-lamp") {
      setSelectedSize("usb_led");
    } else {
      setSelectedSize("default");
    }
  }, [selectedProductId]);

  const handleAddToCart = () => {
    const { price, name: itemDisplayName } = getProductPrice(selectedProductId, selectedSize, isLocalCustomer);
    const itemKey = `${selectedProductId}-${selectedSize}`;
    
    const existingIndex = cart.findIndex(item => item.id === itemKey);
    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += selectedQty;
      setCart(updatedCart);
    } else {
      const newItem: CartItem = {
        id: itemKey,
        productId: selectedProductId,
        name: itemDisplayName,
        size: selectedSize,
        quantity: selectedQty,
        unitPrice: price,
        currency: isLocalCustomer ? "PKR" : "USD"
      };
      setCart([...cart, newItem]);
    }
    
    // Reset inputs
    setSelectedQty(1);
    setValidationError("");
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const handleUpdateQty = (itemId: string, increment: boolean) => {
    const updated = cart.map(item => {
      if (item.id === itemId) {
        const newQty = increment ? item.quantity + 1 : item.quantity - 1;
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    });
    setCart(updated);
  };

  // Handle Drag & Drop / File select for screenshot
  const handleScreenshotFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setValidationError("Please upload a valid image screenshot (PNG/JPG).");
      return;
    }
    setValidationError("");
    setScreenshotName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setScreenshot(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleScreenshotFile(e.dataTransfer.files[0]);
    }
  };

  // Subtotals and Delivery Fees
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  
  // Simple shipping calculation rules
  const shippingFee = cart.length === 0 ? 0 : isLocalCustomer 
    ? (isKarachiCustomer ? 250 : 500) // 250 local, 500 upcountry
    : 35.00; // $35 USD for global shipping

  const grandTotal = cartSubtotal + shippingFee;
  const activeCurrency = isLocalCustomer ? "PKR" : "USD";

  const currentSelectionPrice = getProductPrice(selectedProductId, selectedSize, isLocalCustomer);
  const currentItemTotal = currentSelectionPrice.price * selectedQty;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (cart.length === 0) {
      setValidationError("Your cart is empty. Please add items to order.");
      return;
    }

    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      setValidationError("Please fill in all customer delivery fields (Name, Email, Phone, Address, City).");
      return;
    }

    // Payment validation
    if (paymentMethod === "mobile") {
      if (!screenshot) {
        setValidationError("Please upload a payment transfer screenshot as verification of payment.");
        return;
      }
    } else if (paymentMethod === "cod") {
      if (!isLocalCustomer) {
        setValidationError("Cash on Delivery is strictly available for orders in Pakistan only.");
        return;
      }
    }

    setIsProcessing(true);

    const generatedOrderNumber = `KW-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrderObj = {
      orderNumber: generatedOrderNumber,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress: `${address}, ${city}, ${country}`,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        unitPrice: item.price,
        quantity: item.quantity
      })),
      subtotal: cartSubtotal,
      shipping: shippingFee,
      total: grandTotal,
      currency: activeCurrency,
      method: paymentMethod,
      screenshot: paymentMethod === "mobile" ? screenshot : null,
      screenshotName: paymentMethod === "mobile" ? screenshotName : null,
      status: "Pending",
      date: new Date().toLocaleString()
    };

    // Store in localStorage for instant persistent access on Vercel & client & notify live tabs
    try {
      const existingLocal = JSON.parse(localStorage.getItem("local_orders") || "[]");
      const filtered = existingLocal.filter((o: any) => o.orderNumber !== generatedOrderNumber);
      filtered.unshift(newOrderObj);
      localStorage.setItem("local_orders", JSON.stringify(filtered));
      window.dispatchEvent(new Event("khewara_new_data"));
    } catch (e) {
      console.warn("Failed to write order to localStorage:", e);
    }

    fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newOrderObj)
    })
    .then(res => res.json().catch(() => ({})))
    .then(data => {
      setIsProcessing(false);
      const finalOrder = (data && data.success && data.order) ? data.order : newOrderObj;
      setOrderReceipt({
        orderNumber: finalOrder.orderNumber,
        customerName: finalOrder.customerName,
        customerEmail: finalOrder.customerEmail,
        customerPhone: finalOrder.customerPhone,
        shippingAddress: finalOrder.shippingAddress,
        items: finalOrder.items,
        subtotal: finalOrder.subtotal,
        shipping: finalOrder.shipping,
        total: finalOrder.total,
        currency: finalOrder.currency,
        method: finalOrder.method,
        date: finalOrder.date,
        screenshotName: finalOrder.screenshotName
      });
      // Clear out cart and fields
      setCart([]);
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setCity("");
      setScreenshot(null);
      setScreenshotName("");
    })
    .catch(err => {
      setIsProcessing(false);
      // Fallback: order is already saved in localStorage
      setOrderReceipt({
        orderNumber: newOrderObj.orderNumber,
        customerName: newOrderObj.customerName,
        customerEmail: newOrderObj.customerEmail,
        customerPhone: newOrderObj.customerPhone,
        shippingAddress: newOrderObj.shippingAddress,
        items: newOrderObj.items,
        subtotal: newOrderObj.subtotal,
        shipping: newOrderObj.shipping,
        total: newOrderObj.total,
        currency: newOrderObj.currency,
        method: newOrderObj.method,
        date: newOrderObj.date,
        screenshotName: newOrderObj.screenshotName
      });
      setCart([]);
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setCity("");
      setScreenshot(null);
      setScreenshotName("");
    });
  };

  return (
    <section id="order" className="py-24 px-6 md:px-12 bg-ink-2/40 border-t border-cream/5 relative scroll-mt-20">
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-salt-pink/[0.03] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-deep/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-12 relative z-10">
        
        {/* Title Block */}
        <div className="text-center max-w-2xl mx-auto">
          <span 
            className="font-mono text-xs text-salt-pink tracking-widest uppercase flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsAdminOpen(true)}
            title="Open Owner Terminal"
          >
            <ShoppingCart size={13} />
            Direct Order Portal
          </span>
          <div className="flex items-center justify-center gap-2 mt-1">
            <h2 className="font-serif text-3xl md:text-5xl text-cream tracking-tight">Order From Us</h2>
            <button 
              onClick={() => setIsAdminOpen(true)} 
              className="p-1.5 text-stone hover:text-salt-pink transition-colors cursor-pointer rounded hover:bg-cream/5 animate-pulse"
              title="Open Owner Command Terminal"
            >
              <Lock size={16} />
            </button>
          </div>
          <p className="text-stone text-sm leading-relaxed mt-3">
            Configure your order items below and checkout securely. We offer direct ex-factory dispatch for local pakistani clients and standard secure shipping globally.
          </p>
        </div>

        {orderReceipt ? (
          /* SUCCESS ORDER RECEIPT */
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto w-full bg-ink-3 border border-salt-pink/30 rounded-lg p-6 md:p-8 shadow-2xl relative"
            id="order-receipt-card"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-salt-pink text-ink font-mono text-[9px] uppercase tracking-widest font-extrabold px-3 py-1 rounded shadow-md flex items-center gap-1">
              <CheckCircle size={10} />
              Order Placed Successfully
            </div>

            <div className="text-center pt-4 pb-6 border-b border-cream/10">
              <span className="font-mono text-[10px] text-stone uppercase tracking-wider">Invoice Reference</span>
              <h3 className="font-mono text-2xl text-salt-pink font-bold mt-1 tracking-wider">{orderReceipt.orderNumber}</h3>
              <span className="font-mono text-[9px] text-stone block mt-1">Dispatched from Karachi Depot • {orderReceipt.date}</span>
            </div>

            <div className="py-6 flex flex-col gap-4 text-xs">
              <h4 className="font-mono text-[10px] uppercase text-stone tracking-wider border-b border-cream/5 pb-1">Customer &amp; Shipping Details</h4>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-stone">Recipient:</span>
                <span className="col-span-2 text-cream font-medium">{orderReceipt.customerName}</span>
                <span className="text-stone">Email:</span>
                <span className="col-span-2 text-cream truncate">{orderReceipt.customerEmail}</span>
                <span className="text-stone">Phone:</span>
                <span className="col-span-2 text-cream font-mono">{orderReceipt.customerPhone}</span>
                <span className="text-stone">Deliver To:</span>
                <span className="col-span-2 text-cream leading-normal">{orderReceipt.shippingAddress}</span>
              </div>
            </div>

            <div className="py-4 border-t border-b border-cream/10 flex flex-col gap-3">
              <h4 className="font-mono text-[10px] uppercase text-stone tracking-wider pb-1">Items Summary</h4>
              {orderReceipt.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-cream font-medium">
                    {item.name} <span className="text-stone text-[10px]">x{item.quantity}</span>
                  </span>
                  <span className="font-mono text-cream">
                    {orderReceipt.currency === "PKR" ? "Rs" : "$"} {(item.unitPrice * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="py-5 flex flex-col gap-2.5 text-xs font-mono">
              <div className="flex justify-between text-stone">
                <span>Subtotal:</span>
                <span>{orderReceipt.currency === "PKR" ? "Rs" : "$"} {orderReceipt.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone">
                <span>Shipping Fee:</span>
                <span>{orderReceipt.currency === "PKR" ? "Rs" : "$"} {orderReceipt.shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-salt-pink font-semibold border-t border-cream/5 pt-2 text-sm">
                <span>Grand Total:</span>
                <span>{orderReceipt.currency === "PKR" ? "Rs" : "$"} {orderReceipt.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-4 bg-ink border border-cream/5 rounded text-xs leading-relaxed text-stone text-center mt-3 flex flex-col gap-1">
              <span className="text-cream font-medium uppercase font-mono text-[9px] tracking-wider">
                Payment Verification: {orderReceipt.method.toUpperCase()}
              </span>
              {orderReceipt.method === "card" && "Authorized & cleared via Global Card Gateway."}
              {orderReceipt.method === "cod" && "Payment of cash due upon courier parcel arrival at your doorstep."}
              {orderReceipt.method === "mobile" && (
                <span>
                  Mobile transfer screenshot <span className="text-salt-pink font-medium">"{orderReceipt.screenshotName}"</span> registered. Processing manual clearing.
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              <button 
                onClick={() => setOrderReceipt(null)}
                className="w-full py-2.5 bg-salt-pink/20 border border-salt-pink/50 text-salt-pink font-mono text-[10px] uppercase tracking-wider font-semibold rounded hover:bg-salt-pink hover:text-ink transition-colors"
              >
                Order Another Item
              </button>
              <button 
                onClick={() => {
                  setIsAdminOpen(true);
                  window.dispatchEvent(new Event("khewara_open_admin"));
                }}
                className="w-full py-2.5 bg-salt-pink text-ink font-mono text-[10px] uppercase tracking-wider font-extrabold rounded hover:bg-cream transition-colors flex items-center justify-center gap-1.5 shadow-lg"
              >
                <Lock size={12} />
                <span>Open Admin Portal</span>
              </button>
            </div>
          </motion.div>
        ) : (
          /* PRIMARY CHECKOUT WIDGET */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* CHECKOUT FORMS (LEFT 7 COLS) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* CART BUILDER CARD */}
              <div className="bg-ink-3/40 border border-cream/5 rounded-lg p-5 md:p-6 flex flex-col gap-5">
                <h3 className="font-serif text-lg text-cream flex items-center gap-2 border-b border-cream/5 pb-2">
                  <ShoppingCart size={16} className="text-salt-pink" />
                  1. Build Your Order Cart
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Product selector */}
                  <div className="md:col-span-5 flex flex-col gap-1.5">
                    <label htmlFor="order-product" className="font-mono text-[9px] uppercase text-stone tracking-wider">Select Product</label>
                    <select
                      id="order-product"
                      className="bg-ink border border-cream/10 text-cream text-xs rounded p-2.5 focus:outline-none focus:border-salt-pink w-full"
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                    >
                      {PRODUCTS_LIST.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Size tier selector if applicable */}
                  <div className="md:col-span-4 flex flex-col gap-1.5">
                    <label htmlFor="order-size" className="font-mono text-[9px] uppercase text-stone tracking-wider">Size / Tier</label>
                    <select
                      id="order-size"
                      className="bg-ink border border-cream/10 text-cream text-xs rounded p-2.5 focus:outline-none focus:border-salt-pink w-full"
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                    >
                      {selectedProductId === "colored-lamp" ? (
                        <>
                          <option value="colored_small">Small (1–2 kg) - PKR 7.5k / $45</option>
                          <option value="colored_medium">Medium (2–4 kg) - PKR 10.5k / $65</option>
                          <option value="colored_large">Large (4–6 kg) - PKR 15.5k / $90</option>
                          <option value="colored_xl">Extra Large (6–8 kg) - PKR 20.5k / $125</option>
                          <option value="colored_premium">Premium XL (8–10 kg) - PKR 27.5k / $165</option>
                        </>
                      ) : selectedProductId === "gift-set" ? (
                        <>
                          <option value="gift_mini">Mini Gift Set - PKR 7.5k / $55</option>
                          <option value="gift_classic">Classic Gift Set - PKR 12.5k / $85</option>
                          <option value="gift_premium">Premium Gift Set - PKR 18.5k / $125</option>
                          <option value="gift_luxury">Luxury Gift Set - PKR 27.5k / $175</option>
                          <option value="gift_executive">Executive Gift Collection - PKR 38.5k / $250</option>
                        </>
                      ) : selectedProductId === "moon-lamp" ? (
                        <>
                          <option value="moon_mini">Mini Moon Lamp - PKR 5.0k / $35</option>
                          <option value="moon_color">Color-Changing - PKR 6.5k / $45</option>
                          <option value="moon_led">Premium LED - PKR 7.5k / $55</option>
                          <option value="moon_luxury">Luxury Remote - PKR 8.5k / $65</option>
                        </>
                      ) : selectedProductId === "usb-lamp" ? (
                        <>
                          <option value="usb_mini">USB Mini - PKR 2.0k / $20</option>
                          <option value="usb_desk">USB Desk - PKR 3.0k / $30</option>
                          <option value="usb_led">USB LED Salt Lamp - PKR 3.5k / $35</option>
                          <option value="usb_premium">Premium USB Salt Lamp - PKR 4.5k / $45</option>
                          <option value="usb_color">Color-Changing USB - PKR 5.5k / $55</option>
                        </>
                      ) : (
                        <option value="default">Standard Single Tier</option>
                      )}
                    </select>
                  </div>

                  {/* Quantity and Add Button */}
                  <div className="md:col-span-3 flex items-end gap-2">
                    <div className="flex flex-col gap-1.5 w-16">
                      <label htmlFor="order-qty" className="font-mono text-[9px] uppercase text-stone tracking-wider">Qty</label>
                      <input
                        id="order-qty"
                        type="number"
                        min="1"
                        max="20"
                        className="bg-ink border border-cream/10 text-cream text-xs rounded p-2.5 focus:outline-none focus:border-salt-pink text-center w-full font-mono"
                        value={selectedQty}
                        onChange={(e) => setSelectedQty(Math.max(1, parseInt(e.target.value) || 1))}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="flex-1 bg-salt-pink/15 hover:bg-salt-pink text-salt-pink hover:text-ink text-xs font-mono py-2.5 rounded border border-salt-pink/30 hover:border-salt-pink transition-colors font-semibold uppercase tracking-wider h-[38px]"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* LIVE SELECTION PRICE DISPLAY */}
                <div className="mt-1 bg-ink/75 border border-cream/10 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 animate-fade-in">
                  <div className="flex flex-col">
                    <span className="font-mono text-[8px] uppercase tracking-widest text-stone">Selected configuration</span>
                    <span className="text-xs text-cream font-semibold mt-0.5">{currentSelectionPrice.name}</span>
                    <span className="font-mono text-[10px] text-stone mt-1">
                      Unit Price: {activeCurrency === "PKR" ? "Rs" : "$"} {currentSelectionPrice.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="sm:text-right flex flex-col w-full sm:w-auto border-t sm:border-t-0 border-cream/5 pt-2 sm:pt-0">
                    <span className="font-mono text-[8px] uppercase tracking-widest text-salt-pink">Cart addition value</span>
                    <span className="font-serif text-lg text-salt-pink font-bold mt-0.5">
                      {activeCurrency === "PKR" ? "Rs" : "$"} {currentItemTotal.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-stone font-mono mt-0.5">For {selectedQty} {selectedQty === 1 ? "unit" : "units"}</span>
                  </div>
                </div>

              </div>

              {/* CLIENT DETAILS CARD */}
              <div className="bg-ink-3/40 border border-cream/5 rounded-lg p-5 md:p-6 flex flex-col gap-5">
                <h3 className="font-serif text-lg text-cream flex items-center gap-2 border-b border-cream/5 pb-2">
                  <User size={16} className="text-salt-pink" />
                  2. Delivery &amp; Customer Information
                </h3>

                <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="ord-name" className="font-mono text-[9px] uppercase text-stone tracking-wider">Full Name *</label>
                      <input
                        id="ord-name"
                        type="text"
                        required
                        placeholder="e.g. Musfira Siddiqui"
                        className="bg-ink border border-cream/10 text-cream text-xs rounded p-2.5 focus:outline-none focus:border-salt-pink"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="ord-email" className="font-mono text-[9px] uppercase text-stone tracking-wider">Email Address *</label>
                      <input
                        id="ord-email"
                        type="email"
                        required
                        placeholder="email@example.com"
                        className="bg-ink border border-cream/10 text-cream text-xs rounded p-2.5 focus:outline-none focus:border-salt-pink"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="ord-phone" className="font-mono text-[9px] uppercase text-stone tracking-wider">Phone / Mobile *</label>
                      <input
                        id="ord-phone"
                        type="tel"
                        required
                        placeholder="e.g. 03112824974"
                        className="bg-ink border border-cream/10 text-cream text-xs rounded p-2.5 focus:outline-none focus:border-salt-pink font-mono"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="ord-country" className="font-mono text-[9px] uppercase text-stone tracking-wider">Country *</label>
                      <select
                        id="ord-country"
                        className="bg-ink border border-cream/10 text-cream text-xs rounded p-2.5 focus:outline-none focus:border-salt-pink"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      >
                        <option value="Pakistan">Pakistan 🇵🇰</option>
                        <option value="United States">United States 🇺🇸</option>
                        <option value="United Kingdom">United Kingdom 🇬🇧</option>
                        <option value="United Arab Emirates">United Arab Emirates 🇦🇪</option>
                        <option value="Saudi Arabia">Saudi Arabia 🇸🇦</option>
                        <option value="Germany">Germany 🇩🇪</option>
                        <option value="Canada">Canada 🇨🇦</option>
                        <option value="Australia">Australia 🇦🇺</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="ord-city" className="font-mono text-[9px] uppercase text-stone tracking-wider">City *</label>
                      <input
                        id="ord-city"
                        type="text"
                        required
                        placeholder="e.g. Karachi"
                        className="bg-ink border border-cream/10 text-cream text-xs rounded p-2.5 focus:outline-none focus:border-salt-pink"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                      {isLocalCustomer && (
                        <span className="font-mono text-[8px] text-emerald-400 mt-0.5">
                          ✅ Nationwide Cash on Delivery (COD) Enabled!
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="ord-address" className="font-mono text-[9px] uppercase text-stone tracking-wider">Complete Shipping Address *</label>
                    <textarea
                      id="ord-address"
                      required
                      rows={2}
                      placeholder="Street, Block, Sector, Apartment/House details..."
                      className="bg-ink border border-cream/10 text-cream text-xs rounded p-2.5 focus:outline-none focus:border-salt-pink resize-none"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  {/* PAYMENT METHOD SELECTOR */}
                  <div className="flex flex-col gap-4 border-t border-cream/5 pt-4">
                    <h3 className="font-serif text-lg text-cream flex items-center gap-2">
                      <Lock size={15} className="text-salt-pink" />
                      3. Select Payment Method
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* MOBILE WALLET */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("mobile")}
                        className={`p-3.5 rounded border text-left flex flex-col justify-between gap-3 transition-all duration-300 ${
                          paymentMethod === "mobile"
                            ? "bg-salt-pink/5 border-salt-pink text-cream"
                            : "bg-ink border-cream/10 text-stone hover:text-cream hover:border-cream/25"
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <Wallet size={18} className={paymentMethod === "mobile" ? "text-salt-pink" : "text-stone"} />
                          <span className="font-mono text-[8px] uppercase tracking-wider text-stone">National Prepayment</span>
                        </div>
                        <div>
                          <span className="text-xs font-semibold block">JazzCash / EasyPaisa</span>
                          <span className="text-[9px] text-stone mt-0.5 block leading-tight">03112824974 + Receipt upload</span>
                        </div>
                      </button>

                      {/* CASH ON DELIVERY (Available for Pakistan) */}
                      <button
                        type="button"
                        disabled={!isLocalCustomer}
                        onClick={() => setPaymentMethod("cod")}
                        className={`p-3.5 rounded border text-left flex flex-col justify-between gap-3 transition-all duration-300 ${
                          !isLocalCustomer ? "opacity-30 cursor-not-allowed" : ""
                        } ${
                          paymentMethod === "cod"
                            ? "bg-salt-pink/5 border-salt-pink text-cream"
                            : "bg-ink border-cream/10 text-stone hover:text-cream hover:border-cream/25"
                        }`}
                        title={!isLocalCustomer ? "COD is strictly for Pakistan residents" : ""}
                      >
                        <div className="flex justify-between items-center w-full">
                          <Truck size={18} className={paymentMethod === "cod" ? "text-salt-pink" : "text-stone"} />
                          <span className="font-mono text-[8px] uppercase tracking-wider text-stone">Pakistan Orders</span>
                        </div>
                        <div>
                          <span className="text-xs font-semibold block">Cash on Delivery</span>
                          <span className="text-[9px] text-stone mt-0.5 block leading-tight">No prepayment. Cash on courier.</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* DYNAMIC PAYMENT METHOD DETAIL FORMS */}
                  <div className="mt-2 bg-ink border border-cream/10 p-4 rounded-lg">
                    
                    {/* JAZZCASH & EASYPAISA FORM */}
                    {paymentMethod === "mobile" && (
                      <div className="flex flex-col gap-4 animate-fade-in text-xs">
                        <div className="border-b border-cream/5 pb-2 flex justify-between items-center">
                          <span className="font-mono text-[10px] text-salt-pink uppercase tracking-wider font-semibold">📱 JazzCash / EasyPaisa Direct Transfer</span>
                          <span className="text-[9px] text-stone font-mono">For Pakistani National Orders</span>
                        </div>

                        <div className="bg-ink-3 border border-cream/5 p-4 rounded flex flex-col gap-2.5">
                          <div className="flex justify-between items-baseline">
                            <span className="text-stone font-mono text-[10px] uppercase">Account Number:</span>
                            <span className="text-salt-pink font-mono font-semibold text-sm">03112824974</span>
                          </div>
                          <div className="flex justify-between items-baseline">
                            <span className="text-stone font-mono text-[10px] uppercase">Account Title:</span>
                            <span className="text-cream font-medium">Al-Musfira Enterprises</span>
                          </div>
                          <p className="text-stone text-[11px] leading-relaxed mt-1">
                            Transfer the order total to the account above via your EasyPaisa or JazzCash app. Once transferred, snap a screenshot of the success receipt and upload it below to verify.
                          </p>
                        </div>

                        {/* Screenshot drag drop area */}
                        <div className="flex flex-col gap-1.5">
                          <span className="font-mono text-[9px] uppercase text-stone tracking-wider">Transfer Screenshot Receipt *</span>
                          
                          <div 
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleFileDrop}
                            className="border border-dashed border-cream/20 hover:border-salt-pink/40 bg-ink-3 rounded-lg p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors relative group"
                            id="screenshot-drop-zone"
                          >
                            <input 
                              type="file" 
                              id="screenshot-file-input"
                              accept="image/*"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={(e) => e.target.files && e.target.files[0] && handleScreenshotFile(e.target.files[0])}
                            />
                            {screenshot ? (
                              <div className="flex flex-col items-center gap-2 w-full">
                                <img 
                                  src={screenshot} 
                                  alt="Screenshot Preview" 
                                  className="h-28 object-contain rounded border border-cream/10"
                                />
                                <span className="font-mono text-[10px] text-salt-pink font-semibold truncate max-w-xs">{screenshotName}</span>
                                <span className="text-[9px] text-stone">Click or drag another image to replace</span>
                              </div>
                            ) : (
                              <>
                                <Upload className="text-stone group-hover:text-salt-pink transition-colors" size={24} />
                                <p className="text-[11px] text-cream text-center">
                                  Drag &amp; drop transfer screenshot here or <span className="text-salt-pink font-medium">browse files</span>
                                </p>
                                <span className="text-[8px] text-stone uppercase tracking-wider font-mono">PNG, JPG, JPEG up to 5MB</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CASH ON DELIVERY DETAILS */}
                    {paymentMethod === "cod" && (
                      <div className="flex flex-col gap-2.5 animate-fade-in text-xs leading-relaxed text-stone">
                        <div className="border-b border-cream/5 pb-2">
                          <span className="font-mono text-[10px] text-salt-pink uppercase tracking-wider font-semibold">📦 Pakistan Cash on Delivery</span>
                        </div>
                        <p>
                          Nationwide Cash on Delivery is enabled for your order. No advance deposit or transfer screenshot is required. 
                        </p>
                        <p>
                          Our Al-Musfira logistics partner will deliver the parcel directly to your address in <span className="text-cream font-semibold">{city || "your city"}</span>. Please keep the exact change of <span className="text-cream font-semibold">Rs {grandTotal.toLocaleString()}</span> ready upon courier arrival.
                        </p>
                      </div>
                    )}

                  </div>

                  {/* Submission Error display */}
                  {validationError && (
                    <div className="p-3 bg-rose-900/10 border border-rose-900/40 rounded text-xs text-rose-300 font-mono flex items-center gap-2">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{validationError}</span>
                    </div>
                  )}

                  {/* Checkout Action Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-salt-pink text-ink hover:bg-cream py-3.5 px-6 font-mono text-xs tracking-widest uppercase rounded font-bold transition-all duration-300 hover:shadow-[0_10px_20px_rgba(232,169,160,0.15)] flex items-center justify-center gap-2 shrink-0 h-[46px] disabled:opacity-55 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="animate-spin text-ink" size={15} />
                        Authorizing Secure Checkout...
                      </>
                    ) : (
                      <>
                        Confirm and Place Order ( {activeCurrency === "PKR" ? "Rs" : "$"} {grandTotal.toLocaleString()} )
                        <ArrowRight size={13} />
                      </>
                    )}
                  </button>

                </form>
              </div>

            </div>

            {/* ORDER CART SIDEBAR SUMMARY (RIGHT 5 COLS) */}
            <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24">
              
              <div className="bg-ink-3/60 border border-cream/10 rounded-lg p-5 md:p-6 flex flex-col gap-5">
                <div className="flex justify-between items-center border-b border-cream/10 pb-3">
                  <h3 className="font-serif text-lg text-cream flex items-center gap-2">
                    <ShoppingCart size={16} className="text-salt-pink" />
                    Shopping Cart
                  </h3>
                  <span className="bg-salt-pink/15 text-salt-pink font-mono text-[10px] px-2 py-0.5 rounded-full font-semibold">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
                  </span>
                </div>

                {cart.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-3 text-center text-stone">
                    <ShoppingCart size={32} className="opacity-20" />
                    <p className="text-xs">Your order cart is empty.</p>
                    <span className="text-[10px] uppercase font-mono tracking-wider max-w-[200px]">
                      Build your order using the select module on the left.
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div 
                        key={item.id} 
                        className="bg-ink border border-cream/5 rounded p-3 flex justify-between items-center gap-3 group relative hover:border-salt-pink/20 transition-all duration-200"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs text-cream font-semibold truncate">{item.name}</h4>
                          <span className="font-mono text-[9px] text-stone uppercase tracking-wider block mt-0.5">
                            Unit Cost: {item.currency === "PKR" ? "Rs" : "$"} {item.unitPrice.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-ink-2 border border-cream/10 rounded">
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(item.id, false)}
                              className="p-1 hover:text-salt-pink transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="font-mono text-xs text-cream px-2 min-w-[20px] text-center">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(item.id, true)}
                              className="p-1 hover:text-salt-pink transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={11} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="p-1.5 bg-rose-950/15 text-stone hover:text-rose-400 hover:bg-rose-950/45 rounded transition-all"
                            title="Remove item"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* INTERNATIONAL EXCHANGE RATE WARNING WITH ANIMATED SHINY GRADIENT BORDER */}
                {!isLocalCustomer && (
                  <div className="relative p-[1.5px] rounded-lg overflow-hidden pink-shiny-border animate-fade-in my-1 shadow-[0_4px_12px_rgba(232,169,160,0.1)]">
                    <div className="bg-ink-2 rounded-[7px] p-4 flex flex-col gap-1.5 leading-relaxed text-[11px]">
                      <span className="font-mono text-[9px] text-salt-pink uppercase tracking-widest font-bold flex items-center gap-1">
                        🌍 Currency Exchange Notice
                      </span>
                      <p className="text-cream/90 font-bold">
                        USD prices are converted from PKR and may fluctuate slightly with currency exchange rate movements at the time your order is placed.
                      </p>
                    </div>
                  </div>
                )}

                {/* COST BREAKDOWN ACCORDION */}
                <div className="border-t border-cream/10 pt-4 flex flex-col gap-2.5 text-xs">
                  <div className="flex justify-between text-stone">
                    <span>Cart Subtotal:</span>
                    <span className="font-mono text-cream">{activeCurrency === "PKR" ? "Rs" : "$"} {cartSubtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-stone">
                    <span className="flex items-center gap-1">
                      Shipping &amp; Logistics:
                      <span className="text-[8px] bg-cream/5 px-1 rounded uppercase tracking-wider">
                        {isLocalCustomer ? (isKarachiCustomer ? "Karachi" : "Upcountry PK") : "Global"}
                      </span>
                    </span>
                    <span className="font-mono text-cream">
                      {shippingFee === 0 ? "—" : `${activeCurrency === "PKR" ? "Rs" : "$"} ${shippingFee}`}
                    </span>
                  </div>

                  <div className="border-t border-cream/10 pt-3 mt-1 flex justify-between items-baseline">
                    <span className="font-serif text-sm text-cream font-medium">Order Total:</span>
                    <span className="font-mono text-xl text-salt-pink font-bold">
                      {activeCurrency === "PKR" ? "Rs" : "$"} {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* COURIER LOGISTICS PROMISE */}
                <div className="bg-ink/50 border border-cream/5 p-3 rounded text-[11px] leading-relaxed text-stone flex flex-col gap-1.5">
                  <span className="font-mono text-[8px] text-salt-pink uppercase tracking-widest font-semibold flex items-center gap-1">
                    <Truck size={10} />
                    Al-Musfira Dispatch Pledge
                  </span>
                  {isLocalCustomer ? (
                    <span>
                      Standard local deliveries processed through our registered Karachi hub. Estimates: <span className="text-cream">24–48 hours inside Karachi</span>, or <span className="text-cream">3–5 business days nationwide</span>.
                    </span>
                  ) : (
                    <span>
                      Global marine and air freight logistics fully handled from Karachi Port. Secure customs clearing paperwork included. Delivered in <span className="text-cream">7–12 business days</span>.
                    </span>
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* Secret Owner Database Dashboard */}
      <AdminDashboard 
        isOpen={isAdminOpen} 
        onClose={() => {
          setIsAdminOpen(false);
          // Strip the #admin hash from URL cleanly if present
          if (window.location.hash === "#admin") {
            window.history.replaceState(null, "", window.location.pathname + window.location.search);
          }
        }} 
      />
    </section>
  );
};
