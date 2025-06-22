# Communication Module

This module handles communications related to appointments in the system.

## Features

- Create communications for appointments
- Retrieve communications by appointment ID
- Update communication status
- List all communications

## Endpoints

### POST /communication
Creates a new communication for an appointment.

**Request Body:**
```json
{
  "appointmentId": "123e4567-e89b-12d3-a456-426614174000",
  "type": "EMAIL",
  "startDate": "2024-01-15T10:00:00Z",
  "status": "PENDING"
}
```

**Response:**
```json
{
  "id": "456e7890-e89b-12d3-a456-426614174000",
  "type": "EMAIL",
  "startDate": "2024-01-15T10:00:00.000Z",
  "status": "PENDING",
  "idAppointment": "123e4567-e89b-12d3-a456-426614174000"
}
```

### GET /communication/appointment/:appointmentId
Retrieves all communications for a specific appointment.

### GET /communication
Retrieves all communications in the system.

### GET /communication/:id
Retrieves a specific communication by ID.

### PATCH /communication/:id/status
Updates the status of a communication.

**Request Body:**
```json
{
  "status": "COMPLETED"
}
```

## Communication Types

- `EMAIL`
- `SMS`
- `PUSH_NOTIFICATION`
- `PHONE_CALL`

## Communication Statuses

- `PENDING`
- `IN_PROGRESS`
- `COMPLETED`
- `CANCELLED`
- `FAILED`
- `NO_SHOW`
- `RESCHEDULED`

## Authentication

All endpoints require JWT authentication via the `Authorization` header with the format:
```
Authorization: Bearer <jwt_token>
``` 