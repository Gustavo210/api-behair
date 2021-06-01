import { Connection, createConnection, getConnectionOptions } from "typeorm";

export default async (): Promise<Connection> => {
    const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
    return await createConnection({ ...connectionOptions, name: "default" });
};