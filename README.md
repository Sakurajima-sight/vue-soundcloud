# vue-soundcloud

This project no longer uses the SoundCloud API and has switched to using the Spotify API. For documentation on how to use the Spotify API, refer to the [Spotify API Documentation](https://developer.spotify.com/documentation/web-api/tutorials/getting-started).

## Environment Setup

1. **Node.js**

   This project recommends using **Node.js v22.14.0 (LTS)** for development and running. You can download and install Node.js from the following link: [Node.js Download](https://nodejs.org/zh-cn/download).

2. **Vue 3**

   This project is built on Vue 3. If you're new to Vue.js, refer to the official documentation: [Vue.js Documentation](https://cn.vuejs.org/).

## How to Use

1. **Clone the Project**

   Clone the project using the following command:

   ```sh
   git clone https://github.com/Sakurajima-sight/vue-soundcloud.git
   ```

2. **Install Dependencies**

   Run the following command to install the required dependencies:

   ```sh
   npm install
   ```

3. **Configure `.env` File**

   Configure a `.env` file in the root directory of the project and add your Spotify client ID and secret. For instructions on how to obtain these, visit the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).

4. **Development Mode**

   Run the following command to start the development server:

   ```sh
   npm run dev
   ```

   This will start a hot-reloading development server that you can access in your browser.

5. **Production Mode**

   If you're ready to deploy the app, use the following command to build and minify the app:

   ```sh
   npm run build
   ```
