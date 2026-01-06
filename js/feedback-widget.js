(function () {
    // Feedback Widget - Secure & Readable
    // NOTE: Discord webhook URL must be provided via environment variable
    // Set VITE_FEEDBACK_WEBHOOK in your .env file

    // Create and inject styles
    const styles = document.createElement('style');
    styles.innerHTML = `
.hackshala-feedback-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    font-family: 'Inter', sans-serif;
}

.feedback-toggle {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
    border-radius: 50%;
    box-shadow: 0 4px 15px rgba(0, 210, 255, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: none;
    padding: 0;
}

.feedback-toggle:hover {
    transform: scale(1.1);
}

.feedback-toggle i {
    color: white;
    font-size: 32px;
}

.feedback-box {
    position: absolute;
    bottom: 80px;
    right: 0;
    width: 350px;
    background: #0f172a;
    border: 1px solid #1e293b;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    opacity: 0;
    transform: translateY(20px) scale(0.95);
    visibility: hidden;
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.feedback-box.active {
    opacity: 1;
    transform: translateY(0) scale(1);
    visibility: visible;
}

.feedback-header {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    padding: 20px;
    border-bottom: 1px solid #334155;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.feedback-header h3 {
    margin: 0;
    color: #f8fafc;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 8px;
}

.feedback-close {
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    font-size: 1.2rem;
    transition: color 0.2s;
}

.feedback-close:hover {
    color: #fff;
}

.feedback-body {
    padding: 20px;
}

.feedback-input-group {
    margin-bottom: 16px;
}

.feedback-input-group label {
    display: block;
    color: #cbd5e1;
    font-size: 0.85rem;
    margin-bottom: 6px;
}

.feedback-input {
    width: 100%;
    padding: 10px 14px;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 8px;
    color: #f1f5f9;
    font-family: inherit;
    font-size: 0.9rem;
    resize: vertical;
    transition: border-color 0.2s;
    box-sizing: border-box;
}

.feedback-input:focus {
    outline: none;
    border-color: #00d2ff;
}

.feedback-submit {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
    border: none;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
}

.feedback-submit:hover {
    opacity: 0.9;
}

.feedback-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.feedback-success {
    text-align: center;
    padding: 40px 20px;
    display: none;
}

.feedback-success i {
    font-size: 3rem;
    color: #4ade80;
    margin-bottom: 16px;
}
`;
    document.head.appendChild(styles);

    // Create widget HTML
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'hackshala-feedback-widget';
    widgetContainer.innerHTML = `
<div class="feedback-box" id="feedbackBox">
    <div class="feedback-header">
        <h3><i class="ph-fill ph-chat-circle-text"></i> Support & Feedback</h3>
        <button class="feedback-close" id="feedbackClose" aria-label="Close feedback widget">
            <i class="ph ph-x"></i>
        </button>
    </div>
    <div class="feedback-body">
        <form id="feedbackForm" novalidate>
            <div class="feedback-input-group">
                <label for="fbQuery">How can we help you?</label>
                <textarea id="fbQuery" class="feedback-input" rows="4" placeholder="Describe your issue or feedback..." required maxlength="1000"></textarea>
            </div>
            <div class="feedback-input-group">
                <label for="fbContact">Contact Info (Discord/Email)</label>
                <input type="text" id="fbContact" class="feedback-input" placeholder="So we can reply to you (optional)" maxlength="200">
            </div>
            <button type="submit" class="feedback-submit">
                Send Message <i class="ph-bold ph-paper-plane-right"></i>
            </button>
        </form>
        <div class="feedback-success" id="feedbackSuccess">
            <i class="ph-fill ph-check-circle"></i>
            <h3>Message Sent!</h3>
            <p style="color: #94a3b8; font-size: 0.9rem; margin-top: 8px;">
                Thanks for reaching out. We'll get back to you soon.
            </p>
        </div>
    </div>
</div>
<button class="feedback-toggle" id="feedbackToggle" aria-label="Toggle feedback widget">
    <i class="ph-fill ph-chat-teardrop-dots"></i>
</button>
`;
    document.body.appendChild(widgetContainer);

    // Get DOM elements
    const feedbackToggle = document.getElementById('feedbackToggle');
    const feedbackBox = document.getElementById('feedbackBox');
    const feedbackClose = document.getElementById('feedbackClose');
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackSuccess = document.getElementById('feedbackSuccess');

    /**
     * Toggle feedback box visibility
     */
    function toggleFeedbackBox() {
        feedbackBox.classList.toggle('active');
        const icon = feedbackToggle.querySelector('i');
        
        if (feedbackBox.classList.contains('active')) {
            icon.classList.remove('ph-chat-teardrop-dots');
            icon.classList.add('ph-x');
        } else {
            icon.classList.remove('ph-x');
            icon.classList.add('ph-chat-teardrop-dots');
        }
    }

    // Event listeners
    feedbackToggle.addEventListener('click', toggleFeedbackBox);
    feedbackClose.addEventListener('click', toggleFeedbackBox);

    /**
     * Validates feedback input
     * @param {string} query - Feedback message
     * @param {string} contact - Contact info
     * @returns {object} Validation result
     */
    function validateFeedback(query, contact) {
        const errors = [];
        
        if (!query.trim() || query.trim().length < 10) {
            errors.push('Feedback must be at least 10 characters long');
        }
        
        if (contact.trim() && contact.trim().length > 200) {
            errors.push('Contact info is too long');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Form submission
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const query = document.getElementById('fbQuery').value;
        const contact = document.getElementById('fbContact').value;

        // Validate input
        const validation = validateFeedback(query, contact);
        if (!validation.isValid) {
            alert('❌ ' + validation.errors[0]);
            return;
        }

        // Get webhook URL from environment
        const webhookUrl = window.HACKSHALA_CONFIG?.feedbackWebhook;
        
        if (!webhookUrl) {
            console.error('Feedback webhook URL not configured');
            alert('❌ Unable to send feedback. Please try again later.');
            return;
        }

        const submitButton = feedbackForm.querySelector('button[type="submit"]');
        submitButton.innerHTML = 'Sending...';
        submitButton.disabled = true;

        const payload = {
            content: "📨 **New Website Feedback/Query**",
            embeds: [{
                title: "Feedback Received",
                color: 0x3b82f6,
                fields: [
                    { name: "❓ Query/Feedback", value: query },
                    { name: "👤 Contact", value: contact || 'Anonymous', inline: true },
                    { name: "📄 Page", value: window.location.pathname, inline: true }
                ],
                footer: { text: "Hackshala Support Bot" },
                timestamp: new Date().toISOString()
            }]
        };

        fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(() => {
            // Show success message
            feedbackForm.style.display = 'none';
            feedbackSuccess.style.display = 'block';

            // Auto-close after 3 seconds
            setTimeout(() => {
                if (feedbackBox.classList.contains('active')) {
                    toggleFeedbackBox();
                }
                
                setTimeout(() => {
                    feedbackForm.reset();
                    feedbackForm.style.display = 'block';
                    feedbackSuccess.style.display = 'none';
                    submitButton.innerHTML = 'Send Message <i class="ph-bold ph-paper-plane-right"></i>';
                    submitButton.disabled = false;
                }, 500);
            }, 3000);
        })
        .catch((error) => {
            console.error('Feedback submission error:', error);
            alert('❌ Failed to send feedback. Please try again.');
            submitButton.innerHTML = 'Send Message <i class="ph-bold ph-paper-plane-right"></i>';
            submitButton.disabled = false;
        });
    });
})();
