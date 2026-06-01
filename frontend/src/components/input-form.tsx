interface InputFormProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const InputForm: React.FC<InputFormProps> = ({ label, ...props }) => (
  <div className='mb-3'>
    <label className='block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1'>
      {label}
    </label>
    <input
      {...props}
      className='w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#1877f2]'
    />
  </div>
);
