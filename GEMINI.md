# GEMINI.md

## Project Overview

The Interactive Arud Explorer is a React-based web application that visualizes Arabic poetry meters (Arud) based on Al-Khalil ibn Ahmad al-Farahidi's classical system. The app allows users to explore the five traditional circles of Arabic prosody, each containing different poetic meters with their unique patterns and structures.

The application is built around Al-Khalil's circular theory of Arabic prosody, where each meter is derived from a fundamental syllabic unit sequence. The app provides an interactive "roulette" visualization that shows how different meters are formed by starting at different positions in the circular sequence and grouping the units in specific ways.

### Key Features

1. **Five Prosodic Circles**: Implementation of all five traditional circles of Arabic prosody:
   - Circle 1: Mixed Circle (الدائرة المختلطة)
   - Circle 2: Pure Circle (الدائرة المجتلبة)
   - Circle 3: Contracted Circle (الدائرة المختلطة)
   - Circle 4: Accordant Circle (الدائرة المؤتلفة)
   - Circle 5: Consonant Circle (دائرة المتقارب)

2. **Interactive Visualization**: A "roulette" style animation that shows how poetic meters are constructed from fundamental syllabic units.

3. **Educational Content**: Detailed information about each meter including historical usage, famous examples, and transliterations.

4. **Responsive Design**: Fully responsive interface with RTL (right-to-left) support for Arabic text.

5. **Visual Themes**: Each circle has its own color scheme and visual identity.

## Project Structure

```
interactive-arud-explorer/
├── App.tsx              # Main application component
├── constants.ts         # Core data structures and parsing functions
├── index.html           # HTML entry point
├── index.tsx            # React application entry point
├── metadata.json        # Project metadata
├── package.json         # NPM package configuration
├── package-lock.json    # Exact, reproducible dependency tree
├── README.md            # Project documentation
├── ROADMAP.md           # Development roadmap
├── tsconfig.json        # TypeScript configuration
├── types.ts             # TypeScript interfaces
├── vite.config.ts       # Vite build configuration
├── CLAUDE.md            # Context for Claude Code (claude.ai/code)
├── .claude/             # Claude-specific settings
├── components/          # React components
│   ├── ArudCircle.tsx   # Main "roulette" visualization component
│   ├── CircleHub.tsx    # Circle selection hub
│   ├── CircleView.tsx   # Individual circle view
│   ├── Controls.tsx     # Navigation controls
│   ├── Icons.tsx        # SVG icons
│   ├── InfoCard.tsx     # Information card
│   └── MeterDisplay.tsx # Meter information display
├── data/                # Data files
│   ├── circles/         # Circle data
│   │   ├── circle1-mixed.ts
│   │   ├── circle2-pure.ts
│   │   ├── circle3-contracted.ts
│   │   ├── circle4-accordant.ts
│   │   ├── circle5-consonant.ts
│   │   └── index.ts     # Circle exports and utilities
│   └── classical-examples/ # Historical poetry examples (currently empty)
└── dist/                # Build output (not in source)
```

## Core Concepts

### Arud Theory Implementation

The application implements Al-Khalil's circular theory of Arabic prosody:

- **Atomic Sequence**: Each circle has a fundamental repeating pattern of syllabic units (e.g., `['//0', '/0', '//0', '/0', '/0', '//0', '/0', '//0', '/0', '/0']`)
  - `'//0'`: watid majmū' (long-short-long)
  - `'/0'`: sabab khafif (short-long)
  - `'///0'`: watid mafrūq (long-long-long-short)

- **Poetic Feet (Tafila)**: Groups of atomic units that form complete metrical patterns (e.g., فعولن, مفاعيلن)

- **Meters**: Different starting positions and parsing instructions that create distinct poetic meters

### Data Model

1. **Circle**: Represents one of Al-Khalil's five prosodic circles
   - Contains a unique atomic sequence
   - Contains multiple meters
   - Has visual theme properties

2. **Meter**: Defines a complete meter with:
   - `id`: Unique identifier
   - `name`: Arabic name
   - `nameTransliteration`: English transliteration
   - `circleId`: Reference to parent circle
   - `startOffset`: Starting index on atomic sequence
   - `parsingInstructions`: How to group atomic units
   - `patternTransliteration`: English transliteration of full pattern
   - `description`: Brief English description
   - `historicalUsage`: Classical usage patterns
   - `famousExamples`: Historical poetry examples

3. **Tafila**: Represents a single poetic foot with both unmerged and merged forms

## Development Setup

### Prerequisites

- Node.js (version specified in package.json)
- npm (comes with Node.js)

### Dependencies

- "react": "^19.1.0"
- "react-dom": "^19.1.0"
- "@types/node": "^22.14.0"
- "typescript": "~5.8.2"
- "vite": "^6.2.0"

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key (though the current codebase doesn't appear to actively use Gemini API)

### Development Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Running the Application

To run the application locally:

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Open your browser to the URL provided in the terminal (typically http://localhost:5173)

## Architecture

### Component Architecture

- **App.tsx**: Main component managing application state and navigation between views
- **CircleHub.tsx**: Main circle selection interface showing all five circles
- **CircleView.tsx**: Individual circle view with meter navigation
- **ArudBanner**: The critical "roulette" component - implements smooth sliding animation (in `ArudCircle.tsx`)
- **MeterDisplay.tsx**: Shows meter details with fade-in animations
- **Controls.tsx**: RTL-compliant navigation controls
- **constants.ts**: Contains atomic sequences, tafila mappings, and parsing functions
- **types.ts**: TypeScript interfaces for core data structures

### Key Functions

- `parseMeterPattern()`: Central function that takes a meter's start offset and parsing instructions to extract the correct atomic units from the circular sequence and map them to their corresponding tafila.

### Styling

- Uses Tailwind CSS for styling
- Arabic text uses `font-amiri` class (Amiri Google Font)
- English text uses `font-inter` class (Inter font)
- Custom CSS animations for fade-in effects
- RTL (right-to-left) text direction support
- Amber color scheme for highlighting
- Deep gray background for dark theme

## Development Guidelines

### Adding New Meters

1. Add new meter objects to the appropriate circle file in `data/circles/`
2. Ensure proper `startOffset` and `parsingInstructions` values
3. Include complete theoretical forms, not shortened versions

### Adding New Tafila

1. Update `TAFILA_MAP` in `constants.ts` with new atomic unit combinations

### UI Changes

1. `ArudCircle.tsx` for the main "roulette" visualization (critical component)
2. `MeterDisplay.tsx` for meter information display with animations
3. `Controls.tsx` for RTL-compliant navigation

### RTL Navigation Requirements

- **Next Button**: Must be on the LEFT side with LEFT-pointing chevron (moves sequence forward)
- **Previous Button**: Must be on the RIGHT side with RIGHT-pointing chevron

### Interactive Banner Specifications

**Critical Animation Requirements:**
- Render a continuous strip of atomic sequence (repeated multiple times)
- Smooth sliding animation right-to-left for "Next" navigation
- NO fading or abrupt re-rendering - only sliding motion
- Creates illusion of moving viewing frame along infinite circular tape

**Visual Hierarchy:**
- **Top Layer**: Raw atomic units with highlighting on grouped units
- **Bottom Layer**: Resulting tafila names
- **Connector**: Upward-pointing curly brace SVG between layers

## Current Status

The application is a complete implementation of Al-Khalil's five-circle system of Arabic prosody, with all 16 classical meters properly represented. The application includes:

- Complete data for all five circles
- Interactive visualization of meter construction
- Historical context and examples for each meter
- Responsive design with proper RTL support
- Circle-specific visual themes

## Future Enhancements

According to the ROADMAP.md file, potential future enhancements include:

1. **Educational Enhancements**: Interactive tutorials, historical context integration, comparative analysis
2. **Search & Discovery**: Meter search, pattern matching, similarity mapping
3. **Advanced Visualizations**: 3D circle representations, rhythm visualization, historical timeline
4. **Performance & Polish**: Lazy loading, animation performance, accessibility improvements

## Technical Notes

- Built with Vite + React 19 + TypeScript
- No external state management (uses React's built-in useState)
- Uses SVG for the curved brace graphics
- Supports both Arabic and English text with proper RTL handling
- The `unitWidth` constant (90px) in ArudCircle.tsx controls the visual spacing of atomic units
- Animation timing and easing critical for smooth "roulette" effect