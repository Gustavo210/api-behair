import request from "supertest";
import { getConnection } from "typeorm";
import app from "../app";

import createConnection from '../database/connection'


describe("User routes", () => {
  beforeAll(async () => {

    const connection = await createConnection();
    await connection.runMigrations();

  });
  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create and login a new user", async () => {
    const userCreated = await request(app).post("/users").send({
      email: "user@exemple.com",
      name: "User",
      surname: "Exemple",
      password: "123456"
    });

    expect(userCreated.body.email).toBe("user@exemple.com");
    expect(userCreated.body.name).toBe("User");
    expect(userCreated.body.surname).toBe("Exemple");
    expect(userCreated.status).toBe(201);

    const getUser = await request(app).post("/users/login").send({
      email: "user@exemple.com",
      password: "123456"
    })
    expect(getUser.body.email).toBe("user@exemple.com");
    expect(getUser.body.name).toBe("User");
    expect(getUser.body.surname).toBe("Exemple");
    expect(getUser.status).toBe(200);
  });

});
