const crypto = require("crypto");

// Short-lived server-side cache for validated bulk-import previews. The
// confirm step re-reads from here rather than trusting whatever the client
// sends back — otherwise nothing stops a modified request from claiming a
// row was valid when it wasn't, or substituting different row data than
// what the admin actually saw and approved.
//
// In-memory Map is fine for a single-instance deployment. If this ever runs
// across multiple server instances behind a load balancer, swap this for a
// Redis-backed cache with the same TTL semantics — noted now so it isn't a
// surprise later, not something to build preemptively.

const TTL_MS = 15 * 60 * 1000; // 15 minutes
const store = new Map();

const set = (payload) => {
  const token = crypto.randomUUID();
  store.set(token, { ...payload, expiresAt: Date.now() + TTL_MS });
  return token;
};

const get = (token) => {
  const entry = store.get(token);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    store.delete(token);
    return null;
  }
  return entry;
};

const remove = (token) => {
  store.delete(token);
};

// Lazy sweep of expired entries on every write, so a long-running process
// doesn't slowly accumulate abandoned previews forever.
setInterval(() => {
  const now = Date.now();
  for (const [token, entry] of store.entries()) {
    if (entry.expiresAt < now) store.delete(token);
  }
}, TTL_MS).unref();

module.exports = { set, get, remove };
