# Payment Success Verification Guide

This guide explains how to check if payments are successful in the MediMate app and provides tools for testing payment flows.

## Quick Payment Status Check

### Method 1: Using the Payment Dashboard
1. Navigate to `/payment-dashboard` in your browser
2. Login with your credentials
3. View real-time payment status for all appointments
4. Click the eye icon to see detailed payment information

### Method 2: Using the Payment Status Checker Component
```javascript
import PaymentStatusChecker from './components/ui/PaymentStatusChecker';

<PaymentStatusChecker 
  appointmentId="your-appointment-id"
  onStatusChange={(status) => console.log('Status updated:', status)}
/>
```

### Method 3: Direct API Check
```javascript
const checkPaymentStatus = async (appointmentId) => {
  const token = localStorage.getItem('medimate_token');
  
  const response = await fetch(`/api/appointments/${appointmentId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  const data = await response.json();
  const appointment = data.data;
  
  console.log('Payment Status:', appointment.payment?.status);
  console.log('Appointment Status:', appointment.status);
  console.log('Transaction ID:', appointment.payment?.transactionId);
};
```

## Payment Success Indicators

### What indicates a successful payment:
1. **Payment Status**: `paid`
2. **Appointment Status**: `confirmed`
3. **Transaction ID**: Present and starts with `pay_`
4. **Paid At**: Timestamp when payment was completed
5. **Amount**: Matches the expected amount

### Payment Status Values:
- `pending`: Payment not yet completed
- `paid`: Payment successful
- `failed`: Payment failed
- `refunded`: Payment was refunded

## Testing Payment Flow

### Method 1: Using the Verification Script
```bash
# Test complete payment flow
node payment-verification.js test <appointmentId>

# Check current payment status
node payment-verification.js check <appointmentId>

# Manual verification
node payment-verification.js verify <appointmentId>
```

### Method 2: Manual Testing Steps
1. **Create an appointment** (if not already created)
2. **Navigate to payment page**: `/book-appointment`
3. **Use test card**: `4111111111111111`
4. **Complete payment process**
5. **Check payment dashboard**: `/payment-dashboard`
6. **Verify status changed to**: `paid` and `confirmed`

## Test Payment Credentials

### Test Cards (Razorpay Test Mode)
```javascript
// Success Cards
4111111111111111  // Visa
5555555555554444  // Mastercard
4000000000000002  // Visa (requires 3DS)

// Card Details
Expiry: Any future date (e.g., 12/25)
CVV: Any 3 digits (e.g., 123)
Name: Any name

// Failure Cards
4000000000000119  // Insufficient funds
4000000000000127  // Incorrect CVC
4000000000000069  // Expired card
```

### Test UPI IDs
- `success@razorpay`
- `failure@razorpay`

## Troubleshooting

### Common Issues and Solutions

#### 1. "International cards are not supported"
**Solution**: This is expected in test mode. Use the test payment helper:
- Click "View Test Cards" button
- Use provided test card numbers
- The error message includes guidance for test mode

#### 2. Payment shows as "pending"
**Check**:
- Payment signature verification
- Network connectivity
- API endpoint responses
- Database connection

#### 3. Status doesn't update after payment
**Check**:
- Payment verification endpoint (`/api/payments/verify`)
- Database write permissions
- JWT token validity
- Appointment ID correctness

### Debug Steps
1. **Check browser console** for JavaScript errors
2. **Check network tab** for API call failures
3. **Check server logs** for backend errors
4. **Use payment verification script** for automated testing

## API Endpoints for Payment Verification

### Create Payment Order
```
POST /api/payments/create-order
Headers: Authorization: Bearer <token>
Body: { appointmentId, amount }
```

### Verify Payment
```
POST /api/payments/verify
Headers: Authorization: Bearer <token>
Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId }
```

### Check Appointment Status
```
GET /api/appointments/<appointmentId>
Headers: Authorization: Bearer <token>
```

## Real-time Payment Monitoring

### Using the Payment Dashboard
- Auto-refresh every 5 seconds when enabled
- Real-time status updates
- Summary cards showing payment statistics
- Detailed transaction information

### Using the Status Checker Component
- Manual refresh button
- Automatic status polling
- Test mode indicators
- Error handling and retry logic

## Payment Success Verification Checklist

✅ **Before Testing**:
- [ ] Razorpay test keys configured in `.env.local`
- [ ] Database connection working
- [ ] JWT authentication setup
- [ ] Test user account created

✅ **During Testing**:
- [ ] Use test card numbers only
- [ ] Check test mode indicator is visible
- [ ] Verify payment helper modal works
- [ ] Complete payment flow step by step

✅ **After Testing**:
- [ ] Payment status shows as "paid"
- [ ] Appointment status shows as "confirmed"
- [ ] Transaction ID is present
- [ ] Paid timestamp is recorded
- [ ] Amount matches expected value

## Example Success Response

```json
{
  "success": true,
  "message": "Payment verified and appointment confirmed",
  "data": {
    "appointment": {
      "_id": "appointment_id",
      "status": "confirmed",
      "payment": {
        "status": "paid",
        "method": "card",
        "transactionId": "pay_xxxxxxxxx",
        "amount": 500,
        "currency": "INR",
        "paidAt": "2024-01-15T10:30:00.000Z"
      }
    },
    "paymentId": "pay_xxxxxxxxx",
    "orderId": "order_xxxxxxxxx"
  }
}
```

## Need Help?

If you encounter issues:
1. Check this guide first
2. Use the payment verification script
3. Check the payment dashboard
4. Review API responses in browser dev tools
5. Check server logs for errors

The payment system is designed to be robust with comprehensive error handling and user guidance for test mode scenarios.
