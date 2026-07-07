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
- `npm run typecheck` - TypeScript strict type checking
- `npm run lint` - ESLint (flat config: typescript-eslint, react-hooks, jsx-a11y)
- `npm run format` - Prettier
- `npm test` / `npm run test:watch` - Vitest (parsing golden tests + data validation)

**Deployment:** Pushing to `main` triggers `.github/workflows/deploy.yml`, which
typechecks, lints, tests, builds, and deploys `dist/` to GitHub Pages (custom
domain `arudi.midadalfikr.com`, kept by `public/CNAME`). There is no manual
deploy script. The repo Pages source must be set to "GitHub Actions".

**Prerequisites:** Node.js 22+.

## Design Specifications

### Theme & Visual Design ("engraved medallion" language)
- **Color Scheme**: Deep gray/black background (#111827); graphite surfaces with gold hairlines; per-circle theme colors reserved for content ("enamel")
- **Design tokens** (index.css): `--gold-hairline(-soft)`, `--graphite-*`; utilities `.panel-engraved`, `.border-gold(-soft)`, `.label-gold`, `.heading-display`
- **Typography**:
  - Display/calligraphic headings: 'Reem Kufi' (geometric kufi) via `.heading-display` (gradient gold) or `.font-kufi` — used for view titles, medallion title rings, circle-hub centers
  - Arabic body/poetry/tafail: 'Amiri' (naskh; keeps vocalization legible) via `.font-amiri`
  - English UI text: 'Inter' via `.font-inter`
- **Ornament**: `OrnateDivider` (✦ hairline) sits under every view heading
- **Directionality**: Entire application rendered in RTL mode (dir="rtl" on <html> tag)
- **Layout**: High-contrast, elegant dark theme design

### Critical Navigation Requirements (direction-relative)
- **Next** always advances in the reading direction: in RTL it sits on the LEFT with a LEFT-pointing chevron; in LTR (English mode) it mirrors to the RIGHT with a RIGHT-pointing chevron
- **Previous** sits on the reading-start side pointing backward
- The app is bilingual (see `i18n/`): `LanguageProvider` flips `document.documentElement.lang/dir`; `Controls.tsx` derives chevron direction from `useLanguage().dir` — never hardcode sides

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
- **App.tsx**: Main component owning all navigation state (hub / circle / compare views, selected circle + meter index, tour step)
- **CircleHub.tsx**: Hub view displaying all five circles for selection, plus meter search, compare and tour entry points
- **CircleView.tsx**: Individual circle view; receives `currentMeterIndex` + `onMeterChange` from App (no internal meter state)
- **MeterSearch.tsx**: Hub search across all 16 meters (Arabic/transliteration/tafila, normalized via `utils/arabicNormalize.ts`), deep-links to a meter
- **CompareView.tsx** + **MeterPatternCard.tsx**: side-by-side meter comparison with shared-feet highlighting
- **TourOverlay.tsx** + **tour/tourSteps.ts**: 7-step guided tour (spotlight overlay driving App navigation)
- **DialView.tsx** (Rotation Lab): draggable/keyboard-rotatable circle exposing ALL rotations — canonical meters, neglected rotations (البحور المهملة, e.g. المستطيل/الممتد), and duplicates; powered by **data/rotations.ts** (`CIRCLE_ROTATIONS`, `sequencePeriod`)
- **MathView.tsx**: moraic binary lens (moving=1/quiescent=0), sequence period + distinct-rotation counts, full rotation table per circle (16 used + 5 neglected = 21 distinct rotations)
- **ScanView.tsx**: prosodic scansion — animates the shahid's arudScript letters onto the atomic-unit template letter-by-letter (`utils/scansion.ts` tokenizer); flags non-canonical (zihaf) examples as approximate
- **IslamicPattern.tsx**: procedural geometric SVG backdrop for hub cards (per-instance pattern ids)
- **ErrorBoundary.tsx**: top-level render-error fallback
- **i18n/**: `LanguageContext` (ع/EN toggle, localStorage, flips html lang/dir), `translations.ts` (ar source of truth, typed en parity), `names.ts` helpers
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
- The `UNIT_WIDTH` constant (40px) in ArudCircle.tsx controls the visual spacing of atomic units
- Animation timing and easing critical for smooth "roulette" effect
- Legacy compatibility maintained for single-circle usage
- Utility functions for circle/meter management: `getCircleById()`, `getMeterById()`, `getTotalMeterCount()`