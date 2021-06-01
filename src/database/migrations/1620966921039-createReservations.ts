import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createReservations1620966921039 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "reservations",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    isPrimary: true,
                    generationStrategy: "uuid",
                },
                {
                    name: "id_product",
                    type: "varchar"
                },
                {
                    name: "name",
                    type: "varchar"
                },
                {
                    name: "is_active",
                    type: "varchar",
                    default: false
                },
                {
                    name: "phone",
                    type: "varchar",
                    isNullable: true
                },
                {
                    name: "note",
                    type: "varchar",
                    isNullable: true
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "NOW()"
                }
            ],
            foreignKeys: [
                {
                    columnNames: ["id_product"],
                    name: "reservationIdKey",
                    onDelete: "CASCADE",
                    onUpdate: "CASCADE",
                    referencedTableName: "products",
                    referencedColumnNames: ["id"]
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("reservations")
    }

}
