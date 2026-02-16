Security note: This project now includes a hardcoded superadmin account for convenience per a requested change.

Superadmin credentials (hardcoded in src/controllers/auth.controller.js):
- Email: superadmin@prosaas.local
- Password: SuperSecret123!

Usage:
- POST /api/auth/login with the credentials above will return a JWT for the superadmin.
- The superadmin is a virtual user and is not stored in the database; do not attempt to register with the reserved email.

Warning: Hardcoding credentials is insecure for production. Remove these credentials or protect them with environment variables before deploying to any public environment.
