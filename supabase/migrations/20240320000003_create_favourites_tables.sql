-- Create saved_locations table
create table if not exists public.saved_locations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  label text not null,
  address text not null,
  coordinates point not null,
  icon text default '📍',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create emergency_contacts table
create table if not exists public.emergency_contacts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  phone text not null,
  relationship text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.saved_locations enable row level security;
alter table public.emergency_contacts enable row level security;

-- Create policies for saved_locations
create policy "Users can view their own saved locations."
  on public.saved_locations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own saved locations."
  on public.saved_locations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own saved locations."
  on public.saved_locations for update
  using (auth.uid() = user_id);

create policy "Users can delete their own saved locations."
  on public.saved_locations for delete
  using (auth.uid() = user_id);

-- Create policies for emergency_contacts
create policy "Users can view their own emergency contacts."
  on public.emergency_contacts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own emergency contacts."
  on public.emergency_contacts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own emergency contacts."
  on public.emergency_contacts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own emergency contacts."
  on public.emergency_contacts for delete
  using (auth.uid() = user_id);

-- Create indexes
create index saved_locations_user_id_idx on public.saved_locations(user_id);
create index emergency_contacts_user_id_idx on public.emergency_contacts(user_id); 