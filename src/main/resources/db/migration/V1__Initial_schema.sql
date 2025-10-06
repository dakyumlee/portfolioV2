CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    description TEXT,
    stack VARCHAR(500),
    demo_url VARCHAR(500),
    repo_url VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE contact_logs (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    processed BOOLEAN DEFAULT false,
    admin_reply TEXT,
    created_at TIMESTAMP,
    processed_at TIMESTAMP
);
