import type { ReactNode } from 'react';

interface SelectFormProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: ReactNode;
}

export const SelectForm: React.FC<SelectFormProps> = ({
  label,
  children,
  ...props
}) => (
  <div className='mb-3'>
    <label className='block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1'>
      {label}
    </label>
    <select
      {...props}
      className='w-full p-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-[#1877f2]'
    >
      {children}
    </select>
  </div>
);
