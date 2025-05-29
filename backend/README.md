## Prerequisites

- Having Docker installed on your system.

## Running the docker container

```bash
docker compose up --build
```

The backend server will be available at `http://localhost:8000`

## API Documentation

## Endpoints

### 1. Health Check

**GET** `/`

Returns a simple health check message to verify the API is running.

**Response:**

```json
{
  "message": "Health Check"
}
```

**Status Codes:**

- `200 OK` - Service is running

---

### 2. Convert PPTX to PDF

**POST** `/convert`

Uploads a PowerPoint file and queues a task (using Celery) to convert the file to PDF format and upload it to S3 bucket and return a presigned url.

**Request:**

- **Content-Type**: `multipart/form-data`
- **Body**: Form data with file upload

| Parameter | Type | Required | Description                                |
| --------- | ---- | -------- | ------------------------------------------ |
| `file`    | File | Yes      | PowerPoint file (.pptx extension required) |

**Response:**

```json
{
  "message": "Task started",
  "task_id": "celery-task-uuid"
}
```

**Status Codes:**

- `200 OK` - Task started successfully
- `400 Bad Request` - Invalid file format (only .pptx supported)
- `500 Internal Server Error` - Error reading uploaded file

**Example Usage:**

```bash
curl -X POST "http://localhost:8000/convert" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@presentation.pptx"
```

---

### 3. Get Task Status

**GET** `/task/{task_id}`

Retrieves the status and result of a conversion task (in Celery).

**Path Parameters:**

| Parameter | Type   | Required | Description                                    |
| --------- | ------ | -------- | ---------------------------------------------- |
| `task_id` | string | Yes      | The task ID returned from the convert endpoint |

**Response (Task in Progress):**

```json
{
  "status": "PENDING"
}
```

**Response (Task Completed):**

```json
{
  "status": "SUCCESS",
  "result": "uploaded_pdf_url"
}
```

**Response (Task Failed):**

```json
{
  "status": "FAILURE",
  "result": "error_message"
}
```

**Status Codes:**

- `200 OK` - Task found and status retrieved
- `404 Not Found` - Task ID not found

**Possible Task Statuses:**

- `PENDING` - Task is waiting to be processed
- `SUCCESS` - Task completed successfully
- `FAILURE` - Task failed with an error
- `REVOKED` - Task was cancelled

**Example Usage:**

```bash
curl -X GET "http://localhost:8000/task/{{task_id}}"
```

---

### 4. Cancel Task

**DELETE** `/cancel-task/{task_id}`

Cancels a running or pending conversion task.

**Path Parameters:**

| Parameter | Type   | Required | Description           |
| --------- | ------ | -------- | --------------------- |
| `task_id` | string | Yes      | The task ID to cancel |

**Response:**

```json
{
  "status": "REVOKED",
  "task_id": "your-task-id-here"
}
```

**Status Codes:**

- `200 OK` - Task cancelled successfully
- `404 Not Found` - Task ID not found

**Example Usage:**

```bash
curl -X DELETE "http://localhost:8000/cancel-task/{{task_id}}"
```

## Dependencies

This API relies on:

- **Celery**: For asynchronous task processing
- **Redis**: Message broker for Celery (configured in tasks module)
- **File conversion service**: Handles the actual PPTX to PDF conversion

## Usage Workflow

1. **Upload File**: POST to `/convert` with a .pptx file
2. **Get Task ID**: Save the returned `task_id` from the response
3. **Poll Status**: GET `/task/{task_id}` to check conversion progress
4. **Get Result**: When status is "SUCCESS", the result contains the converted file details
5. **Cancel if Needed**: DELETE `/cancel-task/{task_id}` to stop processing

## Rate Limiting & File Size

- Celery task limits are set to 200s
- HTTP request timeout to conversion server is set to 100s
- No explicit rate limiting is configured
