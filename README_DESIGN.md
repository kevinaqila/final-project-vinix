# FinancePro - Design System untuk UI/UX Designer

## 📋 Overview

Dokumen ini berisi **design system lengkap** yang diextract dari kode React FinancePro untuk memudahkan tim UI/UX designer dalam membuat desain Figma yang konsisten dengan implementasi React.

### File yang Tersedia

| File | Deskripsi |
|------|-----------|
| **FIGMA_DESIGN_SYSTEM.md** | Dokumentasi lengkap (Markdown) dengan semua detail design system |
| **FIGMA_DESIGN_SYSTEM.json** | Data terstruktur (JSON) untuk import ke tools atau programmatic use |
| **FIGMA_DESIGN_SYSTEM_PREVIEW.html** | Preview visual dalam browser (buka dengan double-click) |
| **README_DESIGN.md** | File ini - panduan untuk designer |

---

## 🎨 Quick Start untuk Figma

### 1️⃣ **Import Color Palette**

#### Langkah:
1. Buka Figma → Create new file
2. Pergi ke **Assets panel** (klik ikon asset di sidebar kanan)
3. Klik **Color** button → **+** → **Create color style**
4. Buat style untuk setiap warna berikut:

#### Color Styles yang Perlu Dibuat:
```
FOLDER: Primary
├── Green-50: #f0fdf4
├── Green-100: #dcfce7
├── Green-500: #22c55e
├── Green-600: #16a34a
├── Green-700: #15803d
└── Green-800: #166534

FOLDER: Neutral
├── White: #ffffff
├── Gray-50: #f9fafb
├── Gray-100: #f3f4f6
├── Gray-200: #e5e7eb
├── Gray-300: #d1d5db
├── Gray-400: #9ca3af
├── Gray-700: #374151
└── Gray-900: #111827

FOLDER: Secondary
└── Teal-500: #14b8a6

FOLDER: Additional
├── Blue-50: #eff6ff
├── Blue-500: #3b82f6
├── Purple-100: #f3e8ff
├── Yellow-500: #eab308
├── Red-500: #ef4444
└── Red-600: #dc2626
```

### 2️⃣ **Create Gradient Styles**

Klik **"+"** di Gradient section (berdampingan dengan Color):

| Nama Gradient | Type | Direction | Stops |
|---|---|---|---|
| **Background Page** | Linear | 135° (to-br) | Slate-50 → Blue-50 → Green-50 |
| **Button Primary** | Linear | 90° (to-r) | Green-600 → Green-500 |
| **Button Hover** | Linear | 90° (to-r) | Green-700 → Green-600 |
| **Feature Section** | Linear | 135° (to-br) | Green-600 → Green-500 → Teal-500 |
| **CTA Section** | Linear | 90° (to-r) | Green-600 → Green-800 |

### 3️⃣ **Create Base Components**

#### Button Component
```
Name: Button
Properties:
  - Variant: Primary | Secondary | Outline | Danger
  - Size: Small (py-2.5) | Medium (py-3.5) | Large (py-4)
  - State: Default | Hover | Disabled

Base Design (Primary, Medium):
  - Background: Green-600 → Green-500 (gradient)
  - Text: White, text-base, font-semibold
  - Padding: px-4 py-3.5
  - Border Radius: 12px (rounded-xl)
  - Shadow: 0 10px 15px -3px rgba(0,0,0,0.1)
  - Hover: Shadow increase, translate up
  - Focus Ring: 2px green-500 ring
```

#### Input Component
```
Name: Input Text
Properties:
  - Type: Text | Email | Password
  - State: Default | Focus | Error | Disabled
  - Icon: Left | Right | None

Base Design:
  - Background: White
  - Border: 1px Gray-300
  - Text: text-base, Gray-900
  - Placeholder: Gray-400
  - Padding: px-4 py-3.5
  - Border Radius: 12px (rounded-xl)
  - Focus: Ring-2 Green-500, border transparent
  - Error: Border Red-300, ring Red-500
```

#### Card Component
```
Name: Card
Properties:
  - Type: Default | Premium | Feature
  - Hover Effect: None | Lift | Highlight

Default:
  - Background: White
  - Border: 1px Gray-200
  - Border Radius: 16px (rounded-2xl)
  - Shadow: 0 10px 15px
  - Padding: p-6
  
Premium (Frosted Glass):
  - Background: White 80% opacity
  - Blur: 40px (backdrop-blur-xl)
  - Border: 1px Gray-200 50% opacity
  - Shadow: 0 25px 50px
  - Padding: p-8 (desktop), p-6 (tablet)
```

---

## 📐 Key Numbers & Values

### Spacing Scale
```
4px (xs), 8px (sm), 12px, 16px (md), 20px, 24px (lg), 32px (xl), 48px, 64px
```

### Typography
```
Primary Font: Inter (fallback: system-ui)

Headings:
  H1: 48px, 700 weight, 1.2 line-height
  H2: 36px, 700 weight, 1.2 line-height
  H3: 30px, 700 weight, 1.3 line-height
  H4: 24px, 700 weight, 1.4 line-height
  H5: 20px, 600 weight, 1.4 line-height

Body:
  Body-lg: 18px, 400 weight, 1.75 line-height
  Body: 16px, 400 weight, 1.5 line-height
  Body-sm: 14px, 400 weight, 1.5 line-height
  Caption: 12px, 400 weight, 1.5 line-height
```

### Border Radius
```
Small: 8px (rounded-lg)
Medium: 12px (rounded-xl)
Large: 16px (rounded-2xl)
Extra Large: 24px (rounded-3xl)
```

### Shadows
```
sm: 0 1px 2px rgba(0,0,0,0.05)
md: 0 4px 6px rgba(0,0,0,0.1)
lg: 0 10px 15px rgba(0,0,0,0.1)
xl: 0 20px 25px rgba(0,0,0,0.1)
2xl: 0 25px 50px rgba(0,0,0,0.25)
```

---

## 📱 Responsive Breakpoints

**Mobile-first approach:**

| Breakpoint | Width | Usage |
|---|---|---|
| Default (mobile) | 0px+ | Single column, full width |
| sm | 640px+ | Small optimizations |
| md | 768px+ | 2-column layouts |
| lg | 1024px+ | Full multi-column layouts |
| xl | 1280px+ | Extra-large screens |

### Common Patterns

```
1. Hero Section:
   Mobile: 1 column (full width)
   Desktop: 2 columns (left: content, right: image/visual)

2. Feature Cards:
   Mobile: 1 column
   Tablet: 2 columns (md:grid-cols-2)
   Desktop: 3-4 columns (lg:grid-cols-4)

3. Padding Responsive:
   Mobile: p-4 (16px)
   Tablet: p-6 (24px)
   Desktop: p-8 (32px)

4. Hide/Show:
   Desktop only: hidden lg:block
   Mobile only: block md:hidden
```

---

## 🧩 Page Layouts

### Login Page Layout
```
┌─────────────────────────────────────┐
│   bg-linear-to-br (gradient bg)      │
│                                      │
│  ┌────────────────────────────────┐ │
│  │  bg-white/80 backdrop-blur-xl  │ │
│  │  rounded-3xl shadow-2xl        │ │
│  │                                │ │
│  │  ┌─────────────┬──────────────┐│ │
│  │  │ Form (left) │ Features     ││ │
│  │  │ logo        │ (right, hide ││ │
│  │  │ inputs      │  on mobile)  ││ │
│  │  │ button      │              ││ │
│  │  └─────────────┴──────────────┘│ │
│  └────────────────────────────────┘ │
│                                      │
└─────────────────────────────────────┘

Grid: grid-cols-1 lg:grid-cols-2
Left padding: p-8 lg:p-12
Right background: linear-gradient(to-br, green-600, teal-500)
Max width: max-w-6xl (1280px)
```

### Home Page Sections
```
1. Navigation Bar
   - Sticky top, z-50
   - Logo + Buttons
   - Height: h-20

2. Hero Section
   - 2-column grid on desktop
   - Left: Title, description, buttons, stats
   - Right: Floating cards (hidden on mobile)
   - Background: linear gradient

3. Features Section
   - 4-column grid
   - Feature cards with icon, title, description
   - Hover effect: border-green-500, shadow increase, -translate-y-2

4. Services Section
   - 3-column grid
   - Service cards, 1 marked as "popular" (scale-105, border-green-500)

5. CTA Section
   - Full-width gradient (green-600 to green-800)
   - White text, centered
   - 2 buttons

6. Footer
   - dark background (gray-900)
   - 4-column layout
   - Links + copyright
```

---

## 🎯 Icons to Use

**Library**: Lucide React (use similar style from Figma Icons library)

### Navigation Icons
- Menu (hamburger)
- X (close)
- Home (dashboard)
- Search
- Package (services)
- ShoppingCart (orders)
- Wallet
- User (profile)
- LogOut
- MessageSquare (chat)

### UI Icons
- Eye (show password)
- EyeOff (hide password)
- Mail
- Lock
- AlertCircle (error)
- Star (rating)

### Content Icons
- DollarSign (money)
- Shield (security)
- Users (community)
- TrendingUp (growth)
- FileText (documents)
- Clock (time)
- ArrowRight (action)
- Plus (add)
- Zap (speed)
- Award (achievement)

**Icon Sizing**: 16px (sm), 20px (md), 24px (lg), 32px (xl)

---

## ✨ Effects & Interactions

### Hover States
- **Cards**: `shadow-xl`, `border-green-500`, `-translate-y-2`
- **Buttons**: `from-green-700 to-green-600`, `shadow-xl`, `-translate-y-0.5`
- **Items**: `scale-105`, `opacity-80`, `translate-x-1`

### Focus States
- **Inputs**: `ring-2 ring-green-500`, `border-transparent`
- **Buttons**: `ring-2 ring-offset-2 ring-green-500`

### Disabled States
- **opacity-50**
- **cursor-not-allowed**

### Transitions
- **duration**: 300ms default
- **properties**: all, colors, transform, opacity

### Animations
- **Loading**: `animate-spin` (spinner)
- **Fade**: `animate-pulse`

---

## 📊 Color Usage Guide

### Green (#22c55e, #16a34a)
- Primary brand color
- Buttons (normal & hover)
- Links
- Active states
- Success messages

### Gray (#111827 - #f9fafb)
- Text (dark gray for content)
- Backgrounds (light gray)
- Borders
- Disabled states

### White (#ffffff)
- Card backgrounds
- Text on colored backgrounds
- Page backgrounds (combined with gradient)

### Red (#ef4444)
- Error states
- Danger buttons
- Error messages

### Blue (#3b82f6)
- Secondary links
- Info messages
- Alternative accents

---

## 🚀 Implementation Checklist

- [ ] Import all color styles to Figma
- [ ] Create gradient styles
- [ ] Build Button component (all variants)
- [ ] Build Input component (all variants)
- [ ] Build Card components
- [ ] Create Badge/Pill components
- [ ] Build Avatar component
- [ ] Create StarRating component
- [ ] Build Login page layout
- [ ] Build Sign Up page layout
- [ ] Build Home page (all sections)
- [ ] Build Dashboard layout
- [ ] Add responsive variants (mobile, tablet, desktop)
- [ ] Create interaction prototypes
- [ ] Test all hover/focus/disabled states
- [ ] Setup component library for team sharing
- [ ] Document components in Figma

---

## 💡 Tips for Designers

1. **Use Grid System**: Create 12-column or 16-column grid for consistency
2. **Create Shared Library**: Setup Figma Team Library for reusable components
3. **Responsive Design**: Always design for 3 viewports: 375px (mobile), 768px (tablet), 1280px (desktop)
4. **Auto Layout**: Use Figma's auto-layout feature for flexible components
5. **Component Variants**: Create variants for different states (hover, focus, disabled)
6. **Variables**: Use Figma Variables for colors, sizes, and spacing
7. **Prototyping**: Connect screens with interactions (click → navigate, hover → show state)
8. **Documentation**: Add notes/descriptions to components for developer handoff

---

## 📁 File Structure

```
FinalProject_WebDev/
├── FIGMA_DESIGN_SYSTEM.md              # Full documentation
├── FIGMA_DESIGN_SYSTEM.json            # Structured data
├── FIGMA_DESIGN_SYSTEM_PREVIEW.html    # Visual preview
├── README_DESIGN.md                    # This file
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignUpPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   └── ...
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   └── ...
│   │   └── ...
│   └── ...
└── ...
```

---

## 🔗 Resources

- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Lucide Icons**: https://lucide.dev/
- **Figma Best Practices**: https://www.figma.com/best-practices/
- **Design Systems**: https://www.designsystems.com/

---

## 📞 Questions?

Jika ada pertanyaan atau klarifikasi tentang design system:
1. Lihat file **FIGMA_DESIGN_SYSTEM.md** untuk detail lengkap
2. Buka **FIGMA_DESIGN_SYSTEM_PREVIEW.html** di browser untuk preview visual
3. Check **FIGMA_DESIGN_SYSTEM.json** untuk data terstruktur

---

**Last Updated**: November 19, 2025  
**Version**: 1.0  
**Project**: FinancePro - FinalProject_WebDev

