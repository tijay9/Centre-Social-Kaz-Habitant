import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import { requireAuth, hasPermission } from '@/lib/auth';

// GET - Exporter des données
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user || !hasPermission(user.role, ['MANAGE_EVENTS'])) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const format = searchParams.get('format') || 'json';
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!type || !['events', 'registrations'].includes(type)) {
      return NextResponse.json(
        { error: 'Type d\'export non valide (events ou registrations)' },
        { status: 400 }
      );
    }

    let data: any[] = [];

    if (type === 'events') {
      let query = `
        SELECT e.*, u.name as createdByName
        FROM events e
        LEFT JOIN users u ON e.createdById = u.id
        WHERE 1=1
      `;
      let params: any[] = [];

      if (category) {
        query += ' AND e.category = ?';
        params.push(category);
      }

      if (status) {
        query += ' AND e.status = ?';
        params.push(status);
      }

      if (startDate) {
        query += ' AND e.date >= ?';
        params.push(startDate);
      }

      if (endDate) {
        query += ' AND e.date <= ?';
        params.push(endDate);
      }

      query += ' ORDER BY e.date DESC';

      data = await executeQuery(query, params);
      
      // Parser les tags JSON
      data = (data as any[]).map(event => ({
        ...event,
        tags: event.tags ? JSON.parse(event.tags) : []
      }));

    } else if (type === 'registrations') {
      let query = `
        SELECT 
          r.*,
          e.title as eventTitle,
          e.date as eventDate,
          e.location as eventLocation,
          e.category as eventCategory
        FROM registrations r
        LEFT JOIN events e ON r.eventId = e.id
        WHERE 1=1
      `;
      let params: any[] = [];

      if (status) {
        query += ' AND r.status = ?';
        params.push(status);
      }

      if (category) {
        query += ' AND e.category = ?';
        params.push(category);
      }

      if (startDate) {
        query += ' AND r.createdAt >= ?';
        params.push(startDate);
      }

      if (endDate) {
        query += ' AND r.createdAt <= ?';
        params.push(endDate);
      }

      query += ' ORDER BY r.createdAt DESC';

      data = await executeQuery(query, params);
    }

    if (format === 'csv') {
      // Convertir en CSV
      if (data.length === 0) {
        return new Response('Aucune donnée à exporter', {
          status: 200,
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="${type}_export.csv"`
          }
        });
      }

      const headers = Object.keys(data[0]);
      let csv = headers.join(',') + '\n';

      data.forEach(row => {
        const values = headers.map(header => {
          let value = row[header];
          if (value === null || value === undefined) {
            value = '';
          } else if (typeof value === 'object') {
            value = JSON.stringify(value);
          } else {
            value = String(value);
          }
          // Échapper les guillemets et entourer de guillemets si nécessaire
          if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            value = '"' + value.replace(/"/g, '""') + '"';
          }
          return value;
        });
        csv += values.join(',') + '\n';
      });

      return new Response(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${type}_export_${new Date().toISOString().split('T')[0]}.csv"`
        }
      });

    } else {
      // Format JSON
      return NextResponse.json({
        type,
        exportDate: new Date().toISOString(),
        count: data.length,
        data
      });
    }

  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'export des données' },
      { status: 500 }
    );
  }
}