import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";
import Product from "./Product";

@Entity("reservations")
export default class Reservation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  phone?: string;

  @Column()
  note?: string;

  @Column({ type: 'boolean', default: false })
  is_active?: boolean | string;

  @ManyToOne(() => Product, (product) => product.id)
  @JoinColumn({ name: "id_product" })
  id_product: Product;

  @CreateDateColumn()
  created_at: Date;


  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
