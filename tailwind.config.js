/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'var(--primary-color)',
                    hover: 'var(--primary-hover)',
                },
                secondary: 'var(--secondary-color)',
                success: 'var(--success-color)',
                danger: 'var(--danger-color)',
                warning: 'var(--warning-color)',
                info: 'var(--info-color)',
                bg: 'var(--bg-color)',
                surface: {
                    DEFAULT: 'var(--surface-color)',
                    hover: 'var(--surface-hover)',
                },
                text: {
                    primary: 'var(--text-primary)',
                    secondary: 'var(--text-secondary)',
                    muted: 'var(--text-muted)',
                    inverse: 'var(--text-inverse)',
                },
                border: {
                    DEFAULT: 'var(--border-color)',
                    light: 'var(--border-light)',
                }
            },
            borderRadius: {
                'sm': 'var(--radius-sm)',
                'md': 'var(--radius-md)',
                'lg': 'var(--radius-lg)',
                'full': 'var(--radius-full)',
            },
            boxShadow: {
                'sm': 'var(--shadow-sm)',
                'md': 'var(--shadow-md)',
                'lg': 'var(--shadow-lg)',
            },
            fontFamily: {
                sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
            },
            transitionProperty: {
                'fast': 'var(--transition-fast)',
                'normal': 'var(--transition-normal)',
            }
        },
    },
    plugins: [],
}
