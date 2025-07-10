import { config } from '@/lib/config';
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle as DrizzleHttp } from 'drizzle-orm/neon-http';
import * as userSchema from "./schemas/user-schema";
// @ts-ignore
import ws from 'ws';

let connectionString = config.env.DATABASE_URL;

// Combine all schemas into a single object
const schema = {
  ...userSchema
};


// Configuring Neon for local development
if (config.env.NODE_ENV === 'development') {
  connectionString = 'postgres://postgres:postgres@db.localtest.me:5432/merge';
  neonConfig.fetchEndpoint = (host) => {
    const [protocol, port] = host === 'db.localtest.me' ? ['http', 4444] : ['https', 443];
    return `${protocol}://${host}:${port}/sql`;
  };
  const connectionStringUrl = new URL(connectionString);
  neonConfig.useSecureWebSocket = connectionStringUrl.hostname !== 'db.localtest.me';
  neonConfig.wsProxy = (host) => (host === 'db.localtest.me' ? `${host}:4444/v2` : `${host}/v2`);
}
neonConfig.webSocketConstructor = ws;

const client = neon(connectionString as string);

// Drizzle supports both HTTP and WebSocket clients. Choose the one that fits your needs:

// HTTP Client:
// - Best for serverless functions and Lambda environments
// - Ideal for stateless operations and quick queries
// - Lower overhead for single queries
// - Better for applications with sporadic database access
export const db = DrizzleHttp(client, { schema });


// Export all schemas
export { schema };
// You can also export individual schemas if needed
// export { auth, workflow };

// Export specific tables/relations
export const {
  user
} = schema;
