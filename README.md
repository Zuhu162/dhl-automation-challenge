# DHL Leave Management System with UiPath Automation

This project is a Leave Management System (LMS) integrated with UiPath automation to streamline the process of inputting leave data from spreadsheets. It provides a web interface for managing leave applications, viewing analytics, and triggering automation processes.

## Purpose and Scope

This project was developed for DHL APSSC's Digital Automation Challenge 2.0. The system consists of two main components:

### Web Solution

- Built with ReactJS and NodeJS
- Provides frontend and backend infrastructure for leave management
- Enables HR to input and manage leave applications manually

### Automation Solution

- Developed using UiPath Studio
- Automates data entry process by validating leave records from Excel files
- Implements Transactional Business Process with Row-Level Fault Tolerance inspired by REFramework:
  - Each row is treated as an independent transaction
  - Automatic retry for transient input or validation failures
  - Failed rows are safely logged without interrupting the process
  - Browser-level crashes are caught and reported
  - Generates summary reports via email and API log submission
  - Includes failed rows and failure reasons in the email

### Environment Considerations

- Designed for local environment execution
- No dependencies on environment-specific features
- Portable and consistent behavior across devices

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

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- MongoDB instance (local or cloud)
- UiPath Studio
- Google Chrome browser
- UiPath Browser Automation extension for Chrome

### 1. Clone the Repository

```bash
git clone https://github.com/Zuhu162/dhl-automation-challenge
cd dhl-automation-challenge
```

### 2. Project Setup

Install dependencies:

```bash
npm install
```

If the above command fails, try the following:

1. Open terminal as administrator
2. Navigate to `lms-frontend` and `lms-backend` directories
3. Run `npm install` in both folders

Create a `.env` file in the `lms-backend` directory with your MongoDB connection string and JWT secret:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Create a `.env` file in the `lms-frontend` directory:

```env
VITE_API_URL is not defined in .env, the api calls will be sent to localhost:5000 by default
```

### 3. Running the Application

Start the application:

```bash
npm run dev
```

This will start both the ReactJS frontend and NodeJS backend concurrently.

Visit `http://localhost:8080/` to access the web application.

### 4. UiPath Automation Setup

Navigate to the UiPath project directory:

```bash
cd LeaveAutomation
```

Open the `LeaveAutomation` project in UiPath Studio.

Ensure all necessary dependencies are installed within the UiPath project (Manage Packages).

Run the `Main.xaml` workflow from UiPath Studio. This automation is designed to be triggered remotely by the backend API (`POST /api/automation/trigger`).

**Note:** The automation process requires the frontend application to be running and accessible from the machine running the UiPath robot.

## Video Guide

For a detailed walkthrough of the project setup and execution, please refer to our [Video Guide/Walkthrough](https://www.youtube.com/playlist?list=PL2jbEQjDPtTywcaDEH-wKdwNYW1EB79kA).

## Further Details

For a more in-depth understanding of the process flow, technical specifications, and other details, please refer to the **Process Design Document (PDD)** located in the repository.
