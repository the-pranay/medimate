# Razorpay Webhook Setup Guide

## Why Webhooks Are Important

The "International cards are not supported" error and other payment failures are better handled through webhooks because:

1. **Real-time notifications**: Webhooks provide instant updates about payment status
2. **Reliable error handling**: Even if the user closes the browser, webhooks ensure we capture all payment events
3. **Better user experience**: We can provide more detailed error messages and recovery options
4. **Audit trail**: All payment events are logged in the database

## Setting Up Razorpay Webhooks

### 1. Configure Webhook in Razorpay Dashboard

1. Login to your Razorpay Dashboard
2. Go to Settings → Webhooks
3. Click "Add New Webhook"
4. Set the webhook URL to: `https://your-domain.com/api/payments/webhook`
5. Select these events:
   - `payment.captured`
   - `payment.failed`
   - `payment.authorized`
   - `order.paid`
6. Save the webhook and copy the **Webhook Secret**

### 2. Add Environment Variables

Add to your `.env.local` (development) and `.env.production` (production) files:
```
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

**Note**: The webhook secret is different for test and live modes. Make sure to:
- Use the test webhook secret in `.env.local`
- Use the live webhook secret in `.env.production`

### 3. Test the Webhook

Use tools like ngrok for local development:
```bash
ngrok http 3000
```

Then use the ngrok URL in your Razorpay webhook settings.

## How It Fixes the International Card Issue

1. **Before**: Users saw generic error messages
2. **After**: Webhooks capture detailed error information including:
   - Error codes
   - Error descriptions
   - Failure reasons
   - Error sources

3. **Enhanced Error Detection**: The webhook can detect various patterns for international card errors:
   - Error descriptions containing "international" or "foreign"
   - Specific error codes like `BAD_REQUEST_ERROR`
   - Error messages about unsupported cards

## Webhook Events We Handle

### payment.failed
- Captures detailed error information
- Updates appointment status to failed
- Stores failure reason for user feedback
- Detects international card errors specifically

### payment.captured
- Confirms successful payment
- Updates appointment status to confirmed
- Stores transaction details

### order.paid
- Alternative confirmation event
- Updates payment status to paid

### payment.authorized
- For payments requiring manual capture
- Updates status to authorized

## Benefits of This Implementation

1. **Better Error Messages**: Users get specific, actionable error messages
2. **Reliable Status Updates**: Payment status is always accurate
3. **Debugging**: Detailed logs help identify payment issues
4. **User Experience**: Clear guidance on what to do when payments fail
5. **International User Support**: Specific messaging for international card issues

## Testing International Card Errors

To test international card error handling:

1. Use test cards from non-Indian banks
2. Check the webhook logs for detailed error information
3. Verify that the frontend shows appropriate error messages
4. Test that users can contact support easily

The webhook implementation ensures that even if Razorpay doesn't support international cards, users get a clear explanation and guidance on alternatives.
