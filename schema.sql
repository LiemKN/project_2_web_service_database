DROP TABLE IF EXISTS emailform;

CREATE TABLE emailform (
  id SERIAL PRIMARY KEY,
  send_year INT,
  send_month INT,
  send_day INT,
  email_address TEXT,
  code_content TEXT,
  is_sent INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
