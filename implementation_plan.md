# Monthly Subscription Implementation Plan

This document outlines the steps to build a monthly subscription system so you can charge Gym Owners (Users) a flat fee (e.g., ₹999/month) to access your platform.

## User Review Required

> [!IMPORTANT]
> **Pricing Decision:** Before we begin, please confirm how much you want to charge per month (e.g., ₹999). 
> **Payment Type:** We will start with a "Manual Renewal" model. This means the gym owner pays ₹999, which gives them exactly 30 days of access. When 30 days are up, they are locked out until they click "Pay" again. This is much easier to build than an automatic-recurring charge (which requires complex RBI mandate compliance). Are you okay with this?

## Open Questions

> [!WARNING]
> Do you already have a Razorpay account created and API Keys ready for *your* platform? (These will go in the `.env` file).

## Proposed Changes

---

### 1. Database Updates
We need to track when a gym owner's subscription expires.

#### [MODIFY] `backend/src/models/user.model.js`
Add the following fields to the User schema:
*   `isSubscribed`: Boolean (default: false)
*   `subscriptionExpiresAt`: Date (default: null)

---

### 2. Backend Payment API
We need to create endpoints to generate a Razorpay order for the subscription fee and verify the payment.

#### [NEW] `backend/src/controllers/subscription.controller.js`
*   `createSubscriptionOrder`: Generates a Razorpay order for ₹999.
*   `verifySubscriptionPayment`: Takes the Razorpay signature, verifies it, and updates the User's `subscriptionExpiresAt` to `Date.now() + 30 days`.

#### [NEW] `backend/src/routes/subscription.routes.js`
*   Add routes for the above controller functions and link them to `app.js`.

---

### 3. Access Control (Middleware)
We need to ensure that if a gym owner hasn't paid, they can't access the core features (like adding members or viewing posts).

#### [MODIFY] `backend/src/middlewares/auth.middleware.js`
*   Add a new middleware function: `requireSubscription`.
*   This will check if `req.user.subscriptionExpiresAt` is in the past. If it is, the API will return a `403 Payment Required` error.

---

### 4. Frontend Billing UI
The gym owner needs a place to see their status and pay.

#### [NEW] `frontend/src/features/billing/pages/BillingPage.jsx`
*   A new page in the Dashboard showing:
    *   Current Status: "Active" or "Expired"
    *   Time remaining: "Expires in 12 days"
    *   A "Renew Subscription (₹999)" button.
*   Clicking the button will open the standard Razorpay checkout widget.

#### [MODIFY] `frontend/src/features/posts/pages/DashboardPage.jsx`
*   Add a link to the new "Billing/Subscription" page in the sidebar navigation.
*   Optionally, show a warning banner at the top of the dashboard if their subscription is expiring in less than 3 days.

## Verification Plan

### Manual Verification
1. Log in as a User.
2. Attempt to use the app (it should block you or redirect to Billing).
3. Go to the Billing page and complete a test payment using Razorpay Test Mode.
4. Verify the database updates the expiry date to +30 days.
5. Verify you now have full access to the dashboard.
