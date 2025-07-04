# Status Code Summary

| Code | Meaning               | When It Occurs (in your project)                                   |
| ---- | --------------------- | ------------------------------------------------------------------ |
| 200  | OK                    | Successful request (e.g., login, get profile)                      |
| 201  | Created               | Resource created (e.g., user registered)                           |
| 400  | Bad Request           | Missing or invalid fields in request                               |
| 401  | Unauthorized          | Invalid or missing token (JWT)                                     |
| 404  | Not Found             | Resource (e.g., user or endpoint) doesn't exist                    |
| 409  | Conflict              | Email or UPI ID already exists                                     |
| 500  | Internal Server Error | Unexpected backend crash or DB error                               |
| 501  | Not Implemented       | Endpoint defined but logic not yet implemented                     |
| 502  | Bad Gateway           | Typically when a service (e.g., fraud API) fails or is unreachable |

