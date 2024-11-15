const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
      colors: {
        // Primary Brand Colors
        'custom-purple': 'var(--primary-purple, #7C3AED)',
        'custom-green': 'var(--primary-green, #16A34A)',
        'custom-silver': 'var(--primary-silver, #C0C0C0)',
        
        // Status Colors
        'status': {
          'active': 'var(--status-active, #16A34A)',
          'pending': 'var(--status-pending, #FBBF24)',
          'inactive': 'var(--status-inactive, #DC2626)',
          'warning': 'var(--status-warning, #F59E0B)',
          'error': 'var(--status-error, #DC2626)',
          'success': 'var(--status-success, #16A34A)',
        },

        // UI Theme Colors
        'theme': {
          'background': 'var(--theme-background, #111827)',
          'foreground': 'var(--theme-foreground, #FFFFFF)',
          'muted': 'var(--theme-muted, #6B7280)',
          'border': 'var(--theme-border, #374151)',
        },

        // Component-specific Colors
        'shield': {
          'primary': 'var(--shield-primary, #7C3AED)',
          'secondary': 'var(--shield-secondary, #16A34A)',
          'accent': 'var(--shield-accent, #60A5FA)',
          'glow': 'var(--shield-glow, #7C3AED)',
        },

        // Chart & Data Visualization Colors
        'chart': {
          'primary': 'var(--chart-primary, #7C3AED)',
          'secondary': 'var(--chart-secondary, #16A34A)',
          'tertiary': 'var(--chart-tertiary, #60A5FA)',
          'quaternary': 'var(--chart-quaternary, #F59E0B)',
        },

        // Subscription Tier Colors
        'tier': {
          'miles': 'var(--tier-miles, #6B7280)',
          'centurion': 'var(--tier-centurion, #60A5FA)',
          'tribune': 'var(--tier-tribune, #7C3AED)',
          'consul': 'var(--tier-consul, #16A34A)',
          'emperor': 'var(--tier-emperor, #F59E0B)',
        },

        // Gradient Colors
        'gradient': {
          'start': 'var(--gradient-start, #7C3AED)',
          'middle': 'var(--gradient-middle, #60A5FA)',
          'end': 'var(--gradient-end, #16A34A)',
        },

        // Semantic Colors
        'semantic': {
          'info': 'var(--semantic-info, #60A5FA)',
          'warning': 'var(--semantic-warning, #F59E0B)',
          'error': 'var(--semantic-error, #DC2626)',
          'success': 'var(--semantic-success, #16A34A)',
        },

        // Background Colors
        'background': {
          'primary': 'var(--bg-primary, #111827)',
          'secondary': 'var(--bg-secondary, #1F2937)',
          'tertiary': 'var(--bg-tertiary, #374151)',
          'card': 'var(--bg-card, #1F2937)',
        },

        // Text Colors
        'text': {
          'primary': 'var(--text-primary, #FFFFFF)',
          'secondary': 'var(--text-secondary, #E5E7EB)',
          'muted': 'var(--text-muted, #9CA3AF)',
          'disabled': 'var(--text-disabled, #6B7280)',
        },

        // Border Colors
        'border': {
          'primary': 'var(--border-primary, #374151)',
          'secondary': 'var(--border-secondary, #4B5563)',
          'focus': 'var(--border-focus, #7C3AED)',
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "glow": {
          "0%": {
            boxShadow: "0 0 5px var(--primary-purple), 0 0 10px var(--primary-purple)",
          },
          "100%": {
            boxShadow: "0 0 10px var(--primary-purple), 0 0 20px var(--primary-purple)",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            opacity: 1,
            filter: "brightness(100%)",
          },
          "50%": {
            opacity: 0.8,
            filter: "brightness(150%)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "spin-slow": "spin 3s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-custom': 'linear-gradient(to bottom, var(--primary-purple), var(--primary-green))',
        'gradient-card': 'linear-gradient(to bottom right, var(--gradient-start), var(--gradient-end))',
        'gradient-shield': 'linear-gradient(45deg, var(--shield-primary), var(--shield-secondary))',
      },
      boxShadow: {
        'glow-sm': '0 0 5px var(--primary-purple)',
        'glow-md': '0 0 10px var(--primary-purple)',
        'glow-lg': '0 0 20px var(--primary-purple)',
        'shield': '0 0 15px var(--shield-glow)',
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      fontSize: {
        'xxs': '0.625rem',
      },
      spacing: {
        '18': '4.5rem',
        '112': '28rem',
        '128': '32rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      opacity: {
        '15': '0.15',
        '35': '0.35',
        '85': '0.85',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/forms")({
      strategy: 'class',
    }),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
