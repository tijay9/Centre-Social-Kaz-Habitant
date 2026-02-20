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
  folder: z.enum(['gallery', 'events', 'team']).default('gallery'),
});

function getExt(mime: string, originalName: string) {
  if (mime === 'image/jpeg') return 'jpg';
  if (mime === 'image/jpg') return 'jpg';
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  if (mime === 'image/gif') return 'gif';
  const match = originalName.toLowerCase().match(/\.([a-z0-9]+)$/);
  return match?.[1] ?? 'bin';
}

function safeStringify(v: unknown) {
  try {
    return JSON.stringify(v);
  } catch {
    try {
      return String(v);
    } catch {
      return '[unstringifiable]';
    }
  }
}

export function uploadsRouter(): Router {
  const router = createRouter();

  router.post('/admin/uploads', requireAuth, requireAdmin, upload.single('file'), async (req, res) => {
    try {
      const file = req.file;
      if (!file) return res.status(400).json({ error: 'Missing file' });

      const parsed = bodySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: 'Invalid body', details: parsed.error.flatten() });
      }

      const folder = parsed.data.folder;

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.mimetype)) {
        return res.status(400).json({ error: 'Invalid file type', mime: file.mimetype });
      }

      const supabase = getSupabaseAdmin();

      const ext = getExt(file.mimetype, file.originalname);
      const fileName = `${folder}/${Date.now()}_${crypto.randomBytes(6).toString('hex')}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from('uploads')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (uploadErr) {
        console.error('[uploads] Upload failed', {
          folder,
          fileName,
          mime: file.mimetype,
          size: file.size,
          status: uploadErr.statusCode,
          message: uploadErr.message,
          name: (uploadErr as any).name,
          cause: (uploadErr as any).cause,
        });

        return res.status(500).json({
          error: 'Upload failed',
          details: {
            status: uploadErr.statusCode,
            message: uploadErr.message,
            name: (uploadErr as any).name,
          },
        });
      }

      const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);
      const url = data.publicUrl;

      return res.status(201).json({ url, path: fileName });
    } catch (e) {
      console.error('[uploads] Unexpected error', {
        error: e,
        message: (e as any)?.message,
        stack: (e as any)?.stack,
      });
      return res.status(500).json({ error: 'Upload failed', details: safeStringify(e) });
    }
  });

  return router;
}
