/**
 * GulfWings3000 — Supabase Cloud Data Store
 * Manages magazines and events with CRUD operations on Supabase.
 */

import { supabase } from './supabaseClient';
import coverJan from '../assets/cover-jan.png';
import coverFeb from '../assets/cover-feb.png';
import coverMar from '../assets/cover-mar.png';

/* ---------- Seed Data ---------- */

const SEED_MAGAZINES = [
  {
    title: 'The Future of Wealth',
    description: 'Exploring cutting-edge investment strategies, emerging market opportunities, and the evolving landscape of personal wealth management in 2026.',
    publishDate: '2026-01-15',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    coverImage: coverJan,
  },
  {
    title: 'Markets in Motion',
    description: 'A deep dive into global market movements, cryptocurrency developments, and personal finance mastery techniques for the modern investor.',
    publishDate: '2026-02-15',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    coverImage: coverFeb,
  },
  {
    title: 'Wealth Beyond Borders',
    description: 'Your comprehensive guide to international investments, cross-border financial planning, and discovering money opportunities across global markets.',
    publishDate: '2026-03-15',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    coverImage: coverMar,
  },
];

const SEED_EVENTS = [
  {
    heading: 'Global Investment Summit 2026',
    details: 'Join top financial experts and institutional investors for a full-day summit exploring global market trends, portfolio diversification strategies, and emerging asset classes. Keynote speakers include leading economists and fund managers.',
    eventDate: '2026-06-20',
    eventTime: '09:00:00',
    publishedDate: '2026-05-01',
    whatsappNumber: '+971500000000',
  },
  {
    heading: 'Personal Finance Masterclass',
    details: 'A hands-on workshop covering budgeting fundamentals, smart saving habits, tax-efficient investing, and retirement planning. Perfect for individuals looking to take control of their financial future.',
    eventDate: '2026-07-10',
    eventTime: '14:00:00',
    publishedDate: '2026-05-05',
    whatsappNumber: '+971500000000',
  },
  {
    heading: 'Crypto & Digital Assets Forum',
    details: 'Explore the rapidly evolving world of digital currencies, blockchain technology, and decentralized finance. Industry leaders will discuss regulatory developments and investment opportunities.',
    eventDate: '2026-08-05',
    eventTime: '10:00:00',
    publishedDate: '2026-05-10',
    whatsappNumber: '+971500000000',
  },
  {
    heading: 'Women in Finance Networking Evening',
    details: 'An exclusive networking event celebrating women leaders in finance. Features panel discussions on breaking barriers in investment banking, venture capital, and fintech entrepreneurship.',
    eventDate: '2026-09-15',
    eventTime: '18:00:00',
    publishedDate: '2026-05-15',
    whatsappNumber: '+971500000000',
  },
];

/* ---------- Translation Helpers ---------- */

function translateMagazineKeys(dbMag) {
  if (!dbMag) return null;
  return {
    id: dbMag.id,
    title: dbMag.title,
    description: dbMag.description,
    publishDate: dbMag.publish_date,
    pdfUrl: dbMag.pdf_url,
    coverImage: dbMag.cover_image
  };
}

function translateEventKeys(dbEvent) {
  if (!dbEvent) return null;
  return {
    id: dbEvent.id,
    heading: dbEvent.heading,
    details: dbEvent.details,
    eventDate: dbEvent.event_date,
    eventTime: dbEvent.event_time,
    publishedDate: dbEvent.published_date,
    whatsappNumber: dbEvent.whatsapp_number
  };
}

/* ---------- Cloud Auto-Seeder ---------- */

let seedingInProgress = false;

export async function ensureSeeded() {
  if (!supabase) return;
  if (seedingInProgress) return;

  try {
    // Check if magazines table has any rows
    const { count: magCount, error: magError } = await supabase
      .from('magazines')
      .select('*', { count: 'exact', head: true });

    if (!magError && magCount === 0) {
      seedingInProgress = true;
      const dbSeedMags = SEED_MAGAZINES.map(m => ({
        title: m.title,
        description: m.description,
        publish_date: m.publishDate,
        pdf_url: m.pdfUrl,
        cover_image: m.coverImage
      }));
      await supabase.from('magazines').insert(dbSeedMags);
    }

    // Check if events table has any rows
    const { count: evtCount, error: evtError } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true });

    if (!evtError && evtCount === 0) {
      seedingInProgress = true;
      const dbSeedEvts = SEED_EVENTS.map(e => ({
        heading: e.heading,
        details: e.details,
        event_date: e.eventDate,
        event_time: e.eventTime,
        published_date: e.publishedDate,
        whatsapp_number: e.whatsappNumber
      }));
      await supabase.from('events').insert(dbSeedEvts);
    }
  } catch (err) {
    console.error('Dynamic Seeding Error:', err);
  } finally {
    seedingInProgress = false;
  }
}

/* ---------- Magazine CRUD ---------- */

export async function getMagazines() {
  if (!supabase) return [];
  await ensureSeeded();
  
  const { data, error } = await supabase
    .from('magazines')
    .select('*')
    .order('publish_date', { ascending: false });

  if (error) {
    console.error('Error fetching magazines:', error);
    return [];
  }
  return data.map(translateMagazineKeys);
}

export async function getLatestMagazines(count = 3) {
  if (!supabase) return [];
  await ensureSeeded();

  const { data, error } = await supabase
    .from('magazines')
    .select('*')
    .order('publish_date', { ascending: false })
    .limit(count);

  if (error) {
    console.error('Error fetching latest magazines:', error);
    return [];
  }
  return data.map(translateMagazineKeys);
}

export async function getMagazineById(id) {
  if (!supabase) return null;
  await ensureSeeded();

  const { data, error } = await supabase
    .from('magazines')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching magazine by ID:', error);
    return null;
  }
  return translateMagazineKeys(data);
}

export async function addMagazine({ title, description, publishDate, pdfUrl, coverImage }) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('magazines')
    .insert({
      title,
      description,
      publish_date: publishDate,
      pdf_url: pdfUrl,
      cover_image: coverImage || ''
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating magazine:', error);
    throw error;
  }
  return translateMagazineKeys(data);
}

export async function deleteMagazine(id) {
  if (!supabase) return;

  const { error } = await supabase
    .from('magazines')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting magazine:', error);
    throw error;
  }
}

/* ---------- Events CRUD ---------- */

export async function getEvents() {
  if (!supabase) return [];
  await ensureSeeded();

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true }); // Standard sorting: upcoming chronological order

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }
  return data.map(translateEventKeys);
}

export async function getUpcomingEvents() {
  if (!supabase) return [];
  await ensureSeeded();

  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gte('event_date', today)
    .order('event_date', { ascending: true });

  if (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
  return data.map(translateEventKeys);
}

export async function getEventById(id) {
  if (!supabase) return null;
  await ensureSeeded();

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching event by ID:', error);
    return null;
  }
  return translateEventKeys(data);
}

export async function addEvent({ heading, details, eventDate, eventTime, whatsappNumber }) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('events')
    .insert({
      heading,
      details,
      event_date: eventDate,
      event_time: eventTime || '09:00:00',
      published_date: new Date().toISOString().split('T')[0],
      whatsapp_number: whatsappNumber || '+971500000000'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating event:', error);
    throw error;
  }
  return translateEventKeys(data);
}

export async function editEvent(id, updates) {
  if (!supabase) return null;

  const dbUpdates = {};
  if (updates.heading !== undefined) dbUpdates.heading = updates.heading;
  if (updates.details !== undefined) dbUpdates.details = updates.details;
  if (updates.eventDate !== undefined) dbUpdates.event_date = updates.eventDate;
  if (updates.eventTime !== undefined) dbUpdates.event_time = updates.eventTime;
  if (updates.whatsappNumber !== undefined) dbUpdates.whatsapp_number = updates.whatsappNumber;

  const { data, error } = await supabase
    .from('events')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating event:', error);
    throw error;
  }
  return translateEventKeys(data);
}

export async function deleteEvent(id) {
  if (!supabase) return;

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}

/* ---------- Admin Auth ---------- */

const ADMIN_PASSWORD = 'gw3000admin';

export function adminLogin(password) {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem('gw3000_admin', 'true');
    return true;
  }
  return false;
}

export function isAdminLoggedIn() {
  return sessionStorage.getItem('gw3000_admin') === 'true';
}

export function adminLogout() {
  sessionStorage.removeItem('gw3000_admin');
}
