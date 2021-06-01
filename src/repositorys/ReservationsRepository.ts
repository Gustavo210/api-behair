import { EntityRepository, Repository } from "typeorm";
import Reservation from "../entities/Reservation";

@EntityRepository(Reservation)
export class ReservationsRepository extends Repository<Reservation> { }
