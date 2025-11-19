# FinancePro - Design System untuk Figma

**Dokumentasi Design System FinancePro**  
Generated: November 19, 2025  
Project: FinalProject_WebDev (Frontend)

---

## 📋 Daftar Isi
1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Spacing & Layout](#spacing--layout)
4. [Components](#components)
5. [Pages](#pages)
6. [Effects & Animations](#effects--animations)
7. [Icons](#icons)
8. [Responsive Breakpoints](#responsive-breakpoints)

---

## 🎨 Color Palette

### Primary Colors (Hijau - Brand Color)
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Green-50 | #f0fdf4 | rgb(240, 253, 244) | Background light |
| Green-100 | #dcfce7 | rgb(220, 252, 231) | Accent background |
| Green-500 | #22c55e | rgb(34, 197, 94) | Buttons, gradients |
| Green-600 | #16a34a | rgb(22, 163, 74) | Primary button, active state |
| Green-700 | #15803d | rgb(21, 128, 61) | Hover state, dark accent |
| Green-800 | #166534 | rgb(22, 101, 52) | Dark mode variant |

### Secondary Colors (Teal - Accent)
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Teal-500 | #14b8a6 | rgb(20, 184, 166) | Gradient endpoint, accent |

### Neutral Colors (Gray/White)
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| White | #ffffff | rgb(255, 255, 255) | Backgrounds, cards |
| Gray-50 | #f9fafb | rgb(249, 250, 251) | Light background |
| Gray-100 | #f3f4f6 | rgb(243, 244, 246) | Subtle background |
| Gray-200 | #e5e7eb | rgb(229, 231, 235) | Borders, dividers |
| Gray-300 | #d1d5db | rgb(209, 213, 219) | Input borders |
| Gray-400 | #9ca3af | rgb(156, 163, 175) | Placeholder text, icons |
| Gray-600 | #4b5563 | rgb(75, 85, 99) | Secondary text |
| Gray-700 | #374151 | rgb(55, 65, 81) | Labels, secondary text |
| Gray-900 | #111827 | rgb(17, 24, 39) | Primary text, headings |

### Additional Colors
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Blue-50 | #eff6ff | rgb(239, 246, 255) | Background gradient |
| Blue-500 | #3b82f6 | rgb(59, 130, 246) | Links |
| Blue-100 | #dbeafe | rgb(219, 234, 254) | Feature card background |
| Purple-100 | #f3e8ff | rgb(243, 232, 255) | Feature card background |
| Yellow-400 | #facc15 | rgb(250, 204, 21) | Star rating |
| Yellow-500 | #eab308 | rgb(234, 179, 8) | Star rating |
| Red-500 | #ef4444 | rgb(239, 68, 68) | Error, danger |
| Red-600 | #dc2626 | rgb(220, 38, 38) | Error hover |

### Gradient Definitions

#### 1. Background Page Gradient (to-br / to bottom-right)
```
Linear Gradient: 315° (bottom-right)
From: #f8fafc (Slate-50)
Via: #eff6ff (Blue-50)
To: #f0fdf4 (Green-50)
```

#### 2. Button Primary Gradient (to-r / to right)
```
Linear Gradient: 90° (right)
From: #16a34a (Green-600)
To: #22c55e (Green-500)
Hover: From #15803d (Green-700) To #16a34a (Green-600)
```

#### 3. Feature Section Gradient (to-br / to bottom-right)
```
Linear Gradient: 315° (bottom-right)
From: #16a34a (Green-600)
Via: #22c55e (Green-500)
To: #14b8a6 (Teal-500)
```

#### 4. Card Background (Frosted Glass)
```
Background: rgba(255, 255, 255, 0.8) - White with 80% opacity
Backdrop Blur: 40px (backdrop-blur-xl)
Border: 1px solid rgba(229, 231, 235, 0.5) - Gray-200/50
```

---

## 🔤 Typography

### Font Family
- **Primary Font**: Inter, system-ui, Segoe UI, sans-serif
- **Fallback**: system-ui, -apple-system, sans-serif

### Heading Sizes
| Name | Size | Weight | Line Height | Letter Spacing | Usage |
|------|------|--------|-------------|----------------|-------|
| H1 | 48px (3rem) | 700 Bold | 1.2 | -0.02em | Main hero title |
| H2 | 36px (2.25rem) | 700 Bold | 1.2 | -0.02em | Section titles |
| H3 | 30px (1.875rem) | 700 Bold | 1.3 | -0.01em | Card titles (large) |
| H4 | 24px (1.5rem) | 700 Bold | 1.4 | 0 | Subheadings |
| H5 | 20px (1.25rem) | 600 Semibold | 1.4 | 0 | Card titles |

### Body Text
| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| Body-lg | 18px (1.125rem) | 400 Regular | 1.75 (28px) | Large descriptions |
| Body | 16px (1rem) | 400 Regular | 1.5 (24px) | Default body text |
| Body-sm | 14px (0.875rem) | 400 Regular | 1.5 (21px) | Secondary text, descriptions |
| Xs | 12px (0.75rem) | 400 Regular | 1.5 (18px) | Labels, captions, helper text |

### Text Colors
- **Primary**: #111827 (Gray-900) - Main text
- **Secondary**: #374151 (Gray-700) - Labels, subtitles
- **Tertiary**: #9ca3af (Gray-400) - Placeholder, disabled
- **White**: #ffffff - On colored backgrounds
- **Danger**: #ef4444 (Red-500) - Error messages

---

## 📐 Spacing & Layout

### Spacing Scale (Tailwind Standard)
```
0: 0px
1: 4px
2: 8px
3: 12px
4: 16px
5: 20px
6: 24px
8: 32px
10: 40px
12: 48px
16: 64px
20: 80px
24: 96px
```

### Common Spacing Used
- **Padding Card**: p-8 (32px) on desktop, p-6 (24px) on tablet, p-4 (16px) on mobile
- **Padding Form**: p-4 to p-6 (16px - 24px)
- **Gap Between Elements**: gap-4 to gap-8 (16px - 32px)
- **Margin Bottom Section**: mb-6 to mb-8 (24px - 32px)

### Layout Grid
- **Max Width**: max-w-7xl (80rem / 1280px)
- **Responsive Padding**: px-4 (mobile), sm:px-6, lg:px-8
- **Grid Columns**: 
  - Mobile: grid-cols-1 (single column)
  - Tablet: md:grid-cols-2
  - Desktop: lg:grid-cols-3 to lg:grid-cols-4

---

## 🧩 Components

### 1. Button Component

#### Button - Primary (Default)
```
Classes: bg-linear-to-r from-green-600 to-green-500 text-white rounded-xl px-4 py-3.5
Hover: from-green-700 to-green-600 shadow-xl transform hover:-translate-y-0.5
Focus: ring-2 ring-offset-2 ring-green-500
Disabled: opacity-50 cursor-not-allowed
```
- **Size**: Small (py-2.5), Medium (py-3.5), Large (py-4)
- **Font**: text-base font-semibold
- **Border Radius**: rounded-xl (12px)
- **Shadow**: shadow-lg hover:shadow-xl
- **Transition**: transition-all 300ms

#### Button - Secondary
```
Classes: bg-gray-100 text-gray-900 rounded-xl px-4 py-3.5 border-2 border-gray-300
Hover: border-green-600 text-green-600 bg-gray-50
```

#### Button - Outline
```
Classes: bg-transparent text-green-600 border-2 border-green-600 rounded-xl px-4 py-3.5
Hover: bg-green-50
```

#### Button - Danger
```
Classes: bg-red-600 text-white rounded-xl px-4 py-3.5
Hover: bg-red-700
```

### 2. Input Component

#### Input - Text/Email
```
Classes: px-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400
Focus: ring-2 ring-green-500 border-transparent
With Icon Left: pl-12 (with icon absolute left-4 top-11)
With Icon Right: pr-12 (for password toggle, search icon)
```
- **Font**: text-base
- **Border Radius**: rounded-xl (12px)
- **Placeholder Color**: #9ca3af (Gray-400)
- **Error State**: border-red-300 focus:ring-red-500
- **Disabled**: opacity-50 cursor-not-allowed

#### Input - Textarea
```
Classes: w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 resize-none
Focus: ring-2 ring-green-500 border-transparent
Min Height: min-h-24
```

### 3. Card Component

#### Card - Default
```
Classes: bg-white rounded-2xl p-6 shadow-lg border border-gray-200
Hover: shadow-xl border-green-500 (optional for clickable cards)
```

#### Card - Premium (Frosted Glass)
```
Classes: bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8 lg:p-12
Blur: 40px (backdrop-blur-xl)
```

#### Card - Feature
```
Classes: bg-linear-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200
Hover: hover:border-green-500 hover:shadow-2xl hover:-translate-y-2
Group Hover: group-hover:scale-110 (for icons inside)
```

### 4. Modal / Dialog Component

#### Modal - Backdrop
```
Classes: fixed inset-0 bg-black/50 z-40
Animation: fade in 300ms
```

#### Modal - Content
```
Classes: fixed inset-0 flex items-center justify-center z-50
Card: bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto
Padding: p-6 lg:p-8
```

### 5. Badge / Pill Component

#### Badge - Primary
```
Classes: inline-flex items-center space-x-2 px-4 py-2 bg-green-100 rounded-full border border-green-200
Text: text-sm font-semibold text-green-700
```

#### Badge - Rounded Pill
```
Classes: flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm
Text: font-medium
```

### 6. Loader / Spinner

```
Classes: animate-spin
SVG: 24x24px with strokeWidth="4"
Color: text-green-600 or text-white
```

### 7. Sidebar Component

#### Sidebar Container
```
Classes: fixed top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-lg z-40
Width: w-64 (open), w-0 lg:w-20 (closed/mobile)
Transition: transition-all duration-300
```

#### Sidebar Item - Active
```
Classes: bg-green-600 text-white rounded-lg px-4 py-3
```

#### Sidebar Item - Inactive
```
Classes: text-gray-700 hover:bg-gray-100 rounded-lg px-4 py-3
```

### 8. Avatar Component

```
Classes: h-10 w-10 (or h-12 w-12) rounded-full overflow-hidden bg-gray-200
Image: object-cover h-full w-full
Fallback Icon: User icon (Lucide)
```

### 9. Star Rating Component

```
Stars:
- Filled: Star with fill-current text-yellow-500 (rating <= stars)
- Empty: text-gray-300

Value: text-sm font-medium text-gray-700 ml-2

Sizes:
- sm: h-4 w-4
- md: h-5 w-5
- lg: h-6 w-6
```

---

## 📄 Pages

### 1. Login Page

#### Layout
```
- Full screen min-h-screen
- Background: linear-gradient(to-br, #f8fafc, #eff6ff, #f0fdf4)
- Container: max-w-6xl centered, bg-white/80 backdrop-blur-xl rounded-3xl
- Grid: grid-cols-1 lg:grid-cols-2
  - Left: Form area (p-8 lg:p-12)
  - Right: Features area (hidden lg:flex, gradient bg-linear-to-br from-green-600 to-teal-500)
```

#### Left Section - Form
- Logo: img h-16 centered
- Title: text-3xl font-bold text-gray-900
- Form: space-y-5
  - Email Input: Mail icon left, placeholder "Masukkan email Anda"
  - Password Input: Lock icon left, Eye/EyeOff toggle right
  - Submit Button: Gradient primary, full width, py-3.5, rounded-xl, shadow-lg
  - Link to Signup: "Tidak memiliki akun?" with Link to /signup

#### Right Section - Features (Desktop Only)
- Background: linear-gradient(to-br, #16a34a, #22c55e, #14b8a6)
- Content: text-white
- Title: text-4xl font-bold, "Selamat Datang Kembali!"
- Features: 3 items with icon (DollarSign, Shield, Users), title, description
- Badges: "100% Aman", "10rb+ Pengguna" with icons

### 2. Sign Up Page

#### Layout
```
- Similar to Login, but with 4 form fields
- Min height: min-h-[600px] lg:min-h-[500px]
- Form: space-y-4 (more compact than login)
```

#### Form Fields
1. **Fullname**: User icon, validation: min 2, max 50 chars
2. **Email**: Mail icon, regex validation
3. **Password**: Lock icon + toggle, validation: min 8 chars, upper+lower+digit
4. **Confirm Password**: Lock icon + toggle, must match password

#### Error Messages
```
Classes: flex items-center mt-1 text-sm text-red-600
Icon: AlertCircle h-4 w-4
Display: Only if error exists, with error.field value
```

#### Right Section - Features
- Similar to login but title: "Bergabung dengan FinancePro"
- 3 features: DollarSign, Shield, Users
- Badges: "100% Aman", "10rb+ Pengguna"

### 3. Home Page (Landing)

#### Navigation Bar
```
- bg-white/80 backdrop-blur-md, sticky top-0, z-50
- Max width: max-w-7xl, h-20, border-b border-gray-200
- Logo: TrendingUp icon + text "FinancePro"
- Buttons: Login (text link), SignUp (gradient button)
```

#### Hero Section
```
- Background: linear-gradient(to-br, #f0f4f8, #e8f5e9, #e0f2f1)
- Max width: max-w-7xl, py-24
- Grid: grid-cols-1 lg:grid-cols-2 gap-16

Left Content:
- Badge: green-100 bg with Shield icon, "Platform Terpercaya #1 Indonesia"
- Title: text-5xl lg:text-6xl font-bold
  - "Temukan Ahli" + gradient text "Keuangan Profesional"
- Description: text-xl text-gray-600
- Buttons:
  - Primary: gradient button, "Mulai Sekarang" with ArrowRight icon
  - Secondary: outline button, "Jelajahi Jasa"
- Stats: 3 columns (500+ Freelancer, 1000+ Project, 4.9/5 Rating)

Right Content (Hidden on Mobile):
- 3 Floating Cards (with rotations: rotate-3, -rotate-3, rotate-6)
  - Card 1: FileText icon, "Laporan Keuangan", "Rp 500.000"
  - Card 2: DollarSign icon, "Konsultasi Pajak", "Rp 750.000"
  - Card 3: Clock icon, "Pembukuan Bulanan", "Rp 1.200.000"
- Main Card: gradient bg-linear-to-br from-green-600 to-green-800
  - Title: "Raih Kesuksesan Finansial"
  - Stars: 5 stars rating, "5.0"
```

#### Features Section
```
- Background: white, py-24
- Title: text-4xl font-bold, "Mengapa Memilih FinancePro?"
- Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8
- Feature Cards: 4 items with icon, title, description
  - Hover: border-green-500, shadow-2xl, -translate-y-2
```

#### Services Section
```
- Background: linear-gradient(to-br, #f0f4f8, #e0f7f4), py-24
- Title: "Layanan Populer"
- Grid: grid-cols-1 md:grid-cols-3 gap-8
- Service Cards: 4 items (1 is "Popular" with scale-105, border-2 border-green-500)
  - Title, description, price
  - Button: gradient if popular, gray if not
  - Badge: "Paling Populer" (only for popular card)
```

#### CTA Section
```
- Background: linear-gradient(to-r, #16a34a, #166534)
- Text: text-white, text-center
- Title: text-4xl lg:text-5xl font-bold
- Description: text-xl text-green-100
- Buttons:
  - Primary: white bg, green text, "Daftar Sebagai Client"
  - Secondary: green-700 bg, white text, border-2 border-white
```

#### Footer
```
- Background: gray-900, text-gray-300, py-12
- Grid: grid-cols-1 md:grid-cols-4 gap-8
- Columns:
  1. Logo + description (col-span-2)
  2. Links (Layanan)
  3. Links (Perusahaan)
  4. (implied)
- Bottom: border-t border-gray-800, copyright text center
```

### 4. Dashboard (Client & Freelancer)

#### Layout
```
- Sidebar + Main Content
- Sidebar: fixed, w-64 (open), w-20 (collapsed), transition-all
- Main: flex-1, overflow-auto
```

#### Sidebar Menu Items
**Client**:
- Dashboard (Home icon)
- Cari Jasa (Search icon)
- Pesanan Saya (ShoppingCart icon)
- Pesan (MessageSquare icon, with badge)

**Freelancer**:
- Dashboard (Home icon)
- Jasa Saya (Package icon)
- Buat Jasa (Plus icon)
- Pesanan (FileText icon)
- Dompet (Wallet icon)
- Pesan (MessageSquare icon, with badge)

#### Sidebar States
- **Active**: bg-green-600 text-white, rounded-lg
- **Inactive**: text-gray-700 hover:bg-gray-100
- **Badge**: red-600 bg, white text, text-xs font-semibold, px-2 py-0.5, rounded-full

---

## ✨ Effects & Animations

### Shadows
```
shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

### Blur Effects
```
backdrop-blur-sm: 4px
backdrop-blur-md: 12px
backdrop-blur-xl: 40px
```

### Hover Effects
```
- Cards: hover:shadow-xl, hover:border-green-500, hover:-translate-y-2
- Buttons: hover:from-green-700, hover:to-green-600, hover:shadow-xl, hover:-translate-y-0.5
- Scale: hover:scale-105
- Translate: hover:translate-x-1
- Opacity: hover:opacity-80
```

### Transitions
```
transition-all (all properties, 300ms default)
transition-colors (color properties)
transition-transform (scale, translate, rotate)
transition-opacity (opacity)
duration-300 (300ms)
duration-500 (500ms)
```

### Animations
```
animate-spin (loading spinners)
animate-pulse (fading effects)
```

### Focus States
```
focus:outline-none
focus:ring-2 focus:ring-green-500
focus:ring-offset-2 (for buttons)
focus:border-transparent
```

### Disabled States
```
disabled:opacity-50
disabled:cursor-not-allowed
opacity-50 (for disabled)
```

---

## 🎯 Icons

### Icon Library: Lucide React

#### Common Icons Used
```
Navigation:
- Menu (Sidebar toggle)
- X (Close)
- Home (Dashboard)
- Search (Search)
- Package (Services/Products)
- ShoppingCart (Orders)
- Wallet (Payments)
- User (Profile)
- LogOut (Logout)
- MessageSquare (Messages)

UI Elements:
- Eye (Show password)
- EyeOff (Hide password)
- Mail (Email)
- Lock (Password)
- AlertCircle (Error message)
- Star (Rating)

Content:
- DollarSign (Money/Price)
- Shield (Security/Protection)
- Users (Community)
- TrendingUp (Growth/Analytics)
- FileText (Documents)
- Clock (Time/Duration)
- ArrowRight (Action/Next)
- Plus (Add/Create)
- Zap (Speed/Lightning)
- Award (Achievement)

Sizing:
- sm: h-4 w-4
- md: h-5 w-5, h-6 w-6
- lg: h-7 w-7
- xl: h-8 w-8
```

#### Icon Colors
```
- Primary: text-green-600
- Secondary: text-gray-400
- White: text-white
- In buttons: inherit from text color
- Error: text-red-600
- Success: text-green-600
- Info: text-blue-600
```

---

## 📱 Responsive Breakpoints

### Tailwind Breakpoints
```
Default (Mobile First)
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Common Responsive Patterns Used

#### 1. Full Width to 2 Columns
```html
grid-cols-1 lg:grid-cols-2
```

#### 2. Single to Multiple Columns
```html
md:grid-cols-2 lg:grid-cols-3 (Hero cards)
md:grid-cols-2 lg:grid-cols-4 (Features)
```

#### 3. Padding Responsive
```html
p-4 sm:p-6 lg:p-8 (General padding)
py-8 lg:py-12 (Section padding)
px-4 sm:px-6 lg:px-8 (Horizontal padding)
```

#### 4. Text Size Responsive
```html
text-2xl sm:text-3xl lg:text-4xl (Headings)
text-base lg:text-lg (Body text)
```

#### 5. Display Toggle
```html
hidden lg:block (Show on desktop only)
lg:hidden (Hide on desktop, show on mobile)
block md:hidden (Show on mobile, hide on tablet+)
```

#### 6. Sidebar Responsive
```html
w-64 (open, desktop)
w-0 lg:w-20 (collapsed)
fixed lg:static (Mobile: fixed overlay, Desktop: static)
```

---

## 🔧 Implementation Guide

### Untuk Figma Designer:

1. **Import Color Palette**:
   - Buat Color Style untuk setiap hex
   - Contoh: "Primary/Green-500" → #22c55e
   - Buat Group: Primary, Neutral, Secondary

2. **Create Component Library**:
   - Button (dengan variants: Primary, Secondary, Outline, Danger)
   - Input (Text, Email, Password, Textarea)
   - Card (Default, Premium, Feature)
   - Badge/Pill
   - Avatar
   - StarRating

3. **Build Pages**:
   - Login Page (2-column layout)
   - Sign Up Page (2-column layout)
   - Home Page (Hero + Features + Services + CTA + Footer)
   - Dashboard (Sidebar + Main content)

4. **Responsive Design**:
   - Create mobile (375px), tablet (768px), desktop (1280px) versions
   - Use Figma's responsive design features

5. **Prototype Interactions**:
   - Button hover states
   - Form validation error states
   - Sidebar open/close
   - Modal open/close

---

## 📝 Notes

- **Tailwind CSS**: Semua styling menggunakan Tailwind utility classes
- **Blur Effect**: Menggunakan `backdrop-blur-xl` (40px) untuk frosted glass effect
- **Gradients**: Menggunakan `linear-to-r` (right) dan `linear-to-br` (bottom-right)
- **Icons**: Dari Lucide React, import per icon yang diperlukan
- **Responsive**: Mobile-first approach, expand ke lg breakpoint (1024px+)
- **Brand Color**: Hijau (#22c55e dan #16a34a) sebagai primary color

---

## 🎬 Next Steps

1. Import color palette sebagai Color Styles di Figma
2. Create base components (Button, Input, Card)
3. Build page layouts menggunakan components
4. Add interactions dan hover states
5. Create responsive variants (mobile, tablet, desktop)
6. Setup library sharing untuk team

---

*Last Updated: November 19, 2025*

