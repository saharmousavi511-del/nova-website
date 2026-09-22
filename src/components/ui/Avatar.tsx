interface AvatarProps {
  name: string;
  gradient?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZES = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-16 w-16 text-lg',
  xl: 'h-24 w-24 text-2xl',
};

/** نام‌نویسه (مونوگرام) با پس‌زمینه گرادیانی — بدون نیاز به عکس */
export function Avatar({ name, gradient = 'from-nova-300 to-nebula-500', size = 'md', className = '' }: AvatarProps) {
  const parts = name.trim().split(/\s+/);
  const initials = (parts[0]?.charAt(0) ?? '') + (parts[1]?.charAt(0) ?? '');
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} font-black text-space-950 shadow-lg shadow-black/40 ${SIZES[size]} ${className}`}
      aria-hidden
    >
      <span className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/25 to-transparent" />
      <span className="relative">{initials}</span>
    </span>
  );
}
