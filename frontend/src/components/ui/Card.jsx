import { clsx } from 'clsx';

export default function Card({
    children,
    className = '',
    hover = false,
    gradient = false,
    ...props
}) {
    return (
        <div
            className={clsx(
                hover ? 'card-hover' : 'card',
                gradient && 'bg-gradient-card',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function GlassCard({ children, className = '', ...props }) {
    return (
        <div className={clsx('glass p-6', className)} {...props}>
            {children}
        </div>
    );
}
