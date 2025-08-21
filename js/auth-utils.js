/**
 * Authentication utilities for email validation and user management
 */

class AuthUtils {
    constructor() {
        this.storageKey = 'users';
    }

    /**
     * Normalize email address for consistent comparison
     * @param {string} email - Email to normalize
     * @returns {string} - Normalized email
     */
    static normalizeEmail(email) {
        return email.trim().toLowerCase();
    }

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} - Whether email is valid
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Check if email already exists in storage
     * @param {string} email - Email to check
     * @returns {boolean} - Whether email exists
     */
    static emailExists(email) {
        const normalizedEmail = this.normalizeEmail(email);
        const users = JSON.parse(localStorage.getItem('users')) || [];
        return users.some(user => this.normalizeEmail(user.email) === normalizedEmail);
    }

    /**
     * Get all users from storage
     * @returns {Array} - Array of user objects
     */
    static getAllUsers() {
        return JSON.parse(localStorage.getItem('users')) || [];
    }

    /**
     * Add new user to storage
     * @param {Object} userData - User data to add
     * @returns {boolean} - Whether user was added successfully
     */
    static addUser(userData) {
        try {
            const users = this.getAllUsers();
            
            // Check for duplicate email
            if (this.emailExists(userData.email)) {
                throw new Error('Email already exists');
            }

            // Normalize email
            userData.email = this.normalizeEmail(userData.email);
            
            // Add metadata
            userData.id = Date.now();
            userData.createdAt = new Date().toISOString();
            userData.username = userData.email.split('@')[0];
            
            users.push(userData);
            localStorage.setItem('users', JSON.stringify(users));
            return true;
        } catch (error) {
            console.error('Error adding user:', error);
            return false;
        }
    }

    /**
     * Get user by email
     * @param {string} email - Email to search for
     * @returns {Object|null} - User object or null if not found
     */
    static getUserByEmail(email) {
        const normalizedEmail = this.normalizeEmail(email);
        const users = this.getAllUsers();
        return users.find(user => this.normalizeEmail(user.email) === normalizedEmail) || null;
    }

    /**
     * Rate limiting for registration attempts
     */
    static rateLimiter = {
        attempts: new Map(),
        
        canAttempt(identifier) {
            const now = Date.now();
            const attempts = this.attempts.get(identifier) || [];
            
            // Remove attempts older than 1 minute
            const recentAttempts = attempts.filter(time => now - time < 60000);
            this.attempts.set(identifier, recentAttempts);
            
            // Allow max 5 attempts per minute
            return recentAttempts.length < 5;
        },
        
        recordAttempt(identifier) {
            const attempts = this.attempts.get(identifier) || [];
            attempts.push(Date.now());
            this.attempts.set(identifier, attempts);
        }
    };
}

// Export for use in other files
window.AuthUtils = AuthUtils;
