# 📊 ExpenSense — Personal Ledger & AI Financial Advisor

ExpenSense is a premium, state-of-the-art personal finance tracker and smart ledger featuring an integrated AI financial assistant. Built with **React**, **Vite**, and **Tailwind CSS**, it combines a gorgeous dark-themed glassmorphism interface with powerful data visualization and AI-driven insights to help users manage their money smarter.

### 🌐 Live Deployment
Check out the live application on GitHub Pages:
👉 **[ExpenSense Live Application](https://yashash-sharma.github.io/Expenese-Tracker-App/)**

---

## ✨ Features

- **💼 Sleek Glassmorphism Dashboard**: A premium, responsive interface featuring dynamic card metrics (`Net Balance`, `Total Income`, `Total Expenses`, and `Top Spend Category`).
- **🤖 ExpenBot — AI Advisor**: An interactive, floating chatbot helper powered by the **Google Gemini API**. ExpenBot reads your current transactions locally to analyze your savings rate, summarize your spending, and provide personalized budgeting tips.
- **🛡️ Secure API Key Management**: Your Gemini API Key is entered through a dedicated settings panel inside the chatbot and saved securely in your browser's local storage—never hardcoded or sent to a backend.
- **📈 Dynamic Visualization**: Interactive charts powered by **Recharts** displaying category breakdown shares for expenses and income.
- **📝 Advanced Ledger Management**:
  - Multi-category sorting (`Food`, `Transport`, `Shopping`, `Bills`, `Health`, `Entertainment`, `Other`).
  - Fast transactional search & filters.
  - Fully localized in Indian Rupees (₹).
  - Client-side persistence using browser local storage.
- **🧪 Robust Code Verification**: Includes a comprehensive test suite (Vitest + Testing Library) verifying state reducers, form validators, and date-handling helpers.

---

## 🛠️ Technology Stack

| Technology / Library | Usage |
| :--- | :--- |
| **React 19** | Dynamic declarative component-driven UI |
| **Vite 8** | Fast client-side bundling, HMR, and build toolchain |
| **Tailwind CSS v3** | Styling & layout using modern fluid utility design |
| **Recharts** | Interactive SVG charts for breakdown visualization |
| **Lucide React** | Consistent, premium outline vector icons |
| **Google Gemini API** | AI-driven conversational financial advisory (model: `gemini-2.5-flash`) |
| **Vitest & RTL** | Unit testing framework & component rendering tests |
| **Local Storage** | Client-side persistent storage for ledger data and user API keys |

---

## 🚀 Getting Started

### 📋 Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed on your system.

### 📥 Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Yashash-Sharma/Expenese-Tracker-App.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Expenese-Tracker-App
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### 💻 Running Locally
To launch the Vite development server:
```bash
npm run dev
```
The application will run at [http://localhost:5173/](http://localhost:5173/).

### 🧪 Running Tests
To execute the unit test suite:
```bash
npm run test
```

### 🏗️ Build for Production
To bundle the application into optimized static assets:
```bash
npm run build
```
The compiled files will be located in the `/dist` directory.

---

## 📦 Deployment

This project is deployed to GitHub Pages using the `gh-pages` branch. 

To redeploy the site manually:
1. Build the production site:
   ```bash
   npm run build
   ```
2. Push the contents of the `dist/` directory directly to the `gh-pages` branch:
   ```bash
   git init
   git checkout -b gh-pages
   git add .
   git commit -m "Deploy to GitHub Pages"
   git remote add origin https://github.com/Yashash-Sharma/Expenese-Tracker-App.git
   git push -f origin gh-pages
   ```

---

## 👤 Author
* **Yashash Sharma** - [GitHub Profile](https://github.com/Yashash-Sharma)

---

## 🔮 Developed With
This entire application was pair-programmed, designed, and fully code-vibe built using **Antigravity**, Google DeepMind's agentic AI coding assistant.
