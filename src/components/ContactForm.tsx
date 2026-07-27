const refId = `INQ-${Math.floor(100000 + Math.random() * 900000)}`;
const newInquiryObj = {
  inquiryId: refId,
  name,
  email,
  phone: phone || "Not specified",
  reason: reason || "General Inquiry",
  activeSegment: activeSegment || "wholesale",
  message,
  targetEmail,
  status: "Unread",
  date: new Date().toLocaleString()
};

// Store query locally so it is instantly visible in Admin Dashboard on Vercel
try {
  const existingLocal = JSON.parse(localStorage.getItem("local_inquiries") || "[]");
  existingLocal.unshift(newInquiryObj);
  localStorage.setItem("local_inquiries", JSON.stringify(existingLocal));
} catch (e) {
  console.warn("Failed to write inquiry to storage:", e);
}

fetch("/api/inquiries", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(newInquiryObj)
}).catch(() => {});
