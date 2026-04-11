-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- User profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text default 'Adventurer',
  coins integer default 0,
  total_coins_earned integer default 0,
  total_tasks_completed integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Missions (Health, Mind, Career, or custom)
create table if not exists public.missions (
  id text not null,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  icon text not null,
  color text not null,
  coins_earned integer default 0,
  level integer default 0,
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

-- Tasks belong to quests
create table if not exists public.tasks (
  id text not null,
  user_id uuid references auth.users on delete cascade not null,
  quest_id text not null,
  name text not null,
  coin_reward integer default 10,
  streak integer default 0,
  last_completed_date text,
  completed_today boolean default false,
  scheduled_time text,  -- optional HH:MM format for notifications
  primary key (id, user_id)
);

-- Rewards shop — things to save up for
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

-- Unlocked achievements
create table if not exists public.achievements (
  user_id uuid references auth.users on delete cascade not null,
  achievement_id text not null,
  unlocked_at timestamptz default now(),
  primary key (user_id, achievement_id)
);

-- Inventory (collected loot)
create table if not exists public.inventory (
  id serial primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  icon text not null,
  rarity text not null,
  flavor text,
  obtained_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.missions enable row level security;
alter table public.quests enable row level security;
alter table public.tasks enable row level security;
alter table public.rewards enable row level security;
alter table public.achievements enable row level security;
alter table public.inventory enable row level security;

-- RLS Policies: users can only access their own data
create policy "Users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users manage own missions" on public.missions for all using (auth.uid() = user_id);
create policy "Users manage own quests" on public.quests for all using (auth.uid() = user_id);
create policy "Users manage own tasks" on public.tasks for all using (auth.uid() = user_id);
create policy "Users manage own rewards" on public.rewards for all using (auth.uid() = user_id);
create policy "Users manage own achievements" on public.achievements for all using (auth.uid() = user_id);
create policy "Users manage own inventory" on public.inventory for all using (auth.uid() = user_id);

-- Trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', 'Adventurer'));
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
