# 🕵️ Codenames

A modern, accessible, and deterministic web-based implementation of the popular word-guessing game Codenames. Built with Next.js, TypeScript, and TailwindCSS.

## ✨ Features

- **🎲 Deterministic Board Generation**: Same seed always produces the same board layout across all players
- **👥 Two Game Roles**:
  - **Spymaster**: See all card colors and give clues to your team
  - **Guesser**: Make guesses based on clues from your spymaster
- **🌍 Multi-language Support**: English, Spanish, and Polish vocabularies included
- **🔗 Easy Sharing**: Share game links with specific roles via URL
- **♿ Accessibility**: Colorblind mode with patterns and symbols
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **💾 Local State Persistence**: Guessed tiles are saved to localStorage
- **⚡ Static Export**: Fully static site that can be hosted anywhere

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Szymon-25/Codenames.git
cd Codenames

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start playing!

### Building for Production

```bash
# Build the static site
npm run build

# The output will be in the 'out' directory
# You can serve it with any static file server
```

## 🎮 How to Play

1. **Create a New Game**
   - Choose your preferred language (English, Spanish, or Polish)
   - Select a vocabulary set
   - Choose your role (Spymaster or Guesser)
   - Click "Start Game"

2. **Join an Existing Game**
   - Enter the game seed shared by another player
   - Choose your language and role
   - Join the same board as your teammates

3. **Game Rules**
   - **Spymaster**: See all card colors. Give one-word clues to help your team guess the right words
   - **Guesser**: Click on words you think belong to your team based on the spymaster's clues
   - **Goal**: Find all your team's words before the other team, and avoid the assassin!

## 🔧 How It Works

### Deterministic Board Generation

The game uses a seeded random number generator (seedrandom) to ensure that:
- The same seed produces the exact same board every time
- Word selection and color assignments are consistent across all players
- No backend or database is required

### Architecture

```
/Codenames
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Landing page (create/join game)
│   └── game/page.tsx      # Game board page
├── components/            # React components
│   ├── GameBoard.tsx      # Main game board with grid
│   ├── WordTile.tsx       # Individual word tiles
│   ├── RoleSelector.tsx   # Role selection UI
│   ├── LanguageSelector.tsx # Language picker
│   └── ShareLink.tsx      # Link sharing component
├── lib/                   # Utilities
│   ├── prng.ts           # Seeded random number generator
│   ├── boardGenerator.ts  # Board generation logic
│   └── utils.ts          # Helper functions
├── data/vocab/           # Vocabulary files
│   ├── en/default.json   # English words
│   ├── es/spanish.json   # Spanish words
│   ├── pl/polish.json    # Polish words
│   └── manifest.json     # Language/set metadata
├── types/                # TypeScript definitions
└── scripts/              # Build utilities
    └── buildManifest.ts  # Auto-generate manifest
```

## 📝 Adding New Vocabularies

### Adding a New Language

1. Create a new directory under `data/vocab/` with the language code (e.g., `de` for German)
2. Add a JSON file with the vocabulary:

```json
{
  "title": "Deutsch",
  "language": "de",
  "words": [
    "WORD1", "WORD2", "WORD3", ...
    // At least 25 words required
  ]
}
```

3. Update `data/vocab/manifest.json`:

```json
{
  "languages": {
    "de": {
      "name": "Deutsch",
      "sets": {
        "default": "Deutsch"
      }
    }
  }
}
```

Or run the auto-generation script:

```bash
npx tsx scripts/buildManifest.ts
```

### Adding Multiple Sets per Language

You can add multiple vocabulary sets for the same language:

```
data/vocab/en/
├── default.json
├── movies.json
└── tech.json
```

Each file should follow the same format with unique words.

## 🎨 Customization

### Modifying Colors

Edit the color classes in `components/WordTile.tsx`:

```typescript
const baseClasses = {
  red: 'bg-red-500 border-red-600',
  blue: 'bg-blue-500 border-blue-600',
  neutral: 'bg-gray-400 border-gray-500',
  assassin: 'bg-black border-gray-900'
};
```

### Changing Grid Size

The default grid is 5×5 (25 tiles). To change this, modify the `gridSize` parameter in `lib/boardGenerator.ts` and adjust the grid layout in `components/GameBoard.tsx`.

## 🌐 Deployment

This app is configured for static export and can be deployed to any static hosting service:

### Vercel

```bash
vercel deploy
```

### Netlify

```bash
npm run build
# Deploy the 'out' directory
```

### GitHub Pages

```bash
npm run build
# Push the 'out' directory to gh-pages branch
```

## 🧪 Testing

The game has been tested for:
- ✅ Deterministic board generation (same seed = same board)
- ✅ Role switching (Master vs Guesser views)
- ✅ Multi-language support
- ✅ Colorblind mode functionality
- ✅ Responsive design across devices
- ✅ Local state persistence

## 📦 Technologies Used

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[TailwindCSS](https://tailwindcss.com/)** - Styling
- **[seedrandom](https://www.npmjs.com/package/seedrandom)** - Deterministic random generation

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to:
- Add new vocabulary sets
- Translate to new languages
- Improve accessibility
- Fix bugs
- Suggest new features

## 🎯 Roadmap

Potential future enhancements:
- [ ] Dark mode toggle
- [ ] Custom word input mode
- [ ] Timer and score tracking
- [ ] Multiple grid sizes (4×4, 6×6)
- [ ] Export board as PDF
- [ ] Sound effects and animations
- [ ] Multiplayer sync (optional backend)

## 📸 Screenshots

### Landing Page
![Landing Page](https://github.com/user-attachments/assets/ba6afba9-1a0a-46cf-a582-a5209b0a01d7)

### Game Setup
![Game Setup](https://github.com/user-attachments/assets/92612054-2139-4bbc-9b43-e9cd46d3fa01)

### Guesser View
![Guesser View](https://github.com/user-attachments/assets/15428710-67c5-48d9-be16-cbc37a23876f)

### Spymaster View
![Spymaster View](https://github.com/user-attachments/assets/e0acea0a-573f-443b-969d-115e8838485a)

### Colorblind Mode
![Colorblind Mode](https://github.com/user-attachments/assets/6d957ed5-4bdb-4676-8e8f-8c8810d09084)

---

Made with ❤️ for word game enthusiasts
