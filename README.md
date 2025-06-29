# 📍 Locatr: Real-Time Family Location Tracker

<div align="center">
  <img src="https://github.com/user-attachments/assets/ca0eb7ed-37f1-44fa-bec5-18390273f965" alt="Locatr Logo" width="256" height="256">

  
  **Track your family's location with Locatr**
  
  [![Website](https://img.shields.io/badge/Website-locatr.tech-blue?style=for-the-badge)](https://locatr.tech)
  [![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/kadirmetin/locatr)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
</div>

---

## 🌟 Overview

Locatr is a modern and secure family location tracking app designed to help families stay connected and ensure the safety of their loved ones. Developed using the latest technology and with a focus on privacy, Locatr offers real-time location sharing features. All of this is brought together in an intuitive and user-friendly interface.

**Key Highlights:**
- 🔒 **Privacy-First**: Your family's location data is encrypted and secure
- 👨‍👩‍👧‍👦 **Family-Friendly**: Designed specifically for family use cases
- 📱 **Cross-Platform**: Available on iOS, Android, and Web
- ⚡ **Real-Time**: Instant location updates
- 👁️ **No Data Mining**: We never sell, share, or monetize your personal data

---

## 🚀 Features

### 📍 **Core Location Features**
- **Real-Time Tracking**: Live location sharing with family members
- **Battery Optimization**: Smart location updates to preserve device battery

### 🎨 **User Experience**
- **Intuitive Interface**: Clean, modern design that's easy to navigate
- **Dark Mode**: Full dark mode support for comfortable viewing
- **Accessibility**: Built with accessibility standards in mind
- **Multilingual**: Support for multiple languages and regions

---

## 🛠️ Technology Stack

### **📱 Mobile App (React Native + Expo)**
- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and toolchain
- **TypeScript** - Type-safe development
- **Mapbox** - Advanced mapping functionality

### **🌐 Web Application (Next.js)**
- **Next.js** - React framework with SSR/SSG
- **React** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **React Query** - Data fetching and caching
- **React Leaflet** - Interactive mapping for web

### **⚡ Backend Server (Node.js + Express)**
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Fast web application framework
- **TypeScript** - Type-safe backend development
- **MongoDB** - NoSQL database and ODM

### **🔥 Infrastructure**
- **Imagekit** - Image optimization and delivery
- **Socket.io** - Real-time communication
- **Docker** - Containerization and deployment

### **💻 Development Tools**
- **Monorepo Architecture** - Organized codebase
- **ESLint & Prettier** - Code quality and formatting
- **GitHub Actions** - CI/CD pipeline

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v20 or higher)
- **yarn**
- **Android Stuido and Java SE Development Kit (JDK)** (for mobile development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kadirmetin/locatr.git
   cd locatr
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**

4. **Start the development server**
   ```bash
   yarn dev
   ```

---

## 📱 Screenshots

### 🌐 Web Dashboard
*Experience the full power of Locatr on desktop with our comprehensive web interface*

<div align="center">
  
| **🏠 Landing Page** | **📊 Dashboard** | **🗺️ Live Map** | **📱 Devices** | **⚙️ Settings** |
|:---:|:---:|:---:|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/e7962ea1-e2c2-403d-adc5-5f61a32c13cd" alt="Landing Page" width="180"> | <img src="https://github.com/user-attachments/assets/a3fde4d1-a1ee-425f-a5ef-c9d418413d20" alt="Dashboard Overview" width="180"> | <img src="https://github.com/user-attachments/assets/c5b3ef6a-2551-4d9f-8cf8-961d75c645ec" alt="Live Map View" width="180"> | <img src="https://github.com/user-attachments/assets/8c67f174-a2f5-4801-92c6-b7d163636cbc" alt="Device Management" width="180"> | <img src="https://github.com/user-attachments/assets/e21fd48f-bd19-4b81-bb2f-a89c4ea844a1" alt="Settings Panel" width="180"> |
| *Welcome to Locatr* | *Family overview* | *Real-time tracking* | *Manage devices* | *Customize experience* |

</div>

---

### 📱 Mobile Application
*Stay connected on-the-go with our intuitive mobile experience*

<div align="center">
  
| **👋 Welcome Screen** | **🏠 Home Dashboard** |
|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/ca747648-348e-48fe-b49a-8ad416bb7f54" alt="Mobile Welcome Screen" width="250"> | <img src="https://github.com/user-attachments/assets/c2a5b0b1-6bd9-47d9-a8ea-61f1459e3b4e" alt="Mobile Home Screen" width="250"> |
| *Get started with Locatr* | *Track your family members* |

</div>

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory of each application:

```env
# Mobile
EXPO_NO_METRO_WORKSPACE_ROOT=true
EXPO_PUBLIC_API_BASE_URL="http://localhost:8000/api/v1"
EXPO_PUBLIC_SOCKET_BASE_URL="http://localhost:8000"
EXPO_PUBLIC_WEB_APP_URL="http://localhost:3000"
MAPBOX_READ_DOWNLOAD_TOKEN=""
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=""

# Server
APP_ORIGIN="http://localhost:3000"
SERVER_PORT=5000
BASE_PATH="/api/v1"
MONGO_URI=""
JWT_SECRET=""
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET=""
JWT_REFRESH_EXPIRES_IN="7d"
RESEND_API_KEY=""
RESEND_MAILER_SENDER=""
IMAGEKIT_PUBLIC_KEY=""
IMAGEKIT_URL_ENDPOINT=""
IMAGEKIT_PRIVATE_KEY=""
ADMIN_EMAIL=""

# Web
NEXT_PUBLIC_WEB_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_BASE_URL="http://localhost:5000/api/v1"
NEXT_PUBLIC_SOCKET_BASE_URL="http://localhost:5000"
NEXT_PUBLIC_CAPTCHA_SITE_KEY=""
CAPTCHA_SECRET_KEY=""
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=""
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=""
NEXT_PUBLIC_GA_ID=""
NEXT_PUBLIC_GTM_ID=""
NEXT_PUBLIC_C15T_URL=""

```
---

## 🚀 Deployment

### Production Build
```bash
# Build all applications
yarn build

# Build specific app
cd apps/mobile && eas build --platform android --profile production
cd apps/web && yarn build
cd apps/server && yarn build
```
---

## 📋 Roadmap

### 🎯 **Version 2.0** (Q4 2025)
- [ ] **Advanced Analytics**: Location patterns and insights
- [ ] **...and more to be added!**

---

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test your changes**
5. **Commit your changes**
   ```bash
   yarn commit
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- **Code Style**: Follow ESLint and Prettier configurations
- **Testing**: Make sure all changes work
- **Commit Messages**: Use conventional commit format

### Bug Reports & Feature Requests

- **🐛 [Report a Bug](https://github.com/kadirmetin/locatr/issues/new)**
- **✨ [Request a Feature](https://github.com/kadirmetin/locatr/issues/new)**

---

## 🔒 Privacy & Security

Locatr takes privacy and security seriously:

- **🎯 Minimal Data Collection**: We only collect data necessary for core functionality
- **👤 User Control**: Users have full control over their data and sharing preferences
- **🛡️ Regular Security Audits**: Regular third-party security assessments
- **📜 Transparent Privacy Policy**: Clear and comprehensive privacy policy

For more details, read our [Privacy Policy](https://locatr.tech/privacy) and [Terms of Service](https://locatr.tech/terms).

---

## 📞 Support & Community

### Getting Help

- **📧 [Email Support](mailto:support@locatr.tech)** - Direct support for urgent issues
- **🐛 [GitHub Issues](https://github.com/kadirmetin/locatr/issues)** - Report bugs and request features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

### Special Thanks

- **Open Source Community**: For the incredible tools and libraries that make this possible
- **Family & Friends**: For inspiration and continuous support

### Built With Love By

<div align="center">
  <a href="https://github.com/kadirmetin">
    <img src="https://github.com/kadirmetin.png" width="60" height="60" alt="Kadir Metin" style="border-radius: 50%;">
  </a>
  <br>
  <strong>Kadir Metin</strong>
  <br>
  <em>Full Stack Developer</em>
  <br>
  <a href="https://kadirmetin.dev">Website</a> • 
  <a href="https://github.com/kadirmetin">GitHub</a> • 
  <a href="https://linkedin.com/in/kadirmetin">LinkedIn</a>
</div>

---

<div align="center">
  <strong>Made with ❤️ for families everywhere</strong>
  <br><br>
  
  ⭐ **Star this repository if you find it helpful!** ⭐
  
  <br>
  
  [![GitHub Stars](https://img.shields.io/github/stars/kadirmetin/locatr?style=social)](https://github.com/kadirmetin/locatr/stargazers)
  [![GitHub Forks](https://img.shields.io/github/forks/kadirmetin/locatr?style=social)](https://github.com/kadirmetin/locatr/network/members)
  [![GitHub Watchers](https://img.shields.io/github/watchers/kadirmetin/locatr?style=social)](https://github.com/kadirmetin/locatr/watchers)
</div>
