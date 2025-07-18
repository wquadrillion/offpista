-- Migration: Create users and tasks tables for Offpista Task Manager

create table if not exists users (
  id serial primary key,
  username text unique not null,
  password text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists tasks (
  id serial primary key,
  user_id integer references users(id) on delete cascade,
  title text not null,
  description text,
  status text check (status in ('pending', 'in-progress', 'done')) not null default 'pending',
  extras jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
