/**
 * SenTech Plus - Utility Helpers
 * Formatting currency, numbers and dates for the Senegalese High-Tech market
 */

export function formatPrice(amount: number | string | undefined | null): string {
    if (amount === undefined || amount === null) return '0 FCFA';
    const num = Number(amount);
    if (isNaN(num)) return `${amount} FCFA`;
    
    // Format thousands with space (fr-FR standard for FCFA)
    return `${Math.round(num).toLocaleString('fr-FR')} FCFA`;
}
