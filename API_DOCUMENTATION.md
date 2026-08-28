# PolicyPulse API Documentation

## Base URL
All endpoints are prefixed with `/api`
Example: `http://localhost:5000/api`

## Authentication

Authentication is handled via JWT (JSON Web Tokens). Most endpoints require a valid Bearer token passed in the `Authorization` header.

`Authorization: Bearer <token>`

---

## Auth Endpoints

### 1. Register User
- **Endpoint**: `POST /auth/register`
- **Access**: Public
- **Description**: Registers a new citizen or corporate user.
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "phone": "1234567890",
    "role": "citizen"
  }
  ```

### 2. Login User
- **Endpoint**: `POST /auth/login`
- **Access**: Public
- **Description**: Authenticates a user and returns a JWT.
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```

### 3. Get Current User
- **Endpoint**: `GET /auth/me`
- **Access**: Private (Requires Token)
- **Description**: Returns the profile of the currently authenticated user.

---

## Complaints Endpoints

### 1. Submit a Complaint
- **Endpoint**: `POST /complaints`
- **Access**: Private (Requires Token)
- **Content-Type**: `multipart/form-data`
- **Description**: Submits a new e-waste violation complaint along with GPS coordinates and media evidence.
- **Form Data Fields**:
  - `title` (String)
  - `description` (String)
  - `complaintType` (String)
  - `area` (String)
  - `district` (String)
  - `state` (String)
  - `lat` (Number)
  - `lng` (Number)
  - `evidence` (File Upload, Array, Max 5 files, 10MB each)

### 2. Get All Complaints
- **Endpoint**: `GET /complaints`
- **Access**: Private (Admin / Officer Only)
- **Description**: Retrieves a paginated list of all complaints filed in the system.

## Error Handling

The API uses standardized HTTP status codes and returns errors in the following format:

```json
{
  "message": "Human readable error description",
  "stack": "Stack trace (Only in Development mode)"
}
```

## Rate Limiting & Security
- `apiLimiter`: 100 requests per 15 minutes globally.
- `authLimiter`: 10 requests per hour for auth routes.
- Sanitization: All incoming MongoDB queries and JSON bodies are sanitized.
