import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import * as yup from "yup";
import { EstablishmentsRepository } from "../repositorys/EstablishmentsRepository";
import { UsersRepository } from "../repositorys/UsersRepository";

class EstablishmentController {
    async create(req: Request, res: Response) {
        const {
            name,
            photo,
            init_hours,
            final_hours,
            latitude,
            longitude,
            id_responsible
        } = req.body;

        const schema = yup.object().shape({
            name: yup.string().min(2).required("Name is required"),
            photo: yup.string().required("Photo is required"),
            init_hours: yup.string().required("Init hours is required"),
            final_hours: yup.string().required("Final hours is required"),
            latitude: yup.string().required("Latitude is required"),
            longitude: yup.string().required("Longitude is required"),
            id_responsible: yup.string().required("Id responsible is required")
        })

        try {
            await schema.validate(req.body, { abortEarly: false });
        } catch (error) {
            return res.status(400).json({ message: "Invalid arguments" })
        }

        const usersRepository = getCustomRepository(UsersRepository)
        const establishmentsRepository = getCustomRepository(EstablishmentsRepository)

        const userAlreadyExists = await usersRepository.findOne({ where: { id: id_responsible } })

        if (!userAlreadyExists) {
            return res.status(401).json({ message: "User not exists" })
        }

        const establishment = establishmentsRepository.create({
            name,
            photo,
            init_hours,
            final_hours,
            latitude,
            longitude,
            id_responsible
        });

        try {
            await establishmentsRepository.save(establishment);
            return res.status(201).json(establishment);
        } catch (error) {
            return res.status(400).json({ message: error })
        }
    }
    async findAll(req: Request, res: Response) {
        const id_responsible = req.params.id_responsible as string

        const establishmentsRepository = getCustomRepository(EstablishmentsRepository)
        try {
            const establishment = await establishmentsRepository.findOneOrFail({ where: { id_responsible }, relations: ["products"] })

            establishment.products = establishment.products.map(product => {
                product.cost = (Number(product.cost) / 100)
                return product
            })
            res.status(200).json(establishment);
        } catch (error) {
            res.status(400).json({ message: error });

        }

    }
}

export default new EstablishmentController