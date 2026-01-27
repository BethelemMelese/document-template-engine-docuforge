# Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   cd cover-letter-generator
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   - The app will be available at `http://localhost:5173`

## Project Structure

```
cover-letter-generator/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Button, Card, etc.
│   │   ├── Dashboard/      # Dashboard screen components
│   │   ├── TemplateEditor/ # Rich text editor with variables
│   │   ├── Generator/      # Form and preview components
│   │   └── EmailApply/     # Email integration
│   ├── screens/            # Main screen components
│   ├── utils/              # Utility functions
│   ├── storage/            # LocalStorage management
│   └── types/              # TypeScript types
├── public/                  # Static assets
└── package.json
```

## Features Implemented

✅ **Dashboard** - Template management with cards
✅ **Template Editor** - Rich text editor with variable highlighting
✅ **Variable Detection** - Auto-detect `{{variables}}` in templates
✅ **Generator Form** - Dynamic form based on detected variables
✅ **Live Preview** - Real-time preview of merged content
✅ **PDF Export** - Download as PDF
✅ **DOCX Export** - Download as DOCX
✅ **Email Integration** - Open in Gmail/Outlook/Default client
✅ **LocalStorage** - Save templates locally

## Usage Flow

1. **Create Template**
   - Click "New Template" on dashboard
   - Write cover letter with variables: `{{company}}`, `{{position}}`, `{{date}}`
   - Variables are highlighted in blue
   - Click "Save Template"

2. **Generate Letter**
   - Click "Next → Generate" or select template from dashboard
   - Fill in the form (Company, Position, Date, Email)
   - Click "Generate Letter"
   - Preview the merged content

3. **Export/Email**
   - Download as PDF or DOCX
   - Or click "Continue to Email →"
   - Open in your email client with pre-filled content

## Customization

### Adding New Variables

Variables are automatically detected from the template. Just use `{{variableName}}` format in your template.

### Styling

The app uses Tailwind CSS. Modify `tailwind.config.js` to customize colors and styles.

## Troubleshooting

- **Port already in use**: Change port in `vite.config.ts` or kill the process using port 5173
- **Build errors**: Run `npm install` again to ensure all dependencies are installed
- **TypeScript errors**: Check that all imports are correct and types are defined

## Next Steps (Future Enhancements)

- [ ] Application history tracking
- [ ] Multiple template categories
- [ ] Cloud sync
- [ ] AI-powered suggestions
- [ ] Dark mode toggle
- [ ] Export to multiple formats
- [ ] Template sharing
