# SlideSpeak Challenge

A full-stack application to convert PowerPoint documents to PDF format

## Tech Stack

### Frontend

- [Next.js](https://nextjs.org/docs)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://v3.tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Bun](https://bun.sh/)
- [Jest](https://jestjs.io/)

### Backend

- [Python](https://www.python.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Unoserver](https://github.com/libreofficedocker/unoserver-rest-api) - a packaged unoserver with REST APIs via Docker
- [Celery](https://docs.celeryq.dev/en/latest/index.html) - for queuing tasks
- [Redis](https://redis.io/) - a broker and database for Celery tasks
- [AWS S3](https://aws.amazon.com/s3/)
- [Docker](https://www.docker.com/)

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js
- Python 3.8+
- Docker
- Bun (for package management)

## Getting Started

### Backend

1. Navigate to the backend directory:

```bash
cd backend
```

2. Update environment variables

```bash
cp .env.example .env
```

3. Build and start all services using docker-compose

```bash
docker-compose up --build
```

The backend server will be available at `http://localhost:8000`

### Frontend

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Update environment variables

```bash
cp .env.example .env.local
```

3. Install dependencies:

```bash
bun install
```

4. Run the development server:

```bash
bun run dev

# OR

npm run dev
```

The frontend application will be available at `http://localhost:3000`

## Testing

### Frontend

Run the frontend tests using Jest:

```bash
cd frontend
npm run test
```

### Backend

Run the backend tests using pytest:

```bash
cd backend
pytest
```

## Improvements

### Backend

- The current unoserver service can only process one document at a time which forces as to run Celery with concurrency = 1, we can add some form of load balancing to unoserver to process multiple documents or tasks at the same time
- Add rate limiting for API endpoints
- Add support for more document formats
- Improve test cases

### Frontend

- Improve test cases with end-to-end and integration testing
