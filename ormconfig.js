module.exports = [
  {
    name: "default",
    type: process.env.SERVER_TYPE,
    url: process.env.DATABASE_URL,
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT,
    username: process.env.SERVER_USERNAME,
    password: process.env.SERVER_PASSWORD,
    database: process.env.SERVER_DATABASE,
    migrations: [process.env.SERVER_MIGRATIONS],
    entities: [process.env.SERVER_ENTITIES],
    ssl: {
      rejectUnauthorized: false,
      ca: "",
      key: "",
      cert: "",
    },
    cli: {
      migrationsDir: process.env.SERVER_MIGRATIONS_DIR,
    },
    logging: false,
  },
  {
    name: "production",
    type: process.env.SERVER_TYPE,
    // url: process.env.DATABASE_URL,
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT,
    username: process.env.SERVER_USERNAME,
    password: process.env.SERVER_PASSWORD,
    database: process.env.SERVER_DATABASE,
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
    migrations: [process.env.SERVER_MIGRATIONS],
    entities: [process.env.SERVER_ENTITIES],
    cli: {
      migrationsDir: process.env.SERVER_MIGRATIONS_DIR,
    },
  }
]
  
  