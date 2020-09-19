/** Hookup Express */
const express = require("express");
const app = express();

/** Configure our body Parser */
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/diagnostic", (_, res) => res.status(200).end("OK"));

/** Specific bounce */
app.get("/bounceme", (req, res) => req.query.url
  ? res.redirect(req.query.url)
  : res.status(400).json({ error: "no url" }));

app.get('/internalUser', (req, res) => {
  /** Get the domain part of the host */
  const domain = '.' + req.get('host').split('.').slice(-2).join('.');
  const httpOnly = true;
  const maxAge = 60000;
  const path = '/';
  res.cookie('internalUser', 'true', { maxAge, httpOnly, domain, path });
  res.redirect(req.query.url);
});

const _getRedirectUrl = req =>
  `${process.env.AUTH_BOUNCE_URL}?url=https://${req.get('host')}${req.headers['x-starphleet-originalurl']}`;

/** Auth bounce */
app.all("*", (req, res) => process.env.AUTH_BOUNCE_URL
  // ? res.status(200).json({ url: _getRedirectUrl(req) })
  ? res.redirect(_getRedirectUrl(req))
  : res.status(400).json({ error: "no AUTH_BOUNCE_URL" }));

/*eslint no-process-env: "off"*/
app.listen(process.env.PORT || 3000);

