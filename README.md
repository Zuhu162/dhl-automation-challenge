# DHL Leave Management System with UiPath Automation

This project is a Leave Management System (LMS) integrated with UiPath automation to streamline the process of inputting leave data from spreadsheets. It provides a web interface for managing leave applications, viewing analytics, and triggering automation processes.

## Features

- **User Authentication:** Secure login for users
- **Leave Application Management:** Submit, view, edit, and delete leave applications
- **Dashboard & Analytics:** Overview of leave statistics and trends (e.g., monthly applications, leave type distribution, employee status)
- **Leave Calendar:** Visualize approved leaves on a calendar view
- **Automation Trigger:** Trigger a UiPath automation process directly from the web application to input leave data from a Google Spreadsheet
- **Automation Logs:** View logs and status of past automation runs, including successful/failed rows and remarks
- **Partial Restore:** Option to restore the system to a previous state based on an automation log timestamp by deleting subsequently created leave data and logs

## Technologies Used

**Frontend:**

- React (with React Router for navigation)
- TypeScript
- Tailwind CSS (for styling)
- Shadcn UI (for UI components)
- TanStack Query (for data fetching)
- Zod (for form validation)

**Backend:**

- Node.js
- Express.js (for building the REST API)
- Mongoose (for MongoDB object modeling)
- JWT (JSON Web Tokens) for authentication

**Database:**

- MongoDB

**Automation:**

- UiPath Studio (for the automation process)

## Setup Guide

Follow these steps to set up and run the project locally:

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- MongoDB instance (local or cloud)
- UiPath Studio (for running the automation part)

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <your-repository-directory>
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd lms-backend
```

Install dependencies:

```bash
npm install # or yarn install
```

Create a `.env` file in the `lms-backend` directory with your MongoDB connection string and JWT secret:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Run the backend server:

```bash
npm start # or yarn start
```

The backend API should now be running, typically on port 5000.

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd lms-frontend
```

Install dependencies:

```bash
npm install # or yarn install
```

Create a `.env` file in the `lms-frontend` directory. Configure the backend API URL:

```env
VITE_API_URL=http://localhost:5000/api # Or your backend URL
```

Run the frontend development server:

```bash
npm run dev # or yarn dev
```

The frontend application should now be running, typically on port 5173 (or similar).

### 4. UiPath Automation Setup

Navigate to the UiPath project directory:

```bash
cd LeaveAutomation
```

Open the `LeaveAutomation` project in UiPath Studio.

Ensure all necessary dependencies are installed within the UiPath project (Manage Packages).

Run the `Main.xaml` workflow from UiPath Studio. This automation is designed to be triggered remotely by the backend API (`POST /api/automation/trigger`). The workflow will interact with the Leave Management System's web interface (the frontend you set up in step 3) and input data from a specified Google Spreadsheet.

**Note:** The automation process requires the frontend application to be running and accessible from the machine running the UiPath robot. The backend triggers the process, but the robot interacts with the frontend UI.

### 5. Access the Application

Open your web browser and go to the frontend URL (e.g., `http://localhost:5173`).

You can log in using the demo credentials provided on the login page or register a new user (if registration is enabled, otherwise you might need to manually create a user in the database).

## Further Details

For a more in-depth understanding of the process flow, technical specifications, and other details, please refer to the **Process Design Document (PDD)** located in the repository.

## License

[Specify your project's license here]

## Acknowledgements

[Add any acknowledgements here, e.g., for libraries or resources used]
