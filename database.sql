-- Database Creation
CREATE DATABASE opportunity_bridge;

-- Connect to the database before running the schema
-- \c opportunity_bridge

-- OpportunityBridge AI Database Schema

-- 1. Users Table
-- Stores all user accounts including Seekers, Admins, and Companies
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Mocked in frontend
    role VARCHAR(50) DEFAULT 'seeker', -- 'seeker', 'admin', 'company'
    has_seen_onboarding BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Profiles Table
-- Stores extended details for Seekers (Resume, Skills, etc.)
CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    resume_url VARCHAR(512),
    skills TEXT[], -- Array of strings for PostgreSQL
    experience JSONB, -- Storing experience as JSON blob: [{role, company, duration}]
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Opportunities Table
-- The core listings (Jobs, Internships, etc.)
CREATE TABLE IF NOT EXISTS opportunities (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- Scholarship, Internship, etc.
    category VARCHAR(50) NOT NULL, -- Tech, Arts, etc.
    location VARCHAR(255) NOT NULL,
    is_remote BOOLEAN DEFAULT FALSE,
    stipend_amount DECIMAL(10, 2) DEFAULT 0,
    deadline DATE,
    description TEXT,
    requirements TEXT[],
    posted_at DATE DEFAULT CURRENT_DATE,
    logo_color VARCHAR(50), -- Tailwind class e.g., 'bg-blue-500' for fallback
    logo_url VARCHAR(512), -- Real image URL for the company logo
    posted_by_user_id INT REFERENCES users(id) ON DELETE SET NULL, -- Links to the company user who posted it
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Applications Table
-- Links Users to Opportunities with a status
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    opportunity_id INT REFERENCES opportunities(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'Applied', -- Applied, Under Review, Offer, Rejected, Interview
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cover_letter TEXT,
    UNIQUE(user_id, opportunity_id) -- Prevent duplicate applications
);

-- 5. Notifications Table
-- System messages for users (e.g. "Application Accepted")
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    type VARCHAR(50) DEFAULT 'info', -- info, success, warning, error
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --- SEED DATA IMPORT ---

-- Insert Users
INSERT INTO users (id, name, email, password_hash, role, has_seen_onboarding) VALUES
(101, 'Alex Rivera', 'alex@example.com', 'hashed_pass_123', 'seeker', FALSE),
(102, 'Sarah Chen', 'sarah@example.com', 'hashed_pass_456', 'seeker', TRUE),
(500, 'Creative Studio HR', 'company@example.com', 'hashed_pass_789', 'company', TRUE),
(900, 'Admin User', 'admin@example.com', 'hashed_pass_000', 'admin', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Insert Profiles
INSERT INTO profiles (user_id, name, email, bio, skills, experience) VALUES
(101, 'Alex Rivera', 'alex@example.com', 'Passionate learner looking for opportunities in technology and design.', ARRAY['HTML', 'CSS', 'JavaScript', 'Communication'], '[{"role": "Volunteer", "company": "Local Library", "duration": "Summer 2023"}]')
ON CONFLICT DO NOTHING;

-- Insert Opportunities
INSERT INTO opportunities (id, title, organization, type, category, location, is_remote, stipend_amount, deadline, description, requirements, posted_at, logo_color, logo_url, posted_by_user_id) VALUES
(1, 'Future Coders Scholarship', 'TechForGood Foundation', 'Scholarship', 'Technology', 'Remote', TRUE, 5000, '2024-12-31', 'A scholarship for underrepresented youth interested in software engineering. Includes mentorship.', ARRAY['High school student or equivalent', 'Interest in CS', '3.0 GPA or higher'], '2024-01-15', 'bg-blue-500', NULL, 900),
(2, 'Junior Graphic Design Intern', 'Creative Studio X', 'Internship', 'Arts & Design', 'New York, NY', FALSE, 2500, '2024-06-15', 'Paid internship for aspiring designers to work on real client projects. Adobe Suite proficiency required.', ARRAY['Portfolio required', 'Adobe Illustrator & Photoshop', 'Available for 3 months'], '2024-02-01', 'bg-purple-500', 'https://images.unsplash.com/photo-1626785774573-4b799312c95d?auto=format&fit=crop&q=80&w=200&h=200', 500),
(3, 'Welding Apprenticeship', 'IronWorks Union', 'Apprenticeship', 'Skilled Trades', 'Chicago, IL', FALSE, 4000, '2024-08-01', 'Hands-on apprenticeship learning modern welding techniques. Path to full certification.', ARRAY['High school diploma/GED', 'Physical stamina', 'Detail oriented'], '2024-03-10', 'bg-orange-600', NULL, 900),
(4, 'AI & Ethics Workshop', 'OpenAI Learning', 'Workshop', 'Technology', 'Remote', TRUE, 0, '2024-05-20', 'Weekend workshop exploring the ethical implications of artificial intelligence.', ARRAY['No coding experience needed', 'Interest in philosophy or tech'], '2024-04-05', 'bg-emerald-500', 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=200&h=200', 500),
(5, 'Community Garden Coordinator', 'Green City', 'Entry Level Job', 'Community Service', 'Portland, OR', FALSE, 3200, '2024-05-01', 'Entry level position managing volunteers and garden beds.', ARRAY['Experience with gardening', 'Leadership skills', 'Weekend availability'], '2024-02-20', 'bg-green-600', NULL, 900),
(6, 'STEM University Grant', 'National Science Board', 'Scholarship', 'Academic', 'Remote', TRUE, 10000, '2024-11-15', 'Grant for high school seniors pursuing STEM degrees.', ARRAY['Accepted to 4-year university', 'STEM Major', 'Essay required'], '2023-12-01', 'bg-indigo-600', NULL, 900),
(7, 'Frontend React Bootcamp', 'Code Academy', 'Workshop', 'Technology', 'San Francisco, CA', FALSE, 0, '2024-07-10', 'Intensive 2-week bootcamp for React and TypeScript. Scholarship available for tuition.', ARRAY['Basic HTML/CSS knowledge', 'Laptop required'], '2024-04-01', 'bg-sky-500', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=200&h=200', 900),
(8, 'Digital Music Production Mentorship', 'SoundWave', 'Mentorship', 'Arts & Design', 'Remote', TRUE, 500, '2024-09-01', 'One-on-one mentorship with industry producers. Learn Logic Pro and mixing.', ARRAY['Submit 1 demo track', 'Passion for music'], '2024-03-15', 'bg-pink-500', NULL, 900)
ON CONFLICT (id) DO NOTHING;

-- Insert Applications
INSERT INTO applications (id, user_id, opportunity_id, status, applied_at) VALUES
(1, 101, 1, 'Applied', '2024-05-10 10:00:00'),
(2, 102, 2, 'Under Review', '2024-05-12 14:30:00')
ON CONFLICT (id) DO NOTHING;

-- Insert Notifications
INSERT INTO notifications (user_id, title, message, is_read, type, created_at) VALUES
(101, 'Welcome to OpportunityBridge', 'We''re glad to have you here! Complete your profile to get better recommendations.', FALSE, 'info', '2024-05-09 09:00:00'),
(101, 'Application Received', 'Your application for ''Future Coders Scholarship'' has been received successfully.', TRUE, 'success', '2024-05-10 10:05:00')
ON CONFLICT (id) DO NOTHING;

-- Reset Sequences (Postgres specific helper to ensure auto-increment works after manual ID insertion)
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('profiles_id_seq', (SELECT MAX(id) FROM profiles));
SELECT setval('opportunities_id_seq', (SELECT MAX(id) FROM opportunities));
SELECT setval('applications_id_seq', (SELECT MAX(id) FROM applications));
SELECT setval('notifications_id_seq', (SELECT MAX(id) FROM notifications));
