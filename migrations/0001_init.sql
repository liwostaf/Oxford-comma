-- Phase 1: Guest orders only (no auth yet)

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  orderNumber TEXT UNIQUE NOT NULL,
  guestName TEXT NOT NULL,
  guestEmail TEXT,
  guestPhone TEXT,
  drink TEXT NOT NULL,
  drinkId TEXT NOT NULL,
  size TEXT NOT NULL,
  milk TEXT NOT NULL,
  customNote TEXT,
  pickupTime TEXT NOT NULL,
  popupDate TEXT NOT NULL,
  status TEXT DEFAULT 'reserved',
  totalPrice DECIMAL(5, 2) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_popup ON orders(popupDate);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_slot ON orders(pickupTime);

-- Contact info storage for guests (one-time)
CREATE TABLE IF NOT EXISTS guestContacts (
  id TEXT PRIMARY KEY,
  orderId TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
);

-- Customization options (menu items)
CREATE TABLE IF NOT EXISTS drinks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(5, 2) NOT NULL,
  description TEXT,
  badge TEXT,
  color TEXT,
  status TEXT DEFAULT 'active',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sizes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  priceAdd DECIMAL(5, 2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS milks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  priceAdd DECIMAL(5, 2) DEFAULT 0
);

-- Popup event (single event for Phase 1)
CREATE TABLE IF NOT EXISTS popups (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL UNIQUE,
  startTime TEXT NOT NULL,
  endTime TEXT NOT NULL,
  location TEXT NOT NULL,
  active BOOLEAN DEFAULT 1,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed data
INSERT OR IGNORE INTO drinks (id, name, price, description, badge, color, status)
VALUES
  ('latte', 'Latte', 4.25, 'Double shot, silky steamed milk.', 'fan fave', '#FFD66B', 'active'),
  ('cappuccino', 'Cappuccino', 4.00, 'Espresso, milk, and a thick cap of foam.', '', '#F5E1C0', 'active'),
  ('flatwhite', 'Flat white', 4.25, 'Ristretto shots, thin velvety milk.', '', '#E8CBA8', 'active'),
  ('honeylav', 'Honey lavender latte', 5.00, 'House syrup with local Massachusetts honey.', 'signature', '#CDB8E8', 'active'),
  ('matcha', 'Matcha latte', 5.00, 'Ceremonial-grade matcha, whisked to order.', '', '#A8CC8C', 'active'),
  ('coldbrew', 'Nitro cold brew', 4.00, 'Slow-steeped, poured creamy on tap.', 'iced', '#B9D3F2', 'active');

INSERT OR IGNORE INTO sizes (id, name, priceAdd)
VALUES
  ('12oz', '12 oz', 0),
  ('16oz', '16 oz', 0.75);

INSERT OR IGNORE INTO milks (id, name, priceAdd)
VALUES
  ('whole', 'Whole', 0),
  ('2pct', '2%', 0),
  ('skim', 'Skim', 0),
  ('oat', 'Oat', 0.75),
  ('almond', 'Almond', 0.75),
  ('none', 'No milk', 0);

INSERT OR IGNORE INTO popups (id, date, startTime, endTime, location, active)
VALUES
  ('popup-1', '2026-10-05', '12:30', '14:00', 'Blue booths', 1);
