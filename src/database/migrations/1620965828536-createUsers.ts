import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createUsers1620965828536 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "users",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    isPrimary: true,
                    generationStrategy: "uuid",
                },
                {
                    name: "name",
                    type: "varchar"
                },
                {
                    name: "surname",
                    type: "varchar"
                },
                {
                    name: "password",
                    type: "varchar"
                },
                {
                    name: "email",
                    type: "varchar"
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "NOW()"
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "NOW()"
                },
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users")
    }

}
