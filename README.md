# Docker And Docker Compose Wizard

A user-friendly wizard application that helps you create Docker and Docker Compose files for your projects.

## 🚀 Features

- Interactive wizard interface for Docker configuration
- Generates Dockerfile and docker-compose.yml files
- Modern, responsive UI built with Vite
- GitHub Actions integration for CI/CD
- Jest for testing

## 🛠 Tech Stack

- Vite (latest stable version)
- Node.js (latest stable version)
- JavaScript (ES Modules)
- HTML5
- CSS3
- GitHub Actions
- Jest

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/docker-wizard.git
cd docker-wizard
```

2. Install dependencies:
```bash
npm install
```

## 🏃‍♂️ Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗 Building

To build the production version:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 🧪 Testing

Run tests using Jest:
```bash
npm test
```

## 📝 Best Practices

- Functional programming approach
- Pure functions
- Arrow functions
- ES6+ features (const/let, template literals, destructuring, spread/rest)
- Async/await
- Native APIs
- Modular architecture
- Descriptive naming conventions
- Testing-first approach

## 📄 License

[Add your license information here]

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Special thanks to the Vite team for their amazing framework
- Thanks to all contributors and users

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```