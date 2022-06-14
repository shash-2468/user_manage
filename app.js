const express = require('express');
const exphbs = require('express-handlebars'); // updated to 6.0.X
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

Sentry.init({
    dsn: "https://05a35defdab54489bdb22fdbb34a42e3@o1276965.ingest.sentry.io/6498443",
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({
        // to trace all requests to the default router
        app,
      }),
    ],
    tracesSampleRate: 1.0,
});



// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// Parsing middleware
// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true})); // New

// Parse application/json
// app.use(bodyParser.json());
app.use(express.json()); // New

// Static Files
app.use(express.static('public'));

// Templating engine

const handlebars = exphbs.create({ extname: '.hbs',});
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

 
const routes = require('./server/routes/user');
app.use('/', routes);

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

//Error Handler
app.use(function onError(err, req, res, next) {
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.listen(port, () => console.log(`Listening on port ${port}`));