-- Create enum for ticket status
create type public.ticket_status as enum ('open', 'in_progress', 'resolved', 'closed');

-- Create enum for ticket priority
create type public.ticket_priority as enum ('low', 'medium', 'high', 'urgent');

-- Create tickets table
create table if not exists public.tickets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text not null,
  status public.ticket_status default 'open' not null,
  priority public.ticket_priority default 'medium' not null,
  category text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  resolved_at timestamp with time zone,
  assigned_to uuid references auth.users on delete set null
);

-- Create messages table for ticket communication
create table if not exists public.ticket_messages (
  id uuid default gen_random_uuid() primary key,
  ticket_id uuid references public.tickets on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  content text not null,
  is_system_message boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create attachments table for ticket files
create table if not exists public.ticket_attachments (
  id uuid default gen_random_uuid() primary key,
  ticket_id uuid references public.tickets on delete cascade not null,
  message_id uuid references public.ticket_messages on delete cascade,
  file_name text not null,
  file_type text not null,
  file_size integer not null,
  storage_path text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users on delete cascade not null
);

-- Create storage bucket for ticket attachments
insert into storage.buckets (id, name, public)
values ('ticket-attachments', 'ticket-attachments', false);

-- Enable RLS
alter table public.tickets enable row level security;
alter table public.ticket_messages enable row level security;
alter table public.ticket_attachments enable row level security;

-- Tickets policies
create policy "Users can view their own tickets"
  on public.tickets for select
  using (auth.uid() = user_id);

create policy "Users can create tickets"
  on public.tickets for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tickets"
  on public.tickets for update
  using (auth.uid() = user_id);

-- Messages policies
create policy "Users can view messages for their tickets"
  on public.ticket_messages for select
  using (
    exists (
      select 1 from public.tickets
      where tickets.id = ticket_id
      and tickets.user_id = auth.uid()
    )
  );

create policy "Users can create messages for their tickets"
  on public.ticket_messages for insert
  with check (
    exists (
      select 1 from public.tickets
      where tickets.id = ticket_id
      and tickets.user_id = auth.uid()
    )
  );

-- Attachments policies
create policy "Users can view attachments for their tickets"
  on public.ticket_attachments for select
  using (
    exists (
      select 1 from public.tickets
      where tickets.id = ticket_id
      and tickets.user_id = auth.uid()
    )
  );

create policy "Users can upload attachments to their tickets"
  on public.ticket_attachments for insert
  with check (
    exists (
      select 1 from public.tickets
      where tickets.id = ticket_id
      and tickets.user_id = auth.uid()
    )
  );

-- Storage policies
create policy "Users can view their ticket attachments"
  on storage.objects for select
  using (
    bucket_id = 'ticket-attachments' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can upload ticket attachments"
  on storage.objects for insert
  with check (
    bucket_id = 'ticket-attachments' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Function to update ticket updated_at
create or replace function public.handle_ticket_updated()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for updating ticket timestamp
create trigger on_ticket_updated
  before update on public.tickets
  for each row execute procedure public.handle_ticket_updated(); 