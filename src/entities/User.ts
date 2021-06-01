import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";
import Establishment from "./Establishment";

@Entity("users")
export default class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @OneToMany(() => Establishment, (establishment) => establishment.id_responsible, {
    cascade: ["insert", "update"],
    nullable: false,
  })
  @JoinColumn({ name: "id_responsible" })
  establishment: Establishment[];

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
