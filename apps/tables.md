create table users(
	id uuid primary key default gen_random_uuid(),
	clerk_user_id text unique not null,
	email text not null,
	created_at timestamp default now()
);
create table organizations(
	id uuid primary key default gen_random_uuid(),
	name text not null,
	created_at timestamp default now()
)

create table organization_members(
	id uuid primary key default gen_random_uuid(),
	user_id uuid references users(id) on delete cascade,
	organization_id uuid references organizations(id) on delete cascade,
	role text check(role In('member','admin')) default 'member'
);
create table apis(
	id uuid primary key default gen_random_uuid(),
	user_id uuid references users(id) on delete cascade,
	name text not null,
	base_url text not null,
	rate_limit integer not null,
	created_at timestamp default current_timestamp
);

create table api_usage_logs(
	id uuid primary key default gen_random_uuid(),
	api_id uuid references apis(id) on delete cascade,
	request_count integer not null,
	recorded_at timestamp default current_timestamp
);