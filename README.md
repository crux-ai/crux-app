# Crux App

Crux App is a Next.js project designed for modern web applications, utilizing various libraries and tools to enhance development and user experience.

## Getting Started

To get started with Crux App, follow these steps:

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

Clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd crux-app
pnpm install
```

### Running the Development Server

To start the development server, use the following command:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action.

## Folder Structure

The folder structure of the Crux App is organized as follows:

```
crux-app/
├── public/                # Static files
├── src/                   # Source files
│   ├── components/        # Reusable components
│   ├── pages/             # Next.js pages
│   ├── styles/            # Global styles
│   └── lib/               # Library functions and utilities
├── .husky/                # Husky hooks for Git
├── .eslintrc.js           # ESLint configuration
├── .prettierrc            # Prettier configuration
├── package.json           # Project metadata and scripts
└── tsconfig.json          # TypeScript configuration
```

## Husky Setup

Husky is used to manage Git hooks in this project. It helps enforce code quality by running scripts before commits and pushes.

### Configuration

Husky is configured in the `.husky/` directory. You can find hooks for pre-commit and pre-push actions, which typically include linting and testing commands to ensure code quality.

To add or modify hooks, you can use the following command:

```bash
pnpx husky add .husky/pre-commit "pnpm run lint"
```

This command sets up a pre-commit hook that runs the linting script before allowing a commit.

## Relevant Config Files

- **.eslintrc.js**: Configuration file for ESLint, which helps maintain code quality and consistency.
- **.prettierrc**: Configuration file for Prettier, which formats code according to specified rules.
- **tsconfig.json**: TypeScript configuration file that defines the compiler options and project structure.

Feel free to explore and modify these configurations to suit your development needs.
