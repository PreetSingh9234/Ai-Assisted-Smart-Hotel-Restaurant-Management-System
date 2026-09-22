import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'nora-local.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema(db);
    seedIfEmpty(db);
  }
  return db;
}

function initSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id           TEXT PRIMARY KEY,
      customerName TEXT NOT NULL,
      totalAmount  REAL NOT NULL DEFAULT 0,
      status       TEXT NOT NULL DEFAULT 'New',
      createdAt    TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id         TEXT PRIMARY KEY,
      orderId    TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      menuItemId TEXT,
      name       TEXT NOT NULL,
      quantity   INTEGER NOT NULL DEFAULT 1,
      price      REAL NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS menu_items (
      id        TEXT PRIMARY KEY,
      name      TEXT NOT NULL,
      category  TEXT NOT NULL,
      price     REAL NOT NULL,
      rating    REAL NOT NULL DEFAULT 0,
      available INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS inventory (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      quantity   REAL NOT NULL DEFAULT 0,
      unit       TEXT NOT NULL,
      status     TEXT NOT NULL DEFAULT 'Normal',
      dailyUsage REAL NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS customers (
      id           TEXT PRIMARY KEY,
      name         TEXT NOT NULL,
      ordersCount  INTEGER NOT NULL DEFAULT 0,
      totalSpend   REAL NOT NULL DEFAULT 0,
      favoriteDish TEXT,
      lastOrderAt  TEXT,
      segment      TEXT NOT NULL DEFAULT 'New'
    );
  `);
}

// ── Seed Helpers ──────────────────────────────────────────────────────────────
const hoursAgo = (h: number) =>
  new Date(Date.now() - h * 3_600_000).toISOString();
const daysAgo = (d: number, hOffset = 0) =>
  new Date(Date.now() - d * 86_400_000 - hOffset * 3_600_000).toISOString();

function seedIfEmpty(database: Database.Database) {
  const existing = database
    .prepare('SELECT COUNT(*) as c FROM menu_items')
    .get() as { c: number };
  if (existing.c > 0) return; // Already seeded

  // ── Menu Items ──────────────────────────────────────────────────────────
  const menuItems = [
    { id: 'm1',  name: 'Peri-Peri Pizza',    category: 'Pizza',        price: 389, rating: 4.7, available: 1 },
    { id: 'm2',  name: 'Margherita Pizza',    category: 'Pizza',        price: 299, rating: 4.5, available: 1 },
    { id: 'm3',  name: 'Butter Chicken',      category: 'Indian Mains', price: 349, rating: 4.8, available: 1 },
    { id: 'm4',  name: 'Chicken Biryani',     category: 'Indian Mains', price: 329, rating: 4.6, available: 1 },
    { id: 'm5',  name: 'Paneer Tikka',        category: 'Starters',     price: 279, rating: 4.4, available: 1 },
    { id: 'm6',  name: 'Garlic Bread',        category: 'Starters',     price: 149, rating: 4.3, available: 1 },
    { id: 'm7',  name: 'Loaded Fries',        category: 'Starters',     price: 189, rating: 4.2, available: 1 },
    { id: 'm8',  name: 'Masala Pasta',        category: 'Mains',        price: 259, rating: 4.1, available: 0 },
    { id: 'm9',  name: 'Chicken Burger',      category: 'Burgers',      price: 249, rating: 4.3, available: 1 },
    { id: 'm10', name: 'Chocolate Brownie',   category: 'Desserts',     price: 179, rating: 4.6, available: 1 },
    { id: 'm11', name: 'Mango Lassi',         category: 'Beverages',    price: 129, rating: 4.5, available: 1 },
    { id: 'm12', name: 'Masala Chai',         category: 'Beverages',    price:  69, rating: 4.4, available: 1 },
  ];

  const menuInsert = database.prepare(
    'INSERT INTO menu_items (id, name, category, price, rating, available) VALUES (@id, @name, @category, @price, @rating, @available)'
  );
  const insertMenuTx = database.transaction(() => {
    for (const m of menuItems) menuInsert.run(m);
  });
  insertMenuTx();

  // ── Inventory ───────────────────────────────────────────────────────────
  const inventory = [
    { id: 'i1',  name: 'Tomatoes',    quantity: 25, unit: 'kg', status: 'Normal',   dailyUsage: 3.2 },
    { id: 'i2',  name: 'Cheese',      quantity:  8, unit: 'kg', status: 'Low',      dailyUsage: 1.8 },
    { id: 'i3',  name: 'Chicken',     quantity:  3, unit: 'kg', status: 'Critical', dailyUsage: 4.5 },
    { id: 'i4',  name: 'Flour',       quantity: 40, unit: 'kg', status: 'Normal',   dailyUsage: 2.1 },
    { id: 'i5',  name: 'Paneer',      quantity:  6, unit: 'kg', status: 'Low',      dailyUsage: 2.0 },
    { id: 'i6',  name: 'Rice',        quantity: 30, unit: 'kg', status: 'Normal',   dailyUsage: 3.5 },
    { id: 'i7',  name: 'Onions',      quantity: 15, unit: 'kg', status: 'Normal',   dailyUsage: 2.8 },
    { id: 'i8',  name: 'Butter',      quantity:  2, unit: 'kg', status: 'Critical', dailyUsage: 1.2 },
    { id: 'i9',  name: 'Cooking Oil', quantity: 18, unit: 'L',  status: 'Normal',   dailyUsage: 1.5 },
    { id: 'i10', name: 'Mango Pulp',  quantity:  4, unit: 'L',  status: 'Low',      dailyUsage: 1.8 },
  ];

  const invInsert = database.prepare(
    'INSERT INTO inventory (id, name, quantity, unit, status, dailyUsage) VALUES (@id, @name, @quantity, @unit, @status, @dailyUsage)'
  );
  const insertInvTx = database.transaction(() => {
    for (const item of inventory) invInsert.run(item);
  });
  insertInvTx();

  // ── Customers ───────────────────────────────────────────────────────────
  const customers = [
    { id: 'c1', name: 'Priya Sharma',   ordersCount: 14, totalSpend: 5400, favoriteDish: 'Butter Chicken',  lastOrderAt: daysAgo(2),  segment: 'VIP'     },
    { id: 'c2', name: 'Arjun Mehta',    ordersCount:  8, totalSpend: 3200, favoriteDish: 'Chicken Biryani', lastOrderAt: daysAgo(5),  segment: 'Regular' },
    { id: 'c3', name: 'Rahul Verma',    ordersCount: 22, totalSpend: 9800, favoriteDish: 'Peri-Peri Pizza', lastOrderAt: hoursAgo(1), segment: 'VIP'     },
    { id: 'c4', name: 'Sneha Patel',    ordersCount:  1, totalSpend:  488, favoriteDish: 'Margherita Pizza',lastOrderAt: hoursAgo(2), segment: 'New'     },
    { id: 'c5', name: 'Kiran Reddy',    ordersCount: 12, totalSpend: 4500, favoriteDish: 'Paneer Tikka',    lastOrderAt: daysAgo(17), segment: 'At Risk' },
    { id: 'c6', name: 'Anjali Deshmukh',ordersCount:  6, totalSpend: 2100, favoriteDish: 'Garlic Bread',    lastOrderAt: daysAgo(3),  segment: 'Regular' },
    { id: 'c7', name: 'Vikram Singh',   ordersCount: 19, totalSpend: 7200, favoriteDish: 'Chicken Biryani', lastOrderAt: hoursAgo(5), segment: 'VIP'     },
  ];

  const custInsert = database.prepare(
    'INSERT INTO customers (id, name, ordersCount, totalSpend, favoriteDish, lastOrderAt, segment) VALUES (@id, @name, @ordersCount, @totalSpend, @favoriteDish, @lastOrderAt, @segment)'
  );
  const insertCustTx = database.transaction(() => {
    for (const c of customers) custInsert.run(c);
  });
  insertCustTx();

  // ── Orders + Order Items ────────────────────────────────────────────────
  const orderInsert = database.prepare(
    'INSERT INTO orders (id, customerName, totalAmount, status, createdAt) VALUES (@id, @customerName, @totalAmount, @status, @createdAt)'
  );
  const itemInsert = database.prepare(
    'INSERT INTO order_items (id, orderId, menuItemId, name, quantity, price) VALUES (@id, @orderId, @menuItemId, @name, @quantity, @price)'
  );
  const updateTotal = database.prepare('UPDATE orders SET totalAmount = ? WHERE id = ?');

  const customerNames = ['Rahul Verma','Priya Sharma','Arjun Mehta','Sneha Patel','Kiran Reddy','Anjali Deshmukh','Vikram Singh'];

  const insertOrdersTx = database.transaction(() => {
    for (let i = 0; i < 50; i++) {
      const isToday = i < 20;
      const createdAt = isToday
        ? hoursAgo(Math.random() * 8)
        : daysAgo(Math.floor(Math.random() * 5) + 1, Math.random() * 12);

      let status = 'Delivered';
      if (isToday) {
        if (i < 2)      status = 'New';
        else if (i < 6) status = 'Preparing';
        else if (i < 8) status = 'Ready';
        else if (i === 8) status = 'Delayed';
      }

      const orderId = (2404 + i).toString();
      const numItems = Math.floor(Math.random() * 3) + 1;
      let total = 0;

      orderInsert.run({
        id: orderId,
        customerName: customerNames[Math.floor(Math.random() * customerNames.length)],
        totalAmount: 0,
        status,
        createdAt,
      });

      for (let j = 0; j < numItems; j++) {
        const m = menuItems[Math.floor(Math.random() * menuItems.length)];
        const qty = Math.floor(Math.random() * 2) + 1;
        total += m.price * qty;
        itemInsert.run({
          id: `${orderId}-item-${j}`,
          orderId,
          menuItemId: m.id,
          name: m.name,
          quantity: qty,
          price: m.price,
        });
      }

      updateTotal.run(total, orderId);
    }
  });
  insertOrdersTx();
}