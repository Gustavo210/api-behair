import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";
import Establishment from "./Establishment";
import Reservation from "./Reservation";

@Entity("products")
export default class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  photo?: string;

  @Column()
  description?: string;

  @Column()
  cost: number;

  @OneToMany(() => Reservation, (Reservation) => Reservation.id_product, {
    cascade: ["insert", "update"],
    nullable: false,
  })
  @JoinColumn({ name: "id_product" })
  id_product: Reservation[];


  @ManyToOne(() => Establishment, (Establishment) => Establishment.id)
  @JoinColumn({ name: "id_establishment" })
  id_establishment: Establishment;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
