import bcrypt from 'bcrypt'

export default class GenerateHash {

    private salt: number

    constructor() {
        this.salt = 10
    }

    create(password: string) {
        const passwordHash = bcrypt.hashSync(password, this.salt)

        return passwordHash
    }

    validate(password: string, passwordHash: string) {
        const match = bcrypt.compareSync(password, passwordHash)
        return match
    }
}