# Monthly Subscription Management Guide

## Overview

This guide explains how to manage monthly subscriptions for HackShala Premium using Discord and the verification bot.

## Subscription Lifecycle

### 1. Initial Payment (Month 1)

**When payment arrives:**

1. Check Discord payment notification (webhook)
2. Verify Discord User ID in payment notes
3. Run verification command:
   ```
   /verify user_id:123456789012345678 payment_amount:₹2000 payment_reference:pay_abc123
   ```
4. Bot assigns "Premium" role
5. User gets access to premium channels

### 2. Tracking Subscription Start Date

**Create a spreadsheet or use Discord channel:**

| Discord Name | User ID | Start Date | Next Due | Status |
|--------------|---------|------------|----------|--------|
| @user123 | 1234567890 | 2025-01-15 | 2025-02-15 | Active |
| @user456 | 9876543210 | 2025-01-20 | 2025-02-20 | Active |

**Or create a #subscription-tracker channel in Discord:**

```
📅 Subscription Started: @user123
User ID: 123456789012345678
Start Date: January 15, 2025
Next Due: February 15, 2025
Payment ID: pay_abc123
```

### 3. Monthly Renewal Reminders

**5 days before expiry**, send reminder via Discord DM or channel:

```
🔔 Subscription Renewal Reminder

Hi @user123!

Your HackShala Premium subscription expires in 5 days:
• Current expiry: February 15, 2025
• Monthly fee: ₹2000

To continue access to:
✅ Live classes
✅ Course notes
✅ THM Lab access
✅ Premium Discord channels

Please renew using: https://rzp.io/rzp/G6P9NdVH

Remember to include your Discord User ID: 123456789012345678
```

### 4. Renewal Payment Processing

**When renewal payment arrives:**

1. Check payment notification
2. Verify it's a renewal (check user already has Premium role)
3. Update tracking sheet:
   ```
   Start Date: [Keep original]
   Next Due: [Add 30 days]
   Last Payment: [Today's date]
   Status: Renewed
   ```

**No need to run /verify again** - they already have the role!

### 5. Handling Expired Subscriptions

**If no payment after 3 days grace period:**

1. Send final reminder:
   ```
   ⚠️ Subscription Expired
   
   Hi @user123,
   
   Your subscription expired on February 15, 2025.
   You have 3 days grace period to renew.
   
   After that, premium access will be removed.
   ```

2. **After grace period**, remove premium role:
   ```
   /remove-premium user_id:123456789012345678
   ```

3. Update tracking:
   ```
   Status: Expired
   Removed Date: [Today]
   ```

### 6. Re-subscription

**If user wants to come back:**

1. They pay again
2. Run `/verify` command (assigns role again)
3. Update tracking with new start date

## Automation Options

### Option A: Manual Tracking (Simple)

**Tools needed:**
- Google Sheets / Excel
- Calendar reminders

**Process:**
1. Log each payment in spreadsheet
2. Set calendar reminder for renewal date
3. Send manual reminders
4. Remove roles manually if expired

### Option B: Semi-Automated (Recommended)

**Tools:**
- Discord bot (you have this)
- Google Sheets with Apps Script
- Calendar reminders

**Process:**
1. Bot logs payments to Google Sheet
2. Apps Script sends reminder DMs automatically
3. Manual role removal if needed

### Option C: Fully Automated (Advanced)

**Requires:**
- Backend server (Node.js/Python)
- Database (MongoDB/PostgreSQL)
- Cron jobs for reminders
- Auto role removal

*This requires hosting and is beyond static GitHub Pages*

## Discord Channel Structure

### Recommended Premium Channels

Create these channels for premium members:

```
📚 PREMIUM CONTENT
├── 📌 #premium-announcements (read-only)
├── 🎥 #live-classes (Zoom/Meet links)
├── 📝 #course-notes (PDFs, Google Drive)
├── 🔬 #thm-lab-access (Credentials, vouchers)
├── 🎬 #class-recordings (Video links)
├── 💬 #premium-chat (Member discussion)
├── ❓ #premium-support (1-on-1 help)
└── 💼 #career-guidance (Resumes, interviews)
```

### Channel Permissions

**For Premium Role:**
- ✅ View channels
- ✅ Send messages
- ✅ Attach files
- ✅ Read message history

**For @everyone:**
- ❌ Cannot see premium channels

## Resource Sharing Templates

### Live Class Announcement

```
🎥 LIVE CLASS ALERT

📅 Date: January 20, 2025
🕐 Time: 8:00 PM IST
📚 Topic: Web Application Penetration Testing - OWASP Top 10

🔗 Join Link: https://meet.google.com/abc-defg-hij
🔑 Meeting ID: abc-defg-hij

📖 Pre-class reading: [Link to notes]
🎯 What to bring: Kali Linux VM, Burp Suite

See you there! 🚀
```

### Course Notes Sharing

```
📝 NEW COURSE NOTES AVAILABLE

Module: Network Security Fundamentals
Topics Covered:
✅ TCP/IP Deep Dive
✅ Network Scanning with Nmap
✅ Vulnerability Assessment
✅ Firewall Evasion Techniques

📥 Download: [Google Drive Link]
📄 Format: PDF (45 pages)

Pro tip: Print these out for offline reference! 📚
```

### THM Lab Access

```
🔬 TRYHACKME LAB ACCESS

Your monthly TryHackMe voucher is ready!

🎫 Voucher Code: HACKSHALA-JAN-2025-XXXXX
🌐 Redeem at: https://tryhackme.com/redeem

Recommended Labs This Month:
• Complete Beginner Path
• Web Fundamentals
• Network Exploitation

Valid until: February 15, 2025

Happy hacking! 💻
```

### Class Recording

```
🎬 CLASS RECORDING AVAILABLE

Session: Web App Pentesting (Jan 20, 2025)
Duration: 2 hours 15 minutes

🔗 Watch: [YouTube/Drive Link]
📝 Slides: [Link]
💻 Lab Files: [Link]

Timestamps:
00:00 - Introduction
15:30 - OWASP Top 10 Overview
45:00 - SQL Injection Demo
1:30:00 - XSS Practical
2:00:00 - Q&A

⏰ Recording expires: February 20, 2025
```

## Subscription FAQs

### What if someone pays but doesn't provide Discord ID?

1. Contact them via payment email/phone
2. Ask for Discord ID
3. Once received, run `/verify`

### What if payment webhook fails?

1. Check Razorpay dashboard manually
2. Verify payment details
3. Run `/verify` manually

### Can users pause subscription?

- No automatic pause
- They can cancel and re-subscribe later
- Role will be removed if they don't pay

### Handling refund requests

1. Process refund in Razorpay
2. Run `/remove-premium user_id:xxxxx`
3. Update tracking: Status = Refunded

## Best Practices

✅ **Always verify Discord ID** before assigning role
✅ **Send welcome message** with resources after verification
✅ **Set calendar reminders** 5 days before each expiry
✅ **Keep payment log** for reference
✅ **Respond to queries** within 24 hours
✅ **Update resources** regularly
✅ **Archive old content** after 3 months

## Monthly Checklist

### Beginning of Month
- [ ] Check who needs renewal reminders
- [ ] Send renewal reminders (5 days before)
- [ ] Prepare new month's content (notes, labs)
- [ ] Schedule live classes for the month

### Mid Month
- [ ] Process new subscriptions
- [ ] Upload new course materials
- [ ] Conduct scheduled live classes

### End of Month
- [ ] Remove expired subscriptions (grace period over)
- [ ] Thank active subscribers
- [ ] Plan next month's curriculum
- [ ] Review feedback

## Support

For issues with subscription management:
1. Check bot logs for errors
2. Verify Razorpay webhook is working
3. Ensure bot has proper permissions
4. Contact Discord support for role issues

---

**Remember:** Manual monthly tracking is tedious but manageable for <50 subscribers. Consider automation when you reach 100+ members!
