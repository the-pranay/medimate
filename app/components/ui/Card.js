export function Card({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  ...props 
}) {
  const baseClasses = 'rounded-2xl border backdrop-blur-sm transition-all duration-300';
  
  const variants = {
    default: 'bg-white/90 border-gray-200 shadow-md',
    gradient: 'bg-gradient-to-br from-white/95 to-gray-50/95 border-gray-200/50 shadow-lg',
    glass: 'bg-white/10 border-white/20 shadow-xl backdrop-blur-lg',
    colored: 'bg-gradient-to-br from-blue-50/90 to-purple-50/90 border-blue-200/50 shadow-lg'
  };
  
  const hoverClass = hover ? 'hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1' : '';
  
  const classes = `${baseClasses} ${variants[variant]} ${hoverClass} ${className}`;
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200/50 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 border-t border-gray-200/50 ${className}`}>
      {children}
    </div>
  );
}
