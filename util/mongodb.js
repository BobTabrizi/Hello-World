import { MongoClient } from "mongodb";

const { MONGODB_URI, MONGODB_DB } = process.env;
if (!MONGODB_URI) {
  throw new Error("Mongo DB URI invalid");
}

if (!MONGODB_DB) {
  throw new Error("Mongo DB variable invalid");
}
let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
      return {
        client,
        db: client.db(MONGODB_DB),
      };
    });
  }
  cached.conn = await cached.promise;

  return cached.conn;
}
