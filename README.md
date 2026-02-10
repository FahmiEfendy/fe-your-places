# 📍 Your Places – Frontend

<p align="center">
  <img width="762" height="384" alt="Screenshot" src="https://github.com/user-attachments/assets/be4226cf-f4d6-4521-866c-bfc4f85ec41f" />
</p>

Frontend application for **Your Places**, a web platform where users can explore and share their favorite places. 
This application allows users to browse places, view place details, and manage their own places through a smooth and interactive user interface.


## ✨ Features
- User authentication (login & signup)
- Browse all shared places
- View places by user
- Create, update, and delete places
- Image preview and animations
- Protected routes for authenticated users
- Client-side routing


## 🌐 Live API
Base URL: [https://yourplaces-front.vercel.app](https://yourplaces-front.vercel.app)


## 🛠️ Tech Stack
- Language: JavaScript
- Framework: React 18 (Create React App)
- Routing: React Router DOM v6
- Authentication: Firebase (client-side)
- Animations: react-transition-group
- State Management: React Hooks


## 🚀 How to Run

### Requirements
- Node.js (v16+ recommended)
- npm
- Backend API running (local or production)

### Steps
```bash
https://github.com/FahmiEfendy/yourplaces--front.git # clone the repository

cd yourplaces--front # access cloned repository

npm install # install dependency

npm start # start application
```

After running the command, the app will be available at: http://localhost:3000


## ⚙️ Environment Configuration
- Create a .env file in the root directory
- Check .env.example for required environment keys
- Make sure this URL points to the correct backend (local or production).


## 🔗 Backend Integration
This frontend consumes REST APIs provided by Your Places Backend, including:
- User authentication
- Places CRUD operations
- Image upload handling
Ensure the backend service is running before using the frontend.


## 🧠 Project Notes
- Authentication state is managed on the client
- Protected routes prevent unauthorized access
- Animations improve user experience during route changes
- Designed with reusable and modular components


## 📬 Contact
- Email: itsfahmiefendy@gmail.com
- LinkedIn: https://www.linkedin.com/in/fahmi-efendy
