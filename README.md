# **Building Admin Dashboard**

A comprehensive admin panel built with **Next.js**, **React**, and **Tailwind CSS** for managing building finances and expenses. The application provides financial breakdowns, expense tracking, and building information management with an intuitive user interface.

<!-- TODO: Add a dashboard screenshot here -->
<!-- ![Building Admin Dashboard](public/dashboard-preview.png) -->

---

## **Features**

- 📊 **Financial Overview**: View total finances, expenses, and financial breakdowns
- 📅 **Monthly Data Selection**: Filter financial data by month
  - When selecting a month, the app displays data from the **previous month**
  - For example, selecting "March 2023" shows February 2023 data
  - Data is filtered based on expense date ranges (`date_from` to `date_to`), not creation date
- 🏢 **Building Management**: View and manage building information
- 💰 **Expense Tracking**: Track and categorize expenses with visual breakdowns
- 📱 **Responsive Design**: Optimized for desktop and mobile devices

---

## **Technologies Used**

- **Next.js 15**: For server-side rendering and API routes
- **React 18**: UI library with hooks for state management
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For utility-first styling
- **ShadCN/UI**: Component library for consistent UI elements
- **Supabase**: Backend as a service for database and authentication
- **Recharts**: For data visualization
- **Lucide-react**: Icons library
- **Day.js**: Date manipulation library
- **Vercel**: For deployment and hosting

---

## **Getting Started**

### **Prerequisites**

- Node.js (>=16)
- npm (>=8)
- Supabase account for database access

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
3. Set up environment variables (see Environment Variables section)

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

## **Project Structure**

```
├── public/              # Static assets and resources
├── src/                 # Application source code
│   ├── app/             # Next.js app router pages and layouts
│   │   ├── api/         # API routes
│   │   ├── fondo/       # Fund management pages
│   │   ├── gcomunes/    # Common areas management pages
│   │   ├── info/        # Information pages
│   │   ├── layout.tsx   # Root layout with providers
│   │   └── page.tsx     # Home page
│   ├── components/      # Reusable React components
│   │   ├── charts/      # Chart components
│   │   ├── ui/          # ShadCN UI components
│   │   └── ...          # Other components
│   ├── helpers/         # Utility functions
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Library configurations
│   │   └── supabase/    # Supabase client setup
│   └── types/           # TypeScript type definitions
├── tailwind.config.ts   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── next.config.ts       # Next.js configuration
```

---

## **Environment Variables**

Create a `.env.local` file in the project root with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

These variables are required for connecting to your Supabase instance.

---

## **Database Schema**

The application uses Supabase with the following main tables:

- **expenses**: Stores expense records with categories, amounts, and building information
- **buildings**: Contains building details like addresses and contact information

For detailed information about the data model, data flow, and best practices for working with data in this application, please see the [Data Model Documentation](DATAMODEL.md).

---

## **Deployment**

The application is configured for easy deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set the required environment variables
3. Deploy with the default settings

---

## **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## **License**

This project is licensed under the [MIT License](LICENSE).

---

## **Contact**

Project Link: [https://github.com/codeplaygroundspace/building-admin](https://github.com/codeplaygroundspace/building-admin)
