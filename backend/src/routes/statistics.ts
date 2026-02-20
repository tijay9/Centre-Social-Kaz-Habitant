import type { Router } from 'express';
import { Router as createRouter } from 'express';
import { getSupabaseAdmin } from '../lib/supabase';

export function statisticsRouter(): Router {
  const router = createRouter();

  router.get('/statistics', async (_req, res) => {
    const supabase = getSupabaseAdmin();

    const [eventsCount, galleryCount, teamCount] = await Promise.all([
      supabase.from('events').select('id', { count: 'exact', head: true }),
      supabase.from('gallery_images').select('id', { count: 'exact', head: true }),
      supabase.from('team_members').select('id', { count: 'exact', head: true }),
    ]);

    if (eventsCount.error || galleryCount.error || teamCount.error) {
      return res.status(500).json({ error: 'Database error' });
    }

    return res.json({
      events: eventsCount.count ?? 0,
      gallery: galleryCount.count ?? 0,
      team: teamCount.count ?? 0,
    });
  });

  return router;
}
