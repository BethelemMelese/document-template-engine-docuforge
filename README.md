# LetterForge - Cover Letter Generator

A modern web application that helps you generate customized cover letters from reusable templates using dynamic variables. Templates are stored in a database and accessible from any device.

## Features

- 📝 **Rich Text Editor** - Write cover letters with TipTap editor
- 🔄 **Variable System** - Use `{{company}}`, `{{position}}`, `{{date}}` and more
- 📄 **Export Options** - Download as PDF or DOCX
- 📧 **Email Integration** - One-click email with pre-filled content
- 💾 **Template Management** - Save, edit, duplicate templates (stored in database)
- 🎨 **Modern UI** - Clean, Notion-inspired interface with dark mode
- 🔐 **Authentication** - Sign up / Sign in to access your templates from any device

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, TipTap, jsPDF, docx
- **Backend**: Node.js, Express, Prisma, SQLite (or PostgreSQL)
- **Auth**: JWT

## Getting Started

### 1. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd backend && npm install
```

### 2. Setup Backend

```bash
cd backend
cp .env.example .env   # Edit .env if needed (DATABASE_URL, JWT_SECRET)
npx prisma generate
npx prisma db push
```

### 3. Run Development

**Terminal 1 – Backend:**
```bash
cd backend && npm run dev
```

**Terminal 2 – Frontend:**
```bash
npm run dev
```

The frontend runs at http://localhost:5173 and proxies `/api` to the backend at http://localhost:3001.

### Build

```bash
npm run build
```

## Usage

1. **Create Template**: Write your cover letter template with variables like `{{company}}`, `{{position}}`, `{{date}}`
2. **Fill Variables**: Enter company name, position, and date
3. **Preview & Export**: Review the merged letter and download as PDF/DOCX
4. **Email Apply**: Open in your email client with pre-filled content

## Project Structure

```
src/
├── components/       # Reusable components
├── screens/         # Main screen components
├── utils/           # Utility functions
├── storage/         # LocalStorage management
└── types/           # TypeScript types
```

## License

MIT
