/**
 * Course Access Control
 * Manages user registration and course module access
 */

/**
 * Check if user is registered
 */
function isUserRegistered() {
    return localStorage.getItem('hackshala_registered') === 'true';
}

/**
 * Get registered user info
 */
function getUserInfo() {
    return {
        name: localStorage.getItem('hackshala_user_name') || 'Student',
        email: localStorage.getItem('hackshala_user_email') || '',
        registeredDate: localStorage.getItem('hackshala_registered_date') || ''
    };
}

/**
 * Initialize course access on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    const isRegistered = isUserRegistered();
    
    if (isRegistered) {
        // Mark page as registered user
        document.body.classList.add('user-registered');
        
        // Show user greeting in header
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            const user = getUserInfo();
            const greeting = document.createElement('div');
            greeting.className = 'user-greeting';
            greeting.innerHTML = `<small>Welcome, ${user.name}! 👋</small>`;
            // Insert greeting before the action buttons
            headerActions.insertBefore(greeting, headerActions.firstChild);
        }
        
        // Unlock course content
        unlockCourseContent();
    } else {
        // Lock course content if not registered
        lockCourseContent();
    }
});

/**
 * Lock course-related content
 */
function lockCourseContent() {
    // Add locked state to body
    document.body.classList.add('course-locked');
    
    // Hide premium course modules
    const courseModules = document.querySelectorAll('[data-course-premium]');
    courseModules.forEach(module => {
        module.style.opacity = '0.5';
        module.style.pointerEvents = 'none';
        
        const lockBadge = document.createElement('div');
        lockBadge.innerHTML = '🔒 Register to Access';
        lockBadge.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: #00d2ff;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10;
        `;
        module.style.position = 'relative';
        module.appendChild(lockBadge);
    });
}

/**
 * Unlock course content for registered users
 */
function unlockCourseContent() {
    // Remove locked state
    document.body.classList.remove('course-locked');
    
    // Make all course modules accessible
    const courseModules = document.querySelectorAll('[data-course-premium]');
    courseModules.forEach(module => {
        module.style.opacity = '1';
        module.style.pointerEvents = 'auto';
        
        // Remove any lock badges
        const lockBadge = module.querySelector('[style*="absolute"]');
        if (lockBadge) {
            lockBadge.remove();
        }
    });
}

/**
 * Clear registration (for testing or logout)
 */
function clearRegistration() {
    if (confirm('Are you sure you want to clear your registration?')) {
        localStorage.removeItem('hackshala_registered');
        localStorage.removeItem('hackshala_user_name');
        localStorage.removeItem('hackshala_user_email');
        localStorage.removeItem('hackshala_registered_date');
        location.reload();
    }
}

// Add global access for debugging
window.courseAccess = {
    isRegistered: isUserRegistered,
    getUserInfo: getUserInfo,
    clearRegistration: clearRegistration
};
