# DocuVault

DocuVault ek family document management project hai jisme users:

- account register/login kar sakte hain
- family create ya join kar sakte hain
- admin members add/remove kar sakte hain
- family documents upload, view, download, aur delete kar sakte hain

## Project Structure

```text
docvault/
  backend/
  frontend/docvault/
```

- `backend/`: Express + MongoDB API
- `frontend/docvault/`: React + Vite frontend

## Features

- secure authentication
- family create and join with invite code
- admin-only member management
- member-wise document library
- profile update with avatar
- responsive UI for desktop and mobile

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend `.env` mein required values:

- `PORT`
- `MONGODB_URI`
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`
- `ACCESS_TOKEN_EXPIRES_IN`
- `REFRESH_TOKEN_EXPIRES_IN`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLIENT_URL`

## Frontend Setup

```bash
cd frontend/docvault
npm install
npm run dev
```

## Default Local URLs

- backend: `http://localhost:8000` or your configured backend port
- frontend: `http://localhost:5173`

## Main Flow

1. Register a new account
2. Create a family or join using invite code
3. Admin shares invite code with members
4. Open dashboard and manage family
5. Upload and access documents per member

## Notes

- Family invite code dashboard par admin ko milta hai
- Family create karne wala user admin hota hai
- Family join karne wala user member hota hai

