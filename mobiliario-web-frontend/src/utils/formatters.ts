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
export const formatDate = (dateString: string | number | Date) => {
    if (!dateString) return '---';
    return new Date(dateString).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};