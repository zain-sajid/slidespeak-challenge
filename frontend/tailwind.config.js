/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
  	extend: {
  		colors: {
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			blue: {
  				'25': '#F5FAFF',
  				'50': '#EFF8FF',
  				'100': '#D1E9FF',
  				'200': '#B2DDFF',
  				'300': '#84CAFF',
  				'400': '#53B1FD',
  				'500': '#2E90FA',
  				'600': '#1570EF',
  				'700': '#175CD3',
  				'800': '#1849A9'
  			},
  			'blue-dark': {
  				'50': '#EFF4FF'
  			},
  			gray: {
  				'25': '#FCFCFD',
  				'50': '#F9FAFB',
  				'100': '#F2F4F7',
  				'150': '#EBEEF5',
  				'200': '#E5E9F2',
  				'300': '#D1D9E6',
  				'400': '#98A2B3',
  				'500': '#667085',
  				'600': '#475467',
  				'700': '#344054',
  				'800': '#1D2939',
  				'900': '#101828'
  			},
  			'gray-blue': {
  				'200': '#D5D9EB'
  			},
  			error: {
  				'25': '#FFFBFA',
  				'50': '#FEF3F2',
  				'100': '#FEE4E2',
  				'200': '#FECDCA',
  				'300': '#FDA29B',
  				'400': '#F97066',
  				'500': '#F04438',
  				'600': '#D92D20',
  				'700': '#B42318',
  				'800': '#912018',
  				'900': '#7A271A'
  			},
  			warning: {
  				'25': '#FFFCF5',
  				'50': '#FFFAEB',
  				'100': '#FEF0C7',
  				'200': '#FEDF89',
  				'300': '#FEC84B',
  				'400': '#FDB022',
  				'500': '#F79009',
  				'600': '#DC6803',
  				'700': '#B54708',
  				'800': '#93370D',
  				'900': '#7A2E0E'
  			},
  			success: {
  				'25': '#F6FEF9',
  				'50': '#ECFDF3',
  				'100': '#D1FADF',
  				'200': '#A6F4C5',
  				'300': '#6CE9A6',
  				'400': '#32D583',
  				'500': '#12B76A',
  				'600': '#039855',
  				'700': '#027A48',
  				'800': '#05603A',
  				'900': '#054F31'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
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
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		animation: {
  			'spin-pretty': 'spin-pretty 1s cubic-bezier(0.4, 0.0, 0.2, 1) infinite',
  			bounce200: 'bounce 1s infinite 250ms',
  			bounce400: 'bounce 1s infinite 500ms',
  			bounce600: 'bounce 1s infinite 750ms',
  			enter: 'enter-keyframes 200ms ease-out',
  			leave: 'leave-keyframes 150ms ease-in forwards'
  		},
  		keyframes: {
  			'spin-pretty': {
  				'0%': {
  					transform: 'rotate(0deg)'
  				},
  				'100%': {
  					transform: 'rotate(360deg)'
  				}
  			},
  			'enter-keyframes': {
  				'0%': {
  					transform: 'scale(0.9)',
  					opacity: 0
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: 1
  				}
  			},
  			'leave-keyframes': {
  				'0%': {
  					transform: 'scale(1)',
  					opacity: 1
  				},
  				'100%': {
  					transform: 'scale(0.9)',
  					opacity: 0
  				}
  			},
  			bounce: {
  				'0%, 100%': {
  					transform: 'translateY(-3px)',
  					animationTimingFunction: 'cubic-bezier(0.8,0,1,1)'
  				},
  				'50%': {
  					transform: 'none',
  					animationTimingFunction: 'cubic-bezier(0,0,0.2,1)'
  				}
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  // eslint-disable-next-line global-require
  plugins: [require('@tailwindcss/typography'), require('tailwindcss-animate')],
};
