"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";

const WHATSAPP = "https://wa.me/2348033056790";

export default function WhatsAppPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // sessionStorage clears when the tab closes, so returning visitors on a
    // new session get one gentle reminder again — but never mid-browsing.
    const seen = sessionStorage.getItem("wa-popup-seen");
    if (seen) return;

    const timer = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem("wa-popup-seen", "true");
    }, 3000); // slight delay feels less intrusive

    return () => clearTimeout(timer);
  }, []); // runs once on mount, no pathname dependency

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full sm:max-w-md mx-4 sm:mx-0 animate-in fade-in zoom-in-95">
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-lg font-semibold">Can&apos;t find what you need?</h2>
            <p className="text-sm text-muted-foreground">
              We can help you source it. Reach out directly on WhatsApp and
              we&apos;ll assist you fast. You can also click the chat icon at the
              bottom right corner of the page.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-white font-medium hover:bg-primary-700 transition"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
            <button
              onClick={() => setOpen(false)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
