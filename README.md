# **Expense Tracker Dashboard**

A modern web application built with **Next.js**, **React**, and **Tailwind CSS** for tracking monthly expenses. The application features dynamic data fetching and intuitive UI components for seamless navigation and data visualization.

---

## **Technologies Used**

- **Next.js**
- **React**
- **Tailwind CSS**
- **ShadCN/UI** for pre-built UI components
- **Supabase**
- **Lucide-react**: Icons for React applications
- **Typescript**
- **Vercel**

---

## **Getting Started**

### **Prerequisites**

- Node.js (>=16)
- npm (>=8)

### **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/codeplaygroundspace/building-admin.git
   cd building-admin
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### **Development**

Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app in development mode.

### **Build for Production**

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

### **Linting**

Check for code quality issues:

```bash
npm run lint
```

---

## **Folder Structure**

```
├── components/        # Reusable React components
├── lib/               # Utility functions and helpers
├── pages/             # Application routes
├── public/            # Static assets
├── styles/            # Global styles and Tailwind configuration
├── types/             # TypeScript type definitions
```

---

## **Environment Variables**

Set up a `.env.local` file in the project root with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## **License**

This project is licensed under the [MIT License](LICENSE).
