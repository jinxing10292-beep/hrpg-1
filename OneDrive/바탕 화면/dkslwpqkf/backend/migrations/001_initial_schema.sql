-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    personal_key VARCHAR(8) UNIQUE NOT NULL,
    gold BIGINT NOT NULL DEFAULT 1000,
    money INTEGER NOT NULL DEFAULT 0,
    login_streak INTEGER NOT NULL DEFAULT 0,
    last_login TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create swords table
CREATE TABLE IF NOT EXISTS swords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    level INTEGER NOT NULL DEFAULT 0,
    base_power INTEGER NOT NULL,
    current_power INTEGER NOT NULL,
    is_hidden BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    enhanced_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create battles table
CREATE TABLE IF NOT EXISTS battles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player1_id UUID NOT NULL REFERENCES users(id),
    player2_id UUID NOT NULL REFERENCES users(id),
    winner_id UUID REFERENCES users(id),
    player1_sword_id UUID NOT NULL REFERENCES swords(id),
    player2_sword_id UUID NOT NULL REFERENCES swords(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (player1_id) REFERENCES users(id),
    FOREIGN KEY (player2_id) REFERENCES users(id),
    FOREIGN KEY (winner_id) REFERENCES users(id),
    FOREIGN KEY (player1_sword_id) REFERENCES swords(id),
    FOREIGN KEY (player2_sword_id) REFERENCES swords(id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_swords_user_id ON swords(user_id);
CREATE INDEX IF NOT EXISTS idx_battles_player1_id ON battles(player1_id);
CREATE INDEX IF NOT EXISTS idx_battles_player2_id ON battles(player2_id);
CREATE INDEX IF NOT EXISTS idx_battles_winner_id ON battles(winner_id);

-- Insert initial users with their personal keys
INSERT INTO users (name, personal_key, gold, money) VALUES
    ('조예준', 'yj7f9k2m', 1000, 0),
    ('박은찬', 'ec5h8j3n', 1000, 0),
    ('김동혁', 'dh4k9l7p', 1000, 0),
    ('정결', 'gj2m6n9p', 1000, 0),
    ('이승준', 'sj8p4m2k', 1000, 0),
    ('이정태', 'jt5n8k3m', 1000, 0),
    ('김산', 'sk9m2n6p', 1000, 0)
ON CONFLICT (personal_key) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating updated_at
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
