# NinetyNineAdmin

NinetyNineAdmin project created with Pare CLI

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Development

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run tests
npm run test
```

### Project Structure

```
ninety-nine-admin-web/
├── src/                 # Source code
├── public/              # Static assets (web only)
├── .env.example         # Environment variables template
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## 📝 Environment Variables

Copy `.env.example` to `.env` and configure the following:

- `PORT` - Server port (default: 3000 for web, 3001 for API)
- `NODE_ENV` - Environment (development/production)

## 🛠️ Built With

- **TypeScript** - Type safety and modern JavaScript features
- **Next.js** - React framework (web projects)
- **NestJS** - Node.js framework (API projects)
- **Tailwind CSS** - Utility-first CSS framework (web projects)

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

🚀 **Created with [Pare CLI](https://github.com/paretech/pare-cli)** - Modern web project generator