/**
 * Avatar — Slack-inspired faculty avatar component
 *
 * Supports photo or initials fallback, presence indicator dots,
 * and customizable rounded-xl or rounded-full shapes.
 */

export default function Avatar({
  src,
  name = '',
  initials,
  size = 'md',
  status, // 'online' | 'away' | 'in_lecture' | 'offline'
  rounded = 'xl', // 'xl' | 'full' | 'lg'
  gradient,
  className = '',
}) {
  const sizeClasses = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-9 w-9 text-xs',
    lg: 'h-11 w-11 text-sm',
    xl: 'h-16 w-16 text-lg font-bold',
    '2xl': 'h-20 w-20 text-2xl font-bold',
  };

  const statusSizeClasses = {
    xs: 'h-2 w-2 ring-1',
    sm: 'h-2.5 w-2.5 ring-1.5',
    md: 'h-3 w-3 ring-2',
    lg: 'h-3.5 w-3.5 ring-2',
    xl: 'h-4 w-4 ring-2',
    '2xl': 'h-5 w-5 ring-3',
  };

  const roundedClasses = {
    full: 'rounded-full',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
  };

  const calculatedInitials =
    initials ||
    (name
      ? name
          .replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s+/i, '')
          .split(' ')
          .map((w) => w[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : 'FC');

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-emerald-500';
      case 'away':
        return 'bg-amber-400';
      case 'in_lecture':
        return 'bg-purple-500';
      case 'offline':
        return 'bg-slate-400';
      default:
        return null;
    }
  };

  const statusColor = getStatusColor();

  return (
    <div className={`relative inline-block shrink-0 ${sizeClasses[size]} ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`h-full w-full object-cover ${roundedClasses[rounded] || 'rounded-xl'} shadow-sm`}
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center font-bold text-white shadow-sm select-none ${
            roundedClasses[rounded] || 'rounded-xl'
          } ${
            gradient
              ? `bg-gradient-to-tr ${gradient}`
              : 'bg-gradient-to-tr from-purple-700 via-indigo-700 to-purple-800'
          }`}
        >
          {calculatedInitials}
        </div>
      )}

      {statusColor && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-white ${statusSizeClasses[size]} ${statusColor}`}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
}
