# Eternal Sky Tour API

FastAPI backend for the website. It stores trip planner requests and the chat
between travellers and staff, and serves the staff admin area (`/admin` on the
website).

The browser never calls this service directly. The Next.js site proxies
`/api/*` here (see `next.config.ts`), so the admin session and the traveller's
chat cookie are first-party cookies on the website's own domain.

## Run locally

Requires Python 3.12+.

```powershell
cd backend
py -3.12 -m venv .venv
.venv\Scripts\python -m pip install -r requirements.txt
.venv\Scripts\python -m app.cli create-admin --email you@eternalskytour.com --name "Your Name"
.venv\Scripts\python -m uvicorn app.main:app --reload --port 8000
```

Then run the website (`npm run dev` in the project root) and open:

- http://localhost:3000/en/trip-planner to submit a plan as a traveller
- http://localhost:3000/admin to sign in as staff

Local data lives in `backend/eternal_sky.db` (SQLite). Delete the file to start over.
API docs: http://localhost:8000/docs

## Staff accounts

```powershell
.venv\Scripts\python -m app.cli create-admin --email name@eternalskytour.com --name "Saraa"
```

You'll be asked for a password (at least 10 characters). Running the command
again for an existing email resets that person's password.

## How chat works

- A traveller's chat starts when they submit the trip planner, or from the chat
  bubble on any page. The browser keeps a secret token in an httpOnly cookie
  (`esk_chat`); only its hash is stored.
- New messages are fetched by polling: every 4 s while a chat is open, every
  30 s otherwise. Polling works on any host, including serverless ones.
- A staff reply to a **New** trip plan moves it to **Contacted** automatically.

## AI chat assistant

The assistant (`app/assistant.py`) answers travellers in the chat straight
away, using the tour catalog the website publishes at `/catalog.json` (the same
data as the tour pages). It runs on Claude Opus 5.5 through the Anthropic API.

- **One tour at a time:** when a traveller asks about a trip, the reply carries
  a card for that tour only (photo, length, price, link). The model chooses
  from the catalog's tours; anything else is dropped.
- **Facts from the catalog only:** prices, dates and availability come from
  the catalog, never invented.
- **Hand-over:** if the traveller asks for a person, wants to book or pay, asks
  for a discount or custom quote, complains, or asks something the catalog
  can't answer, the assistant says a trip planner will reply and switches itself
  off for that chat. Those chats show **AI off** in the admin inbox.
- **Staff in control:** a staff reply switches the assistant off for that
  conversation; the switch above each chat in the admin turns it back on.
- **After a trip plan** the assistant replies with the tours that best fit it.

Setup: put your Anthropic API key in `backend/.env` as `ANTHROPIC_API_KEY=...`
and restart the backend. Without a key (or with `ASSISTANT_ENABLED=false`)
chats still work and simply wait for staff. Failed requests are logged and
leave the chat to staff.

Cost: replies use low effort and the ~5k-token catalog is prompt-cached, so a
typical reply is estimated at roughly 1–3 US cents (Claude Opus 5.5: $4 / $20
per million input / output tokens). Check real usage in the Anthropic Console. Requests opt into Anthropic's server-side refusal fallback
(`fallbacks: "default"`), so a reply declined by a safety classifier is retried
on a suitable model instead of failing.

## Tests

```powershell
.venv\Scripts\python -m pytest
```

## Production

Set these environment variables (or a `backend/.env` file, see `.env.example`):

| Variable        | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| `DATABASE_URL`  | `postgresql+psycopg://user:password@host:5432/eternal_sky`         |
| `SECRET_KEY`    | long random string: `python -c "import secrets; print(secrets.token_urlsafe(48))"` |
| `COOKIE_SECURE` | `true` (the site must be served over HTTPS)                        |

On the website, set `BACKEND_URL` to wherever this API runs (default
`http://127.0.0.1:8000`).

Run with e.g. `uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 2`
behind the same reverse proxy as the website.

Before going live, also consider:

- **Migrations:** tables are created on start-up. Add Alembic before changing
  columns on a database that holds real data.
- **Rate limiting** on `POST /api/trip-plans` and the chat endpoints (at the
  reverse proxy, or with a library such as `slowapi`) to deter spam.
- **Notifications:** staff only see new plans and messages in the admin area.
  An email or Telegram alert on new messages is a natural next step.
