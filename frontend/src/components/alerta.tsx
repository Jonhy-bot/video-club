interface AlertaProps {
  mensaje: string;
  tipo?: 'success' | 'error' | '';
}

export const Alerta: React.FC<AlertaProps> = ({
  mensaje,
  tipo = 'success'
}) => {
  if (!mensaje) return null;
  const estilos =
    tipo === 'success' ?
      'bg-green-50 border-green-300 text-green-800'
    : 'bg-red-50 border-red-300 text-red-800';
  return (
    <div className={`p-3 my-3 border rounded text-sm font-medium ${estilos}`}>
      {mensaje}
    </div>
  );
};
