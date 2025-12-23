# HaltAcademy - Free Cybersecurity Learning Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-GitHub%20Pages-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

A professional, **100% free** cybersecurity learning platform with video lessons, hands-on labs, and comprehensive resources. No login required, no paywalls, no subscriptions.

🔗 **Live Demo**: [Add your GitHub Pages URL here]

---

## ✨ Features

- 🎓 **50+ Free Video Lessons** — Structured learning path from beginner to advanced
- 🔬 **25+ Hands-On Labs** — Practice with TryHackMe, Hack The Box, and VulnHub
- 📚 **Comprehensive Resources** — Cheat sheets, tools, GitHub repos, documentation
- 🌐 **Community-Driven** — YouTube, Discord, Telegram, and GitHub communities
- 📱 **Fully Responsive** — Works perfectly on desktop, tablet, and mobile
- ⚡ **Lightning Fast** — Pure HTML/CSS/JS, no frameworks needed
- 🚀 **GitHub Pages Ready** — Deploy in minutes

---

## 📂 Project Structure

```
website/
├── index.html              # Homepage
├── roadmap.html            # Learning path with 6 progressive modules
├── watch.html              # Video player with YouTube embeds
├── labs.html               # Practical labs and exercises
├── resources.html          # Cheat sheets, tools, and documentation
├── about.html              # Mission and instructor profile
├── community.html          # Social platforms and community links
├── css/
│   └── style.css           # Main stylesheet with cyber theme
└── assets/                 # Images and media (if any)
```

---

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/haltacademy.git
   cd haltacademy
   ```

2. **Start a local server**
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Or using PHP
   php -S localhost:8000
   
   # Or using Node.js
   npx http-server
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

---

## 📦 GitHub Pages Deployment

### Option 1: Deploy from Repository Settings

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/haltacademy.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Source", select **main** branch
   - Click **Save**
   - Your site will be live at: `https://yourusername.github.io/repository-name/`

### Option 2: Deploy to Custom Domain

1. Add a `CNAME` file in the root directory:
   ```bash
   echo "yourdomain.com" > CNAME
   ```

2. Configure DNS settings at your domain registrar:
   - Add an `A` record pointing to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Or add a `CNAME` record pointing to `yourusername.github.io`

3. Enable HTTPS in GitHub Pages settings (recommended)

---

## 🎨 Customization

### Update Social Media Links

Replace placeholder links in all HTML files:

```html
<!-- Find and replace these URLs -->
<a href="https://youtube.com" target="_blank">YouTube Channel</a>
<a href="https://discord.gg" target="_blank">Discord Server</a>
<a href="https://t.me" target="_blank">Telegram Group</a>
<a href="https://instagram.com" target="_blank">Instagram</a>
<a href="https://github.com" target="_blank">GitHub</a>
```

### Add YouTube Video IDs

In `watch.html`, replace the placeholder video ID:

```html
<!-- Change this -->
<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" ...>

<!-- To your actual video ID -->
<iframe src="https://www.youtube.com/embed/YOUR_VIDEO_ID" ...>
```

### Update Instructor Bio

Edit `about.html` and replace the placeholder text:

```html
<!-- Around line 290 -->
<div class="instructor-bio">
    <p>[Replace with your actual bio]</p>
</div>
```

### Modify Color Scheme

Edit `css/style.css` to change colors:

```css
:root {
    --bg-primary: #02040a;          /* Main background */
    --bg-secondary: #0d1117;        /* Card backgrounds */
    --accent-primary: #00ffa3;      /* Neon green */
    --accent-secondary: #00d2ff;    /* Neon cyan */
    --text-primary: #f0f6fc;        /* Main text */
    --text-secondary: #8b949e;      /* Secondary text */
}
```

---

## 🛠️ Technology Stack

- **HTML5** — Semantic markup
- **CSS3** — Modern styling with animations
- **Vanilla JavaScript** — No frameworks required
- **Phosphor Icons** — Beautiful icon library
- **Google Fonts** — Inter & JetBrains Mono

---

## 📖 Course Modules

1. **Cybersecurity Basics** (Beginner)
   - CIA Triad, attack vectors, terminology
   
2. **Linux & Networking** (Beginner)
   - Command line, TCP/IP, protocols
   
3. **Reconnaissance & Scanning** (Intermediate)
   - OSINT, Nmap, enumeration
   
4. **Web Application Attacks** (Intermediate)
   - SQL injection, XSS, OWASP Top 10
   
5. **Active Directory** (Advanced)
   - Kerberos, privilege escalation, persistence
   
6. **Red Team Fundamentals** (Advanced)
   - C2 frameworks, evasion, simulations

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report bugs** — Open an issue describing the problem
2. **Suggest features** — Share ideas for improvements
3. **Submit PRs** — Fix bugs or add new features
4. **Share resources** — Contribute cheat sheets or tools
5. **Spread the word** — Star the repo and share with others

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Support the Project

If you find this project helpful:

- ⭐ **Star this repository**
- 🔗 **Share with your network**
- 📢 **Join our community** (Discord, Telegram, etc.)
- 🎥 **Subscribe to our YouTube channel**

---

## 📧 Contact

- **Website**: [Your website URL]
- **Email**: ops@haltacademy.io
- **Discord**: [Your Discord invite]
- **YouTube**: [Your YouTube channel]

---

## 🙏 Acknowledgments

- Built with inspiration from the cybersecurity community
- Special thanks to all contributors and learners
- Icons by [Phosphor Icons](https://phosphoricons.com)
- Fonts by [Google Fonts](https://fonts.google.com)

---

**Made with ❤️ for the cybersecurity community. Free education for all, forever.**
