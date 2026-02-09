# High-Scale Energy Ingestion Engine

A **NestJS-based analytics and ingestion engine** for energy data from vehicles and meters, designed for **high-volume data ingestion**, **fast analytical queries**, and **efficient caching**.

This project demonstrates **Redis caching**, **PostgreSQL partitioning**, **hot/cold tables**, and **basic validations**, optimized for real-time and historical analytics.

---

## **Table of Contents**

1. [Features](#features)
2. [Architecture & Design](#architecture--design)
3. [Database Design](#database-design)
4. [Caching Layer](#caching-layer)
5. [Validations](#validations)
6. [Docker Setup](#docker-setup)
7. [Running Locally](#running-locally)
8. [Running via Docker](#running-via-docker)
9. [Optimizations & Notes](#optimizations--notes)

---

## **Features**

* **REST API** for ingestion and analytics:

  * `/api/v1/meter` – Insert meter readings
  * `/api/v1/vehicle` – Insert vehicle readings
  * `/api/v1/analytics/performance/:vehicleId` – Get analytics for a vehicle (24h window)

* **Redis caching** for fast analytics queries

* **Partitioned PostgreSQL tables** for hot (recent) and cold (historical) data

* **Basic parameter validation** to avoid invalid API inputs

* **Dockerized environment** with Postgres, Redis, and NestJS app

---

## **Architecture & Design**

```
            ┌───────────────┐
            │   NestJS App  │
            └───────┬───────┘
                    │
         ┌──────────┴──────────┐
         │  Redis Cache Layer   │
         └──────────┬──────────┘
                    │
         ┌──────────┴──────────┐
         │ PostgreSQL Database │
         │ - Hot & Cold Tables │
         │ - Partitioned Data  │
         └────────────────────┘
```

**Design Goals:**

* Analytics queries **avoid full table scans** using:

  * Partitioned tables for historical data (`vehicle_2026_02`, `vehicle_2026_03`, etc.)
  * Indexes on frequently filtered columns (`vehicleId`, `timestamp`)
* Real-time queries hit **hot tables** (`vehicle_live`, `meter_live`)
* Redis caches frequently requested analytics results (**5-minute TTL**) to reduce DB load

---

## **Database Design**

**Hot Tables (Real-time ingestion):**

* `vehicle_live` – Latest vehicle readings
* `meter_live` – Latest meter readings

**Cold Tables (Historical / Partitioned):**

* `vehicle` – Partitioned by `timestamp`

  * `vehicle_YYYY_MM`
  * `vehicle_default`
* `meter` – Partitioned by `timestamp`

  * `meter_YYYY_MM`
  * `meter_default`

**Indexes:**

```sql
CREATE INDEX idx_vehicle_vehicleId_timestamp ON vehicle ("vehicleId", "timestamp");
CREATE INDEX idx_meter_meterId_timestamp ON meter ("meterId", "timestamp");
```

**Partitioning ensures:**

* Analytics queries only scan relevant monthly partitions
* Avoids full table scan for historical data

---

## **Caching Layer**

* **Redis** used for caching analytics queries
* **Key format:** `analytics:performance:{vehicleId}`
* **TTL:** 5 minutes (configurable)
* **Benefits:**

  * Avoid repeated aggregation on historical data
  * Reduces DB query load
  * Supports horizontal scaling

**Example in service:**

```ts
const cached = await this.redis.get(cacheKey);
if (cached) return JSON.parse(cached);

const response = await this.computeAnalytics(vehicleId);
await this.redis.set(cacheKey, JSON.stringify(response), 'EX', 300); // 5 min TTL
```

---

## **Validations**

* Basic validation at **service layer**
* Example: Ensure `vehicleId` is provided for analytics query

```ts
if (!vehicleId || vehicleId.trim() === '') {
  throw new BadRequestException('vehicleId must be provided');
}
```

* Validations can be extended with **DTOs** for ingestion endpoints
* Placing validation in **service** ensures consistency even if called from multiple controllers

---

## **Docker Setup**

**Project structure for Docker:**

```
project-root/
├─ src/
├─ db/
│  └─ init/
│     └─ init.sql
├─ Dockerfile
├─ docker-compose.yml
├─ package.json
├─ tsconfig.json
└─ .env
```

**docker-compose.yml** includes:

* `postgres` – Preloaded with tables, partitions, and indexes
* `redis` – Caching layer
* `app` – NestJS application

---

### **Dockerfile**

```dockerfile
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --frozen-lockfile

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

---

### **docker-compose.yml**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: ingestion-engine-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: fleet_db
    ports:
      - '5432:5432'
    volumes:
      - ./db/init:/docker-entrypoint-initdb.d
    restart: always

  redis:
    image: redis:7-alpine
    container_name: ingestion-engine-redis
    ports:
      - '6379:6379'
    restart: always
    command: redis-server --appendonly yes

  app:
    build: .
    container_name: ingestion-engine-app
    depends_on:
      - postgres
      - redis
    environment:
      DATABASE_URL: postgres://postgres:postgres@postgres:5432/fleet_db
      REDIS_HOST: redis
      REDIS_PORT: 6379
    ports:
      - '3000:3000'
```

---

## **Running Locally**

1. Start Postgres and Redis manually or via Docker
2. Update `.env`:

```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/fleet_db
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

3. Run NestJS:

```bash
npm install
npm run start:dev
```

---

## **Running via Docker**

1. Build and start all containers:

```bash
docker-compose up --build
```

2. Access APIs: `http://localhost:3000/api/v1/...`
3. Check Redis cache:

```bash
docker exec -it ingestion-engine-redis redis-cli
keys *
```

4. Check Postgres tables and partitions:

```bash
docker exec -it ingestion-engine-postgres psql -U postgres -d fleet_db
\dt
SELECT * FROM vehicle_2026_02 LIMIT 5;
```

---

## **Optimizations & Notes**

* **Redis caching:** Minimizes repeated aggregation queries
* **Hot and Cold tables:**

  * Hot tables: `vehicle_live`, `meter_live` – real-time writes & queries
  * Cold tables: `vehicle`, `meter` with monthly partitions – analytics over historical data
* **Partitioned tables:** Ensure analytical queries **do not scan entire historical data**
* **Indexes on frequently filtered columns** (`vehicleId`, `meterId`, `timestamp`)
* **Validation at service layer:** Ensures APIs do not receive invalid parameters

**Query efficiency example:**

```sql
SELECT SUM("kwhDeliveredDc") FROM vehicle
WHERE "vehicleId" = 'V123' AND "timestamp" >= '2026-02-01'
```

* Thanks to **partition pruning**, Postgres only scans partitions containing February 2026

---

## **Summary**

This project demonstrates:

* High-scale ingestion using **NestJS + Postgres + Redis**
* Analytical queries optimized with **partitioning, indexes, and caching**
* Separation of **hot (live) and cold (historical) tables**
* Validations for API robustness
* Full **Dockerized environment** for easy deployment

You can **run everything locally** or **spin up with Docker** and your analytics queries are **fast, safe, and scalable**.

---
