# Nano Banana - AI Image Editor

A Next.js application for AI-powered image editing with subscription-based pricing.

## Features

- 🍌 AI-powered image editing
- 💳 Subscription-based pricing with Creem payments
- 🔐 Supabase authentication (Google & GitHub)
- 🎨 Modern UI with Tailwind CSS and ShadCN components
- 📱 Responsive design

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Authentication**: Supabase Auth
- **Payments**: Creem
- **Database**: Supabase (PostgreSQL)
- **UI Components**: ShadCN UI + Radix UI
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Supabase account
- Creem account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nano_banana
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `NEXT_PUBLIC_CREEM_PUBLIC_KEY`: Your Creem public key
- `CREEM_SECRET_KEY`: Your Creem secret key
- `NEXT_PUBLIC_SITE_URL`: Your site URL (e.g., http://localhost:3000)

4. Set up the database:
   - In your Supabase project, run the SQL migration in `supabase_migration.sql`
   - This creates the `subscriptions` table with proper RLS policies

5. Set up Creem products:
   - In your Creem dashboard, create products for your pricing plans
   - Update the `productId` values in `src/lib/payment.ts` to match your Creem product IDs

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── checkout/         # Payment checkout API
│   │   ├── verify-payment/   # Payment verification API
│   │   └── webhooks/creem/   # Creem webhook handler
│   ├── login/                # Authentication page
│   ├── pricing/              # Pricing page
│   └── payment/success/      # Payment success page
├── components/
│   └── ui/                   # ShadCN UI components
└── lib/
    ├── payment.ts            # Payment service with Creem integration
    └── supabase/             # Supabase client configuration
```

## Pricing Plans

The application includes three pricing tiers:

- **Free**: $0/month - 5 AI edits, basic features
- **Pro**: $9.99/month - Unlimited edits, advanced features
- **Enterprise**: $49.99/month - Everything + team features

## Payment Flow

1. User selects a pricing plan
2. Application creates a Creem checkout session
3. User completes payment on Creem's secure checkout
4. Creem redirects back with payment status
5. Application verifies payment and updates user subscription
6. Webhooks handle subscription lifecycle events

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run TypeScript check and ESLint

### Database Migrations

The `supabase_migration.sql` file contains the SQL to set up the subscriptions table. Run this in your Supabase SQL editor.

### Webhook Setup

Configure your Creem webhook endpoint to point to:
```
https://yourdomain.com/api/webhooks/creem
```

This handles subscription status updates automatically.

## Deployment

1. Deploy to Vercel, Netlify, or your preferred platform
2. Set environment variables in your deployment platform
3. Update `NEXT_PUBLIC_SITE_URL` to your production domain
4. Configure Creem webhook URLs to use your production domain

## License

[Your License Here]