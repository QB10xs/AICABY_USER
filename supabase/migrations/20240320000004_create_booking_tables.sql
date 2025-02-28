-- Create enum for booking status
create type public.booking_status as enum ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');

-- Create enum for vehicle types
create type public.vehicle_type as enum ('standard', 'premium', 'luxury', 'van');

-- Create locations table
create table if not exists public.locations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  name text,
  address text not null,
  coordinates point not null,
  type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_visited timestamp with time zone default timezone('utc'::text, now()),
  frequency integer default 1
);

-- Create bookings table
create table if not exists public.bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  pickup_location_id uuid references public.locations on delete restrict not null,
  dropoff_location_id uuid references public.locations on delete restrict not null,
  pickup_time timestamp with time zone not null,
  vehicle_type public.vehicle_type not null,
  status public.booking_status default 'pending' not null,
  distance numeric(10,2) not null,
  duration integer not null, -- in minutes
  price numeric(10,2) not null,
  driver_id uuid references auth.users on delete set null,
  payment_method text not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- Create drivers table
create table if not exists public.drivers (
  id uuid references auth.users on delete cascade primary key,
  vehicle_type public.vehicle_type not null,
  license_number text not null,
  vehicle_plate text not null,
  rating numeric(3,2) default 5.00,
  total_rides integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create driver reviews table
create table if not exists public.driver_reviews (
  id uuid default gen_random_uuid() primary key,
  booking_id uuid references public.bookings on delete cascade not null,
  driver_id uuid references public.drivers on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.locations enable row level security;
alter table public.bookings enable row level security;
alter table public.drivers enable row level security;
alter table public.driver_reviews enable row level security;

-- Create policies for locations
create policy "Users can view their own locations"
  on public.locations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own locations"
  on public.locations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own locations"
  on public.locations for update
  using (auth.uid() = user_id);

-- Create policies for bookings
create policy "Users can view their own bookings"
  on public.bookings for select
  using (auth.uid() = user_id);

create policy "Users can create their own bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own bookings"
  on public.bookings for update
  using (auth.uid() = user_id);

-- Create policies for driver reviews
create policy "Users can view all driver reviews"
  on public.driver_reviews for select
  using (true);

create policy "Users can create reviews for their own bookings"
  on public.driver_reviews for insert
  with check (
    auth.uid() = user_id and
    exists (
      select 1 from public.bookings
      where id = booking_id
      and user_id = auth.uid()
      and status = 'completed'
    )
  );

-- Create function to update driver rating
create or replace function public.update_driver_rating()
returns trigger as $$
begin
  update public.drivers
  set 
    rating = (
      select avg(rating)::numeric(3,2)
      from public.driver_reviews
      where driver_id = new.driver_id
    ),
    total_rides = (
      select count(*)
      from public.driver_reviews
      where driver_id = new.driver_id
    )
  where id = new.driver_id;
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for updating driver rating
create trigger on_driver_review_change
  after insert or update on public.driver_reviews
  for each row execute procedure public.update_driver_rating();
