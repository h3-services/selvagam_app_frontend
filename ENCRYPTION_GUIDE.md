# Security & Encryption Documentation

This document outlines the security measures and encryption protocols implemented within the **Selvagam Admin Portal** to protect sensitive user data, specifically passwords for Parents and Drivers.

## 1. Governance & Overview

The system employs a centralized security utility layer to ensure consistent data protection across all modules. This prevents sensitive information from being transmitted or stored in plain text.

- **Central Utility**: `src/utils/security.js`
- **Library**: [CryptoJS](https://www.npmjs.com/package/crypto-js)
- **Algorithm**: AES-256 (Advanced Encryption Standard)

## 2. Encryption Implementation

### A. Central Security Utility (`securityUtils`)

The `securityUtils` object provides three primary methods:

| Method            | Purpose                                       | Technical Logic                               |
| :---------------- | :-------------------------------------------- | :-------------------------------------------- |
| `encrypt(text)`   | Protects data before API transmission         | AES encryption with a system-wide secret key. |
| `decrypt(cipher)` | Retrieves original data for system processing | AES decryption using the same secret key.     |
| `hash(password)`  | One-way protection (non-reversible)           | SHA-256 hashing.                              |

### B. Active Encryption Zones

Encryption is automatically triggered at the **Service Layer** to ensure that components do not need to handle cryptographic logic.

#### Parent Management (`parentService.js`)

- **Creation**: When a parent is registered, the password is encrypted before being sent to the `/parents` endpoint.
- **Updates**: Any password modification is encrypted before submission.

#### Driver Management (`driverService.js`)

- **Registration**: Driver credentials are encrypted before hitting the `/drivers` API.
- **Maintenance**: Updates to driver profiles follow the same encryption standard.

## 3. Data Flow Example

1. **User Input**: Admin enters a password (e.g., `Welcome@123`) in the "Add Parent" form.
2. **Service Call**: `parentService.createParent(data)` is called.
3. **Encryption**: The service calls `securityUtils.encrypt('Welcome@123')`.
4. **Result**: The password becomes an unreadable string (e.g., `U2FsdGVkX1+...`).
5. **API Post**: The encrypted string is sent to the server.

## 4. Key Management

The system currently uses a consistent secret key: `selvagam-admin-secure-key-2026`.

> [!IMPORTANT]
> **Production Recommendation**:
> In a production environment, this key should be moved to an environment variable (`.env`) and never committed to the repository to prevent unauthorized decryption access.

## 5. Summary Table

| Category             | Protection Level           | Status    |
| :------------------- | :------------------------- | :-------- |
| **Parent Passwords** | AES-256 Encrypted          | ✅ Active |
| **Driver Passwords** | AES-256 Encrypted          | ✅ Active |
| **Admin Logins**     | Plain Text (Firestore)     | ℹ️ Legacy |
| **API Transmission** | HTTPS + Payload Encryption | ✅ Active |

---

_Last Updated: February 2026_
