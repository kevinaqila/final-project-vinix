# Withdrawal Auto-Complete Setup Guide

## 📋 Overview
Sistem withdrawal dengan auto-complete yang menggunakan external cron service untuk production-ready deployment.

## ⚙️ Features
- ✅ Admin fee Rp 7,000 langsung dipotong saat request
- ✅ Auto-complete withdrawal setelah 5 menit (untuk testing)
- ✅ Production-ready tanpa node-cron
- ✅ Protected endpoint dengan secret key

## 🔧 Setup untuk Testing (Setiap 5 Menit)

### 1. Environment Variables
Tambahkan di `.env` atau Vercel environment:
```
CRON_SECRET_KEY=your_super_secret_cron_key_12345
```

### 2. Setup Cron Service

#### Option A: EasyCron (Recommended)
1. Daftar di [EasyCron](https://www.easycron.com)
2. Create new cron job:
   - **URL**: `https://your-api.vercel.app/api/wallet/auto-complete`
   - **Method**: `POST`
   - **Headers**:
     ```
     x-cron-secret: your_super_secret_cron_key_12345
     Content-Type: application/json
     ```
   - **Schedule**: Setiap 5 menit (`*/5 * * * *`)
   - **Timezone**: Asia/Jakarta

#### Option B: Google Cloud Scheduler
```bash
gcloud scheduler jobs create http test-withdrawal-autocomplete \
  --schedule="*/5 * * * *" \
  --uri="https://your-api.vercel.app/api/wallet/auto-complete" \
  --http-method=POST \
  --headers="x-cron-secret=your_super_secret_cron_key_12345,Content-Type=application/json" \
  --time-zone="Asia/Jakarta"
```

#### Option C: Manual Testing dengan cURL
```bash
curl -X POST https://your-api.vercel.app/api/wallet/auto-complete \
  -H "x-cron-secret: your_super_secret_cron_key_12345" \
  -H "Content-Type: application/json"
```

## 🔄 Flow Withdrawal

1. **User Request Withdrawal**
   - Admin fee Rp 7,000 langsung dipotong
   - Status: "pending"
   - autoCompleteAt: 5 menit dari sekarang

2. **Auto-Complete Process** (setiap 5 menit)
   - Cron service hit endpoint `/api/wallet/auto-complete`
   - Cari withdrawal dengan `autoCompleteAt <= now`
   - Update status ke "completed"
   - Potong amount dari wallet balance

3. **Manual Check** (opsional)
   - User buka halaman wallet/history
   - Sistem otomatis check & complete withdrawal yang sudah lewat waktu

## 📊 API Endpoints

### POST /api/wallet/auto-complete
**Protected endpoint untuk cron service**
- Headers: `x-cron-secret: <CRON_SECRET_KEY>`
- Response: Jumlah withdrawal yang diproses

### GET /api/wallet/history
**Auto-check & complete withdrawal saat user akses**
- Tidak perlu cron service, tapi kurang reliable untuk production

## 🔒 Security
- Endpoint protected dengan `CRON_SECRET_KEY`
- Hanya bisa diakses dari cron service yang trusted
- Rate limiting recommended untuk production

## 🧪 Testing Steps

1. **Request Withdrawal**
   ```javascript
   POST /api/wallet/withdraw
   {
     "amount": 100000,
     "bankName": "BCA",
     "accountNumber": "1234567890",
     "accountName": "John Doe"
   }
   ```

2. **Check Status**
   ```javascript
   GET /api/wallet/history
   // Status: "pending", autoCompleteAt: 5 menit lagi
   ```

3. **Trigger Auto-Complete**
   ```bash
   # Manual trigger atau tunggu 5 menit
   curl -X POST https://your-api.vercel.app/api/wallet/auto-complete \
     -H "x-cron-secret: your_super_secret_cron_key_12345"
   ```

4. **Verify Completion**
   ```javascript
   GET /api/wallet/history
   // Status: "completed", balance berkurang amount withdrawal
   ```

## 🚀 Production Setup

Untuk production, ubah durasi dari 5 menit menjadi 3 hari:
```javascript
autoCompleteAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 hari
```

Dan setup cron job untuk berjalan setiap hari:
- Schedule: `0 0 * * *` (setiap hari jam 00:00)