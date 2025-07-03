// Theme definitions for different user roles
export const themes = {
  patient: {
    primary: '#0369A1', // Medical blue
    secondary: '#0EA5E9', // Light blue
    accent: '#10B981', // Green
    gradient: 'from-blue-50 via-white to-green-50',
    cardGradient: 'from-blue-500 to-green-500',
    textPrimary: 'text-blue-600',
    textSecondary: 'text-green-600',
    bgPrimary: 'bg-blue-600',
    bgSecondary: 'bg-green-600',
    borderPrimary: 'border-blue-200',
    hoverPrimary: 'hover:bg-blue-700',
    shadowPrimary: 'shadow-blue-500/25',
    name: 'Patient Portal',
    description: 'Your health, our priority',
    icon: '🩺'
  },
  doctor: {
    primary: '#059669', // Medical green
    secondary: '#10B981', // Light green
    accent: '#0D9488', // Teal
    gradient: 'from-green-50 via-white to-teal-50',
    cardGradient: 'from-green-500 to-teal-500',
    textPrimary: 'text-green-600',
    textSecondary: 'text-teal-600',
    bgPrimary: 'bg-green-600',
    bgSecondary: 'bg-teal-600',
    borderPrimary: 'border-green-200',
    hoverPrimary: 'hover:bg-green-700',
    shadowPrimary: 'shadow-green-500/25',
    name: 'Doctor Portal',
    description: 'Excellence in patient care',
    icon: '👨‍⚕️'
  },
  admin: {
    primary: '#7C3AED', // Purple
    secondary: '#A855F7', // Light purple
    accent: '#EC4899', // Pink
    gradient: 'from-purple-50 via-white to-pink-50',
    cardGradient: 'from-purple-500 to-pink-500',
    textPrimary: 'text-purple-600',
    textSecondary: 'text-pink-600',
    bgPrimary: 'bg-purple-600',
    bgSecondary: 'bg-pink-600',
    borderPrimary: 'border-purple-200',
    hoverPrimary: 'hover:bg-purple-700',
    shadowPrimary: 'shadow-purple-500/25',
    name: 'Admin Portal',
    description: 'System management & control',
    icon: '⚙️'
  }
};

// Get theme based on user role
export const getTheme = (role) => {
  return themes[role] || themes.patient;
};

// Generate CSS variables for theme
export const getCSSVariables = (theme) => {
  return {
    '--theme-primary': theme.primary,
    '--theme-secondary': theme.secondary,
    '--theme-accent': theme.accent,
  };
};

// Theme-aware component wrapper
export const ThemeProvider = ({ children, theme }) => {
  return (
    <div 
      className={`min-h-screen bg-gradient-to-br ${theme.gradient}`}
      style={getCSSVariables(theme)}
    >
      {children}
    </div>
  );
};
