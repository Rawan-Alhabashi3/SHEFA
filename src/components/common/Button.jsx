function Button({ children, className = '', variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-100 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus:ring-blue-950',
    secondary: 'border border-blue-200 bg-white text-blue-700 hover:bg-blue-50 focus:ring-blue-100 dark:border-blue-500/40 dark:bg-slate-900 dark:text-blue-200 dark:hover:bg-blue-950/50 dark:focus:ring-blue-950',
    light: 'border border-white bg-white text-blue-700 shadow-sm hover:bg-blue-50 focus:ring-white/40 dark:border-blue-500/40 dark:bg-slate-900 dark:text-blue-100 dark:hover:bg-blue-950/60 dark:focus:ring-blue-950',
    ghostOnDark: 'border border-white/35 bg-white/10 text-white hover:bg-white/20 focus:ring-white/30 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:focus:ring-blue-950',
  }

  return (
    <button
      className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-4 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
