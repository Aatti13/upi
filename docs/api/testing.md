# Testing Guidelines

## Postman Folder Structure

  ```bash
  UPI/
  ├── Authentication/
  │   ├── POST User Signup         # Registers a new user
  │   ├── POST User Login          # Authenticates and returns tokens
  │   └── GET User Logout          # Invalidates session or token
  │
  ├── UPI Testing/
  │   ├── POST Add UPI             # Links a new UPI to user/account
  │   ├── GET Get UPI by User ID   # Retrieves UPI by user ID
  │   └── GET Get UPI by Account No. # Retrieves UPI by account number
  │
  ├── Transactions/
  │   └── (empty)                 # No requests added yet (To be done later)
  │
  └── Fraud/
      └── (empty)                 # No requests added yet (To be done later)
  ```

