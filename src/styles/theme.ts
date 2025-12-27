import { keyframes } from 'styled-components';

type ThemeMode = 'light' | 'dark';
type CursorSymbol = '☀️' | '⭐';

declare module 'styled-components' {
  export interface DefaultTheme {
    mode: ThemeMode;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      soft: {
        primary: string;
        secondary: string;
        accent: string;
      };
      background: {
        main: string;
        dark: string;
        light: string;
        gradient: string;
        softGradient: string;
      };
      text: {
        primary: string;
        secondary: string;
        light: string;
      };
      gradients: {
        primary: readonly string[];
        secondary: readonly string[];
        morphing: readonly string[];
      };
    };
    cursor: {
      primary: string;
      border: string;
      symbol: CursorSymbol;
    };
    fonts: {
      primary: string;
      secondary: string;
    };
    shadows: {
      small: string;
      medium: string;
      large: string;
    };
    animations: {
      fadeIn: ReturnType<typeof keyframes>;
      slideUp: ReturnType<typeof keyframes>;
      shine: ReturnType<typeof keyframes>;
    };
    breakpoints: {
      mobile: string;
      tablet: string;
      desktop: string;
      large: string;
    };
    transitions: {
      default: string;
      smooth: string;
      bounce: string;
    };
  }
}

const lightTheme = {
  mode: 'light' as ThemeMode,
  colors: {
    primary: '#9DB4C0',  // Soft blue-grey
    secondary: '#C5DCDE', // Soft mint
    accent: '#F6C3CB',   // Soft pink
    soft: {
      primary: '#E6E6FA', // Lavender
      secondary: '#F0E6EF', // Soft purple
      accent: '#FFE4E1',  // Misty rose
    },
    background: {
      main: '#F8F6F7',   // Very light grey-pink
      dark: '#2d3436',
      light: '#ffffff',
      gradient: 'linear-gradient(135deg, #9DB4C0 0%, #C5DCDE 100%)',
      softGradient: 'linear-gradient(135deg, #E6E6FA 0%, #F0E6EF 100%)',
    },
    text: {
      primary: '#5C6B73',  // Muted blue-grey
      secondary: '#8C9A9E', // Lighter blue-grey
      light: '#ffffff',
    },
    gradients: {
      primary: ['#9DB4C0', '#C5DCDE', '#F6C3CB'],
      secondary: ['#E6E6FA', '#F0E6EF', '#FFE4E1'],
      morphing: ['#E6E6FA', '#C5DCDE', '#F6C3CB']
    }
  },
  cursor: {
    primary: '#1BFFFF',
    border: '#2E3192',
    symbol: '☀️' as CursorSymbol
  },
  fonts: {
    primary: "'Rubik', 'Space Grotesk', sans-serif",
    secondary: "'Poppins', sans-serif",
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.1)',
    large: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
  animations: {
    fadeIn: keyframes`
      from { opacity: 0; }
      to { opacity: 1; }
    `,
    slideUp: keyframes`
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    `,
    shine: keyframes`
      from {
        background-position: 200% 0;
      }
      to {
        background-position: -200% 0;
      }
    `,
  },
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    large: '1440px',
  },
  transitions: {
    default: '0.3s ease',
    smooth: '0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  }
} as const;

const darkTheme = {
  mode: 'dark' as ThemeMode,
  colors: {
    primary: '#1BFFFF',
    secondary: '#2E3192',
    accent: '#D4145A',
    soft: {
      primary: '#CCCCFF',
      secondary: '#C8A2C8',
      accent: '#F7CAC9',
    },
    background: {
      main: '#1a1a1a',
      dark: '#000000',
      light: '#2d2d2d',
      gradient: 'linear-gradient(135deg, #1BFFFF 0%, #2E3192 100%)',
      softGradient: 'linear-gradient(135deg, #CCCCFF 0%, #C8A2C8 100%)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#a0a0a0',
      light: '#ffffff',
    },
    gradients: {
      primary: ['#1BFFFF', '#2E3192', '#D4145A'],
      secondary: ['#CCCCFF', '#C8A2C8', '#F7CAC9'],
      morphing: ['#304352', '#1BFFFF', '#0A2342']
    }
  },
  cursor: {
    primary: '#1BFFFF',
    border: '#2E3192',
    symbol: '⭐' as CursorSymbol
  },
  fonts: {
    primary: "'Rubik', 'Space Grotesk', sans-serif",
    secondary: "'Poppins', sans-serif",
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.2)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.2)',
    large: '0 10px 15px rgba(0, 0, 0, 0.2)',
  },
  animations: {
    fadeIn: keyframes`
      from { opacity: 0; }
      to { opacity: 1; }
    `,
    slideUp: keyframes`
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    `,
    shine: keyframes`
      from {
        background-position: 200% 0;
      }
      to {
        background-position: -200% 0;
      }
    `,
  },
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    large: '1440px',
  },
  transitions: {
    default: '0.3s ease',
    smooth: '0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  }
} as const;

export { lightTheme, darkTheme };