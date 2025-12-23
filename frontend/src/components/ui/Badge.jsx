import { clsx } from 'clsx';

const variants = {
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    error: 'bg-red-500/20 text-red-400 border-red-500/30',
    info: 'bg-primary-500/20 text-primary-400 border-primary-500/30',
    accent: 'bg-accent-500/20 text-accent-400 border-accent-500/30',
};

export default function Badge({
    children,
    variant = 'info',
    className = '',
    ...props
}) {
    return (
        <span
            className={clsx(
                'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}
