// Utilitaires de Sécurité
// Fournit des méthodes génériques pour valider et nettoyer les entrées utilisateur côté API.

/**
 * Nettoie une chaîne de caractères pour éviter l'injection HTML simple.
 * (Note : React gère déjà l'échappement lors du rendu, mais c'est utile pour les données persistées).
 * @param {string} str - La chaîne à nettoyer
 * @returns {string} - La chaîne sécurisée
 */
export const sanitizeInput = (str) => {
    if (typeof str !== 'string') return str;
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    // ✅ Les slashes (/) ne sont pas encodés pour préserver les URLs d'images
};

/**
 * Valide qu'un email correspond à un format standard.
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Valide la force d'un mot de passe (min 8 caractères).
 * @param {string} password 
 * @returns {boolean}
 */
export const isStrongPassword = (password) => {
    return typeof password === 'string' && password.length >= 8;
};

/**
 * Filtre un objet de requête pour n'autoriser que certains champs.
 * Utile pour empêcher l'Over-Posting (Mass Assignment).
 * @param {Object} body - L'objet de la requête entrante
 * @param {Array<string>} allowedFields - Les clés autorisées
 * @returns {Object} - L'objet nettoyé
 */
export const filterAllowedFields = (body, allowedFields) => {
    if (!body || typeof body !== 'object') return {};
    return Object.keys(body)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
            obj[key] = typeof body[key] === 'string' ? sanitizeInput(body[key]) : body[key];
            return obj;
        }, {});
};
