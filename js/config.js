/**
 * Hackshala Configuration
 * Load sensitive URLs from environment variables
 * 
 * Environment variables required:
 * - VITE_REGISTRATION_WEBHOOK: Discord webhook for registration submissions
 * - VITE_FEEDBACK_WEBHOOK: Discord webhook for feedback submissions
 */

window.HACKSHALA_CONFIG = {
    // Load from environment variables (populated by build process)
    registrationWebhook: import.meta?.env?.VITE_REGISTRATION_WEBHOOK || 'https://discord.com/api/webhooks/1455495891464097814/e4A1rGU7Mir8S4XWy6jxUGqR8BZle01yIMCMaGIOTDX1UBYIJfkkjC8cIEz4EErlvk9J',
    feedbackWebhook: import.meta?.env?.VITE_FEEDBACK_WEBHOOK || '',
    
    /**
     * Validates that all required configs are present
     */
    validate() {
        const missing = [];
        
        if (!this.registrationWebhook) {
            missing.push('VITE_REGISTRATION_WEBHOOK');
        }
        if (!this.feedbackWebhook) {
            missing.push('VITE_FEEDBACK_WEBHOOK');
        }
        
        if (missing.length > 0) {
            console.warn('⚠️ Missing environment variables:', missing.join(', '));
            return false;
        }
        
        return true;
    }
};

// Validate on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        HACKSHALA_CONFIG.validate();
    });
} else {
    HACKSHALA_CONFIG.validate();
}
