# Shopping Site

A full-stack shopping website built with **React, Express, Tailwind CSS, PostgreSQL**, featuring a secure and interactive shopping experience.

## Features

- ✅ Search for products
- ✅ Liked items stored in LocalStorage
- ✅ Secure cookies for authentication & security
- ✅ User authentication with PostgreSQL
- ✅ Add-to-basket functionality (currently logs item in console)
- ⬜ Implement actual basket functionality
- ⬜ Checkout & payment system (planned)
- ⬜ User profiles (planned)

## Tech Stack

### Frontend

- **React**
- **Tailwind CSS**

### Backend

- **Express.js**

### Database

- **PostgreSQL**

### Authentication & Security

- **Authentication**:

  - PostgreSQL (using JWT tokens stored in cookies)

- **Security Measures**:
  - Protection against:
    - XSS (Cross-Site Scripting)
    - CSRF (Cross-Site Request Forgery)
    - Session Hijacking
    - MITM (Man-in-the-Middle Attacks)
    - SQL Injection
    - DOS (Denial of Service)
  - **Password Security**: bcrypt (uses hash + salt to prevent Rainbow Table attacks)

### Browser Compatibility

- Browser specificity is used in the project for security and compatibility reasons, ensuring the application performs well across supported browsers.
