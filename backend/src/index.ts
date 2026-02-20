import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { getEnv } from './lib/env';
import { healthRouter } from './routes/health';
import { authRouter } from './routes/auth';
import { eventsRouter } from './routes/events';
import { contactsRouter } from './routes/contacts';
import { galleryRouter } from './routes/gallery';
import { postsRouter } from './routes/posts';
import { partnersRouter } from './routes/partners';
import { statisticsRouter } from './routes/statistics';
import { teamRouter } from './routes/team';
import { registrationsRouter } from './routes/registrations';
import { uploadsRouter } from './routes/uploads';

dotenv.config();

const env = getEnv();

const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '2mb' }));

const allowedOrigins = [env.FRONTEND_URL, process.env.FRONTEND_URL_2].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // allow server-to-server / health checks (no Origin header)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(healthRouter());
app.use(authRouter());
app.use(eventsRouter());
app.use(contactsRouter());
app.use(galleryRouter());
app.use(postsRouter());
app.use(partnersRouter());
app.use(statisticsRouter());
app.use(teamRouter());
app.use(registrationsRouter());
app.use(uploadsRouter());

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(env.PORT, '0.0.0.0', () => {
  console.log(`Backend listening on :${env.PORT}`);
});
