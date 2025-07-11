# API Routes

## Folder Structure

```bash
backend/
|
├── config/
│   └── db.js                        # MongoDB connection setup
│
├── controllers/
│   ├── account.controller.js        # Account-related logic (CRUD, balance)
│   ├── auth.controller.js           # Authentication (register, login, logout, etc.)
│   └── upi.controller.js            # UPI creation and management
│
├── lib/
│   ├── errorLog/
│   │   └── error.status.js          # Custom error status formatting
│   │
│   ├── success/
│   │   └── success.response.js      # Standard success response structure
│   │
│   └── validators/
│       └── auth.validation.js       # Joi/Yup or custom validators for auth
│
├── middleware/
│   └── auth.middleware.js           # Auth token checking, protected routes
│
├── models/
│   ├── account.model.js             # Account schema (accNo, balance, etc.)
│   ├── fraud.model.js               # Fraud detection (if applicable)
│   ├── transaction.model.js         # Transaction schema (senderUPI, receiverUPI)
│   ├── upi.model.js                 # UPI schema (upiId, linkedUpi, isActive)
│   └── user.model.js                # User schema (email, password, etc.)
│
├── routes/
│   ├── account.routes.js            # Routes for /api/account
│   ├── auth.routes.js               # Routes for /api/auth
│   └── upi.routes.js                # Routes for /api/upi
```

---
## Authentication
  - POST: `/api/auth/signup`  
  - POST: `/api/auth/login`
  - GET: `/api/auth/logout`

## Account
  - POST: `/api/account/create`
  - GET: `/api/account/:userId`
  - GET: `/api/account/:accNo`

## UPI
  - POST: `/api/upi/add`
  - GET: `/api/upi/:userId`

(To be edited later)


