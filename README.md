# CareSync - Hospital Workflow Optimization

This project encapsulates a full-stack deployment based on your Software Requirement Specification (SRS) document, developed with React (Vite) and Node/Express. 

The website utilizes a modern, aesthetic, light interface with clean typography (Outfit), glassmorphism styles, and harmonious medical color tokens (professional teals, energetic but soft reds for emergencies).

## Features
- **Patient Dashboard**: Dynamic wait-time predictions, appointment booking functionality, and an emergency access function button.
- **Doctor Dashboard**: A schedule overview with specific markers prioritizing emergencies, intuitive statuses, and rich statistics.
- **Admin Dashboard**: System administration interface with real-time analytics representations for active doctors, average wait time, and hospital volume.

## Project Structure
* `backend/`: Node.js, Express, Mongoose architecture handling authentication routes and dummy appointment scheduling. 
* `frontend/`: React components connected via React Router showing distinct dashboards utilizing `lucide-react` for premium iconography.

## How to Run
1. **Start the Backend:**
   Open a terminal in the `backend` folder and run:
   ```bash
   node server.js
   ```
   *(Running on port 5000 by default)*

2. **Start the Frontend:**
   Open a terminal in the `frontend` folder and run:
   ```bash
   npm run dev
   ```
   Navigate to the generated localhost link, choose a role, and log in securely.
