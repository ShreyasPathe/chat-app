# 💬 Chat-app — A Secure Real-Time Chat Application

**Chat-app** is a full-stack, real-time messaging platform built with **React** and **Firebase**, featuring **end-to-end encryption (E2EE)** to ensure complete user privacy and secure communication.

---

## 🚀 Features

- 🔐 **End-to-End Encryption (E2EE)** – Messages are encrypted before leaving the sender and decrypted only by the receiver.
- ⚡ **Real-Time Messaging** – Built using Firebase Firestore for fast, live chat updates.
- 🔥 **Firebase Authentication** – Supports Google Sign-In and Email/Password auth.
- 🧾 **User Profiles** – Each user has a profile with display name and avatar.
- 👥 **Online Presence Detection** – Shows who is online.
- 📱 **Responsive Design** – Works seamlessly on desktop and mobile.
- 🌙 **Dark Mode** *(optional enhancement)*

---

## 🛠️ Tech Stack

- **Frontend:** React.js, TailwindCSS / CSS Modules
- **Backend:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Encryption:** AES or RSA (handled on client side for E2EE)
- **Hosting:** Firebase Hosting / Vercel / Netlify

---

## 📁 Folder Structure

```
chat-app/
├── public/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page-level components
│   ├── services/          # Firebase and encryption helpers
│   ├── utils/             # Utility functions
│   └── App.jsx            # Root component
├── .env                   # Firebase config (never commit this!)
├── package.json
└── README.md
```

---

## 🔧 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/ShreyasPathe/chat-app.git
cd chat-app
````

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

Create a `.env` file in the root and add your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Run the app locally

```bash
npm run dev
```

---

## 🔐 Security & Encryption

All messages are encrypted using **end-to-end encryption (E2EE)** protocols. This means:

* Messages are encrypted on the sender’s device
* Only the intended recipient can decrypt them
* Even Firebase (or you as the developer) cannot read message contents

Encryption is handled using libraries like **CryptoJS** or **Web Crypto API**.

---

## 🧠 Future Improvements

* ✅ Group Chats
* ✅ Push Notifications
* 📷 Media & File Sharing
* 🧪 Unit & Integration Testing
* 📊 Chat Analytics Dashboard

---

## 📸 Screenshots

*Include screenshots or a demo GIF of the UI here*

---

## 🙌 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🔗 Live Demo

🌐 *(will be hosted soon)*

---

## 🤝 Connect

Made with ❤️ by [Shreyas Pathe](https://www.linkedin.com/in/shreyas-pathe/)


Let me know if you'd like to add **badges**, **screenshots**, or a **video demo** section!

