// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://8de650774a35ddbc3a9800438bc54566@o4506658653011968.ingest.us.sentry.io/4508308413808640",
  debug: false,
});
