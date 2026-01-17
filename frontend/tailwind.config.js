/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            fontFamily: {
                'fear': ['JetBrains Mono', 'monospace'],
            },
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                fear: {
                    red: '#FF0000',
                    'dark-red': '#8B0000',
                    black: '#000000',
                    gray: '#B0B0B0',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                },
                'pulse-red': {
                    '0%, 100%': { 
                        boxShadow: '0 0 20px hsla(0, 100%, 50%, 0.4)',
                        transform: 'scale(1)'
                    },
                    '50%': { 
                        boxShadow: '0 0 40px hsla(0, 100%, 50%, 0.8)',
                        transform: 'scale(1.02)'
                    }
                },
                'pulse-aggressive': {
                    '0%, 100%': { 
                        boxShadow: '0 0 30px hsla(0, 100%, 50%, 0.6)',
                        opacity: '1'
                    },
                    '50%': { 
                        boxShadow: '0 0 60px hsla(0, 100%, 50%, 1)',
                        opacity: '0.7'
                    }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'pulse-red': 'pulse-red 2s ease-in-out infinite',
                'pulse-aggressive': 'pulse-aggressive 0.5s ease-in-out infinite'
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
};
