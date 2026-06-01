export const Carga: React.FC = () => {
  return (
    <div className='flex items-center justify-center py-8'>
      <div className='flex flex-col items-center'>
        <div className='w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin'></div>
        <p className='mt-3 text-sm text-gray-600'>Cargando...</p>
      </div>
    </div>
  );
};
