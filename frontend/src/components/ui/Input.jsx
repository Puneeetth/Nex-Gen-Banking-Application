import { clsx } from 'clsx';
import { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    error,
    className = '',
    type = 'text',
    ...props
}, ref) => {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-gray-300">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                type={type}
                className={clsx(
                    'input-field',
                    error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                    className
                )}
                {...props}
            />
            {error && (
                <p className="text-sm text-red-400">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;

export function Select({ label, error, options, className = '', ...props }) {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-gray-300">
                    {label}
                </label>
            )}
            <select
                className={clsx(
                    'input-field appearance-none cursor-pointer',
                    error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                    className
                )}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-sm text-red-400">{error}</p>
            )}
        </div>
    );
}
