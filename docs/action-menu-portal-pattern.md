# ActionMenu Portal + Dinamik Pozisyonlama Patterni

Bu doküman, NinetyNine Admin Web projesinde ActionMenu (üç nokta menüsü) gibi açılır menülerin ekranın dışına taşmaması ve her zaman görünür olması için kullanılan **Portal + Dinamik Pozisyonlama** yaklaşımını açıklar.

## Amaç
- Açılır menülerin (dropdown, context menu, action menu) parent container'ın overflow veya scroll'una takılmadan, her zaman ekranda tam görünür olması.
- Menü ekranın altına/sağına taşarsa otomatik olarak yukarıya veya sola kayması.
- Tüm ActionMenu componentlerinde tekrar kullanılabilir bir çözüm sunmak.

---

## Kullanılan Yöntemler

1. **Portal Componenti**
   - Menü, React Portal ile doğrudan `<body>`'ye render edilir.
   - Böylece parent'ın overflow/scroll kısıtlamalarından etkilenmez.

2. **Dinamik Pozisyonlama**
   - Menü açıldığında, tetikleyici butonun (`ref`) konumu ölçülür.
   - Menü yüksekliği ve genişliği tahmini olarak belirlenir.
   - Eğer menü ekranın altına taşacaksa yukarıya, sola taşacaksa sola kaydırılır.
   - Pozisyon, `style` ile inline olarak verilir.

3. **Dışarı Tıklayınca Kapatma**
   - Menü açıkken, dışarı tıklanırsa menü kapanır.

4. **Uzun Menüde Scroll**
   - Menüye `max-h-72` veya `max-h-80` ve `overflow-auto` Tailwind sınıfları eklenir.

---

## Portal Componenti (src/app/components/ui/Portal.tsx)
```tsx
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function Portal({ children }: { children: React.ReactNode }) {
  const elRef = useRef<HTMLDivElement | null>(null);

  if (!elRef.current) {
    elRef.current = document.createElement("div");
  }

  useEffect(() => {
    const portalRoot = document.body;
    portalRoot.appendChild(elRef.current!);
    return () => {
      portalRoot.removeChild(elRef.current!);
    };
  }, []);

  return createPortal(children, elRef.current);
}
```

---

## ActionMenu Kullanım Örneği

```tsx
import React, { useRef, useState, useEffect } from "react";
import Portal from '@/app/components/ui/Portal';

const ActionMenu = ({ onAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = 160; // tahmini yükseklik
      const menuWidth = 180;
      const padding = 8;
      let top = rect.bottom + window.scrollY + padding;
      let left = rect.right + window.scrollX - menuWidth;
      if (top + menuHeight > window.innerHeight + window.scrollY) {
        top = rect.top + window.scrollY - menuHeight - padding;
      }
      if (left < 0) {
        left = padding;
      }
      setMenuStyle({
        position: 'absolute',
        top,
        left,
        zIndex: 9999,
        minWidth: menuWidth,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  return (
    <div className="flex items-center justify-center">
      <button
        ref={buttonRef}
        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center"
        onClick={e => {
          e.stopPropagation();
          setIsOpen(v => !v);
        }}
        type="button"
      >
        {/* ...icon... */}
      </button>
      {isOpen && (
        <Portal>
          <div
            style={menuStyle}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 py-1 max-h-72 overflow-auto"
          >
            {/* Menü içeriği */}
            <button onClick={() => { setIsOpen(false); onAction("view"); }} className="...">Detay</button>
            {/* ...diğer butonlar... */}
          </div>
        </Portal>
      )}
    </div>
  );
};
```

---

## Notlar
- Menü yüksekliği ve genişliği, menü içeriğine göre ayarlanabilir.
- Eğer menüde çok fazla buton varsa, `max-h-80` ve `overflow-auto` ile scroll eklenebilir.
- Bu pattern, tüm ActionMenu, Dropdown, ContextMenu gibi açılır menülerde tekrar kullanılabilir.
- Eğer farklı bir pozisyonlama ihtiyacı olursa, pozisyon hesaplama fonksiyonu güncellenebilir.

---

## Kullanıldığı Yerler
- `src/app/dashboard/requests/page.tsx`
- `src/app/dashboard/requests/waiting/page.tsx`
- `src/app/dashboard/requests/resolved/page.tsx`
- `src/app/dashboard/units/page.tsx`
- `src/app/dashboard/residents/page.tsx`

---

## Geliştirme
- Eğer menüde animasyon veya daha gelişmiş pozisyonlama istenirse, Popper.js gibi bir kütüphane de entegre edilebilir.
- Bu pattern, projenin diğer bölümlerinde de referans olarak kullanılabilir. 