import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createEstablishments1620966216842 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "establishments",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    isPrimary: true,
                    generationStrategy: "uuid",
                },
                {
                    name: "id_responsible",
                    type: "varchar"
                },
                {
                    name: "name",
                    type: "varchar"
                },
                {
                    name: "photo",
                    type: "varchar",
                    isNullable: true
                },
                {
                    name: "init_hours",
                    type: "timestamp"
                },
                {
                    name: "final_hours",
                    type: "timestamp"
                },
                {
                    name: "latitude",
                    type: "varchar"
                },
                {
                    name: "longitude",
                    type: "varchar"
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "NOW()"
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "NOW()"
                },
            ],
            foreignKeys: [
                {
                    columnNames: ["id_responsible"],
                    name: "responsibleIdKey",
                    onDelete: "CASCADE",
                    onUpdate: "CASCADE",
                    referencedTableName: "users",
                    referencedColumnNames: ["id"]
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("establishments")
    }

}
