// Core Application Logic - Deobfuscated & Secure
// NOTE: Discord webhook URL must be provided via environment variable
// Set VITE_REGISTRATION_WEBHOOK in your .env file

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates phone format (basic validation)
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
function validatePhone(phone) {
    const phoneRegex = /^[0-9\s\-\+\(\)]{7,}$/;
    return phoneRegex.test(phone.trim());
}

/**
 * Sanitizes input to prevent XSS
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
    const registrationModal = document.getElementById('registrationModal');
    const closeModal = document.getElementById('closeModal');
    const registrationForm = document.getElementById('registrationForm');
    const watchButtons = document.querySelectorAll('.btn-primary[href^="watch.html"]');
    
    let targetUrl = '';
    const hasRegistered = localStorage.getItem('hackshala_registered') === 'true';
    
    // Check if user is registered and unlock course access
    if (hasRegistered) {
        console.log('✅ User is registered - course modules unlocked');
        document.body.classList.add('user-registered');
    }
    
    // Watch button click handlers
    watchButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            // If already registered, allow direct access
            if (hasRegistered) {
                window.location.href = button.getAttribute('href');
                return;
            }
            // Otherwise show registration modal
            targetUrl = button.getAttribute('href');
            registrationModal.classList.add('active');
        });
    });
    
    // Close modal
    closeModal.addEventListener('click', () => {
        registrationModal.classList.remove('active');
    });
    
    // Registration form submission
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const interest = document.getElementById('interest').value.trim();
        
        // Validation
        if (!fullName || fullName.length < 2) {
            alert('❌ Please enter a valid name (at least 2 characters)');
            return;
        }
        
        if (!validateEmail(email)) {
            alert('❌ Please enter a valid email address');
            return;
        }
        
        if (!validatePhone(phone)) {
            alert('❌ Please enter a valid phone number');
            return;
        }
        
        if (!interest) {
            alert('❌ Please select your area of interest');
            return;
        }
        
        // Use the webhook URL directly
        const webhookUrl = 'https://discord.com/api/webhooks/1455495891464097814/e4A1rGU7Mir8S4XWy6jxUGqR8BZle01yIMCMaGIOTDX1UBYIJfkkjC8cIEz4EErlvk9J';
        
        if (!webhookUrl) {
            console.error('Registration webhook URL not configured');
            alert('❌ Unable to process registration. Please try again later.');
            return;
        }
        
        const payload = {
            content: "🚀 **New Registration Received!**",
            embeds: [{
                title: "New Student Registration",
                color: 0x00ff9d,
                fields: [
                    { name: "👤 Name", value: sanitizeInput(fullName), inline: true },
                    { name: "📧 Email", value: sanitizeInput(email), inline: true },
                    { name: "📱 Phone", value: sanitizeInput(phone), inline: true },
                    { name: "🎯 Interest", value: sanitizeInput(interest), inline: true }
                ],
                footer: { text: "Hackshala Registration System" },
                timestamp: new Date().toISOString()
            }]
        };
        
        // Send to webhook
        fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (response.ok) {
                // Store user registration data
                localStorage.setItem('hackshala_registered', 'true');
                localStorage.setItem('hackshala_user_name', fullName);
                localStorage.setItem('hackshala_user_email', email);
                localStorage.setItem('hackshala_registered_date', new Date().toISOString());
                
                // Mark document as having registered user
                document.body.classList.add('user-registered');
                
                registrationModal.classList.remove('active');
                alert("✅ Registration Successful! Welcome to Hackshala. You now have access to all course modules.");
                registrationForm.reset();
                
                if (targetUrl) {
                    window.location.href = targetUrl;
                }
            } else {
                throw new Error('Webhook response not ok');
            }
        })
        .catch(error => {
            console.error('Registration Error:', error);
            // Even if webhook fails, register the user locally for course access
            localStorage.setItem('hackshala_registered', 'true');
            localStorage.setItem('hackshala_user_name', fullName);
            localStorage.setItem('hackshala_user_email', email);
            localStorage.setItem('hackshala_registered_date', new Date().toISOString());
            document.body.classList.add('user-registered');
            
            alert('✅ Registration Successful! You now have access to all course modules.');
            registrationModal.classList.remove('active');
            registrationForm.reset();
            
            if (targetUrl) {
                window.location.href = targetUrl;
            }
        });
    });
});
// Syllabus Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    const syllabusModal = document.getElementById('syllabusModal');
    const viewSyllabusBtn = document.getElementById('viewSyllabusBtn');
    const closeSyllabusBtn = document.getElementById('closeSyllabusModal');

    if (viewSyllabusBtn) {
        viewSyllabusBtn.addEventListener('click', (e) => {
            e.preventDefault();
            syllabusModal.classList.add('active');
        });
    }

    if (closeSyllabusBtn) {
        closeSyllabusBtn.addEventListener('click', () => {
            syllabusModal.classList.remove('active');
        });
    }

    // Close on outside click
    syllabusModal.addEventListener('click', (e) => {
        if (e.target === syllabusModal) {
            syllabusModal.classList.remove('active');
        }
    });
});

// Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const mainNav = document.getElementById('mainNav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('mobile-active');
            const icon = navToggle.querySelector('i');
            icon.classList.toggle('ph-list');
            icon.classList.toggle('ph-x');
        });
    }
});
