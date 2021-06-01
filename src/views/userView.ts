import User from "../entities/User";

export default class UserView {

    constructor(params: User) {
        return {
            id: params.id,
            name: params.name,
            surname: params.surname,
            email: params.email,
            establishment: params.establishment
        }
    }
}