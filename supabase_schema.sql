-- OptiAsset Supabase Schema
-- This script matches the FastAPI backend models for your Next.js application.
-- Run this in the Supabase SQL Editor to create your database tables!

-- Create tables
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL UNIQUE,
    permissions JSONB DEFAULT '[]'::jsonb NOT NULL
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    hashed_password VARCHAR NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_tag VARCHAR NOT NULL UNIQUE,
    name VARCHAR NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'Available',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    assigned_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    return_date TIMESTAMP WITH TIME ZONE
);

CREATE TABLE asset_status_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    old_status VARCHAR,
    new_status VARCHAR NOT NULL,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Important Note: Since this maps user credentials manually (hashed_password), 
-- you're bypassing Supabase's built-in Auth (auth.users). 
-- If you want native Supabase Auth, you'd link users.id to auth.users in the future!
