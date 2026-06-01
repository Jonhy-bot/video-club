export const extraerErrorDelServidor = (data: unknown): string => {
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (typeof obj.error === 'string') {
      return obj.error;
    }
    if (Array.isArray(obj.detalles)) {
      return obj.detalles[0] || 'Error desconocido';
    }
  }
  return 'Error desconocido';
};
