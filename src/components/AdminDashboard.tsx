// Helper to load and merge data from API and client-side storage (for Vercel compatibility)
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

  // Merge orders by orderNumber
  const ordersMap = new Map<string, any>();
  [...apiOrders, ...localOrders].forEach(o => {
    if (o && o.orderNumber && !ordersMap.has(o.orderNumber)) {
      ordersMap.set(o.orderNumber, o);
    }
  });

  // Merge inquiries by inquiryId
  const inquiriesMap = new Map<string, any>();
  [...apiInquiries, ...localInquiries].forEach(iq => {
    if (iq && iq.inquiryId && !inquiriesMap.has(iq.inquiryId)) {
      inquiriesMap.set(iq.inquiryId, iq);
    }
  });

  return { 
    mergedOrders: Array.from(ordersMap.values()), 
    mergedInquiries: Array.from(inquiriesMap.values()) 
  };
};

const verifyPasscode = async (codeToVerify: string) => {
  setLoading(true);
  setError("");
  const trimmedCode = codeToVerify.trim();

  try {
    const resOrders = await fetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode: trimmedCode })
    });
    const dataOrders = await resOrders.json().catch(() => ({}));

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
