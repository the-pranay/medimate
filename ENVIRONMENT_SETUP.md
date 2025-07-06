# Environment Variables Configuration for MediMate

## Required Environment Variables

### Database
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation

### Agora Video Calling
- `NEXT_PUBLIC_AGORA_APP_ID` - Agora App ID (public)
- `AGORA_APP_CERTIFICATE` - Agora App Certificate (private)

### Payment Gateway (Razorpay)
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Razorpay public key
- `RAZORPAY_KEY_SECRET` - Razorpay secret key

### Email Service (Optional)
- `EMAIL_HOST` - SMTP host
- `EMAIL_PORT` - SMTP port
- `EMAIL_USER` - SMTP username
- `EMAIL_PASS` - SMTP password

## Vercel Deployment Setup

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add the following variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medimate
JWT_SECRET=your-secure-jwt-secret-key-here
NEXT_PUBLIC_AGORA_APP_ID=your-agora-app-id
AGORA_APP_CERTIFICATE=your-agora-app-certificate
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret-key
```

## Local Development Setup

1. Create a `.env.local` file in the root directory
2. Add all the environment variables listed above
3. Restart your development server

## Environment Variable Validation

The application will now provide better error messages when environment variables are missing:

- Video calls will show "Agora configuration missing" if Agora vars are not set
- Payment will show specific errors for missing Razorpay configuration
- Database connections will fail gracefully with clear error messages

## Testing

Run the test script to verify your environment setup:

```bash
node test-bug-fixes.js
```

This will test API endpoints and provide feedback on missing configurations.
