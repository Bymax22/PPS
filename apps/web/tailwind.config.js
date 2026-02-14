/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        'playfair': ['var(--font-playfair)', 'serif'],
        'inter': ['var(--font-inter)', 'sans-serif'],
        'space-grotesk': ['var(--font-space-grotesk)', 'sans-serif'],
        'plus-jakarta': ['var(--font-plus-jakarta)', 'sans-serif'],
        'sans': ['var(--font-inter)', 'system-ui', 'sans-serif'],
        'serif': ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      colors: {
        campus: {
          navy: "#003087",
          gold: "#FBB03B",
          light: "#F4F7FA",
          dark: "#001f5b",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          blue: '#0713FB',
          dark: '#161A38',
          green: '#0EF117',
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { 
            opacity: 0.5,
            transform: 'scale(1)',
          },
          '50%': { 
            opacity: 0.8,
            transform: 'scale(1.05)',
          },
        },
        slideInFromBottom: {
          from: { 
            opacity: 0,
            transform: 'translateY(20px)',
          },
          to: { 
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
        slideInFromLeft: {
          from: { 
            opacity: 0,
            transform: 'translateX(-20px)',
          },
          to: { 
            opacity: 1,
            transform: 'translateX(0)',
          },
        },
        slideInFromRight: {
          from: { 
            opacity: 0,
            transform: 'translateX(20px)',
          },
          to: { 
            opacity: 1,
            transform: 'translateX(0)',
          },
        },
        scaleIn: {
          from: { 
            opacity: 0,
            transform: 'scale(0.9)',
          },
          to: { 
            opacity: 1,
            transform: 'scale(1)',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'slideInBottom': 'slideInFromBottom 0.6s ease-out',
        'slideInLeft': 'slideInFromLeft 0.6s ease-out',
        'slideInRight': 'slideInFromRight 0.6s ease-out',
        'scaleIn': 'scaleIn 0.5s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
        'gradient': 'gradientShift 5s ease infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}