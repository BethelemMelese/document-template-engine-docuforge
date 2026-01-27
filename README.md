# LetterForge - Cover Letter Generator

A modern web application that helps you generate customized cover letters from reusable templates using dynamic variables.

## Features

- 📝 **Rich Text Editor** - Write cover letters with TipTap editor
- 🔄 **Variable System** - Use `{{company}}`, `{{position}}`, `{{date}}` and more
- 📄 **Export Options** - Download as PDF or DOCX
- 📧 **Email Integration** - One-click email with pre-filled content
- 💾 **Template Management** - Save, edit, duplicate, and delete templates
- 🎨 **Modern UI** - Clean, Notion-inspired interface

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- TipTap (Rich Text Editor)
- jsPDF (PDF export)
- docx (DOCX export)
- React Router

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

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
