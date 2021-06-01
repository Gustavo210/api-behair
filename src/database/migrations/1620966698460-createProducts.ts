import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createProducts1620966698460 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "products",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    isPrimary: true,
                    generationStrategy: "uuid",
                },
                {
                    name: "id_establishment",
                    type: "varchar"
                },
                {
                    name: "photo",
                    type: "varchar",
                    isNullable: true
                },
                {
                    name: "name",
                    type: "varchar"
                },
                {
                    name: "description",
                    type: "varchar",
                    isNullable: true
                },
                {
                    name: "cost",
                    type: "integer"
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
            ],
            foreignKeys: [
                {
                    columnNames: ["id_establishment"],
                    name: "productIdKey",
                    onDelete: "CASCADE",
                    onUpdate: "CASCADE",
                    referencedTableName: "establishments",
                    referencedColumnNames: ["id"]
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("products")
    }

}
