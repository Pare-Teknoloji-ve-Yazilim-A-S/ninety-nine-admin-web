/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Renkler - Figma tasarım dosyasından alındı
      colors: {
        // Ana renkler
        primary: {
          DEFAULT: '#000000',
          white: '#FFFFFF',
          gold: '#AC8D6A',
          'gold-light': '#F2E7DC',
          red: '#E53E3E',            // Updated to warm red
          'red-light': '#FDEAEA',    // Light warm red
          'red-dark': '#9C2A2A',     // Dark rust red
          blue: '#718096',           // Warm slate blue
          'blue-light': '#E2E8F0',   // Light warm blue
          'blue-dark': '#2D3748',    // Dark steel blue
          'gray-blue': '#9DA6B9',
          'dark-gray': '#201F1D',
        },
        // Warm Red Palette - Terracotta & Rust tones
        red: {
          50: '#FEF7F7',     // Very light warm red
          100: '#FDEAEA',    // Light warm red
          200: '#FBCFCF',    // Soft warm red
          300: '#F6A8A8',    // Light terracotta
          400: '#EF7070',    // Medium warm red
          500: '#E53E3E',    // Main warm red
          600: '#C53030',    // Deep warm red
          700: '#9C2A2A',    // Rust red
          800: '#742A2A',    // Dark rust
          900: '#4A1515',    // Very dark warm red
          950: '#2D0A0A',    // Ultra dark red
        },
        // Warm Blue Palette - Slate & Steel tones
        blue: {
          50: '#F7F9FC',     // Very light warm blue
          100: '#EDF2F7',    // Light warm blue
          200: '#E2E8F0',    // Soft warm blue
          300: '#CBD5E0',    // Light slate
          400: '#A0AEC0',    // Medium warm blue
          500: '#718096',    // Main warm blue (slate)
          600: '#4A5568',    // Deep warm blue
          700: '#2D3748',    // Steel blue
          800: '#1A202C',    // Dark steel
          900: '#171923',    // Very dark blue
          950: '#0D0E12',    // Ultra dark blue
        },
        // White & Off-White Palette - Warm tones
        white: {
          DEFAULT: '#FFFFFF',       // Pure white - rare use
          warm: '#FEFEFE',          // Slightly warm white
          cream: '#FDFCFB',         // Cream white
          soft: '#FCFBFA',          // Soft warm white
          paper: '#FAFAF9',         // Paper white (matches gray-50)
          pearl: '#F9F8F7',         // Pearl white
          ivory: '#F8F7F5',         // Ivory white
          snow: '#F7F6F4',          // Snow white
        },
        // Warm Gray Palette - NinetyNine temasına uygun
        gray: {
          50: '#FAFAF9',    // En açık - almost white
          100: '#F5F5F4',   // Çok açık warm gray
          200: '#E7E5E4',   // Açık warm gray
          300: '#D6D3D1',   // Orta açık warm gray
          400: '#A8A29E',   // Orta warm gray
          500: '#78716C',   // Ana warm gray
          600: '#57534E',   // Koyu warm gray
          700: '#44403C',   // Daha koyu warm gray
          800: '#292524',   // Çok koyu warm gray
          900: '#1C1917',   // En koyu warm gray
          950: '#0C0A09',   // Ultra koyu
        },
        // Gradient renkleri
        gradient: {
          'gold-start': '#F2E7DC',
          'gold-end': '#AC8D6A',
          'dark-start': '#5F5F5F',
          'dark-end': '#1A1A1A',
        },
        // Arka plan renkleri
        background: {
          // Dark mode
          primary: '#000000',        // Pure black
          secondary: '#201F1D',      // Primary dark-gray
          card: '#1C1917',          // Gray-900
          soft: '#292524',           // Gray-800 (softer dark)

          // Light mode - Warm white tones
          'light-primary': '#FAFAF9',    // Gray-50 (paper white)
          'light-secondary': '#F5F5F4',  // Gray-100  
          'light-card': '#FDFCFB',       // Cream white
          'light-soft': '#FCFBFA',       // Soft warm white
          'light-pearl': '#F9F8F7',      // Pearl white
          'light-ivory': '#F8F7F5',      // Ivory white
          'light-pure': '#FFFFFF',       // Pure white (special cases)

          // Contextual backgrounds
          'glass-light': 'rgba(253, 252, 251, 0.8)',  // Glass effect light
          'glass-dark': 'rgba(28, 25, 23, 0.8)',      // Glass effect dark
        },
        // Metin renkleri
        text: {
          // Dark mode - Warm white tones
          primary: '#FDFCFB',        // Cream white (softer than pure white)
          secondary: '#9DA6B9',      // Gray-blue
          accent: '#AC8D6A',         // Gold
          muted: '#78716C',          // Gray-500
          soft: '#F9F8F7',           // Pearl white (for subtle text)
          bright: '#FFFFFF',         // Pure white (for high contrast)

          // Light mode
          'light-primary': '#1C1917',    // Gray-900
          'light-secondary': '#57534E',  // Gray-600
          'light-accent': '#AC8D6A',     // Gold (aynı)
          'light-muted': '#78716C',      // Gray-500
          'light-soft': '#44403C',       // Gray-700 (soft dark text)

          // Semantic text colors
          'on-dark': '#FDFCFB',          // Best text on dark backgrounds
          'on-light': '#1C1917',         // Best text on light backgrounds
          'on-gold': '#1C1917',          // Best text on gold backgrounds
          'on-gray': '#FDFCFB',          // Best text on gray backgrounds
        },
        // Border renkleri
        border: {
          // Dark mode
          primary: '#44403C',        // Gray-700
          secondary: '#292524',      // Gray-800
          light: '#57534E',          // Gray-600

          // Light mode
          'light-primary': '#E7E5E4',    // Gray-200
          'light-secondary': '#D6D3D1',  // Gray-300
          'light-muted': '#A8A29E',      // Gray-400

          // Accent borders
          gold: '#AC8D6A',           // Primary gold
          'gold-light': '#D4B896',   // Lighter gold
        },
        // Hover ve Focus renkleri
        hover: {
          // Dark mode
          gold: '#B8956F',           // Lighter gold
          'gold-bg': '#1F1B0F',      // Dark gold background
          gray: '#374151',           // Gray hover
          white: '#F9F8F7',          // Pearl white hover

          // Light mode  
          'light-gold': '#9A7A5A',   // Darker gold
          'light-gold-bg': '#FDF8F3', // Light gold background
          'light-gray': '#F3F4F6',   // Light gray hover
          'light-white': '#F8F7F5',  // Ivory white hover
          'light-cream': '#FCFBFA',  // Soft cream hover
        },
        // Focus renkleri
        focus: {
          gold: '#D6C7A8',           // Focus gold
          ring: '#AC8D6A33',         // Gold ring with opacity
        },
        // Semantic Color System - Warm tones
        semantic: {
          // Success - Warm green tones
          success: {
            50: '#F0FDF4',           // Very light success
            100: '#DCFCE7',          // Light success
            500: '#22C55E',          // Main success (slightly warm green)
            600: '#16A34A',          // Deep success
            700: '#15803D',          // Dark success
          },
          // Warning - Warm amber/orange tones
          warning: {
            50: '#FFFBEB',           // Very light warning
            100: '#FEF3C7',          // Light warning
            500: '#F59E0B',          // Main warning (warm amber)
            600: '#D97706',          // Deep warning
            700: '#B45309',          // Dark warning
          },
          // Info - Warm blue tones (from our blue palette)
          info: {
            50: '#F7F9FC',           // Very light info
            100: '#EDF2F7',          // Light info
            500: '#718096',          // Main info (warm slate)
            600: '#4A5568',          // Deep info
            700: '#2D3748',          // Dark info
          },
          // Error - Warm red tones (from our red palette)
          error: {
            50: '#FEF7F7',           // Very light error
            100: '#FDEAEA',          // Light error
            500: '#E53E3E',          // Main error (warm red)
            600: '#C53030',          // Deep error
            700: '#9C2A2A',          // Dark error (rust)
          }
        }
      },
      // Font aileleri - CSS Variables ile
      fontFamily: {
        sans: ['Helvetica', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        helvetica: ['Helvetica', 'system-ui', 'sans-serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        'sf-pro': ['SF Pro', 'system-ui', 'sans-serif'],
      },
      // Font boyutları - Global Standards
      fontSize: {
        // Minimum sizes (accessibility compliant)
        'xs': ['12px', { lineHeight: '16px' }],     // Caption, helper text
        'sm': ['14px', { lineHeight: '20px' }],     // Small text, labels
        'base': ['16px', { lineHeight: '24px' }],   // Body text (web standard)
        'lg': ['18px', { lineHeight: '28px' }],     // Large body text
        'xl': ['20px', { lineHeight: '28px' }],     // Small headings

        // Heading sizes
        '2xl': ['24px', { lineHeight: '32px' }],    // Section headings
        '3xl': ['30px', { lineHeight: '36px' }],    // Page headings
        '4xl': ['36px', { lineHeight: '40px' }],    // Large headings
        '5xl': ['48px', { lineHeight: '48px' }],    // Display headings
        '6xl': ['60px', { lineHeight: '60px' }],    // Hero headings

        // Mobile-optimized sizes
        'mobile-xs': ['14px', { lineHeight: '20px' }],
        'mobile-sm': ['16px', { lineHeight: '24px' }],
        'mobile-base': ['18px', { lineHeight: '28px' }],
      },
      // Font ağırlıkları - CSS Standards
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',        // Regular
        medium: '500',        // Medium
        semibold: '600',      // Demi Bold
        bold: '700',          // Bold
        extrabold: '800',     // Extra Bold
        black: '900',         // Heavy

        // Custom weights for design system
        'semi-medium': '550', // Between medium and semibold
      },
      // Spacing
      spacing: {
        '1': '4px',
        '2': '8px',
        '2.5': '10px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '6.25': '25px',
        '10': '40px',
        '33.5': '134px',
      },
      // Border radius
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '8px',
        'lg': '12px',
        'xl': '16px',
        'full': '9999px',
        'pill': '100px',
      },
      // Box shadows
      boxShadow: {
        'bottom-nav': '0px -1px 16px 0px rgba(0, 0, 0, 0.07)',
        'card': '0px 4px 16px 0px rgba(0, 0, 0, 0.1)',
      },
      // Gradients
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-gold': 'linear-gradient(180deg, #F2E7DC 0%, #AC8D6A 100%)',
        'gradient-dark': 'linear-gradient(180deg, #5F5F5F 0%, #1A1A1A 100%)',
        'gradient-card': 'linear-gradient(180deg, rgba(95, 95, 95, 0.2) 0%, #1A1A1A 100%)',
      },
      // Breakpoints (Mobile First)
      screens: {
        'mobile': '390px',
        'tablet': '768px',
        'desktop': '1024px',
      },
      // Line heights - Typography Standards
      lineHeight: {
        'none': '1',          // For display text
        'tight': '1.25',      // For headings
        'snug': '1.375',      // For large text
        'normal': '1.5',      // For body text (web standard)
        'relaxed': '1.625',   // For comfortable reading
        'loose': '2',         // For very relaxed text

        // Semantic line heights
        'heading': '1.2',     // For display headings
        'subheading': '1.3',  // For subheadings
        'body': '1.6',        // For body content
        'caption': '1.4',     // For small text
      },
      // Opacity
      opacity: {
        '35': '0.35',
        '40': '0.4',
      },
      // Z-index
      zIndex: {
        'bottom-nav': '50',
        'modal': '100',
        'tooltip': '200',
      },
      // Keyframes for animations
      keyframes: {
        // Toast animations
        slideInRight: {
          '0%': {
            transform: 'translateX(100%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1'
          }
        },
        slideOutRight: {
          '0%': {
            transform: 'translateX(0)',
            opacity: '1'
          },
          '100%': {
            transform: 'translateX(100%)',
            opacity: '0'
          }
        },
        slideInLeft: {
          '0%': {
            transform: 'translateX(-100%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1'
          }
        },
        slideOutLeft: {
          '0%': {
            transform: 'translateX(0)',
            opacity: '1'
          },
          '100%': {
            transform: 'translateX(-100%)',
            opacity: '0'
          }
        },
        slideInDown: {
          '0%': {
            transform: 'translateY(-100%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        slideOutUp: {
          '0%': {
            transform: 'translateY(0)',
            opacity: '1'
          },
          '100%': {
            transform: 'translateY(-100%)',
            opacity: '0'
          }
        },
        slideInUp: {
          '0%': {
            transform: 'translateY(100%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        slideOutDown: {
          '0%': {
            transform: 'translateY(0)',
            opacity: '1'
          },
          '100%': {
            transform: 'translateY(100%)',
            opacity: '0'
          }
        },
        'toast-progress': {
          '0%': { width: '100%' },
          '100%': { width: '0%' }
        },
        // Spinner animations
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      // Animation configurations
      animation: {
        slideInRight: 'slideInRight 0.3s ease-out',
        slideOutRight: 'slideOutRight 0.2s ease-in',
        slideInLeft: 'slideInLeft 0.3s ease-out',
        slideOutLeft: 'slideOutLeft 0.2s ease-in',
        slideInDown: 'slideInDown 0.3s ease-out',
        slideOutUp: 'slideOutUp 0.2s ease-in',
        slideInUp: 'slideInUp 0.3s ease-out',
        slideOutDown: 'slideOutDown 0.2s ease-in',
        'toast-progress': 'toast-progress linear',
        fadeIn: 'fadeIn 0.2s ease-out',
        scaleIn: 'scaleIn 0.2s ease-out',
      },
    },
  },
  plugins: [],
}