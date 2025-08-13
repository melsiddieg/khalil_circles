# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Interactive Arud Explorer is a React-based web application that visualizes Arabic poetry meters (Arud) based on Al-Khalil ibn Ahmad al-Farahidi's classical system. The app displays an interactive multi-circle exploration interface where users can navigate between Al-Khalil's five prosodic circles, each containing different poetic meters with their unique patterns and structures. The app features a hub-based navigation system that allows switching between circles and exploring individual meters within each circle.

## Development Commands

**Local Development:**
- `npm install` - Install dependencies
- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Prerequisites:** Node.js is required. Set `GEMINI_API_KEY` in `.env.local` (though the current codebase doesn't appear to actively use Gemini API).

## Design Specifications

### Theme & Visual Design
- **Color Scheme**: Deep gray/black background (#111827) with amber/gold accents (#FBBF24, #F59E0B)
- **Typography**: 
  - Arabic text: 'Amiri' Google Font (classic serif feel)
  - English UI text: 'Inter' font (modern clarity)
- **Directionality**: Entire application rendered in RTL mode (dir="rtl" on <html> tag)
- **Layout**: High-contrast, elegant dark theme design

### Critical RTL Navigation Requirements
- **Next Button**: Must be on the LEFT side with LEFT-pointing chevron (moves sequence forward)
- **Previous Button**: Must be on the RIGHT side with RIGHT-pointing chevron
- This ensures intuitive navigation for RTL interface users

## Architecture & Core Concepts

### Arud Theory Implementation
The application is built around Al-Khalil's complete circular theory of Arabic prosody with five distinct circles:

- **Five Prosodic Circles**: Each circle has its own atomic sequence and contains specific meters
  - Circle 1 (Mixed): `['0//', '0/', '0//', '0/', '0/', '0//', '0/', '0//', '0/', '0/']`
  - Circle 2 (Pure): Different atomic patterns for pure meters
  - Circle 3 (Contracted): Specialized patterns for contracted meters
  - Circle 4 (Accordant): Accordant meter patterns
  - Circle 5 (Consonant): Consonant meter patterns
- **Atomic Units**: Fundamental syllabic units with various patterns
  - `'0//'`: watid majmū' (long-short-long)
  - `'0/'`: sabab khafif (short-long)
  - Additional specialized patterns per circle
- **Poetic Feet (Tafila)**: Groups of atomic units that form complete metrical patterns
- **Meters**: Different starting positions and parsing instructions that create distinct poetic meters within each circle

### Data Model Requirements
- **Circle Objects**: Each must contain:
  - `id`: Unique identifier (e.g., 'circle1-mixed')
  - `name`: Arabic name (e.g., 'الدائرة المختلطة')
  - `nameTransliteration`: English transliteration
  - `description`: Brief English description
  - `atomicSequence`: Circle-specific atomic pattern array
  - `baseSequenceLength`: Length of the atomic sequence
  - `meters`: Array of meters belonging to this circle
  - `visualTheme`: Color scheme and styling for the circle
  - `order`: Display order (1-5)
- **Meter Objects**: Each must contain:
  - `id`: Unique identifier
  - `name`: Arabic name (e.g., 'البحر الطويل')
  - `nameTransliteration`: English transliteration
  - `description`: Brief English description
  - `circleId`: Reference to parent circle
  - `startOffset`: Starting index on circle's atomic sequence
  - `parsingInstructions`: Array dictating atomic unit grouping (e.g., [2, 3, 2, 3])
  - `patternTransliteration`: English transliteration of full pattern
  - `historicalUsage`: Classical usage patterns
  - `famousExamples`: Array of historical poetry examples
- **Accuracy**: All meters must be in complete, theoretical forms (not shortened majzū' versions)

### Key Data Structures
- `Circle`: Represents one of Al-Khalil's five prosodic circles with complete metadata
- `Meter`: Defines a complete meter with ID, name, circle reference, and historical examples
- `Tafila`: Represents a single poetic foot with both unmerged and merged forms
- `TafilaVariant`: Supports prosodic variations (Zihaf) with base form and variations
- `PoetryExample`: Historical poetry examples with poet attribution and era
- `CircleTheme`: Visual styling configuration for each circle
- `AppState`: Navigation state for hub/circle view management
- `TAFILA_MAP`: Maps atomic unit sequences to their Arabic names with circle-specific prefixes

### Component Architecture
- **App.tsx**: Main component managing navigation between hub and circle views
- **CircleHub.tsx**: Hub view displaying all five circles for selection
- **CircleView.tsx**: Individual circle view with meter navigation
- **ArudCircle.tsx**: The critical "roulette" component - implements smooth sliding animation
- **MeterDisplay.tsx**: Shows meter details with fade-in animations
- **Controls.tsx**: RTL-compliant navigation controls
- **InfoCard.tsx**: Displays application information and instructions
- **Icons.tsx**: SVG icon components for UI elements
- **constants.ts**: Contains atomic sequences, tafila mappings, and circle/meter data
- **types.ts**: TypeScript interfaces for all data structures
- **data/circles/**: Individual circle definition files and utilities

### Interactive Banner ("Roulette") Specifications
**Critical Animation Requirements:**
- Render a continuous strip of ATOMIC_SEQUENCE (repeated multiple times)
- Smooth sliding animation right-to-left for "Next" navigation
- NO fading or abrupt re-rendering - only sliding motion
- Creates illusion of moving viewing frame along infinite circular tape

**Visual Hierarchy:**
- **Top Layer**: Raw atomic units (//0, /0) with amber highlighting on grouped units
- **Bottom Layer**: Resulting tafila names (e.g., فعولن)
- **Connector**: Upward-pointing curly brace SVG between layers (no "hats" above)
- **Animation**: Tafila text fades in with delay after atomic group slides into place

### Parsing Algorithm
The `parseMeterPattern()` function in constants.ts:36 is central to the app. It takes a meter's start offset and parsing instructions to extract the correct atomic units from the circle's atomic sequence and map them to their corresponding tafila. The function supports:
- Circle-specific atomic sequences and tafila mappings
- Circle-prefixed keys for unique tafila identification (e.g., 'c2:', 'c3:', 'c5:', 'c6:')
- Special handling for Circle 3 (contracted) with uniform tafila repetition
- Fallback mechanisms for unmapped patterns
- Legacy compatibility for backward compatibility

### Styling Approach
- Uses Tailwind CSS for styling
- Arabic text uses `font-amiri` class (Amiri Google Font)
- English text uses `font-inter` class (Inter font)
- Custom CSS animations for fade-in effects
- RTL (right-to-left) text direction support with `dir="rtl"`
- Amber color scheme (`text-amber-400`, `bg-amber-500/10`) for highlighting
- Deep gray background (#111827) for dark theme

## Key Files for Modifications

**Adding New Circles:**
- Create new circle file in `data/circles/` following existing pattern
- Update `data/circles/index.ts` to include the new circle
- Add circle-specific atomic sequence and visual theme
- Include complete meter definitions with historical examples

**Adding New Meters:**
- Modify the appropriate circle file in `data/circles/`
- Add new meter objects to the circle's `meters` array
- Ensure proper `startOffset` and `parsingInstructions` values
- Include complete theoretical forms, not shortened versions
- Add historical usage and poetry examples

**Adding New Tafila:**
- Update `TAFILA_MAP` in `constants.ts:8` with new atomic unit combinations
- Use circle-specific prefixes (e.g., 'c2:', 'c3:') for unique patterns
- Include both unmerged and merged forms

**UI Changes:**
- `CircleHub.tsx` for the main hub navigation interface
- `CircleView.tsx` for individual circle displays
- `ArudCircle.tsx` for the main "roulette" visualization (critical component)
- `MeterDisplay.tsx` for meter information display with animations
- `Controls.tsx` for RTL-compliant navigation
- `InfoCard.tsx` for application information display
- Tailwind classes are used throughout for responsive design

## Technical Notes

- Built with Vite + React 19 + TypeScript
- No external state management (uses React's built-in useState)
- Hub-based navigation system for switching between circles
- Circle-specific data organization in `data/circles/` directory
- Uses SVG for the curved brace graphics (upward-pointing between layers)
- Supports both Arabic and English text with proper RTL handling
- Circle-specific visual themes and color schemes
- The `unitWidth` constant (90px) in ArudCircle.tsx controls the visual spacing of atomic units
- Animation timing and easing critical for smooth "roulette" effect
- Legacy compatibility maintained for single-circle usage
- Utility functions for circle/meter management: `getCircleById()`, `getMeterById()`, `getTotalMeterCount()`