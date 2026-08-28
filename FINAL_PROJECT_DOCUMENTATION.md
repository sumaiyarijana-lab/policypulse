# PolicyPulse: Final Project Documentation

## Project Overview
PolicyPulse is an enterprise-grade, AI-powered e-waste compliance and monitoring platform. It connects citizens, recycling centers, corporate producers, and government authorities onto a unified dashboard to combat illegal e-waste dumping and enforce safe recycling regulations.

## Architecture & Technology Stack
- **Frontend**: Next.js 14, React 19, Tailwind CSS, Framer Motion, Leaflet, Recharts
- **Backend**: Node.js, Express.js, Socket.IO, JWT, Multer
- **Database**: MongoDB (via Mongoose)
- **AI Service**: Designed for integration with a Flask-based Python AI service for image recognition and natural language processing.

## Core Features
1. **User Authentication & Role Management**: Secure access for Citizens, Officers, and Admins.
2. **Complaint Management System**: Voice-enabled, location-aware complaint submission with media evidence.
3. **Real-Time Live Map**: Heatmaps of e-waste violations and nearby authorized recycler locations.
4. **Environmental Impact Calculator**: Dynamic tracking of CO2 saved, energy conserved, and toxic materials prevented.
5. **Global Sustainability Leaderboard**: Ranking eco-friendly organizations based on compliance and recycling volume.
6. **AI Assistant**: Conversational AI chatbot for rapid policy guidance and platform navigation.
7. **Compliance Dashboard**: Analytical tracking, tracking timelines, and downloadable PDF reports.
8. **Enterprise Security**: Rate limiting, MongoDB sanitization, HTTP parameter pollution protection, input validation, and Helmet headers.

## Directory Structure
- `/client/`: Next.js frontend application.
  - `/src/app/`: Next.js App Router pages (Dashboard, Map, Complaints, Education, Calculator).
  - `/src/components/`: Reusable UI components (Layout, AI, Complaints).
  - `/src/context/`: Global state management (Auth, Theme, Notification, Language).
- `/server/`: Express.js backend.
  - `/src/controllers/`: Route logic for authentication, complaints, and admin actions.
  - `/src/middleware/`: Enterprise security filters, JWT protection, validation.
  - `/src/models/`: MongoDB schemas (User, Complaint, Recycler).
  - `/src/routes/`: API endpoint definitions.
- `/ai/`: Placeholder directory for the Flask AI detection service.

## Security Posture
The backend utilizes robust Express middlewares such as `helmet`, `hpp`, `express-rate-limit`, and `express-mongo-sanitize` to thwart common OWASP top 10 vulnerabilities. Authentication relies on strictly controlled JSON Web Tokens (JWT) and BCrypt password hashing.

## Future Roadmap
- Deeper integration of Computer Vision models in the `/ai/` microservice to automatically detect e-waste types from user uploads.
- Blockchain ledger for tracking the end-to-end lifecycle of corporate electronics.
- Expansion of the multi-language localization to support 50+ regional languages automatically via AI translation APIs.
