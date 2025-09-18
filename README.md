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
- Support for multiple menus stored within the app
- Edit and fill modes for creating and filling out menus
- Export menus as JSON or PDF
- Share menus via end-to-end encrypted links
- Mobile-friendly responsive design
- Dark/light mode support

## Technical Details

### PDF Export with Embedded JSON
- JSON data is embedded as a file attachment within the PDF
- PDF files can be imported back into the app, preserving all data

### Data Storage
- By default, menus are stored locally in your browser's localStorage.
- For link sharing an end-to-end encrypted copy is uploaded temporarily when requested by the user.

### Link sharing
- End-to-end encrypted: your device generates a random key and encrypts the menu with AES-256-GCM.
- Only the encrypted data is uploaded; you receive a link like `https://relationshipmenu.org/open?id=TOKEN#key=URLSAFEKEY`. The `#key` fragment is never sent to the server.
- Links expire automatically and the data can also be deleted early by going to the links page.

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

## Contributing

Hi there! 👋 I'm working on this project in my spare time, and it's still very much in flux. While I welcome contributions a lot, I'd like to coordinate efforts to make sure we're not duplicating work.

If you're interested in contributing:

1. Please open a discussion topic in the "ideas" category before starting any work
2. Share what you plan to implement or change
3. I'll respond as soon as I can to let you know:
   - If it's a good time to work on that feature
   - If I might already be working on something similar
   - If the approach aligns with where I'm taking the project

This helps us align our efforts and ensures your valuable time is well spent on contributions that can be successfully integrated. Thank you for your interest in making this project better!
