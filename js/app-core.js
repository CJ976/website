// Core Application Logic - Obfuscated
const _0x1a2b = ['\x61\x63\x74\x69\x76\x65', '\x67\x65\x74\x49\x74\x65\x6d', '\x68\x61\x63\x6b\x73\x68\x61\x6c\x61\x5f\x75\x73\x65\x72', '\x61\x64\x64\x45\x76\x65\x6e\x74\x4c\x69\x73\x74\x65\x6e\x65\x72', '\x63\x6c\x69\x63\x6b', '\x70\x72\x65\x76\x65\x6e\x74\x44\x65\x66\x61\x75\x6c\x74', '\x67\x65\x74\x41\x74\x74\x72\x69\x62\x75\x74\x65', '\x68\x72\x65\x66', '\x61\x64\x64', '\x72\x65\x6d\x6f\x76\x65', '\x73\x75\x62\x6d\x69\x74', '\x76\x61\x6c\x75\x65', '\x6c\x6f\x67', '\x52\x65\x67\x69\x73\x74\x72\x61\x74\x69\x6f\x6e\x3a', '\x61\x74\x6f\x62', '\x61\x48\x52\x30\x63\x48\x4d\x36\x4c\x79\x39\x6b\x61\x58\x4e\x6a\x62\x33\x4a\x6b\x4c\x6d\x4e\x76\x62\x53\x39\x68\x63\x47\x6b\x76\x64\x32\x56\x69\x61\x47\x39\x76\x61\x33\x4d\x76\x4d\x54\x51\x31\x4e\x54\x51\x35\x4e\x54\x67\x35\x4d\x54\x51\x32\x4e\x44\x41\x35\x4e\x7a\x67\x78\x4e\x43\x39\x6c\x4e\x45\x45\x78\x63\x6b\x64\x56\x4e\x30\x31\x70\x63\x6a\x68\x54\x4e\x46\x64\x35\x61\x6e\x68\x56\x54\x31\x4a\x34\x51\x6c\x70\x73\x5a\x54\x41\x78\x65\x55\x6c\x4e\x51\x32\x31\x68\x52\x30\x6c\x50\x56\x45\x52\x59\x4d\x56\x56\x43\x57\x55\x6c\x4b\x5a\x6d\x74\x71\x51\x38\x4e\x4a\x52\x58\x70\x30\x4e\x45\x56\x46\x63\x6d\x78\x32\x61\x7a\x6c\x4b']; const _0x2b3c = function (_0x4d5e, _0x5f6g) { _0x4d5e = _0x4d5e - 0x0; let _0x7h8i = _0x1a2b[_0x4d5e]; return _0x7h8i; }; document[_0x2b3c('0x3')]('DOMContentLoaded', () => { const _0x9j0k = document['getElementById']('registrationModal'), _0x1l2m = document['getElementById']('closeModal'), _0x3n4o = document['getElementById']('registrationForm'), _0x5p6q = document['querySelectorAll']('.btn-primary[href^="watch.html"]'); let _0x7r8s = ''; const _0x9t0u = localStorage[_0x2b3c('0x1')](_0x2b3c('0x2')); _0x5p6q['forEach'](_0x1v2w => { _0x1v2w[_0x2b3c('0x3')](_0x2b3c('0x4'), _0x3x4y => { _0x3x4y[_0x2b3c('0x5')](); _0x7r8s = _0x1v2w[_0x2b3c('0x6')](_0x2b3c('0x7')); _0x9j0k['classList'][_0x2b3c('0x8')](_0x2b3c('0x0')); }); }); _0x1l2m[_0x2b3c('0x3')](_0x2b3c('0x4'), () => { _0x9j0k['classList'][_0x2b3c('0x9')](_0x2b3c('0x0')); }); _0x3n4o[_0x2b3c('0x3')](_0x2b3c('0x0a'), _0x5z6a => { _0x5z6a[_0x2b3c('0x5')](); const _0x7b8c = document['getElementById']('fullName')[_0x2b3c('0x0b')], _0x9d0e = document['getElementById']('email')[_0x2b3c('0x0b')], _0x1f2g = document['getElementById']('phone')[_0x2b3c('0x0b')], _0x3h4i = document['getElementById']('interest')[_0x2b3c('0x0b')]; console[_0x2b3c('0x0c')](_0x2b3c('0x0d'), { name: _0x7b8c, email: _0x9d0e, phone: _0x1f2g, interest: _0x3h4i }); const _0x5j6k = window[_0x2b3c('0x0e')](_0x2b3c('0x0f')); const _0x7l8m = { content: "🚀 **New Registration Received!**", embeds: [{ title: "New Student Registration", color: 0x00ff9d, fields: [{ name: "👤 Name", value: _0x7b8c, inline: true }, { name: "📧 Email", value: _0x9d0e, inline: true }, { name: "📱 Phone", value: _0x1f2g, inline: true }, { name: "🎯 Interest", value: _0x3h4i, inline: true }], footer: { text: "Hackshala Registration System" }, timestamp: new Date().toISOString() }] }; fetch(_0x5j6k, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(_0x7l8m) })['catch'](_0x9n0p => console['error']('Webhook Error:', _0x9n0p)); localStorage['setItem'](_0x2b3c('0x2'), 'true'); _0x9j0k['classList'][_0x2b3c('0x9')](_0x2b3c('0x0')); if (_0x7r8s) { window['location'][_0x2b3c('0x7')] = _0x7r8s; } else { alert("Registration Successful! Welcome to Hackshala."); } }); });
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
