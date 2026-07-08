# Namira Frontend

Frontend foundation for the Namira project.

This project is a React + TypeScript + Vite app prepared for:

- Arabic RTL user interface
- Login page
- Register page
- Customer profile page
- Auth context
- Protected customer and owner routes
- Shared UI components

The visual direction follows the Stitch-generated Namira / resin boutique UI reference: soft pink theme, rounded inputs, pill buttons, and RTL-first layouts.

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- CSS variables

## Project Structure

The project is organized by feature and topic:

- `src/app/router`
- `src/app/providers`
- `src/features/authentication`
- `src/features/customer`
- `src/shared/components`
- `src/shared/services`
- `src/shared/constants`
- `src/styles`

## Local Setup

Install packages:

```powershell
npm install
```

Create local environment files only when needed. Real environment files are intentionally ignored by Git.

Required environment variable:

```text
VITE_API_BASE_URL
```

Example:

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

## Security Notes

Do not commit real API URLs for private environments, tokens, certificates, private keys, or local environment files.

Ignored local files include:

- `.env`
- `.env.*`
- `*.pfx`
- `*.pem`
- `*.key`
- `*.crt`
- `*.cer`
