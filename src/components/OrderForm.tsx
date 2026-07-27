const generatedOrderNumber = `KW-${Math.floor(100000 + Math.random() * 900000)}`;
const newOrderObj = {
  orderNumber: generatedOrderNumber,
  customerName: name,
  customerEmail: email,
  customerPhone: phone,
  shippingAddress: `${address}, ${city}, ${country}`,
  items: cart,
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

// Store order locally so it is instantly visible in Admin Dashboard on Vercel
try {
  const existingLocal = JSON.parse(localStorage.getItem("local_orders") || "[]");
  existingLocal.unshift(newOrderObj);
  localStorage.setItem("local_orders", JSON.stringify(existingLocal));
} catch (e) {
  console.warn("Failed to write order to storage:", e);
}

fetch("/api/orders", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(newOrderObj)
}).catch(() => {});
