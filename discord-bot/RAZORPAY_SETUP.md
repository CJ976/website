# How to Connect Razorpay Payments to Discord Notifications

Since Razorpay processes payments on their own secure page, you need to tell Razorpay to send notifications directly to your Discord webhook.

**You must do this in your Razorpay Dashboard. No coding is needed on the website.**

## 🛑 Critical Step: Modify Your Webhook URL
Discord webhooks don't understand Razorpay's format by default. You need to add `/slack` to the end of your URL so Discord can read it.

**Your Original URL:**
`https://discord.com/api/webhooks/1455521394568728620/nnvlFz4v8R7Ih862YOW206h_RxL-oY4i-aQY-nzVkTFPcymFcR9-tEmg4bSuibzyVy2X`

**✅ Use This URL Instead (added `/slack`):**
`https://discord.com/api/webhooks/1455521394568728620/nnvlFz4v8R7Ih862YOW206h_RxL-oY4i-aQY-nzVkTFPcymFcR9-tEmg4bSuibzyVy2X/slack`

---

## 🚀 Step-by-Step Setup Guide

### 1. Log in to Razorpay Dashboard
Go to [https://dashboard.razorpay.com](https://dashboard.razorpay.com) and log in.

### 2. Go to Webhook Settings
1. Look at the left sidebar menu.
2. Go to **Settings** (usually at the bottom) → **Webhooks**.
3. Click the blue **+ Add New Webhook** button.

### 3. Enter Webhook Details
Fill in the form with these exact settings:

- **Webhook URL:** Paste the URL ending in `/slack` (from above).
- **Secret:** (Optional) You can leave this blank or type `hackshala`.
- **Alert Email:** (Optional) Enter your email.

### 4. Select Active Events
This determines *when* you get a notification. Check these boxes:

- [x] `payment.captured` (Best one - confirms successful payment)
- [x] `payment.failed` (Good to know if someone tried but failed)
- [x] `order.paid` (If available)

### 5. Save
Click **Create Webhook**.

---

## ✅ Test It
1. Use a test payment link or make a small ₹1 payment.
2. Check your Discord channel.
3. You should see a message from Razorpay with the payment details!

## 💡 Troubleshooting
**"I don't see notifications!"**
- Did you add `/slack` to the end of the URL?
- Did you select `payment.captured` in events?
- Check Discord channel permissions (ensure the webhook works).

**"The message looks ugly/JSON format"**
- This is normal without a custom backend. The `/slack` trick makes it readable enough to see the **Amount** and **Customer Details**.

---
*Note: This directly connects Razorpay to Discord. Your website code doesn't need to change.*
