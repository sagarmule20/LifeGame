-- Life Game — Supabase Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- Updated: mandatory missions, €5 per task, custom subtasks

-- User profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text default 'Adventurer',
  euros integer default 0,
  total_euros_earned integer default 0,
  total_tasks_completed integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Missions (3 mandatory: Health, Career, Finance — plus paid extras)
-- is_mandatory marks the 3 core missions that cannot be removed
create table if not exists public.missions (
  id text not null,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  icon text not null,
  color text not null,
  coins_earned integer default 0,
  level integer default 0,
  is_mandatory boolean default false,
  primary key (id, user_id)
);

-- Quests belong to missions
create table if not exists public.quests (
  id text not null,
  user_id uuid references auth.users on delete cascade not null,
  mission_id text not null,
  name text not null,
  description text default '',
  primary key (id, user_id)
);

-- Tasks belong to quests — users can add custom subtasks freely
-- All tasks earn a fixed €5 (coin_reward column kept for future flexibility)
create table if not exists public.tasks (
  id text not null,
  user_id uuid references auth.users on delete cascade not null,
  quest_id text not null,
  name text not null,
  coin_reward integer default 5,
  streak integer default 0,
  last_completed_date text,
  completed_today boolean default false,
  scheduled_time text,  -- optional HH:MM for push notifications
  primary key (id, user_id)
);

-- Rewards shop — things to save up for and purchase with earned €
create table if not exists public.rewards (
  id text not null,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  icon text default '🎁',
  cost integer not null,
  purchased boolean default false,
  purchased_at timestamptz,
  primary key (id, user_id)
);

-- Unlocked achievements / badges
create table if not exists public.achievements (
  user_id uuid references auth.users on delete cascade not null,
  achievement_id text not null,
  unlocked_at timestamptz default now(),
  primary key (user_id, achievement_id)
);

-- Loot inventory (collected items)
create table if not exists public.inventory (
  id serial primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  icon text not null,
  rarity text not null,
  flavor text,
  obtained_at timestamptz default now()
);

-- ===========================
-- Row Level Security
-- ===========================
alter table public.profiles enable row level security;
alter table public.missions enable row level security;
alter table public.quests enable row level security;
alter table public.tasks enable row level security;
alter table public.rewards enable row level security;
alter table public.achievements enable row level security;
alter table public.inventory enable row level security;

-- RLS Policies: drop first so this script is re-runnable
drop policy if exists "Users read own profile" on public.profiles;
drop policy if exists "Users update own profile" on public.profiles;
drop policy if exists "Users insert own profile" on public.profiles;
drop policy if exists "Leaderboard read" on public.profiles;
drop policy if exists "Users manage own missions" on public.missions;
drop policy if exists "Users manage own quests" on public.quests;
drop policy if exists "Users manage own tasks" on public.tasks;
drop policy if exists "Users manage own rewards" on public.rewards;
drop policy if exists "Users manage own achievements" on public.achievements;
drop policy if exists "Users manage own inventory" on public.inventory;

-- Profiles: users manage their own + everyone can read for leaderboard
create policy "Users read own profile" on public.profiles for select using (true);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users manage own missions" on public.missions for all using (auth.uid() = user_id);
create policy "Users manage own quests" on public.quests for all using (auth.uid() = user_id);
create policy "Users manage own tasks" on public.tasks for all using (auth.uid() = user_id);
create policy "Users manage own rewards" on public.rewards for all using (auth.uid() = user_id);
create policy "Users manage own achievements" on public.achievements for all using (auth.uid() = user_id);
create policy "Users manage own inventory" on public.inventory for all using (auth.uid() = user_id);

-- ===========================
-- Auto-create profile on signup
-- ===========================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', 'Adventurer'));
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if it exists, then recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
