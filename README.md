# **vue-soundcloud (Switched to Spotify API)**
This project is a **fork of** [soroushchehresa/vue-soundcloud](https://github.com/soroushchehresa/vue-soundcloud?tab=readme-ov-file). However, due to changes in the API, certain aspects have been **modified and adapted** accordingly. Additionally, this project has been **fully rewritten in Vue 3** to ensure better performance and maintainability.

This project **no longer uses the SoundCloud API** and has now switched to using **Spotify API**. For detailed instructions on how to use the Spotify API, please refer to the [Spotify API Documentation](https://developer.spotify.com/documentation/web-api/tutorials/getting-started).

---

## **📢 Project Status**
This project is **currently just a demo**, with **basic functionality already implemented**, but it **has not been deployed to a production environment** yet. We will observe **user feedback** before deciding on further development.

---

## **📸 Screenshots**
### **Desktop View:**
<p align="center">
  <img src="assets\Desktop.png" width="100%" />
</p>

### **Mobile View:**
🚧 **Coming soon...** 🚧

---

## **🛠️ Environment Setup**

### 1️⃣ **Install Node.js**
This project recommends using **Node.js v22.14.0 (LTS)** for development and running.  
You can download and install it from the [Node.js Official Website](https://nodejs.org/en/download).

### 2️⃣ **Vue 3**
This project is built with **Vue 3**.  
If you are new to Vue.js, please refer to the official documentation: [Vue.js Documentation](https://vuejs.org/).

---

## **🚀 How to Use**

### **1. Clone the Project**
Use the following command to clone the project:
```sh
git clone https://github.com/Sakurajima-sight/vue-soundcloud.git
```

### **2. Install Dependencies**
Run the following command to install the required dependencies:
```sh
npm install
```

### **3. Configure the `.env` File**
Create a `.env` file in the **root directory** of the project and add your **Spotify API** and **Last.fm API** keys.

🔹 **How to Get a Spotify API Key?**  
Visit the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).

🔹 **How to Get a Last.fm API Key?**  
Visit the [Last.fm API Account](https://www.last.fm/api/accounts) and [Last.fm API Documentation](https://www.last.fm/api).

💡 **Note:** The Spotify Player API **is only available to Spotify Premium users**. For more details, refer to the [Spotify Web Playback SDK documentation](https://developer.spotify.com/documentation/web-playback-sdk).

#### **📌 Example `.env` File**
```env
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
VITE_LASTFM_API_KEY=your_lastfm_api_key
```

⚠️ **API Authentication Notice**
- Spotify API requires **OAuth 2.0** authentication, and you may need to obtain an **Access Token**.
- Follow the official guide for details: [Spotify Authentication Guide](https://developer.spotify.com/documentation/web-api/concepts/authorization).

---

### **4. Start Development Mode**
Run the following command to start the development server:
```sh
npm run dev
```
After running, you can access the development server at **http://localhost:8080** in your browser.

---

### **5. Production Mode (Not Yet Deployed)**
This project **has not been deployed to a production environment** yet. However, you can locally build and preview it using the following commands:

#### **Build the project**
```sh
npm run build
```
#### **Preview the production version**
```sh
npm run preview
```
If deployment is planned in the future, consider the following platforms:
- **Vercel / Netlify** (Recommended)
- **GitHub Pages**
- **Nginx / Apache**
- **Docker Deployment**

---

## **📌 Summary**
✅ This project has switched to **Spotify API** and supports **Last.fm API**.  
✅ **Basic functionality is complete**, but **it remains a demo and has not been deployed**.  
✅ **Spotify API is available only to Premium users**, so please ensure you have access.  
✅ **Future development will depend on user feedback**—your suggestions are welcome! 🎵🎶  

📢 **Feel free to Star ⭐ and support this project!** 🚀