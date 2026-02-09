# 🕵️ Word Agents

A modern, accessible, and deterministic web-based word-guessing game inspired by Codenames. Built with Next.js, TypeScript, and TailwindCSS, Word Agents brings the excitement of team-based deduction to your browser.

**Play now at:** [wordagents.app](https://wordagents.app)

## ✨ Features

- **🎲 Deterministic Board Generation**: Same seed always produces identical board layouts across all players—no server required
- **👥 Two Game Roles**:
  - **Spymaster**: See all card colors and strategically guide your team with one-word clues
  - **Guesser**: Deduce and select words based on your spymaster's hints
- **🌍 Multi-language Support**: Play in English, Spanish, or Polish with authentic vocabulary sets
- **🔗 Easy Sharing**: Share game codes and direct links with teammates—choose your role before joining
- **♿ Accessible Design**: Clean interface with high contrast and intuitive controls
- **📱 Responsive Experience**: Optimized for desktop and mobile with fullscreen landscape mode for comfortable play
- **💾 Local State Persistence**: Your game progress is automatically saved to localStorage
- **⚡ Static Export**: Fully client-side application that can be deployed anywhere—no backend needed
- **🎨 Beautiful UI**: Modern gradient backgrounds with animated character illustrations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Szymon-25/WordAgents.git
cd WordAgents

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

### Creating a New Game

1. **Visit the Landing Page**
   - Click "Create new game" on the home page
   - Choose your role: Spymaster or Guesser
   - Click "Start game" to generate a unique game code

2. **Share with Your Team**
   - Copy your game code (e.g., "G7BL")
   - Share the code with teammates via the "Share links" button
   - Each player can select their preferred role when joining

### Joining an Existing Game

1. Enter the 4-character game code on the home page
2. Select your role (Spymaster or Guesser)
3. Join the same board as your teammates—guaranteed identical layout

### Game Rules

- **Spymaster View**: See all card colors (blue team, red team, neutral, assassin). Give strategic one-word clues to help your team identify their words
- **Guesser View**: See only the words. Click on words you think belong to your team based on the spymaster's clues
- **Objective**: Find all your team's words before the opposing team, while avoiding the assassin card
- **Winning**: The first team to reveal all their colored words wins. Clicking the assassin card results in an instant loss!

## 🔧 Technical Architecture

### Deterministic Board Generation

Word Agents uses a seeded pseudo-random number generator (seedrandom) to ensure perfect synchronization:
- Identical seeds produce identical board layouts every time
- Word selection and color assignments are deterministically calculated
- No database or backend synchronization required
- Players joining with the same code always see the same board

### Project Structure

```
/WordAgents
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page (create/join game)
│   ├── game/page.tsx      # Main game board
│   └── layout.tsx         # Root layout with metadata
├── components/            # React components
│   ├── GameBoard.tsx      # Main game board with 5×5 grid
│   ├── WordTile.tsx       # Individual word tiles with team colors
│   ├── RoleSelector.tsx   # Spymaster/Guesser selection UI
│   ├── LanguageSelector.tsx # Multi-language support
│   └── ShareLink.tsx      # Game code sharing functionality
├── lib/                   # Core utilities
│   ├── prng.ts           # Seeded random number generator
│   ├── boardGenerator.ts  # Deterministic board generation logic
│   └── utils.ts          # Helper functions
├── data/vocab/           # Vocabulary files by language
│   ├── en/default.json   # English word set
│   ├── es/spanish.json   # Spanish word set
│   ├── pl/polish.json    # Polish word set
│   └── manifest.json     # Language metadata
├── types/                # TypeScript type definitions
└── scripts/              # Build utilities
    └── buildManifest.ts  # Auto-generate vocabulary manifest
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

### Modifying Team Colors

Edit the color classes in `components/WordTile.tsx`:

```typescript
const teamColors = {
  blue: 'bg-cyan-500 border-cyan-600',
  red: 'bg-red-500 border-red-600',
  neutral: 'bg-stone-500 border-stone-600',
  assassin: 'bg-gray-800 border-gray-900'
};
```

### Adding Custom Vocabulary Sets

The vocabulary system supports easy expansion without code changes.

### Changing Grid Size

The default grid is 5×5 (25 tiles). To customize:
1. Modify the `GRID_SIZE` constant in `lib/boardGenerator.ts`
2. Adjust the card distribution logic for your desired team balance
3. Update the grid layout classes in `components/GameBoard.tsx`

## 🌐 Deployment

Word Agents is configured for static export and can be deployed to any static hosting service.

### Vercel (Recommended)

```bash
# Deploy with Vercel CLI
vercel deploy

# Or connect your GitHub repository at vercel.com for automatic deployments
```

### Netlify

```bash
# Build the static site
npm run build

# Deploy the 'out' directory via Netlify CLI or drag-and-drop
netlify deploy --prod --dir=out
```

### GitHub Pages

```bash
# Build for production
npm run build

# Deploy the 'out' directory to your gh-pages branch
# Configure your repository settings to serve from gh-pages branch
```

### Other Static Hosts

Any service that can serve static files will work: Cloudflare Pages, AWS S3, Azure Static Web Apps, etc. Just run `npm run build` and deploy the `out` directory.

## 🧪 Quality Assurance

Word Agents has been thoroughly tested for:
- ✅ **Deterministic Behavior**: Same seed generates identical boards across all clients
- ✅ **Role Integrity**: Switching between Master and Guesser views maintains game state
- ✅ **Multi-language Support**: All vocabulary sets load correctly
- ✅ **Responsive Design**: Seamless experience on desktop, tablet, and mobile devices
- ✅ **State Persistence**: Game progress survives page refreshes via localStorage
- ✅ **Cross-browser Compatibility**: Works on Chrome, Firefox, Safari, and Edge

## 📦 Technologies

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router and static export
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[TailwindCSS 4](https://tailwindcss.com/)** - Utility-first styling with modern CSS
- **[seedrandom](https://www.npmjs.com/package/seedrandom)** - Deterministic random number generation
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[Firebase Analytics](https://firebase.google.com/)** - Optional usage tracking

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

- **Add Vocabulary Sets**: Contribute word lists in new languages or themed sets
- **Improve Accessibility**: Suggest enhancements for screen readers and keyboard navigation
- **Report Bugs**: Open issues with detailed reproduction steps
- **Suggest Features**: Share ideas for new game modes or UI improvements
- **Submit Pull Requests**: Follow the existing code style and include tests where applicable

Please ensure your contributions maintain the professional quality and accessibility standards of the project.

## 🎯 Future Enhancements

Potential features under consideration:

- [ ] **Dark Mode**: Toggle between light and dark themes
- [ ] **Custom Word Input**: Allow players to use their own word lists
- [ ] **Game Statistics**: Track wins, streaks, and performance metrics
- [ ] **Multiple Grid Sizes**: Support for 4×4 and 6×6 boards
- [ ] **Export Functionality**: Save game boards as PDF or image
- [ ] **Sound Effects**: Optional audio feedback for actions
- [ ] **Animations**: Smooth transitions and card flip effects
- [ ] **Tournament Mode**: Multi-round competitive play with scoring
- [ ] **Team Chat**: Optional real-time communication (requires backend)

## 📸 Screenshots

### Landing Page
![Landing Page](https://github.com/user-attachments/assets/28039800-28d2-44fe-982d-b2d867635b13)

### Game Setup
![Game Setup](https://github.com/user-attachments/assets/39fbf6b9-cab5-405a-b32a-f9056dd2807d)

### Spymaster View
![Spymaster View](https://github.com/user-attachments/assets/af968f22-5f96-47e1-9823-70008391ac4a)

### Guesser View
![Guesser View](https://github.com/user-attachments/assets/dca01939-30a8-481f-8884-72d3cabc98f4)

---

Made with ❤️ for word game enthusiasts
