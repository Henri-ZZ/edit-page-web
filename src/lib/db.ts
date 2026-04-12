import postgres from 'postgres';

declare global {
  // eslint-disable-next-line no-var
  var __editPageSql: ReturnType<typeof postgres> | undefined;
}

function getDatabaseUrl() {
  const databaseUrl = import.meta.env.POSTGRES_URL;
  if (!databaseUrl) {
    throw new Error('Missing required environment variable: POSTGRES_URL');
  }
  return databaseUrl;
}

export function getSql() {
  if (!globalThis.__editPageSql) {
    globalThis.__editPageSql = postgres(getDatabaseUrl(), {
      idle_timeout: 20,
      max: 1,
      prepare: false,
      ssl: 'require',
    });
  }

  return globalThis.__editPageSql;
}
