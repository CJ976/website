(function () {
    // 1. Inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
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
            background: #0f172a; /* Matches dark theme */
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
    document.head.appendChild(style);

    // 2. Inject HTML
    const widget = document.createElement('div');
    widget.className = 'hackshala-feedback-widget';
    widget.innerHTML = `
        <div class="feedback-box" id="feedbackBox">
            <div class="feedback-header">
                <h3><i class="ph-fill ph-chat-circle-text"></i> Support & Feedback</h3>
                <button class="feedback-close" id="feedbackClose"><i class="ph ph-x"></i></button>
            </div>
            <div class="feedback-body">
                <form id="feedbackForm">
                    <div class="feedback-input-group">
                        <label for="fbQuery">How can we help you?</label>
                        <textarea id="fbQuery" class="feedback-input" rows="4" placeholder="Describe your issue or feedback..." required></textarea>
                    </div>
                    <div class="feedback-input-group">
                        <label for="fbContact">Contact Info (Discord/Email)</label>
                        <input type="text" id="fbContact" class="feedback-input" placeholder="So we can reply to you (optional)">
                    </div>
                    <button type="submit" class="feedback-submit">Send Message <i class="ph-bold ph-paper-plane-right"></i></button>
                </form>
                <div class="feedback-success" id="feedbackSuccess">
                    <i class="ph-fill ph-check-circle"></i>
                    <h3>Message Sent!</h3>
                    <p style="color: #94a3b8; font-size: 0.9rem; margin-top: 8px;">Thanks for reaching out. We'll get back to you soon.</p>
                </div>
            </div>
        </div>
        <div class="feedback-toggle" id="feedbackToggle">
            <i class="ph-fill ph-chat-teardrop-dots"></i>
        </div>
    `;
    document.body.appendChild(widget);

    // 3. Logic
    const toggle = document.getElementById('feedbackToggle');
    const box = document.getElementById('feedbackBox');
    const close = document.getElementById('feedbackClose');
    const form = document.getElementById('feedbackForm');
    const success = document.getElementById('feedbackSuccess');

    const toggleBox = () => {
        box.classList.toggle('active');
        const icon = toggle.querySelector('i');
        if (box.classList.contains('active')) {
            icon.classList.remove('ph-chat-teardrop-dots');
            icon.classList.add('ph-x');
        } else {
            icon.classList.remove('ph-x');
            icon.classList.add('ph-chat-teardrop-dots');
        }
    };

    toggle.addEventListener('click', toggleBox);
    close.addEventListener('click', toggleBox);

    // Webhook URL
    const WEBHOOK_URL = 'https://discord.com/api/webhooks/1455492655273214073/OiSLZmQPQX_SCCPy2lKn7dVNdGozKZscvEsoDX-KsqpumAaF-sWUFvb0KmXTvhNnyNSo';

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const query = document.getElementById('fbQuery').value;
        const contact = document.getElementById('fbContact').value || 'Anonymous';
        const submitBtn = form.querySelector('button[type="submit"]');

        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;

        const payload = {
            content: "📨 **New Website Feedback/Query**",
            embeds: [{
                title: "Feedback Received",
                color: 0x3b82f6, // Blue
                fields: [
                    { name: "❓ Query/Feedback", value: query },
                    { name: "👤 Contact", value: contact, inline: true },
                    { name: "📄 Page", value: window.location.pathname, inline: true }
                ],
                footer: { text: "Hackshala Support Bot" },
                timestamp: new Date().toISOString()
            }]
        };

        fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(() => {
                form.style.display = 'none';
                success.style.display = 'block';
                setTimeout(() => {
                    toggleBox();
                    // Reset form after closing
                    setTimeout(() => {
                        form.reset();
                        form.style.display = 'block';
                        success.style.display = 'none';
                        submitBtn.innerHTML = 'Send Message <i class="ph-bold ph-paper-plane-right"></i>';
                        submitBtn.disabled = false;
                    }, 500);
                }, 3000);
            })
            .catch(err => {
                console.error(err);
                alert('Failed to send message. Please try again.');
                submitBtn.innerHTML = 'Send Message <i class="ph-bold ph-paper-plane-right"></i>';
                submitBtn.disabled = false;
            });
    });

})();
