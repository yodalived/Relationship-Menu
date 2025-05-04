# Non-Escalator Relationship Menu
![relationship_menu_editor](https://github.com/user-attachments/assets/e1264d90-e473-47f1-9f19-c11ce79924b1)


A web-based tool that helps people define and reflect on their relationships according to their own preferences and needs, rather than following predefined social norms.
This is the source code of [relationshipmenu.org](https://relationshipmenu.org).

## About

This tool welcomes all forms of connection — whether platonic, familial, professional, or romantic. It's designed to bring clarity to how we define our unique relationships.

Think of relationships as customizable recipes — you and others select ingredients from the menu that appeal to your tastes and preferences. The resulting "dish" becomes your relationship.

## Features

- Create personalized relationship menus with custom categories and items
- Add notes to each menu item
- Support for multiple people in a relationship
- Edit and fill modes for creating and using menus
- Export menus as JSON or PDF
- Share menus via links (not recommended currently)
- Local storage to save your work in the browser
- Mobile-friendly responsive design
- Dark/light mode support

## Technical Details

### PDF Export with Embedded JSON
- JSON data is embedded as a file attachment within the PDF
- PDF files can be imported back into the app, preserving all data

### Data Storage
- All data is stored locally in the browser's localStorage
- No server-side processing or storage of relationship data

### Link sharing
- When sharing via URL, data is compressed using LZ-String
- Shared links use URL fragments with compressed data (`#data_v1=...`)
- Not recommended currently as the links break easily in messangers

### Templates
- Predefined templates available to get started quickly
- Empty template available for fully custom menus

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production

```bash
# Build for production
npm run build
```
