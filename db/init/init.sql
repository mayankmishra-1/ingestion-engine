-- db/init/init.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- Needed for uuid_generate_v4

-- Meter live
CREATE TABLE IF NOT EXISTS public.meter_live
(
    "meterId" character varying NOT NULL,
    "kwhConsumedAc" double precision NOT NULL,
    voltage double precision NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_911b583a3acd56511f4882e89d8" PRIMARY KEY ("meterId")
);

-- Vehicle live
CREATE TABLE IF NOT EXISTS public.vehicle_live
(
    "vehicleId" character varying NOT NULL,
    soc double precision NOT NULL,
    "kwhDeliveredDc" double precision NOT NULL,
    "batteryTemp" double precision NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_1ee9168712ef9555967c9b05fa1" PRIMARY KEY ("vehicleId")
);

-- Vehicle master table (partitioned)
CREATE TABLE IF NOT EXISTS vehicle (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    "vehicleId" VARCHAR NOT NULL,
    soc DOUBLE PRECISION NOT NULL,
    "kwhDeliveredDc" DOUBLE PRECISION NOT NULL,
    "batteryTemp" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT "PK_vehicle" PRIMARY KEY (id, "timestamp")
) PARTITION BY RANGE ("timestamp");

-- Vehicle partitions
CREATE TABLE IF NOT EXISTS vehicle_2026_02 PARTITION OF vehicle
    FOR VALUES FROM ('2026-02-01 00:00:00') TO ('2026-03-01 00:00:00');

CREATE TABLE IF NOT EXISTS vehicle_2026_03 PARTITION OF vehicle
    FOR VALUES FROM ('2026-03-01 00:00:00') TO ('2026-04-01 00:00:00');

CREATE TABLE IF NOT EXISTS vehicle_default
PARTITION OF vehicle DEFAULT;

-- Meter master table (partitioned)
CREATE TABLE IF NOT EXISTS meter (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    "meterId" VARCHAR NOT NULL,
    "kwhConsumedAc" DOUBLE PRECISION NOT NULL,
    voltage DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT "PK_meter" PRIMARY KEY (id, "timestamp")
) PARTITION BY RANGE ("timestamp");

-- Meter partitions
CREATE TABLE IF NOT EXISTS meter_2026_02 PARTITION OF meter
    FOR VALUES FROM ('2026-02-01 00:00:00') TO ('2026-03-01 00:00:00');

CREATE TABLE IF NOT EXISTS meter_2026_03 PARTITION OF meter
    FOR VALUES FROM ('2026-03-01 00:00:00') TO ('2026-04-01 00:00:00');

CREATE TABLE IF NOT EXISTS meter_default
PARTITION OF meter DEFAULT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vehicle_vehicleId_timestamp ON vehicle ("vehicleId", "timestamp");
CREATE INDEX IF NOT EXISTS idx_meter_meterId_timestamp ON meter ("meterId", "timestamp");
