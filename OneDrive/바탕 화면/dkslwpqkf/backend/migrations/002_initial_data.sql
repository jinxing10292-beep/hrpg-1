-- Initial sword data for each user
DO $$
DECLARE
    user_rec RECORD;
    sword_names TEXT[] := ARRAY[
        '용사의 검', '전설의 대검', '마법의 단검', '신성한 장검', '어둠의 검', '빛의 검', '바람의 검'
    ];
    sword_descriptions TEXT[] := ARRAY[
        '평범해 보이지만 강력한 힘이 잠들어 있다',
        '오래된 전설에 등장하는 검',
        '빛을 내는 신비로운 단검',
        '성스러운 기운이 감도는 장검',
        '어둠의 힘이 서려 있는 검',
        '순수한 빛의 정수를 담은 검',
        '바람을 자유롭게 다룰 수 있는 검'
    ];
    i INTEGER;
    base_power INTEGER;
    current_power INTEGER;
    sword_name TEXT;
    sword_desc TEXT;
    sword_id UUID;
BEGIN
    -- For each user, create an initial sword
    FOR user_rec IN SELECT id, name FROM users LOOP
        -- Randomly select a sword name and description
        i := 1 + floor(random() * array_length(sword_names, 1))::integer;
        sword_name := sword_names[i];
        sword_desc := sword_descriptions[i];
        
        -- Calculate base power (100-150)
        base_power := 100 + floor(random() * 51)::integer;
        
        -- Insert the sword
        INSERT INTO swords (user_id, name, level, base_power, current_power, is_hidden, created_at, enhanced_at)
        VALUES (
            user_rec.id,
            sword_name,
            0, -- Start at level 0
            base_power,
            base_power, -- Current power equals base power at level 0
            false, -- Not hidden by default
            NOW(),
            NOW()
        )
        RETURNING id INTO sword_id;
        
        -- Update user's description
        UPDATE users 
        SET updated_at = NOW()
        WHERE id = user_rec.id;
        
        RAISE NOTICE 'Created % for user % (ID: %)', sword_name, user_rec.name, user_rec.id;
    END LOOP;
END $$;
