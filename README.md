# 🐋 BelugaChat

Rastgele WebRTC Video Chat Uygulaması

## 📁 Dosya Yapısı

```
belugachat/
├── server.js          ← Node.js signaling sunucusu
├── package.json       ← Bağımlılıklar
├── README.md
└── public/
    └── index.html     ← Tüm frontend
```

---

## 🚀 Yerel Kurulum (Bilgisayarında Test Et)

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. Sunucuyu başlat
npm start

# 3. Tarayıcıda aç
# http://localhost:3000
```

> ⚠️ Kamera için HTTPS şart! Yerel testte Chrome'da şu adresi aç:
> `chrome://flags/#unsafely-treat-insecure-origin-as-secure`
> Oraya `http://localhost:3000` ekle.

---

## ☁️ Railway ile Deploy (Ücretsiz, 5 Dakika)

1. [railway.app](https://railway.app) → GitHub ile giriş yap
2. **New Project** → **Deploy from GitHub repo**
3. Bu klasörü bir GitHub reposuna yükle, Railway'e bağla
4. Railway otomatik `npm start` çalıştırır ve HTTPS verir
5. Aldığın URL'yi arkadaşlarınla paylaş 🎉

---

## ☁️ Render ile Deploy (Ücretsiz)

1. [render.com](https://render.com) → New → **Web Service**
2. GitHub reposunu bağla
3. Build command: `npm install`
4. Start command: `node server.js`
5. Deploy!

---

## 🔧 TURN Sunucusu Ekleme (Farklı Ağlar İçin Şart)

`public/index.html` içindeki `ICE_CONFIG` bölümünü düzenle:

```javascript
const ICE_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    {
      urls: 'turn:YOUR_TURN_SERVER:3478',
      username: 'YOUR_USERNAME',
      credential: 'YOUR_PASSWORD'
    }
  ]
};
```

**Ücretsiz TURN:** [metered.ca](https://www.metered.ca) → ücretsiz plan mevcut

---

## 🔑 Google Auth Ekleme (Opsiyonel)

`index.html` içindeki `googleLogin()` fonksiyonunu Firebase ile değiştir:

```javascript
// Firebase SDK ekle, sonra:
const provider = new GoogleAuthProvider();
signInWithPopup(auth, provider).then((result) => {
  const user = result.user;
  document.getElementById('sname').textContent = user.displayName;
  document.getElementById('semail').textContent = user.email;
  enterChat();
});
```
