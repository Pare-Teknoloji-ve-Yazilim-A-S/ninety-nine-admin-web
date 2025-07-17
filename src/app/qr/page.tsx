"use client";

import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useSearchParams, usePathname } from "next/navigation";

export default function QrPage() {
  // Next.js App Router'da searchParams ve pathname hook'ları
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const qrData = searchParams?.get("data") || "NinetyNine Club";

  // Paylaşım linki için tam URL'i client-side'da al
  const [shareUrl, setShareUrl] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light-primary dark:bg-background-primary">
      <div className="bg-background-light-card dark:bg-background-card rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-text-on-light dark:text-on-dark mb-4">QR İşlemleri</h1>
        <p className="text-base text-text-light-secondary dark:text-text-secondary mb-2">
          QR kodunu aşağıda görebilirsiniz. Bu kodu güvenliğe okutunuz.
        </p>
        <div className="flex justify-center my-6">
          <div className="bg-background-light-soft dark:bg-background-soft p-8 rounded-xl inline-block">
            <QRCode
              value={qrData}
              size={220}
              bgColor="#FFFFFF"
              fgColor="#000000"
              style={{ background: "#FFFFFF", padding: 8, borderRadius: 16 }}
            />
          </div>
        </div>
        <p className="text-xs text-text-light-muted dark:text-text-muted break-all mb-4">{qrData}</p>
        
      </div>
    </div>
  );
} 