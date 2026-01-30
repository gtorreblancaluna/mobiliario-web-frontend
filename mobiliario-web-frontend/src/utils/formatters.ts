/**
 * Formatea un número a moneda mexicana (MXN)
 * @param {number|string} value - El valor a formatear
 * @returns {string} - Valor formateado ej: $1,250.00
 */
export const formatCurrency = (value: string): string => {

    const number = Number.parseFloat(value);

    if (Number.isNaN(number)) {
        return '$0.00';
    }

    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
};

/**
 * Formatea una fecha string a un formato legible
 */
export const formatDate = (dateString: string | number | Date | undefined | null) => {
  // 1. Manejo de nulos o vacíos (Type Guard inicial)
  if (dateString === null || dateString === undefined || dateString === '') {
    return 'Sin fecha';
  }
  
  let date: Date;

  // 2. Si es un string, TypeScript ahora sabe que NO es undefined/null
  if (typeof dateString === 'string') {
    if (dateString.includes('/')) {
      // Forzamos a TS a reconocer que aquí dateString es puramente un string
      const parts: string[] = dateString.split('/');
      date = new Date(
        parseInt(parts[2] ?? "0"), 
        parseInt((parts[1] ?? "1")) - 1, 
        parseInt(parts[0] ?? "1")
      );
    } else {
      date = new Date(dateString);
    }
  } 
  // 3. Si es number o Date
  else {
    date = new Date(dateString);
  }

  // Validación de seguridad final
  if (isNaN(date.getTime())) return 'Fecha inválida';

  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};