import { Request, Response } from "express";
import { getCustomRepository, In } from "typeorm";
import * as yup from "yup";
import Establishment from "../entities/Establishment";
import Product from "../entities/Product";
import { ProductsRepository } from "../repositorys/ProductsRepository";
import { ReservationsRepository } from "../repositorys/ReservationsRepository";

class ReservationController {
    async create(req: Request, res: Response) {
        const {
            name,
            phone,
            note,
            created_at,
            id_product
        } = req.body;

        const schema = yup.object().shape({
            name: yup.string().min(2).required("Name is required"),
            phone: yup.string().min(9, "minimal length is 11").required("phone is required"),
            note: yup.string(),
            created_at: yup.string(),
            id_product: yup.string().required("Id product is required")
        })

        try {
            await schema.validate(req.body, { abortEarly: false });
        } catch (error) {
            return res.status(400).json({ message: "Invalid arguments", error })
        }

        const productRepository = getCustomRepository(ProductsRepository)
        const reservationRepository = getCustomRepository(ReservationsRepository)

        const productAlreadyExists = await productRepository.findOne({ where: { id: id_product } })

        if (!productAlreadyExists) {
            return res.status(400).json({ message: "Product not exists" })
        }

        const reservationAlreadyExists = await reservationRepository.findOne({ where: { created_at } })

        if (reservationAlreadyExists) {
            return res.status(400).json({ message: "Reservation exists" })
        }

        const reservation = reservationRepository.create({
            name,
            phone,
            note,
            created_at,
            is_active: false,
            id_product
        });

        try {
            await reservationRepository.save(reservation);
            return res.status(201).json(reservation);
        } catch (error) {
            return res.status(400).json({ message: error })
        }
    }
    async findOne(req: Request, res: Response) {
        const id = req.params.id as string

        const reservationRepository = getCustomRepository(ReservationsRepository)
        try {
            const reservation = await reservationRepository.findOneOrFail(id)
            res.status(200).json(reservation);
        } catch (error) {
            res.status(400).json({ message: "Reservation not found" });

        }

    }
    async findAll(req: Request, res: Response) {
        const phone = req.params.phone as string

        const reservationRepository = getCustomRepository(ReservationsRepository)
        try {
            const reservation = await reservationRepository.find({ phone })
            const reservations = reservation.map(item => {
                item.is_active = item.is_active === "true" ? true : false
                return item
            })
            res.status(200).json(reservations);
        } catch (error) {
            res.status(400).json({ message: "Reservation not found" });

        }

    }
    async findAllPerEstablishment(req: Request, res: Response) {
        const id_establishment = req.params.id_establishment as string

        const productsRepository = getCustomRepository(ProductsRepository)
        const reservationRepository = getCustomRepository(ReservationsRepository)
        try {
            const products = await productsRepository.find({ where: { id_establishment } })
            const reservation = await reservationRepository.find({ where: { id_product: In(products.map(item => item.id)) } })
            const reservations = reservation.map(item => {
                item.is_active = item.is_active === "true" ? true : false
                return item
            })
            res.status(200).json(reservations);
        } catch (error) {
            res.status(400).json({ message: "Reservation not found" });

        }

    }
    async acceptReservation(req: Request, res: Response) {
        const id = req.params.id as string

        const reservationRepository = getCustomRepository(ReservationsRepository)
        try {
            const reservationExists = await reservationRepository.findOneOrFail({ id })

            if (!reservationExists) {
                return res.status(400).json({ message: "Reservation not found" })
            }
            reservationExists.is_active = true
            await reservationRepository.save(reservationExists)


            res.status(200).json({ message: "Reservation has accept by Establishment" });
        } catch (error) {
            res.status(400).json({ message: "Reservation not found" });

        }

    }
    async findProductsPerReservation(req: Request, res: Response) {
        const phone = req.params.phone as string
        try {
            const reservationRepository = getCustomRepository(ReservationsRepository)

            const products = await reservationRepository.createQueryBuilder("reservations")
                .innerJoin(Product, "products", "products.id = reservations.id_product")
                .innerJoin(Establishment, "establishments", "establishments.id = products.id_establishment")
                .where(`reservations.phone = '${ phone }'`)
                .select(["products.photo as photo",
                    "establishments.name as establishment",
                    "products.name as name",
                    "products.cost as cost",
                    "products.id as id",
                    "products.description as description",
                    "establishments.latitude as latitude",
                    "reservations.created_at as data",
                    "establishments.longitude as longitude"])
                .orderBy("products.created_at", "DESC")
                .execute()
            const listProduct = products.map((product: any) => {
                product.cost = (Number(product.cost) / 100)
                return product
            })
            return res.status(200).json(listProduct);
        } catch (error) {
            return res.status(400).json({ message: "products not found", error });

        }

    }
}

export default new ReservationController