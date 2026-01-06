// Hackshala UI Scripts - Secure & Readable

(function () {
    // Navigation Toggle Logic
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

    // NOTE: Removed ineffective client-side protections (right-click disable, F12 disable).
    // These do not provide meaningful security and obstruct legitimate development/accessibility.
    // Real security happens on the server-side.

    // Resource Filtering Logic (for resources.html)
    const filterTabs = document.querySelectorAll('.filter-tab');
    const resourceCards = document.querySelectorAll('.resource-card');
    
    if (filterTabs.length > 0 && resourceCards.length > 0) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const filterValue = tab.dataset.filter;
                
                // Update active tab
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Filter cards
                resourceCards.forEach(card => {
                    if (filterValue === 'all' || card.dataset.category === filterValue) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Labs Data & Rendering
    const labsData = []; // Add labs data here if needed

    /**
     * Renders lab cards to the specified container
     * @param {Array} labs - Array of lab objects
     * @param {string} containerId - ID of the container element
     */
    function renderLabs(labs, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        if (labs.length === 0) return;
        
        container.innerHTML = labs.map(lab => `
            <div class="lab-card">
                <div class="lab-icon"><i class="ph-bold ${lab.icon}"></i></div>
                <h3>${lab.title}</h3>
                <p>${lab.description}</p>
                <div class="lab-meta">
                    <span class="lab-badge difficulty-${lab.difficulty.toLowerCase()}">${lab.difficulty}</span>
                    <span class="lab-badge">${lab.duration}</span>
                </div>
                <a href="${lab.link}" target="_blank" class="btn btn-outline">
                    Launch Lab <i class="ph ph-arrow-square-out"></i>
                </a>
            </div>
        `).join('');
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('tryhackme-labs')) {
            renderLabs(labsData, 'tryhackme-labs');
        }
    });

})();
