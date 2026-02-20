import type { Router } from 'express';
import { Router as createRouter } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { z } from 'zod';
import { getSupabaseAdmin } from '../lib/supabase';
import { requireAuth, requireAdmin } from '../middleware/auth';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const bodySchema = z.object({
  folder: z.enum(['gallery', 'events']).default('gallery'),
});

function getExt(mime: string, originalName: string) {
  if (mime === 'image/jpeg') return 'jpg';
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  if (mime === 'image/gif') return 'gif';
  const match = originalName.toLowerCase().match(/\.([a-z0-9]+)$/);
  return match?.[1] ?? 'bin';
}

export function uploadsRouter(): Router {
  const router = createRouter();

  router.post('/admin/uploads', requireAuth, requireAdmin, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Missing file' });

    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });

    const folder = parsed.data.folder;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Invalid file type' });
    }

    const supabase = getSupabaseAdmin();

    const ext = getExt(req.file.mimetype, req.file.originalname);
    const fileName = `${folder}/${Date.now()}_${crypto.randomBytes(6).toString('hex')}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from('uploads')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadErr) {
      return res.status(500).json({ error: 'Upload failed' });
    }

    const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);
    const url = data.publicUrl;

    return res.status(201).json({ url, path: fileName });
  });

  return router;
}
