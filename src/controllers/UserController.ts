import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import * as yup from "yup";
import { EstablishmentsRepository } from "../repositorys/EstablishmentsRepository";
import { UsersRepository } from "../repositorys/UsersRepository";
import GenerateHash from "../utils/generateHash";
import UserView from "../views/userView";
import SendMailService from "../services/SendMailService";

class UserController {
    async create(req: Request, res: Response) {
        const { name, surname, password, email } = req.body;

        const schema = yup.object().shape({
            name: yup.string().min(2).required("Name is required"),
            surname: yup.string().min(2).required("Surname is required"),
            password: yup.string().min(4).required("Password is required"),
            email: yup.string().email().required("Email is required")
        })

        try {
            await schema.validate(req.body, { abortEarly: false });
        } catch (error) {
            return res.status(400).json({ message: "Invalid arguments" })
        }

        const usersRepository = getCustomRepository(UsersRepository)

        const userAlreadyExists = await usersRepository.findOne({ email })

        if (userAlreadyExists) {
            return res.status(400).json({ message: "User exists" })
        }

        const hash = new GenerateHash

        const user = usersRepository.create({
            email,
            name,
            surname,
            password: hash.create(password)
        });

        try {
            await usersRepository.save(user);
            return res.status(201).json(new UserView(user));
        } catch (error) {
            return res.status(400).json({ message: "Error to create a user" })
        }
    }
    // async findOne(req: Request, res: Response) {
    //     const id = req.params.id as string

    //     const usersRepository = getCustomRepository(UsersRepository)
    //     try {
    //         const user = await usersRepository.findOneOrFail(id)
    //         res.status(200).json(new UserView(user));
    //     } catch (error) {
    //         res.status(400).json({ message: "User not found" });

    //     }

    // }

    async createUserAndEstablishment(req: Request, res: Response) {
        const { URLPhoto, establishmentName, finalHours, initHours, latitude, longitude, password, email, name, surname } = req.body;

        const schema = yup.object().shape({
            name: yup.string().min(2).required("Name is required"),
            surname: yup.string().min(2).required("Surname is required"),
            password: yup.string().min(4).required("Password is required"),
            email: yup.string().email().required("Email is required"),
            longitude: yup.string().required("Longitude is required"),
            latitude: yup.string().required("Latitude is required"),
            initHours: yup.string().required("initHours is required"),
            finalHours: yup.string().required("finalHours is required"),
            establishmentName: yup.string().required("Establishment name is required"),
            URLPhoto: yup.string(),
        })

        try {
            await schema.validate(req.body, { abortEarly: false });
        } catch (error) {
            return res.status(400).json({ message: error.errors })
        }

        const usersRepository = getCustomRepository(UsersRepository)

        const userAlreadyExists = await usersRepository.findOne({ email })

        if (userAlreadyExists) {
            return res.status(400).json({ message: "User exists" })
        }

        const hash = new GenerateHash

        const user = usersRepository.create({
            email,
            name,
            surname,
            password: hash.create(password)
        });
        await usersRepository.save(user);

        const establishmentRepository = getCustomRepository(EstablishmentsRepository)
        const id_responsible = user.id as any

        const existsEstablishment = await establishmentRepository.find({ latitude, longitude })
        if (existsEstablishment.length !== 0) {
            return res.status(400).json({ message: "In this place there is already an establishment." })
        }

        const establishment = establishmentRepository.create({
            id_responsible,
            latitude,
            longitude,
            name: establishmentName,
            init_hours: initHours,
            final_hours: finalHours,
            photo: URLPhoto
        })

        try {
            await establishmentRepository.save(establishment);
            return res.status(201).json({ user: new UserView(user), establishment });
        } catch (error) {
            return res.status(400).json({ message: "Error to create a user" })
        }
    }
    async login(req: Request, res: Response) {
        const { email, password } = req.body

        const usersRepository = getCustomRepository(UsersRepository)
        try {
            const hash = new GenerateHash

            const user = await usersRepository.findOneOrFail({ email })
            const match = hash.validate(password, user.password)
            if (!match) {
                throw new Error()
            }

            return res.status(200).json(new UserView(user));
        } catch (error) {
            return res.status(400).json({ message: "Invalid email or password" });

        }


    }
    async forgotPassword(req: Request, res: Response) {
        const { email } = req.body

        const usersRepository = getCustomRepository(UsersRepository)

        const user = await usersRepository.findOneOrFail({ email })

        const variables = {
            name: user.name,
            link: `${ process.env.BEHAIR_URL_SERVER }/recover/${ user.id }`,
        };
        SendMailService.execute(email, "Email de Recuperação", variables);

        return res.status(201).json({ message: "The recovery email has been sent to your address." });
    }
    async verify(req: Request, res: Response) {
        const { uuid } = req.params

        const usersRepository = getCustomRepository(UsersRepository)
        try {


            await usersRepository.findOneOrFail({ id: uuid })

            return res.status(200).json({ message: "User exists" });
        } catch (error) {
            return res.status(400).json({ message: "User not found" });

        }
    }
    async recover(req: Request, res: Response) {
        const { uuid } = req.params
        const { password, confirmPassword } = req.body

        const schema = yup.object().shape({
            password: yup.string().min(4).required("Password is required"),
            confirmPassword: yup.string().min(4).required("Confirm password is required"),
        })

        try {
            await schema.validate(req.body, { abortEarly: false });
        } catch (error) {
            return res.status(400).json({ message: error.errors })
        }

        const usersRepository = getCustomRepository(UsersRepository)

        const hash = new GenerateHash
        try {
            const user = await usersRepository.findOneOrFail({ id: uuid })

            user.password = hash.create(password)

            await usersRepository.save(user)

            return res.status(200).json(user);
        } catch (error) {
            return res.status(400).json({ message: "User not found" });

        }
    }
}

export default new UserController