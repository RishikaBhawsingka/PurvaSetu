/**
 * Design tokens lifted 1:1 from the NER Sentinel AI web reference
 * (frontend/src/index.css + tailwind.config.js) so Convoy Telematics
 * shares the same visual identity on mobile.
 *
 * If PurvaSetu already has a theme/colors file, merge these values into
 * it instead of importing this file separately — this exists as a
 * standalone drop-in in case no shared theme file exists yet.
 */

export const colors = {
  // Backgrounds
  bgPrimary: '#EDE8DC', // Cream — screen background
  bgSecondary: '#CBD0C0', // Pale sage — subtle section backgrounds
  bgCard: '#EDE8DC', // Card surface (web used a translucent glass-card;
  // mobile uses a flat cream card with a border for legibility)

  // Accents
  accentForest: '#30483B', // Primary accent — buttons, active states, icons
  accentTerracotta: '#A9573F', // Secondary accent — page title, focus ring
  accentMustard: '#B8944A', // Tertiary accent — POL tanker highlight

  // Text
  textPrimary: '#20231F', // Almost black
  textSecondary: '#4A5048', // Muted charcoal
  textMuted: 'rgba(32, 35, 31, 0.6)',

  // Borders
  border: 'rgba(32, 35, 31, 0.12)',
  borderActive: '#30483B',
  borderNeutral: '#CBD0C0',

  // Status
  statusActive: '#10B981', // In transit / active — green
  statusWarning: '#F59E0B', // Rerouting — amber
  statusDanger: '#EF4444', // Delayed / landslide / emergency — red

  white: '#FFFFFF',
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

// The web app uses the Apple HIG system font stack; RN's default System
// font already resolves to San Francisco on iOS and Roboto on Android,
// so no custom font loading is required to match that intent.
export const typography = {
  h1: { fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
  h2: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },
  body: { fontSize: 14, fontWeight: '400' },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  caption: { fontSize: 12, fontWeight: '400' },
};

export const shadow = {
  shadowColor: '#30483B',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 10,
  elevation: 2,
};

export const STATUS_META = {
  IN_TRANSIT: { label: 'Active', color: colors.statusActive },
  REROUTING: { label: 'Rerouting', color: colors.statusWarning },
  DELAYED_LANDSLIDE: { label: 'Delayed', color: colors.statusDanger },
};

export const SEVERITY_META = {
  LOW: { label: 'Low', color: colors.statusActive },
  HIGH: { label: 'High', color: colors.statusWarning },
  CRITICAL: { label: 'Critical', color: colors.statusDanger },
};