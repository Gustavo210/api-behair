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
import Product from "./Product";
import User from "./User";

@Entity("establishments")
export default class Establishment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  photo?: string;

  @Column()
  init_hours: Date;

  @Column()
  final_hours: Date;

  @Column()
  latitude: string;

  @Column()
  longitude: string;

  @OneToMany(() => Product, (product) => product.id_establishment, {
    cascade: ["insert", "update"],
    nullable: false,
  })
  @JoinColumn({ name: "id_establishment" })
  products: Product[];

  @ManyToOne(() => User, (user) => user.establishment)
  @JoinColumn({ name: "id_responsible" })
  id_responsible: User;

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
