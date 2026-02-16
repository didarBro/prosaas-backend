const { getAllUsers } = require('../src/controllers/auth.controller');

// Mock response
const res = {
  status(code) { this.statusCode = code; return this; },
  json(obj) { console.log('RES', this.statusCode, JSON.stringify(obj, null, 2)); }
};

(async () => {
  // Test as non-superadmin
  await getAllUsers({ user: { userId: 'someUserId' } }, res, (e) => { if (e) console.error(e); });

  // Test as superadmin (will attempt DB access; if no DB connection, it will throw)
  await getAllUsers({ user: { userId: 'superadmin' } }, res, (e) => { if (e) console.error(e); });
})();
