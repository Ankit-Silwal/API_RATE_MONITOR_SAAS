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
	recorded_at timestamp default current_timestamp
);
ALTER TABLE api_usage_logs
ADD COLUMN endpoint TEXT,
ADD COLUMN status_code INT,
ADD COLUMN response_time INT;

CREATE INDEX idx_api_usage_api_id
ON api_usage_logs(api_id);

CREATE INDEX idx_api_usage_logs_recorded_at
ON api_usage_logs(recorded_at);

create table api_keys(
	id uuid primary key default gen_random_uuid(),
	api_id uuid references apis(id) on delete cascade,
	key_hash text not null,
	created_at timestamp default current_timestamp
);