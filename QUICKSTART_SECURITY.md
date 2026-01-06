# Quick Start: Security Configuration Guide

## Step 1: Set Up Environment Variables

### For Web Application (Frontend)

1. Copy the template:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Discord webhook URLs:
```bash
# Get these from your Discord server:
# 1. Go to Server Settings → Webhooks
# 2. Create new webhooks (one for registrations, one for feedback)
# 3. Copy the full webhook URLs

VITE_REGISTRATION_WEBHOOK=https://discord.com/api/webhooks/YOUR_ID/YOUR_TOKEN
VITE_FEEDBACK_WEBHOOK=https://discord.com/api/webhooks/YOUR_ID/YOUR_TOKEN
```

### For Discord Bot

1. Ensure Discord bot token is in `.env`:
```bash
# Get from Discord Developer Portal: Applications → Your Bot → Token
DISCORD_TOKEN=YOUR_BOT_TOKEN_HERE

# These can stay as default or customize:
PREMIUM_ROLE_NAME=Premium
ADMIN_ROLE_NAME=Admin
```

2. **IMPORTANT**: Never commit `.env` file with actual secrets!
   - It's already in `.gitignore`
   - Verify: `git status | grep .env` should show nothing

---

## Step 2: Get Discord Webhook URLs

### Creating a Discord Webhook

1. Open your Discord server
2. Go to: **Server Settings** → **Integrations** → **Webhooks**
3. Click **New Webhook**
4. Name it (e.g., "Hackshala Registration" or "Hackshala Feedback")
5. Choose which channel it posts to
6. Click **Copy Webhook URL**
7. Paste into `.env` file

**Example URL**: `https://discord.com/api/webhooks/123456789/abcdefghijk`

---

## Step 3: Get Discord Bot Token

### Creating a Discord Bot Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **New Application**
3. Name it "Hackshala Bot"
4. Go to **Bot** section
5. Click **Add Bot**
6. Under TOKEN, click **Copy**
7. Paste into `.env` as `DISCORD_TOKEN`

**IMPORTANT**: 
- ⚠️ Never share this token
- ⚠️ Never commit it to Git
- If leaked, regenerate immediately in Developer Portal

### Bot Permissions

Ensure your bot has these permissions in your Discord server:
- Manage Roles
- Send Messages
- Embed Links
- Read Message History

---

## Step 4: Web Server Configuration

### For Apache

Create/edit `.htaccess` in your website root:

```apache
# Enable HTTPS
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# Security Headers
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' https://unpkg.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://discord.com"
Header always set Permissions-Policy "microphone=(), camera=(), geolocation=()"
```

### For Nginx

Edit your nginx configuration:

```nginx
server {
    listen 443 ssl http2;
    
    # SSL certificates (get from Let's Encrypt)
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Security Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://unpkg.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://discord.com" always;
    add_header Permissions-Policy "microphone=(), camera=(), geolocation=()" always;
}
```

---

## Step 5: Test Everything

### Test Web Forms

1. Open your website in a browser
2. Try the registration form:
   - Invalid email → Should show error
   - Valid email → Should submit and show success
3. Try the feedback widget:
   - Too short feedback → Should show error
   - Valid feedback → Should submit and show success
4. Check your Discord server - messages should appear!

### Test Discord Bot

1. In your Discord server, type: `/verify`
2. Should autocomplete as a slash command
3. Test with a valid user ID
4. Verify the user gets the premium role

---

## Step 6: Monitor Logs

### Web Application

Logs are in the browser console. Check for:
- ✅ `Config validation passed` 
- ✅ No errors about missing webhook URLs

### Discord Bot

Logs are in `discord-bot/bot.log`. Check for:
- ✅ `Bot logged in as...`
- ✅ `Synced X slash command(s)`
- 📝 Any errors or warnings

View live logs:
```bash
cd discord-bot
tail -f bot.log
```

---

## Security Checklist

- [ ] `.env` file created and filled with actual values
- [ ] `.env` is in `.gitignore` and not committed
- [ ] Discord webhook URLs are valid and tested
- [ ] Discord bot token is valid
- [ ] HTTPS enabled on web server
- [ ] Security headers configured on web server
- [ ] Form submissions tested and working
- [ ] Discord bot commands tested and working
- [ ] Logs created and monitoring configured
- [ ] No secrets visible in browser console

---

## Troubleshooting

### "Webhook URL not configured" Error

**Problem**: Forms won't submit
**Solution**: 
1. Check `.env` file exists
2. Verify webhook URL is filled in
3. For web apps, rebuild/restart server to load new `.env`
4. Check browser console for specific error

### Discord Bot Not Responding

**Problem**: Bot doesn't appear or commands don't work
**Solution**:
1. Verify bot token in `.env` is correct
2. Check Discord server has bot as member
3. Verify bot has required permissions
4. Check `bot.log` for errors
5. Restart bot: `python bot.py`

### "Invalid User ID" Error

**Problem**: `/verify` command fails
**Solution**:
1. Make sure you're providing a Discord user ID (not username)
2. Get ID by right-clicking user in Discord (if dev mode on)
3. ID should be a long number, not a name

### HTTPS Certificate Issues

**Problem**: Browser shows "Not Secure"
**Solution**:
1. Get free certificate from [Let's Encrypt](https://letsencrypt.org/)
2. Use `certbot` for automation
3. Ensure `.well-known` directory is accessible

---

## Rotating Secrets (If Leaked)

If any secret is accidentally exposed:

### Webhook URL
1. Go to Discord Server Settings → Webhooks
2. Delete the exposed webhook
3. Create a new one
4. Update `.env` file

### Bot Token
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your bot application
3. Go to Bot section
4. Click **Regenerate** under TOKEN
5. Update `.env` file

---

## Next Steps

1. Read [SECURITY.md](./SECURITY.md) for detailed security information
2. Read [SECURITY_SUMMARY.md](./SECURITY_SUMMARY.md) for improvements made
3. Set up monitoring/alerting on your logs
4. Periodically run security audits (`npm audit`, `pip check`)
5. Keep dependencies updated

---

**Last Updated**: January 6, 2026
**Status**: Ready to Deploy
