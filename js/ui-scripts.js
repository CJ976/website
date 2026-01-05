// Hackshala UI Scripts - Obfuscated & Unified
(function () {
    // Navigation Toggle Logic
    const _0x1a = document.getElementById('navToggle');
    const _0x1b = document.getElementById('mainNav');
    if (_0x1a && _0x1b) {
        _0x1a.addEventListener('click', () => {
            _0x1b.classList.toggle('mobile-active');
            const _0x1c = _0x1a.querySelector('i');
            _0x1c.classList.toggle('ph-list');
            _0x1c.classList.toggle('ph-x');
        });
    }

    // Site Protection (Right-click & Key combos)
    document.addEventListener('contextmenu', _0x2a => _0x2a.preventDefault());
    document.addEventListener('keydown', function (_0x2b) {
        if (_0x2b.ctrlKey && (_0x2b.key === 'u' || _0x2b.key === 'i' || _0x2b.key === 'j' || _0x2b.key === 's')) _0x2b.preventDefault();
        if (_0x2b.key === 'F12') _0x2b.preventDefault();
    });

    // Resource Filtering Logic (for resources.html)
    const _0x4a = document.querySelectorAll('.filter-tab');
    const _0x4b = document.querySelectorAll('.resource-card');
    if (_0x4a.length > 0 && _0x4b.length > 0) {
        _0x4a.forEach(_0x4c => {
            _0x4c.addEventListener('click', () => {
                const _0x4d = _0x4c.dataset.filter;
                _0x4a.forEach(_0x4e => _0x4e.classList.remove('active'));
                _0x4c.classList.add('active');
                _0x4b.forEach(_0x4f => {
                    if (_0x4d === 'all' || _0x4f.dataset.category === _0x4d) {
                        _0x4f.style.display = 'flex';
                    } else {
                        _0x4f.style.display = 'none';
                    }
                });
            });
        });
    }

    // Labs Data & Rendering
    const _0x3a = []; // Add labs data here if needed

    function _0x3b(_0x3c, _0x3d) {
        const _0x3e = document.getElementById(_0x3d);
        if (!_0x3e) return;
        if (_0x3c.length === 0) return;
        _0x3e.innerHTML = _0x3c.map(_0x3f => `
            <div class="lab-card">
                <div class="lab-icon"><i class="ph-bold ${_0x3f.icon}"></i></div>
                <h3>${_0x3f.title}</h3>
                <p>${_0x3f.description}</p>
                <div class="lab-meta">
                    <span class="lab-badge difficulty-${_0x3f.difficulty.toLowerCase()}">${_0x3f.difficulty}</span>
                    <span class="lab-badge">${_0x3f.duration}</span>
                </div>
                <a href="${_0x3f.link}" target="_blank" class="btn btn-outline">Launch Lab <i class="ph ph-arrow-square-out"></i></a>
            </div>
        `).join('');
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('tryhackme-labs')) {
            _0x3b(_0x3a, 'tryhackme-labs');
        }
    });

})();
