# HackShala Payment Verification Bot

A Discord bot for semi-automated premium role assignment after payment verification.

## Features

- `/verify` - Assign premium role to users after payment
- `/remove-premium` - Remove premium role (refunds, etc.)
- Automatic DM notification to verified users
- Verification logging
- Role-based permissions

## Setup Guide

### Step 1: Create Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **"New Application"** → Name it "HackShala Verifier"
3. Go to **Bot** section → Click **"Add Bot"**
4. Under **Privileged Gateway Intents**, enable:
   - ✅ Server Members Intent
   - ✅ Message Content Intent
5. Click **"Reset Token"** → Copy the token (you'll need this!)

### Step 2: Invite Bot to Server

1. Go to **OAuth2** → **URL Generator**
2. Select scopes:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Select bot permissions:
   - ✅ Manage Roles
   - ✅ Send Messages
   - ✅ Use Slash Commands
4. Copy the generated URL and open it in browser
5. Select your Discord server and authorize

### Step 3: Configure Bot

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your bot token:
   ```env
   DISCORD_TOKEN=your_actual_bot_token_here
   PREMIUM_ROLE_NAME=Premium
   ADMIN_ROLE_NAME=Admin
   ```

### Step 4: Install Dependencies

```bash
# Install Python packages
pip install -r requirements.txt
```

### Step 5: Run the Bot

```bash
python bot.py
```

You should see:
```
✅ Bot logged in as HackShala Verifier (ID: xxxxxxxxxx)
✅ Synced 2 slash command(s)
```

## Usage

### When Payment Arrives

1. **Check Payment Notification** (you already have this via webhook)
   - You'll see: User paid, Discord ID in notes

2. **Use `/verify` Command**
   ```
   /verify user_id:123456789012345678 payment_amount:₹2000 payment_reference:pay_abc123
   ```

3. **Bot Will:**
   - ✅ Find the user in Discord
   - ✅ Assign "Premium" role
   - ✅ Send confirmation DM to user
   - ✅ Log verification (if you have #verification-logs channel)

### Remove Premium (Refunds)

```
/remove-premium user_id:123456789012345678
```

## Commands Reference

| Command | Description | Required Role |
|---------|-------------|---------------|
| `/verify <user_id> <amount> [reference]` | Assign premium role | Admin |
| `/remove-premium <user_id>` | Remove premium role | Admin |
| `!ping` | Test bot connectivity | Everyone |

## Important Notes

### Role Hierarchy

The bot role **MUST** be positioned **above** the "Premium" role in Server Settings → Roles:

```
✅ Correct Order:
   1. @HackShala Verifier (Bot)
   2. @Premium
   3. @everyone

❌ Wrong Order:
   1. @Premium
   2. @HackShala Verifier (Bot)  <-- Bot can't assign roles above it!
```

### Finding Discord User ID

Users should:
1. Enable Developer Mode in Discord Settings → Advanced
2. Right-click their profile → Copy User ID
3. Include this ID in payment notes

### Verification Logs (Optional)

Create a channel named `#verification-logs` to automatically log all verifications.

## Hosting Options

### Option 1: Run on Your Computer
- Simple but requires your computer to be on 24/7
- Good for testing

### Option 2: VPS (Recommended)
- Digital Ocean, Linode, AWS EC2
- $5-10/month
- Always online

### Option 3: Free Hosting
- **Railway.app** (500 hours/month free)
- **Render.com** (free tier available)

### Deployment Example (Railway.app)

1. Create account on [Railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub"**
3. Connect your repository
4. Add environment variables:
   - `DISCORD_TOKEN` = your token
   - `PREMIUM_ROLE_NAME` = Premium
   - `ADMIN_ROLE_NAME` = Admin
5. Railway will auto-deploy!

## Troubleshooting

### Bot not responding to commands
- ✅ Check bot is online (green status)
- ✅ Bot has "Use Application Commands" permission
- ✅ Run `/verify` again to sync commands

### "I don't have permission to assign roles"
- ✅ Bot role is above Premium role
- ✅ Bot has "Manage Roles" permission

### User not found
- ✅ User has joined the Discord server
- ✅ User ID is correct (18-digit number)
- ✅ User hasn't left the server

### Commands not showing up
- Wait 5-10 minutes for Discord to sync
- Try kicking and re-inviting the bot

## Security

- ⚠️ **Never share your bot token**
- ⚠️ Keep `.env` file private (already in .gitignore)
- ⚠️ Only admins can use verification commands

## Support

If you encounter issues:
1. Check the bot logs for errors
2. Ensure all permissions are correct
3. Verify token is valid and bot is invited

## License

This bot is for HackShala's internal use.
