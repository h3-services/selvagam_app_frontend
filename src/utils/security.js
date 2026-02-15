import CryptoJS from 'crypto-js';

// SECURE KEY - In a production environment, this should be in an environment variable
// For this portal, we'll use a consistent key for system-wide encryption
const SECRET_KEY = 'selvagam-admin-secure-key-2026';

export const securityUtils = {
    /**
     * Encrypts a string (e.g., password) using AES encryption.
     * Use this before saving to the database.
     * @param {string} text - The plain text to encrypt
     * @returns {string} - The encrypted base64 string
     */
    encrypt: (text) => {
        if (!text) return '';
        try {
            return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
        } catch (error) {
            console.error("Encryption error:", error);
            return text; // Fallback to plain text if encryption fails
        }
    },

    /**
     * Decrypts an encrypted string using AES decryption.
     * @param {string} ciphertext - The base64 encrypted string
     * @returns {string} - The original plain text
     */
    decrypt: (ciphertext) => {
        if (!ciphertext) return '';
        try {
            const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
            const originalText = bytes.toString(CryptoJS.enc.Utf8);
            return originalText;
        } catch (error) {
            console.error("Decryption error:", error);
            return ciphertext; // Return ciphertext if decryption fails
        }
    },

    /**
     * Best Practice: One-way hashing (cannot be decrypted).
     * Use this if you don't need to ever see the password again (standard login).
     * @param {string} password - The plain text password
     * @returns {string} - SHA256 hashed string
     */
    hash: (password) => {
        if (!password) return '';
        return CryptoJS.SHA256(password).toString();
    }
};
