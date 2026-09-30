# Phase 1 Local Development

## What's Built

**Customer App** (`http://localhost:3000/`)
- Guest checkout flow (email or phone required)
- "Be the first to hear" signup popup (every checkout)
- "Are you sure you don't want to sign up?" popup (first time only)
- Order confirmation with order number
- Real-time slot availability tracking (max 6 per 15-min slot)
- Responsive design, navy + cream theme

**Admin Board** (`http://localhost:3000/admin.html`)
- Live order tracking grouped by pickup time
- Order status flow: reserved → ready → picked up
- Stats: # reserved, # ready, # picked up, revenue
- Beep sounds: ding (new order), double-ding (ready), warning (cancel)
- Polls every 2 seconds for live updates

## Setup (Local Testing)

### 1. Install dependencies
```bash
cd /home/user/Oxford-comma
npm install
```

### 2. Start local dev server
```bash
npm run dev
```

This starts a dev server at `http://localhost:3000` (or similar—check output)

### 3. Test the flow

**Browser 1 (or tab):**
1. Go to `http://localhost:3000`
2. Click "Start Ordering"
3. Pick a drink, size, milk, and pickup time
4. Enter name and email (or phone)
5. Click "Reserve it"
6. See signup popup—skip for now
7. See "Are you sure?" popup—click "Continue as guest"
8. Get confirmation with order #

**Browser 2 (or tab):**
1. Go to `http://localhost:3000/admin.html`
2. Should see your order appear in real-time
3. Click "mark ready" → hear double-ding sound
4. Click "picked up" → order fades out
5. Watch stats update

## Data Storage (Phase 1)

- Orders are saved in **browser localStorage** (`oxford-comma-orders`)
- Data persists across page refreshes but is lost if you clear browser data
- Phase 2 will move this to Cloudflare D1 database

## Troubleshooting

**Dev server won't start?**
```bash
# Make sure Node.js is installed
node --version

# Try deleting node_modules and reinstalling
rm -rf node_modules
npm install
npm run dev
```

**Orders not appearing on admin board?**
- Make sure both browser tabs/windows are on localhost
- Check that sounds are enabled (click the toggle on admin board)
- Refresh the admin board (↻ button)

**Can't hear sounds?**
- Click the 🔔 toggle on the admin board to enable/disable
- Browser may require user interaction before playing audio (common security feature)

## What's Coming in Phase 2

- ✅ Email/phone verification (one-time code)
- ✅ User account creation & login
- ✅ Password reset / account recovery
- ✅ Loyalty card (8 drinks = 1 free, auto-stamp on pickup)
- ✅ Cloudflare D1 database (instead of localStorage)
- ✅ Admin login & management
- ✅ Order editing/cancellation for guests & users

## File Structure

```
/home/user/Oxford-comma/
├── public/
│   ├── index.html          # Customer app
│   ├── admin.html          # Admin board
│   └── logo.webp           # Logo asset
├── migrations/
│   └── 0001_init.sql       # D1 schema (Phase 2)
├── functions/              # API endpoints (Phase 2)
├── package.json            # Dependencies
├── wrangler.toml           # Cloudflare config
└── LOCAL_DEV.md            # This file
```

## Notes

- Order numbers are generated client-side (e.g., "A7K2")
- Slot cap is 6 orders per 15-minute window
- Popup event is hardcoded to 2026-10-05, 12:30–14:00 at Blue booths
- Admin board polls localStorage every 2 seconds (no real DB yet)
- All styling is inline (no separate CSS files)

---

**Next:** Once you approve this Phase 1, we'll move to **Phase 2 (Authentication)** which adds user accounts, D1 database, and email verification.
