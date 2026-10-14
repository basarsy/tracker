# Job Application Tracker

Personal single-user web application for tracking job applications, status histories, interviews, and hiring pipeline analytics.

---

## Tech Stack

- **Backend**: Java 21, Spring Boot 3.4, Spring Data JPA, Spring Security, JJWT, Flyway, PostgreSQL 16+
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, TanStack React Query, React Router 6, Recharts, React Hook Form, Zod
- **Infrastructure**: Docker Compose (optional), PostgreSQL

---

## Prerequisites

- **Java 21**: JDK installed (verified with `java -version`)
- **Node.js 20+**: Installed with npm (verified with `node -v` and `npm -v`)
- **PostgreSQL 16+** OR **Docker Desktop**

---

## Database Setup

### Option A: Using Docker Compose
```bash
cp .env.example .env   # On Windows PowerShell: copy .env.example .env
docker compose up -d
```

### Option B: Local PostgreSQL Service
Create the database and role using `psql` or pgAdmin:
```sql
CREATE USER jobtracker WITH PASSWORD 'jobtracker';
CREATE DATABASE jobtracker OWNER jobtracker;
GRANT ALL PRIVILEGES ON DATABASE jobtracker TO jobtracker;
```

---

## Running the Backend

```bash
cd backend
# Windows:
.\mvnw.cmd spring-boot:run

# Linux / macOS:
./mvnw spring-boot:run
```

- **API Base URL**: `http://localhost:8080/api`
- **Health Check**: `http://localhost:8080/api/health`
- **Swagger OpenAPI Docs**: `http://localhost:8080/swagger-ui.html`

### Default Authentication Credentials
- **Username**: `admin`
- **Password**: `changeme`

---

## Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

- **Frontend Application**: `http://localhost:5173`

---

## Features

1. **Authentication**:
   - Single-user login secured with BCrypt and stateless JWT bearer tokens.
2. **Applications Management (CRUD)**:
   - Full application tracking (Company, Position, Work Model, Employment Type, Location, URL, Dates, Salary range, CV Version, Contact info, Notes).
   - Filtering by Status, Work Model, Employment Type, Source, and free-text search.
   - Server-side pagination and sorting.
   - Status change timeline with notes and transition timestamps.
   - Interview scheduling and management (round types: Phone, HR, Technical, Onsite).
3. **Analytics Dashboard**:
   - High-level KPIs: Total Applications, Active Pipeline, Response Rate, Interview Rate, Offer Rate, Rejection Rate, Ghosted Count, Avg/Median Response Times.
   - Application Funnel progression (Applied $\rightarrow$ Responded $\rightarrow$ Interview $\rightarrow$ Offer).
   - Recharts visual charts: Weekly trends, Applications by Source, Work Model distribution.
   - **Needs Attention Widget**: Flags applications in `APPLIED` status for > 14 days without response.
   - **Upcoming Interviews Widget**: Displays scheduled upcoming rounds across all active applications.
4. **Automated Maintenance**:
   - Scheduled background job (`GhostedJob`) runs daily at 03:00 to automatically flag applications inactive for 30+ days as `GHOSTED`.
5. **Data Export**:
   - One-click CSV export respecting all active filters (`/api/applications/export`).

---

## Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `DB_URL` | JDBC database URL | `jdbc:postgresql://localhost:5432/jobtracker` |
| `DB_USER` | PostgreSQL user | `jobtracker` |
| `DB_PASSWORD` | PostgreSQL password | `jobtracker` |
| `APP_USERNAME` | Login username | `admin` |
| `APP_PASSWORD` | Login password (plain or BCrypt hash) | `changeme` |
| `JWT_SECRET` | Secret key for JWT signing ($\ge$ 32 chars) | Default development secret |
| `JWT_EXPIRATION_MS` | JWT validity duration | `86400000` (24h) |
| `GHOSTED_AFTER_DAYS`| Inactive threshold for ghosted status | `30` |
| `CORS_ALLOWED_ORIGINS`| Allowed frontend origins | `http://localhost:5173` |

---

## Testing

```bash
# Run backend tests
cd backend
.\mvnw.cmd test

# Run frontend type check and production build
cd frontend
npm run build
```
