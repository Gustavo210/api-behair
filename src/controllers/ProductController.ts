import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import * as yup from "yup";
import { ProductsRepository } from "../repositorys/ProductsRepository";

class ProductController {
    async create(req: Request, res: Response) {
        const { name, photo, description, cost, id_establishment } = req.body;

        const schema = yup.object().shape({
            name: yup.string().min(2).required("Name is required"),
            photo: yup.string(),
            description: yup.string(),
            cost: yup.mixed().required("Cost is required"),
            id_establishment: yup.string().required("Id establishment is required")
        })

        try {
            await schema.validate(req.body, { abortEarly: false });
        } catch (error) {
            return res.status(400).json({ message: error })
        }

        const productRepository = getCustomRepository(ProductsRepository)

        const productAlreadyExists = await productRepository.findOne({ name })

        if (productAlreadyExists) {
            return res.status(400).json({ message: "product exists" })
        }


        const product = productRepository.create({
            name,
            photo,
            description,
            cost: (Number(cost) * 100),
            id_establishment
        });

        try {
            await productRepository.save(product);
            return res.status(201).json(product);
        } catch (error) {
            return res.status(400).json({ message: "Error to create a product" })
        }
    }
    async findOne(req: Request, res: Response) {
        const id = req.params.id as string

        const productRepository = getCustomRepository(ProductsRepository)
        try {
            const product = await productRepository.findOneOrFail(id)
            product.cost = (Number(product.cost) / 100)
            res.status(200).json(product);
        } catch (error) {
            res.status(400).json({ message: "Product not found" });

        }

    }
    async findAll(req: Request, res: Response) {
        const id_establishment = req.params.id_establishment as string

        const productRepository = getCustomRepository(ProductsRepository)
        try {
            const products = await productRepository.find({
                where: {
                    id_establishment
                }
            })
            res.status(200).json(products);
        } catch (error) {
            res.status(400).json({ message: "products not found" });

        }

    }
}

export default new ProductController