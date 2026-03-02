create table users(
	id uuid primary key default gen_random_uuid(),
	clerk_user_id text unique not null,
	email text not null,
	created_at timestamp default now()
);