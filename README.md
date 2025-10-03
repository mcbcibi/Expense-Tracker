# Expense Tracker with Supabase

A modern expense tracking application built with React, TypeScript, and Supabase.

## Features

- **Authentication:** User sign up/sign in with Supabase Auth
- Track income and expenses with categorization
- Set budgets and monitor spending
- Recurring transactions with automatic scheduling
- Interactive dashboard with charts and analytics
- Responsive design with Tailwind CSS
- Real-time data synchronization

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Authentication:** Supabase Auth
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to your project settings and get your Project URL and anon public key
3. Update the `.env` file with your Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Database Setup

Run the migration file to set up your database schema:

1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `migrations/001_initial_schema.sql`
4. Run the SQL script

This will create all necessary tables:
- `transactions` - Store all income/expense transactions
- `categories` - Categories for transactions (Food, Transport, etc.)
- `budgets` - Budget limits for categories
- `recurring_transactions` - Recurring income/expense items
- `user_profiles` - User profile information

### 4. Authentication Setup

The app uses Supabase Auth for user management:

- **Sign Up:** Users can create accounts with email and password
- **Email Confirmation:** New accounts require email verification
- **Sign In:** Existing users can sign in with their credentials
- **Session Management:** Automatic session handling and persistence
- **Sign Out:** Users can sign out from the app

### 5. Start Development Server

```bash
npm run dev
```

### 6. Build for Production

```bash
npm run build
npm run preview
```

## Database Schema

### Tables Created by Migration

- **transactions**: Stores all transaction records with category, amount, date, etc.
- **categories**: Pre-populated with common expense/income categories
- **budgets**: Budget limits for spending categories
- **recurring_transactions**: Automated recurring transactions
- **user_profiles**: User settings and preferences

### Indexes

Performance-optimized indexes are created on frequently queried columns.

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # React components
├── context/            # React Context for state management
├── types.ts            # TypeScript type definitions
├── utils/              # Utility functions and Supabase client
└── main.tsx           # App entry point

migrations/             # Database migration files
.env                    # Environment variables (ignored by git)
```

## Features Overview

### Transactions
- Add income and expense transactions
- Categorize each transaction
- Multiple payment methods supported
- Transaction history with search/filter

### Budgets
- Set weekly or monthly budgets per category
- Track spending against budgets
- Visual budget progress indicators

### Recurring Transactions
- Set up repeating income/expenses
- Frequency options: daily, weekly, monthly, yearly
- Automatic scheduling

### Dashboard
- Overview of financial status
- Charts and analytics
- Recent transactions summary

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
