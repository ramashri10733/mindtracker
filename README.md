# MindTracker

A comprehensive mental health tracking application that helps users monitor their mental well-being, track daily reflections, and access helpful resources.

## Features

- **Daily Reflections**: Record and track your daily thoughts and emotions
- **Resource Library**: Access curated mental health resources and articles
- **Mood Tracking**: Monitor your emotional patterns over time
- **Goal Setting**: Set and track mental health related goals
- **Modern UI**: Clean and intuitive user interface with responsive design

## Tech Stack

- **Frontend**: React.js with modern CSS
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/mindtracker1.git
cd mindtracker1
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables:
   - Create `.env` file in the server directory
   - Add necessary environment variables (see `.env.example`)

4. Start the development servers:
```bash
# Start backend server (from server directory)
npm run dev

# Start frontend server (from client directory)
npm start
```

## Project Structure

```
mindtracker1/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── styles/       # CSS styles
│   │   └── App.js        # Main application component
│   └── public/           # Static files
├── server/                # Backend Node.js application
│   ├── routes/           # API routes
│   ├── models/           # Database models
│   └── controllers/      # Route controllers
└── README.md             # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the open-source community for their invaluable resources 