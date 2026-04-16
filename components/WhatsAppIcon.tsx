"use client";

import { MessageCircle } from "lucide-react";

const WhatsAppIcon = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "+2348033056790";
    const message = encodeURIComponent(
      "Hello! I'm interested in your Volvo spare parts.",
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div
      onClick={handleWhatsAppClick}
      className="fixed bottom-20 right-6 cursor-pointer z-50"
    >
      <div className="bg-white rounded-full shadow-lg p-2 hover:scale-110 transition-transform">
        <MessageCircle className="h-10 w-10 text-green-500 animate-bounce" />
      </div>
    </div>
  );
};

export default WhatsAppIcon;
