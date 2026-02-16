const { login } = require('../src/controllers/auth.controller');

// Mock request/response
const req = { body: { email: 'superadmin@prosaas.local', password: 'SuperSecret123!' } };
const res = {
  status(code) { this.statusCode = code; return this; },
  json(obj) { console.log('RES JSON', this.statusCode, JSON.stringify(obj)); }
};

login(req, res, (err) => { if (err) console.error('ERR', err); });
