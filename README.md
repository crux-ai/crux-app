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
├── .github/workflows/      # CI/CD workflows
│   ├── CI.yml
│   ├── release.yml
│   └── update-deps.yml
├── src/                    # Source code
│   ├── app/               # App pages and routing
│   ├── components/        # Reusable UI components
│   ├── context/          # React context providers
│   ├── lib/              # Utilities and helpers
│   ├── lotties/          # Lottie animation files
│   ├── styles/           # Global styles
│   ├── tests/            # Test files
│   └── validations/      # Form and data validations
├── public/               # Static assets
└── pre-commit/          # Pre-commit hooks
```

## Relevant Config Files

```
├── .husky/               # Git hooks configuration
├── .next/                # Next.js build output
├── .vscode/             # VS Code settings
├── .env.local           # Local environment variables
├── .eslintrc.json       # ESLint configuration
├── .gitignore           # Git ignore rules
├── codecov.yml          # Codecov configuration
├── commitlint.config.ts # Commit message linting
├── eslint.config.mjs    # ESLint module config
├── lint-staged.config.js # Lint-staged configuration
├── next.config.mjs      # Next.js configuration
├── postcss.config.mjs   # PostCSS configuration
├── tailwind.config.ts   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
├── tsconfig.tsbuildinfo # TypeScript build info
├── vitest-setup.ts      # Vitest test setup
└── vitest.config.mts    # Vitest configuration
```
Feel free to explore and modify these configurations to suit your development needs.
