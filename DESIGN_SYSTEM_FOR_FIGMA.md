# Design System for Figma - FinancePro Platform

## 🎨 **Color Palette**

### Primary Colors
- **Green Primary**: `#22c55e` (emerald-500)
- **Green Dark**: `#16a34a` (emerald-600)
- **Green Light**: `#dcfce7` (emerald-100)

### Secondary Colors
- **Blue Primary**: `#3b82f6` (blue-500)
- **Blue Dark**: `#1d4ed8` (blue-700)
- **Blue Light**: `#dbeafe` (blue-100)

- **Purple Primary**: `#8b5cf6` (purple-500)
- **Purple Dark**: `#7c3aed` (purple-600)
- **Purple Light**: `#ede9fe` (purple-100)

- **Amber/Yellow Primary**: `#f59e0b` (amber-500)
- **Amber Dark**: `#d97706` (amber-600)
- **Amber Light**: `#fef3c7` (amber-100)

### Neutral Colors
- **White**: `#ffffff`
- **Gray 50**: `#f9fafb`
- **Gray 100**: `#f3f4f6`
- **Gray 200**: `#e5e7eb`
- **Gray 300**: `#d1d5db`
- **Gray 400**: `#9ca3af`
- **Gray 500**: `#6b7280`
- **Gray 600**: `#4b5563`
- **Gray 700**: `#374151`
- **Gray 800**: `#1f2937`
- **Gray 900**: `#111827`

### Gradient Backgrounds
- **Primary Gradient**: `linear-gradient(135deg, #22c55e 0%, #16a34a 100%)`
- **Hero Background**: `linear-gradient(135deg, #f9fafb 0%, #dcfce7 100%)`
- **CTA Background**: `linear-gradient(135deg, #16a34a 0%, #15803d 100%)`
- **Card Hover**: `linear-gradient(135deg, #f3f4f6 0%, #ffffff 100%)`

---

## 📝 **Typography**

### Font Family
- **Primary**: System default (Inter, -apple-system, sans-serif)
- **No custom fonts used**

### Text Sizes & Weights
- **Hero Title**: `text-5xl lg:text-6xl` (48px-60px), `font-bold` (700)
- **Section Title**: `text-4xl` (36px), `font-bold` (700)
- **Card Title**: `text-2xl` (24px), `font-bold` (700)
- **Body Large**: `text-xl` (20px), `font-medium` (500)
- **Body Regular**: `text-lg` (18px), `font-normal` (400)
- **Body Small**: `text-base` (16px), `font-medium` (500)
- **Label**: `text-sm` (14px), `font-medium` (500)
- **Caption**: `text-xs` (12px), `font-medium` (500)

---

## 🧩 **Components & Usage**

### Buttons

#### Primary Button
- **Used in**: LoginPage (submit), SignUpPage (register), HomePage (CTA), Dashboard headers
- **Styles**: `bg-linear-to-r from-green-600 to-green-700`, rounded-xl, shadow-lg, hover:scale-105
- **Text**: White, font-bold
- **Padding**: px-6 py-3 (24px 12px)

#### Secondary Button
- **Used in**: HomePage (explore services), Service cards
- **Styles**: `bg-white border-2 border-gray-300`, rounded-xl, hover:border-green-600
- **Text**: Gray-900, font-bold
- **Padding**: px-6 py-3

#### Category Pills
- **Used in**: ServicesPage (category filters)
- **Styles**: `bg-gray-100 hover:bg-gray-200`, rounded-lg, transform hover:scale-105
- **Active**: `bg-linear-to-r from-green-600 to-green-700 text-white`

### Input Fields

#### Search Input
- **Used in**: ClientDashboard (hero search), ServicesPage (main search)
- **Styles**: `bg-white rounded-xl shadow-2xl`, pl-14 pr-6 py-4
- **Icon**: Search (left), green on focus
- **Focus**: `focus:ring-4 focus:ring-green-300`

#### Form Input
- **Used in**: LoginPage, SignUpPage
- **Styles**: `bg-gray-50 border border-gray-300 rounded-xl`, px-4 py-3
- **Focus**: `focus:ring-2 focus:ring-green-500 focus:border-green-500`

### Cards

#### Service Card
- **Used in**: ServicesPage (service grid)
- **Styles**: `bg-white rounded-2xl shadow-lg`, p-6, hover:shadow-2xl hover:-translate-y-2
- **Border**: `border border-gray-100`
- **Elements**: Category badge (top-right), freelancer avatar, title, rating, price

#### Stats Card
- **Used in**: ClientDashboard, FreelancerDashboard
- **Styles**: `bg-linear-to-br from-[color] to-[color]`, rounded-2xl, p-6, text-white
- **Colors**: blue-500→blue-600, purple-500→purple-600, emerald-500→emerald-600, amber-500→amber-600

#### Feature Card
- **Used in**: HomePage (features section)
- **Styles**: `bg-linear-to-br from-gray-50 to-white`, rounded-2xl, p-8, border border-gray-200
- **Hover**: `hover:border-green-500 hover:shadow-2xl hover:-translate-y-2`

### Navigation

#### Sidebar
- **Used in**: All dashboard pages
- **Styles**: Fixed left, bg-white, shadow-lg, collapsible
- **Width**: 280px (expanded), 80px (collapsed)
- **Items**: Icon + text, hover effects with green accent

#### Top Navigation
- **Used in**: HomePage
- **Styles**: `bg-white/80 backdrop-blur-md`, sticky top, shadow-lg
- **Logo**: Green icon + FinancePro text

### Other Components

#### Star Rating
- **Used in**: Service cards, reviews
- **Styles**: Yellow stars, size variants (sm, md, lg)
- **Interactive**: Clickable for reviews

#### Loading Spinner
- **Used in**: Loading states
- **Styles**: Green color, animate-spin

#### Modal
- **Used in**: Confirmations, forms
- **Styles**: `bg-white rounded-2xl shadow-2xl`, centered overlay

---

## 📱 **Page Layouts**

### HomePage (Landing)
```
┌─────────────────────────────────────┐
│ [Navigation Bar]                    │
│ Logo + Menu + Auth Buttons          │
├─────────────────────────────────────┤
│ [Hero Section]                      │
│ Title + Description + CTA Buttons   │
│ + Floating Service Cards            │
├─────────────────────────────────────┤
│ [Features Section]                  │
│ 4 Feature Cards Grid                │
├─────────────────────────────────────┤
│ [Services Section]                  │
│ Service Cards + Popular Badge       │
├─────────────────────────────────────┤
│ [CTA Section]                       │
│ Full-width green gradient           │
├─────────────────────────────────────┤
│ [Footer]                            │
│ Links + Company Info                │
└─────────────────────────────────────┘
```

### ClientDashboard
```
┌─────────────────────────────────────┐
│ [Sidebar] [Main Content]            │
│         ┌─────────────────────────┐ │
│         │ [Hero Search Banner]    │ │
│         │ Dark overlay + Search   │ │
│         ├─────────────────────────┤ │
│         │ [Stats Cards] 3-col     │ │
│         │ Blue/Yellow/Green       │ │
│         ├─────────────────────────┤ │
│         │ [Categories Grid]       │ │
│         │ Service categories      │ │
│         ├─────────────────────────┤ │
│         │ [Platform Stats]        │ │
│         │ 3 stats with icons      │ │
│         └─────────────────────────┘ │
└─────────────────────────────────────┘
```

### FreelancerDashboard
```
┌─────────────────────────────────────┐
│ [Sidebar] [Main Content]            │
│         ┌─────────────────────────┐ │
│         │ [Header Banner]         │ │
│         │ Green gradient + CTA    │ │
│         ├─────────────────────────┤ │
│         │ [Stats Grid] 4-col      │ │
│         │ Blue/Purple/Emerald/Amber│ │
│         ├─────────────────────────┤ │
│         │ [Order Status Cards]    │ │
│         │ 3 cards with borders     │ │
│         ├─────────────────────────┤ │
│         │ [Recent Orders List]    │ │
│         │ Table with status badges │ │
│         └─────────────────────────┘ │
└─────────────────────────────────────┘
```

### ServicesPage
```
┌─────────────────────────────────────┐
│ [Sidebar] [Main Content]            │
│         ┌─────────────────────────┐ │
│         │ [Search Header]         │ │
│         │ Green gradient banner   │ │
│         ├─────────────────────────┤ │
│         │ [Category Pills]        │ │
│         │ Horizontal scroll       │ │
│         ├─────────────────────────┤ │
│         │ [Services Grid]         │ │
│         │ 1-4 columns responsive  │ │
│         └─────────────────────────┘ │
└─────────────────────────────────────┘
```

### LoginPage/SignUpPage
```
┌─────────────────────────────────────┐
│ [Background]                        │
│ Gradient from-slate-50 to-green-50  │
├─────────────────┬───────────────────┤
│ [Form Card]     │ [Visual Side]     │
│ White card      │ Gradient card     │
│ Form fields     │ Welcome text      │
│ Submit button   │ Features list     │
└─────────────────┴───────────────────┘
```

---

## 🎯 **Icons & Visual Elements**

### Lucide React Icons Used
- **Navigation**: Home, User, Briefcase, MessageSquare, Wallet, Settings, LogOut
- **Actions**: Search, Plus, Edit, Trash, Eye, EyeOff, Upload, Download
- **Status**: CheckCircle, Clock, AlertCircle, XCircle
- **Rating**: Star (filled/unfilled)
- **Services**: FileText, DollarSign, TrendingUp, Package, Shield, Award
- **UI**: ChevronLeft, ChevronRight, Menu, X, ArrowRight

### Effects & Animations
- **Hover**: `transform hover:scale-105`, `hover:-translate-y-2`
- **Transitions**: `transition-all duration-300`
- **Shadows**: `shadow-lg`, `shadow-2xl`, `shadow-[color]/50`
- **Backdrop**: `backdrop-blur-md`, `backdrop-blur-sm`

### Spacing System
- **Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Section Padding**: `py-24` (96px), `py-16` (64px), `py-12` (48px)
- **Card Padding**: `p-6` (24px), `p-8` (32px)
- **Element Spacing**: `space-x-4` (16px), `space-y-8` (32px)

---

## 📐 **Breakpoints & Responsive**

### Tailwind Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

### Grid Systems
- **1 column**: Mobile default
- **2 columns**: `md:grid-cols-2` (768px+)
- **3 columns**: `lg:grid-cols-3` (1024px+)
- **4 columns**: `xl:grid-cols-4` (1280px+)

### Responsive Utilities
- **Text**: `text-lg md:text-xl lg:text-2xl`
- **Padding**: `px-4 sm:px-6 lg:px-8`
- **Flex**: `flex-col sm:flex-row`

---

## 🛠 **Implementation Guide for Figma**

### 1. **Setup Figma File Structure**
```
FinancePro Design System
├── 📁 Components
│   ├── Buttons
│   ├── Cards
│   ├── Inputs
│   ├── Navigation
│   └── Modals
├── 📁 Pages
│   ├── HomePage
│   ├── LoginPage
│   ├── ClientDashboard
│   ├── FreelancerDashboard
│   └── ServicesPage
├── 📁 Assets
│   ├── Icons
│   ├── Images
│   └── Logos
└── 📁 Styles
    ├── Colors
    ├── Typography
    └── Effects
```

### 2. **Create Color Styles**
- Import all colors as Figma color styles
- Name them: `Green/Primary/500`, `Green/Primary/600`, etc.
- Create gradient styles for backgrounds

### 3. **Build Component Library**
- Create master components for all reusable elements
- Use auto-layout for responsive behavior
- Add variants for different states (hover, active, disabled)

### 4. **Page Implementation**
- Start with wireframes using gray colors
- Apply design system colors and components
- Ensure responsive behavior across breakpoints

### 5. **Key Figma Features to Use**
- **Auto-layout**: For responsive components
- **Variants**: For button states, card types
- **Component properties**: For dynamic content
- **Grid layouts**: For consistent spacing
- **Constraints**: For responsive positioning

### 6. **Design Checklist**
- [ ] All colors from palette implemented
- [ ] Typography scales applied
- [ ] Components created with variants
- [ ] All pages laid out
- [ ] Responsive breakpoints tested
- [ ] Hover states and interactions defined
- [ ] Icons properly sized and colored

---

## 📋 **Quick Reference**

### Most Used Classes
- **Backgrounds**: `bg-white`, `bg-gray-50`, `bg-linear-to-r from-green-600 to-green-700`
- **Text**: `text-gray-900`, `text-gray-600`, `text-white`
- **Borders**: `border border-gray-200`, `rounded-xl`, `rounded-2xl`
- **Shadows**: `shadow-lg`, `shadow-2xl`
- **Spacing**: `p-6`, `m-4`, `space-y-4`

### Color Usage Patterns
- **Primary Actions**: Green gradients
- **Secondary Actions**: Gray with green borders
- **Success States**: Green (#22c55e)
- **Warning States**: Amber/Yellow
- **Info States**: Blue
- **Neutral**: Gray scale

This design system covers the entire FinancePro platform. Use it to create consistent, beautiful designs that match the existing codebase perfectly.