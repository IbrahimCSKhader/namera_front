# Handmade Resin Gifts Frontend

React + TypeScript + Vite frontend for an Arabic RTL handmade gifts store.

## Features

- Responsive home page inspired by the Stitch resin boutique references
- Login with phone number, email, or username
- Register flow with full name, phone, address, optional email, password confirmation, and terms approval
- Auth context with token persistence
- Protected customer and owner routes
- Customer profile page

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- CSS variables
- Vitest

## Local Setup

Install packages:

```powershell
npm install
```

Required environment variable:

```text
VITE_API_BASE_URL=http://localhost:5074/api
```

Run the frontend:

```powershell
npm run dev
```

Build:

```powershell
npm run build
```

Run tests:

```powershell
npm test
```

## Security Notes

Do not commit real API URLs for private environments, tokens, certificates, private keys, or local environment files.
