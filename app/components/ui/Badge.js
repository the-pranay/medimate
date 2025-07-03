export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  ...props 
}) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-all duration-200';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    success: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200',
    warning: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200',
    error: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200',
    info: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200',
    purple: 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border border-purple-200'
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}
