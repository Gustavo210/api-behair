module.exports = [
  {
    name: "default",
    type: "postgres",
    host: process.env.LOCAL_SERVER_HOST,
    port: process.env.LOCAL_SERVER_PORT,
    username: process.env.LOCAL_SERVER_USERNAME,
    password: process.env.LOCAL_SERVER_PASSWORD,
    database: process.env.LOCAL_SERVER_DATABASE,
    migrations: [process.env.LOCAL_SERVER_MIGRATIONS],
    entities: [process.env.LOCAL_SERVER_ENTITIES],
    cli: {
      migrationsDir: process.env.SERVER_MIGRATIONS_DIR,
    },
    logging: false,
  },
  {
    name: "production",
    type: "postgres",
    url: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
      ca: "",
      key: "",
      cert: "",
    },
    migrations: [process.env.SERVER_MIGRATIONS],
    entities: [process.env.SERVER_ENTITIES],
    cli: {
      migrationsDir: process.env.SERVER_MIGRATIONS_DIR,
    },
    logging: false,
  },
  {
    name: "test",
    type: 'sqlite',
    database: './src/database/test/behear.test.sqlite',
    migrations: [process.env.LOCAL_SERVER_MIGRATIONS],
    entities: [process.env.LOCAL_SERVER_ENTITIES],
    cli: {
      migrationsDir: process.env.SERVER_MIGRATIONS_DIR,
    },
  }
]

