import { EntityRepository, Repository } from "typeorm";
import Establishment from "../entities/Establishment";

@EntityRepository(Establishment)
export class EstablishmentsRepository extends Repository<Establishment> { }
