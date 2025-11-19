# Component Code Snippets & HTML Examples

## Untuk Di-Reference Figma Designer

---

## 1. Button Component Examples

### HTML (Copyable for Testing in Figma)

```html
<!-- Button - Primary -->
<button class="px-6 py-3.5 bg-linear-to-r from-green-600 to-green-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-green-700 hover:to-green-600 transform hover:-translate-y-0.5 transition-all">
  Masuk
</button>

<!-- Button - Secondary -->
<button class="px-6 py-3.5 bg-gray-100 text-gray-900 font-semibold rounded-xl border-2 border-gray-300 hover:border-green-600 hover:text-green-600 transition-all">
  Daftar
</button>

<!-- Button - Outline -->
<button class="px-6 py-3.5 bg-transparent text-green-600 border-2 border-green-600 font-semibold rounded-xl hover:bg-green-50 transition-all">
  Jelajahi
</button>

<!-- Button - Danger -->
<button class="px-6 py-3.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all">
  Delete
</button>

<!-- Button - Large -->
<button class="px-8 py-4 bg-linear-to-r from-green-600 to-green-500 text-white font-bold rounded-xl shadow-lg">
  Mulai Sekarang
</button>

<!-- Button - Small -->
<button class="px-4 py-2 bg-linear-to-r from-green-600 to-green-500 text-white text-sm font-semibold rounded-lg">
  OK
</button>

<!-- Button - Disabled -->
<button disabled class="px-6 py-3.5 bg-linear-to-r from-green-600 to-green-500 text-white font-semibold rounded-xl opacity-50 cursor-not-allowed">
  Loading...
</button>

<!-- Button - With Icon (Left) -->
<button class="flex items-center gap-2 px-6 py-3.5 bg-linear-to-r from-green-600 to-green-500 text-white font-semibold rounded-xl">
  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.5 1.5H2a1 1 0 00-1 1v15a1 1 0 001 1h16a1 1 0 001-1V10"/></svg>
  Download Report
</button>

<!-- Button - With Icon (Right) -->
<button class="flex items-center gap-2 px-6 py-3.5 bg-linear-to-r from-green-600 to-green-500 text-white font-semibold rounded-xl">
  Next
  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
</button>
```

---

## 2. Input Component Examples

```html
<!-- Text Input - Default -->
<div>
  <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
  <input type="email" placeholder="Masukkan email" class="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
</div>

<!-- Text Input - With Icon (Left) -->
<div>
  <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
  <div class="relative">
    <svg class="absolute left-4 top-4 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
    <input type="email" class="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500">
  </div>
</div>

<!-- Password Input - With Toggle -->
<div>
  <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
  <div class="relative">
    <svg class="absolute left-4 top-4 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
    <input type="password" class="w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500">
    <button class="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
    </button>
  </div>
</div>

<!-- Input - Error State -->
<div>
  <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
  <input type="email" class="w-full px-4 py-3.5 border border-red-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent">
  <p class="text-sm text-red-600 mt-1 flex items-center gap-1">
    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
    Email tidak valid
  </p>
</div>

<!-- Textarea -->
<div>
  <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
  <textarea class="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 resize-none min-h-24 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Tulis pesan Anda di sini..."></textarea>
</div>

<!-- Select Input -->
<div>
  <label class="block text-sm font-medium text-gray-700 mb-2">Pilih Layanan</label>
  <select class="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent">
    <option>Laporan Keuangan</option>
    <option>Konsultasi Pajak</option>
    <option>Audit Internal</option>
  </select>
</div>

<!-- Checkbox -->
<div class="flex items-center gap-2">
  <input type="checkbox" id="terms" class="h-5 w-5 border border-gray-300 rounded text-green-600 focus:ring-green-500 cursor-pointer">
  <label for="terms" class="text-sm text-gray-700">Saya setuju dengan syarat dan ketentuan</label>
</div>

<!-- Radio Button -->
<div class="space-y-2">
  <div class="flex items-center gap-2">
    <input type="radio" name="role" id="client" class="h-5 w-5 border border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer">
    <label for="client" class="text-sm text-gray-700">Saya adalah Client</label>
  </div>
  <div class="flex items-center gap-2">
    <input type="radio" name="role" id="freelancer" class="h-5 w-5 border border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer">
    <label for="freelancer" class="text-sm text-gray-700">Saya adalah Freelancer</label>
  </div>
</div>
```

---

## 3. Card Component Examples

```html
<!-- Card - Default -->
<div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:border-green-500 transition-all">
  <h4 class="text-lg font-bold text-gray-900 mb-2">Card Title</h4>
  <p class="text-sm text-gray-600">This is a simple card with shadow and border</p>
</div>

<!-- Card - Premium (Frosted Glass) -->
<div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8 lg:p-12">
  <h4 class="text-2xl font-bold text-gray-900 mb-3">Premium Card</h4>
  <p class="text-gray-600">Frosted glass effect with 40px blur</p>
</div>

<!-- Card - With Icon -->
<div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
  <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
    <svg class="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>
  </div>
  <h4 class="text-lg font-bold text-gray-900 mb-2">Feature Title</h4>
  <p class="text-sm text-gray-600">Description of the feature</p>
</div>

<!-- Card - Clickable/Hoverable -->
<div class="bg-linear-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 hover:border-green-500 hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer">
  <h4 class="text-2xl font-bold text-gray-900 mb-3">Layanan Populer</h4>
  <p class="text-gray-600 mb-4">Deskripsi layanan yang menarik</p>
  <button class="w-full py-3 bg-linear-to-r from-green-600 to-green-500 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-600">
    Lihat Detail
  </button>
</div>

<!-- Card - Service Card with Badge -->
<div class="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-green-500 scale-105">
  <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
    <span class="bg-linear-to-r from-green-600 to-green-700 text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg">
      Paling Populer
    </span>
  </div>
  <h3 class="text-2xl font-bold text-gray-900 mb-3">Konsultasi Pajak</h3>
  <p class="text-gray-600 mb-6">Konsultasi perpajakan dan pembukuan untuk kepatuhan bisnis</p>
  <p class="text-3xl font-bold text-green-600 mb-6">Mulai Rp 750.000</p>
</div>
```

---

## 4. Badge & Pill Components

```html
<!-- Badge - Primary -->
<span class="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 rounded-full border border-green-200">
  <svg class="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
  <span class="text-sm font-semibold text-green-700">100% Aman</span>
</span>

<!-- Badge - Status -->
<span class="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
  Aktif
</span>

<!-- Badge - Error -->
<span class="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
  Gagal
</span>

<!-- Badge - With Count -->
<span class="inline-block px-2 py-0.5 bg-red-600 text-white text-xs font-semibold rounded-full">
  3
</span>

<!-- Pill - Frosted -->
<span class="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm border border-white/30">
  <svg class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.172 16.172a4 4 0 015.656 0M9 10a4 4 0 118 0 4 4 0 01-8 0M12 12H8"/></svg>
  <span class="text-white font-medium">10rb+ Pengguna</span>
</span>
```

---

## 5. Avatar Component

```html
<!-- Avatar - With Image -->
<div class="h-10 w-10 rounded-full overflow-hidden">
  <img src="avatar.jpg" alt="User" class="h-full w-full object-cover">
</div>

<!-- Avatar - Fallback (Icon) -->
<div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
  <svg class="h-6 w-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/></svg>
</div>

<!-- Avatar - With Status Badge -->
<div class="relative">
  <img src="avatar.jpg" alt="User" class="h-10 w-10 rounded-full object-cover">
  <div class="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border border-white"></div>
</div>

<!-- Avatar - Group -->
<div class="flex -space-x-2">
  <img src="avatar1.jpg" class="h-8 w-8 rounded-full border-2 border-white" alt="">
  <img src="avatar2.jpg" class="h-8 w-8 rounded-full border-2 border-white" alt="">
  <img src="avatar3.jpg" class="h-8 w-8 rounded-full border-2 border-white" alt="">
  <div class="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">+2</div>
</div>
```

---

## 6. Star Rating Component

```html
<!-- Star Rating - 5 Stars -->
<div class="flex items-center space-x-1">
  <svg class="h-5 w-5 text-yellow-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
  <svg class="h-5 w-5 text-yellow-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
  <svg class="h-5 w-5 text-yellow-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
  <svg class="h-5 w-5 text-yellow-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
  <span class="ml-2 text-sm font-medium text-gray-700">5.0 (128 reviews)</span>
</div>

<!-- Star Rating - Partial (3.5 Stars) -->
<div class="flex items-center space-x-1">
  <svg class="h-5 w-5 text-yellow-500 fill-current" viewBox="0 0 20 20">/* filled */</svg>
  <svg class="h-5 w-5 text-yellow-500 fill-current" viewBox="0 0 20 20">/* filled */</svg>
  <svg class="h-5 w-5 text-yellow-500 fill-current" viewBox="0 0 20 20">/* filled */</svg>
  <svg class="h-5 w-5 text-gray-300" viewBox="0 0 20 20">/* empty */</svg>
  <svg class="h-5 w-5 text-gray-300" viewBox="0 0 20 20">/* empty */</svg>
  <span class="ml-2 text-sm font-medium">3.5</span>
</div>
```

---

## 7. Modal/Dialog Component

```html
<!-- Modal Overlay + Content -->
<div class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
  <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
    <!-- Modal Header -->
    <div class="flex items-center justify-between p-6 border-b border-gray-200">
      <h2 class="text-2xl font-bold text-gray-900">Konfirmasi Pembatalan</h2>
      <button class="text-gray-400 hover:text-gray-600">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
    
    <!-- Modal Body -->
    <div class="p-6">
      <p class="text-gray-600 mb-4">Apakah Anda yakin ingin membatalkan pesanan ini?</p>
    </div>
    
    <!-- Modal Footer -->
    <div class="flex gap-3 p-6 border-t border-gray-200">
      <button class="flex-1 px-4 py-2.5 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-all">
        Batal
      </button>
      <button class="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all">
        Ya, Batalkan
      </button>
    </div>
  </div>
</div>
```

---

## 8. Sidebar Component

```html
<!-- Sidebar Navigation -->
<aside class="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 shadow-lg z-40 flex flex-col">
  <!-- Logo Section -->
  <div class="p-4 border-b border-gray-200">
    <img src="logo.png" alt="FinancePro" class="h-8">
  </div>
  
  <!-- Navigation Menu -->
  <nav class="flex-1 overflow-y-auto py-4">
    <ul class="space-y-1 px-2">
      <!-- Active Item -->
      <li>
        <button class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-green-600 text-white">
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
          <span class="font-medium">Dashboard</span>
        </button>
      </li>
      
      <!-- Inactive Item -->
      <li>
        <button class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <span class="font-medium">Cari Jasa</span>
        </button>
      </li>
      
      <!-- Item with Badge -->
      <li>
        <button class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z"/></svg>
          <span class="font-medium">Pesan</span>
          <span class="ml-auto px-2 py-0.5 bg-red-600 text-white text-xs font-semibold rounded-full">3</span>
        </button>
      </li>
    </ul>
  </nav>
  
  <!-- User Profile Section -->
  <div class="border-t border-gray-200 p-4 space-y-2">
    <button class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
      <img src="avatar.jpg" alt="User" class="h-10 w-10 rounded-full object-cover">
      <div class="text-left">
        <p class="text-sm font-medium text-gray-900">John Doe</p>
        <p class="text-xs text-gray-600">Client</p>
      </div>
    </button>
    <button class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50">
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
      <span class="font-medium">Logout</span>
    </button>
  </div>
</aside>
```

---

## 9. Form Layout Example

```html
<!-- Complete Form -->
<form class="space-y-5 max-w-lg">
  <!-- Full Name -->
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
    <div class="relative">
      <svg class="absolute left-3 top-3.5 h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/></svg>
      <input type="text" placeholder="John Doe" class="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent">
    </div>
  </div>

  <!-- Email -->
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
    <div class="relative">
      <svg class="absolute left-3 top-3.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
      <input type="email" placeholder="john@example.com" class="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
    </div>
  </div>

  <!-- Submit Button -->
  <button type="submit" class="w-full py-2.5 bg-linear-to-r from-green-600 to-green-500 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-600">
    Submit
  </button>
</form>
```

---

## 10. Navigation Bar Example

```html
<!-- Navbar -->
<nav class="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-20">
      <!-- Logo -->
      <div class="flex items-center space-x-3">
        <div class="h-12 w-12 bg-linear-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
          <svg class="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10.5 1.5H2a1 1 0 00-1 1v15a1 1 0 001 1h16a1 1 0 001-1V10"/></svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold bg-linear-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            FinancePro
          </h1>
        </div>
      </div>

      <!-- Right Actions -->
      <div class="flex items-center space-x-4">
        <button class="px-6 py-2.5 text-gray-700 font-semibold hover:text-green-600 transition-colors">
          Login
        </button>
        <button class="px-6 py-2.5 bg-linear-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg">
          Sign Up
        </button>
      </div>
    </div>
  </div>
</nav>
```

---

**Note**: These are HTML snippets using Tailwind CSS. For Figma, recreate these designs using:
- Colors from the color palette
- Gradients as defined
- Spacing/padding values (convert px to Figma units)
- Shadow values as defined
- Border radius values

