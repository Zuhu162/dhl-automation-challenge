# LMS API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication using a JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Endpoints

### Authentication

#### Register User

- **POST** `/auth/register`
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: User object with token

#### Login

- **POST** `/auth/login`
- **Description**: Login user and get token
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: User object with token

#### Get Current User

- **GET** `/auth/me`
- **Description**: Get current logged in user
- **Headers**: Requires authentication
- **Response**: User object

### Leaves

All leave endpoints require authentication.

#### Create Leave

- **POST** `/leaves`
- **Description**: Create a new leave request
- **Headers**: Requires authentication
- **Request Body**:
  ```json
  {
    "startDate": "date",
    "endDate": "date",
    "type": "string",
    "reason": "string"
  }
  ```
- **Response**: Created leave object

#### Get All Leaves

- **GET** `/leaves`
- **Description**: Get all leave requests
- **Headers**: Requires authentication
- **Response**: Array of leave objects

#### Get Single Leave

- **GET** `/leaves/:id`
- **Description**: Get a specific leave request
- **Headers**: Requires authentication
- **Response**: Leave object

#### Update Leave

- **PUT** `/leaves/:id`
- **Description**: Update a leave request
- **Headers**: Requires authentication
- **Request Body**:
  ```json
  {
    "startDate": "date",
    "endDate": "date",
    "type": "string",
    "reason": "string",
    "status": "string"
  }
  ```
- **Response**: Updated leave object

#### Delete Leave

- **DELETE** `/leaves/:id`
- **Description**: Delete a leave request
- **Headers**: Requires authentication
- **Response**: Success message

### Automation

#### Trigger Automation

- **POST** `/automation/trigger`
- **Description**: Trigger UiPath automation process
- **Request Body**:
  ```json
  {
    "parameters": {
      // Automation specific parameters
    }
  }
  ```
- **Response**: Automation status

### Automation Logs

#### Create Automation Log

- **POST** `/automationLogs`
- **Description**: Create a new automation log entry
- **Request Body**:
  ```json
  {
    "status": "string",
    "details": "string",
    "timestamp": "date"
  }
  ```
- **Response**: Created log object

#### Get All Automation Logs

- **GET** `/automationLogs`
- **Description**: Get all automation logs
- **Response**: Array of log objects

#### Get Single Automation Log

- **GET** `/automationLogs/:id`
- **Description**: Get a specific automation log
- **Response**: Log object

#### Update Automation Log

- **PUT** `/automationLogs/:id`
- **Description**: Update an automation log
- **Request Body**:
  ```json
  {
    "status": "string",
    "details": "string",
    "timestamp": "date"
  }
  ```
- **Response**: Updated log object

#### Delete Automation Log

- **DELETE** `/automationLogs/:id`
- **Description**: Delete an automation log
- **Response**: Success message

## Error Responses

The API uses conventional HTTP response codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

Error responses include a message explaining the error:

```json
{
  "error": "Error message"
}
```
