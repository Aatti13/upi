## Authentication Testing

### User Signup
#### (POST: `/api/auth/signup`)

- **Description**
  - Allowing user to register for the service

- **Request Body**
  ```bash
  {
    "email": <User Email>,
    "name": <Customer Name>,
    "password": "*****",
    "phoneNo": "xxx-xx-xxxxx"
  }
  ```

- **Success Response:** `Code: 201`
  ```bash
  {
    success: true,
    ...User Details
  }
  ```
- **Error Response:** `Code(s): 400/401/409/500`
  ```bash
  {
    success: false,
    ...error,
    ...message
  }
  ```

- **Testing Conditions**
    - if all mandatory fields filled
    - Email Validation
    - password length check (OPTIONAL: Discuss Password Strength Standards)
    - Phone Number Validation
    - if user already exists (based on email)
    - if mobile number already in use

---
### User Login
#### (POST: `/api/auth/login`)

- **Description**
  - Allowing user to login into their accounts

- **Request Body**
  ```bash
  {
    "phoneNo": "xxx-xx-xxxxx"
    "password": "*****",
  }
  ```

- **Success Response:** `Code: 201`
  ```bash
  {
    success: true,
    ...User Details
  }
  ```
- **Error Response:** `Code(s): 401/404/500`
  ```bash
  {
    success: false,
    ...error,
    ...message
  }
  ```
- **Testing Conditions**
    - if all mandatory fields filled
    - password length check (OPTIONAL: Discuss Password Strength Standards)
    - Phone Number Validation
    - Password Validation

---
### User Logout
#### (GET: `/api/auth/logout`)

- **Description**
  - Allowing user to logout from their accounts

- **Testing**
  - In order to test in Postmam, perform this operation in the same request as Login

- **Success Response**: Cookie gets Cleared from 1 to 0
- **Error Response**: No Change in session state
