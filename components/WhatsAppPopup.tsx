"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";

const WHATSAPP = "https://wa.me/2348033056790";

export default function WhatsAppPopup() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const seen = localStorage.getItem("wa-popup-seen");

    const shouldForceShow = pathname.startsWith("/products");

    if (!seen || shouldForceShow) {
      const timer = setTimeout(() => {
        setOpen(true);

        if (!shouldForceShow) {
          localStorage.setItem("wa-popup-seen", "true");
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full sm:max-w-md mx-4 sm:mx-0 animate-in fade-in zoom-in-95">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Icon */}
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-2">
            <h2 className="text-lg font-semibold">Can’t find what you need?</h2>
            <p className="text-sm text-muted-foreground">
              We can help you source it. Reach out directly on WhatsApp and
              we’ll assist you fast. You can also click the chat icon at the bottom right corner of the page.
            </p>
          </div>

          {/* Actions */}
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
