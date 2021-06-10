import { Router } from "express";
import EstablishmentController from "./controllers/EstablishmentController";
import ProductController from "./controllers/ProductController";
import reservationController from "./controllers/reservationController";
import UserController from "./controllers/UserController";

const routes = Router();

routes.post("/users", UserController.create)
routes.post("/users/forgot", UserController.forgotPassword)
routes.post("/register", UserController.createUserAndEstablishment)
routes.put("/users/recover/:uuid", UserController.recover)
routes.get("/users/verify/:uuid", UserController.verify)
routes.post("/users/login", UserController.login)

routes.post("/establishments", EstablishmentController.create)
routes.get("/establishments/:id_responsible", EstablishmentController.findAll)
routes.get("/establishments/reservations/:id_establishment", reservationController.findAllPerEstablishment)

routes.post("/products", ProductController.create)
routes.get("/products/all/:id_establishment", ProductController.findAll)
routes.get("/products/all", ProductController.findNewProducts)
routes.get("/products/search", ProductController.findProductsQuery)
routes.get("/products/:id", ProductController.findOne)
routes.put("/products/:id", ProductController.update)
routes.delete("/products/:id", ProductController.delete)

routes.post("/reservations", reservationController.create)
routes.get("/reservations/:phone", reservationController.findProductsPerReservation)
routes.put("/reservations/accept/:id", reservationController.acceptReservation)

export default routes
