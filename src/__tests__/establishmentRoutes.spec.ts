import request from "supertest";
import { getConnection } from "typeorm";
import app from "../app";

import createConnection from '../database/connection'


describe("Establishment routes", () => {
    beforeAll(async () => {

        const connection = await createConnection();
        await connection.runMigrations();

    });
    afterAll(async () => {
        const connection = getConnection();
        await connection.dropDatabase();
        await connection.close();
    });

    it("Should be able to create and find a new establishment", async () => {
        const userCreated = await request(app).post("/users").send({
            email: "user@exemple2.com",
            name: "User2",
            surname: "Exemple2",
            password: "1234567"
        });
        expect(userCreated.status).toBe(201);

        const establishmentCreated = await request(app).post("/establishments").send({
            name: "barbearia do seu jao",
            photo: "https://images.unsplash.com/photo-1613121999598-c2aeaa306ed4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
            init_hours: "2021-05-15T22:51:53.245Z",
            final_hours: "2021-05-15T23:59:32.104Z",
            latitude: "-19.866327",
            longitude: "-44.989986",
            id_responsible: userCreated.body.id
        })
        expect(establishmentCreated.status).toBe(201);

        const getEstablishments = await request(app).get(`/establishments/${ userCreated.body.id }`)

        expect(getEstablishments.status).toBe(200);
        expect(getEstablishments.body.name).toBe("barbearia do seu jao");
        expect(getEstablishments.body.photo).toBe("https://images.unsplash.com/photo-1613121999598-c2aeaa306ed4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80");
        expect(getEstablishments.body.init_hours).toBe("2021-05-15T22:51:53.245Z");
        expect(getEstablishments.body.final_hours).toBe("2021-05-15T23:59:32.104Z");
        expect(getEstablishments.body.latitude).toBe("-19.866327");
        expect(getEstablishments.body.longitude).toBe("-44.989986");
    });


    it("Should be able to get error on rote establishments", async () => {

        const establishmentCreatedError = await request(app).post("/establishments").send({
            name: "barbearia do seu jao",
            photo: "https://images.unsplash.com/photo-1613121999598-c2aeaa306ed4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
            init_hours: "2021-05-15T22:51:53.245Z",
            final_hours: "2021-05-15T23:59:32.104Z",
            latitude: "-19.866327",
            longitude: "-44.989986",
            id_responsible: '4567654325'
        })
        expect(establishmentCreatedError.status).toBe(401);
        expect(establishmentCreatedError.body.message).toBe("User not exists");

        const establishmentCreatedErrorGeneric = await request(app).post("/establishments").send({
            name: "",
            photo: "",
            init_hours: "",
            final_hours: "",
            latitude: "",
            longitude: "",
            id_responsible: ''
        })
        expect(establishmentCreatedErrorGeneric.body.message).toBe("Invalid arguments");

        const getEstablishments = await request(app).get(`/establishments/56785437`)
        expect(getEstablishments.status).toBe(400);
    });

});
