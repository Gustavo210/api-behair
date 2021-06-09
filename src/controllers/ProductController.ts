import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import * as yup from "yup";
import Establishment from "../entities/Establishment";
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
    async delete(req: Request, res: Response) {
        const id = req.params.id as string

        const productRepository = getCustomRepository(ProductsRepository)
        try {
            await productRepository.delete(id)
            res.status(200).json({ message: "Product has been deleted" });
        } catch (error) {
            res.status(400).json({ message: "Product not found" });

        }

    }
    async update(req: Request, res: Response) {
        const id = req.params.id as string
        const { name, photo, description, cost } = req.body

        const productRepository = getCustomRepository(ProductsRepository)
        try {
            const product = await productRepository.findOneOrFail(id)
            await productRepository.save({
                cost: (Number(cost) * 100),
                name,
                photo,
                description,
                id: product.id
            })
            const productUpdated = await productRepository.findOneOrFail(id)
            productUpdated.cost = (Number(productUpdated.cost) / 100)
            res.status(200).json(productUpdated);
        } catch (error) {
            res.status(400).json({ message: "Product not found" });

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
            const listProduct = products.map(product => {
                product.cost = (Number(product.cost) / 100)
                return product
            })
            res.status(200).json(listProduct);
        } catch (error) {
            res.status(400).json({ message: "products not found" });

        }

    }
    async findNewProducts(req: Request, res: Response) {

        try {
            const productRepository = getCustomRepository(ProductsRepository)

            const products = await productRepository.createQueryBuilder("products")
                .innerJoin(Establishment, "establishments", "establishments.id = products.id_establishment")
                .select(["products.photo as photo",
                    "establishments.name as establishment",
                    "products.name as name",
                    "products.cost as cost",
                    "products.id as id",
                    "products.description as description",
                    "establishments.latitude as latitude",
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
    async findProductsQuery(req: Request, res: Response) {
        const { search } = req.query
        try {
            const productRepository = getCustomRepository(ProductsRepository)

            const products = await productRepository.createQueryBuilder("products")
                .innerJoin(Establishment, "establishments", "establishments.id = products.id_establishment")
                .where(`LOWER(products.name) LIKE LOWER('%${ search }%') OR LOWER(establishments.name) LIKE LOWER('%${ search }%') OR LOWER(products.description) LIKE LOWER('%${ search }%')`)
                .select(["products.photo as photo",
                    "establishments.name as establishment",
                    "products.id as id",
                    "products.name as name",
                    "products.cost as cost",
                    "products.description as description",
                    "establishments.latitude as latitude",
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

export default new ProductController