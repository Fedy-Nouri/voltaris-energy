import { MongoClient, type Collection, type Db } from 'mongodb';
import type { EnquiryDocument } from '@/types/enquiry';

/**
 * MongoDB access.
 *
 * The official driver rather than an ODM such as Mongoose. Every enquiry is
 * already validated by the Zod schema in `lib/validation.ts` before it reaches
 * this layer, so an ODM would mean a second schema definition that can drift
 * from the first — and Mongoose's model registry is awkward in serverless,
 * where re-registering a model on a warm lambda throws.
 *
 * The connection is cached on `globalThis`. Each serverless invocation can get
 * a fresh module scope, so without caching a burst of submissions opens one
 * connection per invocation and exhausts the Atlas connection limit. Caching on
 * the global also survives dev hot-reloads, which would otherwise leak a
 * connection on every file save.
 */

const DB_NAME = process.env.MONGODB_DB ?? 'voltaris';
const ENQUIRIES_COLLECTION = 'enquiries';

declare global {
  // `var` is required here — `let`/`const` do not create a property on the
  // global object, which is the whole point of caching across invocations.
  var __voltarisMongo: Promise<MongoClient> | undefined;
}

/**
 * Whether persistence is configured at all.
 *
 * Exported so callers can degrade gracefully rather than throw: a clone of this
 * repository with no database should still run, and the contact form should
 * still work.
 */
export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI);
}

function getClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set — check isDatabaseConfigured() before calling this.');
  }

  if (!global.__voltarisMongo) {
    global.__voltarisMongo = new MongoClient(uri, {
      // Keep the pool small. Serverless scales by adding instances, not by
      // adding connections within one, and Atlas' free tier caps total
      // connections at 500 across the cluster.
      maxPoolSize: 10,
      // Fail fast rather than letting a form submission hang: the visitor is
      // waiting on this request.
      serverSelectionTimeoutMS: 5000,
    }).connect();
  }

  return global.__voltarisMongo;
}

async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db(DB_NAME);
}

/** Tracks which collections have had their indexes ensured this process. */
const indexed = new Set<string>();

/**
 * The enquiries collection, typed, with its index ensured once per process.
 *
 * `createIndex` is idempotent, but it is still a round trip, so it runs once
 * per cold start rather than on every insert.
 */
export async function getEnquiries(): Promise<Collection<EnquiryDocument>> {
  const db = await getDb();
  const collection = db.collection<EnquiryDocument>(ENQUIRIES_COLLECTION);

  if (!indexed.has(ENQUIRIES_COLLECTION)) {
    indexed.add(ENQUIRIES_COLLECTION);
    // The admin dashboard will list newest first; this is the only query it
    // needs, and without the index that becomes a collection scan.
    await collection.createIndex({ createdAt: -1 }).catch((error) => {
      // A missing index slows the dashboard; it must not break a submission.
      console.error('[mongodb] could not ensure createdAt index', error);
      indexed.delete(ENQUIRIES_COLLECTION);
    });
  }

  return collection;
}
