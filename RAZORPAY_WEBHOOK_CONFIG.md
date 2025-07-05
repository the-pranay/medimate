# Razorpay Webhook Configuration Guide

## Quick Setup

### 1. Environment Variables Added
✅ **RAZORPAY_WEBHOOK_SECRET** has been added to both:
- `.env.local` (development)
- `.env.production` (production)

### 2. Replace Placeholder Values

**IMPORTANT**: You need to replace `your_razorpay_webhook_secret_here` with your actual webhook secrets.

#### For Development (.env.local):
```bash
RAZORPAY_WEBHOOK_SECRET=whsec_test_your_test_webhook_secret
```

#### For Production (.env.production):
```bash
RAZORPAY_WEBHOOK_SECRET=whsec_live_your_live_webhook_secret
```

## How to Get Your Webhook Secret

### Step 1: Login to Razorpay Dashboard
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Login with your credentials

### Step 2: Set Up Webhook (Development)
1. In the dashboard, go to **Settings** → **Webhooks**
2. Click **"Add New Webhook"**
3. Configure:
   - **Webhook URL**: `https://your-ngrok-url.ngrok.io/api/payments/webhook`
   - **Secret**: Leave blank (Razorpay will generate one)
   - **Events**: Select these events:
     - `payment.captured`
     - `payment.failed`
     - `payment.authorized`
     - `order.paid`
4. Click **"Create Webhook"**
5. Copy the **Webhook Secret** and update `.env.local`

### Step 3: Set Up Webhook (Production)
1. Repeat Step 2 but use your production URL:
   - **Webhook URL**: `https://new-medimate.vercel.app/api/payments/webhook`
2. Copy the **Webhook Secret** and update `.env.production`

## Why This Fixes the International Card Issue

### Current Problem:
- Users get "International cards are not supported" error
- No detailed error handling
- Poor user experience

### With Webhooks:
- Real-time payment event notifications
- Detailed error information from Razorpay
- Better error messages for users
- Automatic retry mechanisms
- Complete audit trail

## Local Development with ngrok

### Install ngrok:
```bash
npm install -g ngrok
```

### Run your Next.js app:
```bash
npm run dev
```

### In another terminal, expose your local server:
```bash
ngrok http 3000
```

### Use the ngrok URL in Razorpay webhook settings:
```
https://abc123.ngrok.io/api/payments/webhook
```

## Testing the Webhook

### 1. Check Webhook Endpoint
Visit: `http://localhost:3000/api/payments/webhook`
You should see: `{"message": "Webhook endpoint is working"}`

### 2. Test Payment Flow
1. Try booking an appointment
2. Use a test card (Razorpay provides test cards)
3. Check the webhook logs in Razorpay dashboard

### 3. International Card Testing
1. Try with an international card
2. Check that the error is now properly handled
3. User should see detailed error message with support info

## Webhook Security

The webhook secret ensures that:
- Only Razorpay can send webhooks to your endpoint
- Webhook payload is verified for authenticity
- No malicious requests can trigger false payment events

## Next Steps

1. **Replace the placeholder webhook secrets** in both environment files
2. **Test the webhook locally** using ngrok
3. **Deploy to production** and test with live webhook
4. **Monitor webhook logs** in Razorpay dashboard
5. **Test international card error handling**

## Environment Variables Summary

```bash
# .env.local (Development)
RAZORPAY_WEBHOOK_SECRET=whsec_test_your_actual_test_secret

# .env.production (Production)  
RAZORPAY_WEBHOOK_SECRET=whsec_live_your_actual_live_secret
```

## Support

If you encounter issues:
1. Check Razorpay webhook logs
2. Check your application logs
3. Verify webhook secret is correct
4. Test with Razorpay's webhook simulator
