# 🪙 ArthaSaathi — Your Wealth Companion

<p align="center">
  <img src="./assets/icon.png" width="100" alt="ArthaSaathi Logo" />
</p>

<p align="center">
  <strong>A premium fintech-grade Finance Manager & Expense Tracker</strong><br/>
  Built with React Native + Expo • Jetpack-quality UI in JavaScript
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.81-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Expo_SDK-54-black?style=for-the-badge&logo=expo" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Platform-Android-green?style=for-the-badge&logo=android" />
</p>

---

## ✨ Overview

**ArthaSaathi** (अर्थसाथी — *"Your Wealth Companion"*) is a beautifully crafted, production-quality expense tracking app that demonstrates senior-level mobile development skills. Built with a clean, scalable architecture, it features rich animations, dark/light theme support, and a premium fintech-style UI.

> **Artha** (Sanskrit: wealth/purpose/meaning) + **Saathi** (Hindi: companion/partner)

---

## 🎯 Features

### Core Features
- ✅ **Add Income & Expenses** — Full-featured form with category selection, date picker, and notes
- ✅ **Category-Based Tracking** — 18 predefined categories with custom icons and colors
- ✅ **Monthly Summary** — Total income, expenses, and remaining balance
- ✅ **Transaction History** — Searchable, filterable list grouped by date
- ✅ **Local Storage** — All data persisted via AsyncStorage (no backend required)

### UI/UX Excellence
- 🎨 **Gradient-Based UI** — Premium gradients throughout the app
- 🌓 **Dark / Light Mode** — Animated theme toggle with beautiful palettes
- 📱 **Bottom Tab Navigation** — 4 tabs: Home, Analytics, History, Settings
- ✨ **Rich Animations** — 60fps micro-interactions using Reanimated 3
- ⌨️ **Keyboard Handling** — Smooth UX with KeyboardAvoidingView
- 📳 **Haptic Feedback** — Tactile responses on all interactions

### Bonus Features
- 📊 **Animated Donut Charts** — SVG-based category visualization
- 📈 **Bar Graphs** — 6-month income vs expense trends
- 👆 **Swipe Gestures** — Swipe-to-delete transactions with undo
- 🫙 **Smart Empty States** — Animated illustrations when no data
- 💰 **INR Currency** — Indian rupee formatting with lakhs/crores grouping
- 🎯 **Monthly Budget** — Set spending limits
- 🚀 **3-Slide Onboarding** — Beautiful first-launch experience
- 👤 **Profile Management** — User name, email, and avatar

---

## 📸 Screenshots

| Onboarding | Home | Analytics |
|:---:|:---:|:---:|
| *Onboarding flow* | *Balance card + recent transactions* | *Donut chart + trends* |

| History | Settings | Add Transaction |
|:---:|:---:|:---:|
| *Search + filter* | *Theme toggle + profile* | *Bottom sheet form* |

---

## 🏗️ Architecture

```
ArthaSaathi/
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root: fonts, providers, splash
│   ├── index.tsx                 # Smart redirect
│   ├── onboarding.tsx            # 3-slide onboarding
│   └── (tabs)/
│       ├── _layout.tsx           # Tab bar config
│       ├── index.tsx             # Home screen
│       ├── analytics.tsx         # Charts + breakdown
│       ├── transactions.tsx      # Full history
│       └── settings.tsx          # Preferences
├── src/
│   ├── components/
│   │   ├── ui/                   # Reusable UI primitives
│   │   │   ├── GradientCard.tsx
│   │   │   ├── Button.tsx        # Animated button w/ haptics
│   │   │   ├── Input.tsx         # Floating label input
│   │   │   ├── EmptyState.tsx    # Animated empty states
│   │   │   ├── SnackBar.tsx      # Undo snackbar
│   │   │   └── AnimatedTabBar.tsx
│   │   ├── home/
│   │   │   ├── BalanceCard.tsx   # Gradient balance card
│   │   │   ├── TransactionItem.tsx # Swipeable row
│   │   │   └── QuickStats.tsx    # Income/expense pills
│   │   ├── analytics/
│   │   │   ├── DonutChart.tsx    # SVG donut chart
│   │   │   ├── BarGraph.tsx      # Animated bar graph
│   │   │   └── CategoryBreakdown.tsx
│   │   └── modals/
│   │       ├── AddTransactionSheet.tsx
│   │       └── CategoryPickerGrid.tsx
│   ├── store/                    # Zustand state management
│   │   ├── transactionStore.ts   # CRUD + computed selectors
│   │   └── settingsStore.ts      # Theme, currency, profile
│   ├── hooks/
│   │   └── useTheme.ts           # Reactive theme colors
│   ├── constants/
│   │   ├── Colors.ts             # Full dark + light palette
│   │   ├── Categories.ts         # 18 categories
│   │   └── Typography.ts         # Type scale + spacing
│   ├── types/
│   │   └── index.ts              # All TypeScript interfaces
│   └── utils/
│       ├── currency.ts           # INR formatting
│       ├── dateUtils.ts          # Date helpers
│       └── storage.ts            # AsyncStorage wrappers
├── assets/
│   └── fonts/                    # Poppins + SpaceMono
├── app.json                      # Expo config
├── babel.config.js               # Reanimated plugin
└── tsconfig.json
```

### Design Principles
- **Single Responsibility** — Each component does one thing well
- **Separation of Concerns** — Store → Hooks → Components → Screens
- **Type Safety** — Full TypeScript with strict mode
- **Scalability** — Easy to add new categories, currencies, or screens
- **Performance** — Reanimated 3 (worklet-based), no unnecessary re-renders

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | React Native + Expo SDK 54 | Cross-platform mobile |
| **Navigation** | Expo Router v6 | File-based routing |
| **State** | Zustand | Lightweight reactive state |
| **Animations** | Reanimated 3 | 60fps native animations |
| **Gestures** | Gesture Handler | Swipe, pan, tap |
| **Charts** | react-native-svg | Custom donut + bar charts |
| **Storage** | AsyncStorage | Local data persistence |
| **Haptics** | expo-haptics | Tactile feedback |
| **Fonts** | expo-font | Poppins + SpaceMono |
| **Gradients** | expo-linear-gradient | Premium gradient UI |
| **Icons** | @expo/vector-icons | MaterialCommunityIcons |
| **Dates** | date-fns | Date formatting/grouping |

---

## 🚀 Setup & Run

### Prerequisites
- [Node.js](https://nodejs.org/) ≥ 18
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)
- [Android Studio](https://developer.android.com/studio) (for emulator) OR Expo Go app

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/ArthaSaathi.git
cd ArthaSaathi

# 2. Install dependencies
npm install

# 3. Start the development server
npx expo start

# 4. Run on device/emulator
# Scan QR code with Expo Go (Android) — OR —
# Press 'a' to open in Android emulator
```

### Build APK

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build Android APK (preview)
eas build --platform android --profile preview

# Build production AAB
eas build --platform android --profile production
```

---

## 📦 EAS Build Configuration

Create `eas.json` in the project root:

```json
{
  "cli": {
    "version": ">= 15.0.0"
  },
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

---

## 🔥 Firebase App Distribution

1. Build the APK using EAS (`eas build --platform android --profile preview`)
2. Go to [Firebase Console](https://console.firebase.google.com/)
3. Navigate to **App Distribution** → **Upload** the APK
4. Add testers by email → They receive an install link
5. Share the Firebase distribution link with evaluators

---

## 📊 Feature Checklist

| Requirement | Status |
|---|---|
| Add income / expense | ✅ |
| Amount, category, date, note fields | ✅ |
| Form validation | ✅ |
| Category-based tracking | ✅ |
| Visual distinction (icons/colors) | ✅ |
| Monthly summary | ✅ |
| Total income / expenses / balance | ✅ |
| Gradient-based UI | ✅ |
| Dark / Light mode toggle | ✅ |
| Bottom tab navigation (4 tabs) | ✅ |
| Animations (micro + transitions) | ✅ |
| Keyboard handling | ✅ |
| Local storage (AsyncStorage) | ✅ |
| Animated pie/donut charts | ✅ (Bonus) |
| Swipe gestures | ✅ (Bonus) |
| Smart empty states | ✅ (Bonus) |
| Haptic feedback | ✅ (Bonus) |
| Onboarding flow | ✅ (Bonus) |
| Profile management | ✅ (Bonus) |
| Budget tracking | ✅ (Bonus) |
| INR formatting (Indian) | ✅ (Bonus) |

---

## 🎨 Design System

### Color Palette

**Dark Theme (Primary)**
- Background: `#0A0A1B`
- Card: `#141428`
- Primary: `#7C5CFC`
- Income: `#00D4AA`
- Expense: `#FF6B6B`

**Typography**: Poppins (Regular, Medium, SemiBold, Bold) + SpaceMono

### Component Library
- `GradientCard` — Reusable gradient container
- `Button` — Animated with haptic variants (primary, secondary, outline, ghost)
- `Input` — Floating label with error states
- `EmptyState` — Smart animated placeholders
- `SnackBar` — Slide-up with undo action
- `TransactionItem` — Swipeable with category icons
- `DonutChart` — SVG-based animated segments
- `BarGraph` — Multi-bar comparison

---

## 👨‍💻 Developer

Made with ❤️ in India

---

## 📄 License

This project is created as part of an internship assignment evaluation.
