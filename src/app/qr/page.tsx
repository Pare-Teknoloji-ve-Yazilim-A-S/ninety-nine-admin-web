import React from "react";

export default function QrPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light-primary dark:bg-background-primary">
      <div className="bg-background-light-card dark:bg-background-card rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-text-on-light dark:text-on-dark mb-4">QR İşlemleri</h1>
        <p className="text-base text-text-light-secondary dark:text-text-secondary mb-2">
          Burada QR kod ile ilgili işlemler yapılacaktır.
        </p>
        {/* İleride QR ile ilgili içerik ve fonksiyonlar buraya eklenecek */}
      </div>
    </div>
  );
} 