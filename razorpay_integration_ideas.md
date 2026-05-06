# Razorpay Integration for Multi-Gym Platform

Since your platform hosts multiple gym owners and you want the payments to go directly to their respective bank accounts, you are essentially building a **Marketplace** or a **Multi-tenant SaaS**. 

There are **two main ways** to handle this with Razorpay. Here is a breakdown of each approach so you can decide which fits your business model best.

---

## Option 1: Dynamic API Keys (The "SaaS" Approach)
This is the simplest way to start if you just want to provide the software and don't want to touch the gym owners' money or deal with complex compliance.

**How it works:**
1. Every Gym Owner creates their own standard Razorpay account.
2. They log into your website and paste their Razorpay `Key ID` and `Key Secret` into a Settings page.
3. Your database saves these keys securely under that specific user/gym.
4. When a gym member pays, your backend fetches that specific gym's keys and processes the payment directly to them. Your platform never touches the money.

### Implementation Steps:

**1. Update Database Model:**
Add fields to store the keys in your `user.model.js` (or a `Gym` model if you have one):
```javascript
const userSchema = new mongoose.Schema({
    // ... existing fields ...
    razorpay: {
        keyId: { type: String, default: null },
        keySecret: { type: String, default: null }
    }
});
```

**2. Dynamic Order Creation (Backend):**
When creating a checkout session, use the keys from the database instead of hardcoding them in `.env`.
```javascript
const Razorpay = require('razorpay');

// Inside your payment controller
exports.createOrder = async (req, res) => {
    // 1. Find the gym owner the user is trying to pay
    const gymOwner = await User.findById(req.body.gymOwnerId);

    if (!gymOwner.razorpay.keyId) {
        return res.status(400).json({ error: "This gym has not set up payments." });
    }

    // 2. Initialize Razorpay dynamically with THEIR keys
    const instance = new Razorpay({
        key_id: gymOwner.razorpay.keyId,
        key_secret: gymOwner.razorpay.keySecret,
    });

    // 3. Create the order
    const options = {
        amount: req.body.amount * 100, // amount in smallest currency unit
        currency: "INR",
        receipt: "receipt_order_74394",
    };

    const order = await instance.orders.create(options);
    res.json({ order, keyId: gymOwner.razorpay.keyId }); 
};
```

**Pros:** 
- Extremely easy to build.
- You have zero liability for disputes/refunds (the gym owner handles it).

**Cons:** 
- You cannot automatically deduct a "platform commission" on every sale.
- Gym owners have to go through the technical step of finding their API keys and pasting them into your app.

---

## Option 2: Razorpay Route (The "Marketplace" Approach)
This is the standard way Swiggy, Zomato, or Amazon handle payments. You have one master Razorpay account, and the money gets split automatically.

**How it works:**
1. You create one Master Razorpay Account for your platform.
2. Gym owners don't need their own API keys. Instead, you onboard them to Razorpay as **Linked Accounts** via API.
3. Razorpay gives you a `Linked Account ID` (e.g., `acc_12345`) for each gym owner. You save this in your database.
4. When a member pays, they pay your master account. But in the API call, you tell Razorpay to "route" 100% (or 95%, keeping a 5% commission) to the gym owner's `Linked Account ID`.

### Implementation Steps:

**1. Update Database Model:**
```javascript
const userSchema = new mongoose.Schema({
    // ... existing fields ...
    razorpayLinkedAccountId: { type: String, default: null }
});
```

**2. Create a Transfer on Payment (Backend):**
```javascript
const Razorpay = require('razorpay');

// Initialize with YOUR platform's keys from .env
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
    const gymOwner = await User.findById(req.body.gymOwnerId);

    const options = {
        amount: req.body.amount * 100,
        currency: "INR",
        transfers: [
            {
                account: gymOwner.razorpayLinkedAccountId, // Route money here!
                amount: req.body.amount * 100, // 100% of the money (or less if you take commission)
                currency: "INR",
                on_hold: 0
            }
        ]
    };

    const order = await instance.orders.create(options);
    res.json({ order });
};
```

**Pros:**
- Better user experience for gym owners (no dealing with API keys).
- You can easily charge a percentage commission on every payment.

**Cons:**
- Harder to set up. Requires using the Razorpay Route API.
- You might have more compliance overhead since payments flow through your master account.

---

### Which should you choose?
*   If you just want to charge the gym owners a monthly subscription to use your software, and let them keep 100% of their members' fees, **Option 1 (Dynamic Keys)** is much easier to build.
*   If you want to offer your software for free but charge a 2% cut on every transaction made through your platform, you MUST use **Option 2 (Razorpay Route)**.
