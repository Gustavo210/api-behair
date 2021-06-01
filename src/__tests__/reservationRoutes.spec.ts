import request from "supertest";
import { getConnection } from "typeorm";
import app from "../app";

import createConnection from '../database/connection'
import Reservation from "../entities/Reservation";


describe("reservation routes", () => {
    beforeAll(async () => {

        const connection = await createConnection();
        await connection.runMigrations();

    });
    afterAll(async () => {
        const connection = getConnection();
        await connection.dropDatabase();
        await connection.close();
    });

    it("Should be able to create and find a new product", async () => {
        const userCreated = await request(app).post("/users").send({
            email: "user@exemple3.com",
            name: "User3",
            surname: "Exemple3",
            password: "12345678"
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

        const getEstablishment = await request(app).get(`/establishments/${ userCreated.body.id }`)

        expect(getEstablishment.status).toBe(200);

        const productCreated = await request(app).post("/products").send({
            name: "sobrancelha",
            photo: "https://www.dicasdemulher.com.br/wp-content/uploads/2019/12/risco-na-sobrancelha-1.jpg",
            description: "corte com gilete",
            cost: 15,
            id_establishment: getEstablishment.body.id
        })
        expect(productCreated.status).toBe(201);

        const reservationCreated = await request(app).post("/reservations").send({
            name: "Juliana ana ana",
            phone: "23456789182",
            note: "não vou demorar muito",
            created_at: "2021-05-16T10:51:53.245Z",
            id_product: productCreated.body.id
        })
        expect(reservationCreated.status).toBe(201);

        const allReservations = await request(app).get(`/establishments/reservations/${ establishmentCreated.body.id }`)

        allReservations.body.map((item: Reservation) => {
            expect(item.name).toBe("Juliana ana ana")
            expect(item.phone).toBe("23456789182")
        })
    });

    it("should be able to find all reservations", async () => {

        const allReservations = await request(app).get(`/reservations/23456789182`)

        allReservations.body.map((item: Reservation) => {
            expect(item.name).toBe("Juliana ana ana")
            expect(item.phone).toBe("23456789182")
        })
    })
    it("should be able to accept reservation", async () => {

        const allReservations = await request(app).get(`/reservations/23456789182`)


        const response = await request(app).put(`/reservations/accept/${ allReservations.body[0].id }`)
        expect(response.status).toBe(200)
    })


});
