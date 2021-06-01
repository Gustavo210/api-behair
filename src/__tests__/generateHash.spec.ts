import GenerateHash from "../utils/generateHash"

describe("Generate hash", () => {

    it("Should be able new hash password", () => {
        const hash = new GenerateHash
        expect(hash.create("12345")).toHaveLength(60)
    })


    it("Should be able compare hash", () => {
        const hash = new GenerateHash

        const newHash = hash.create("12345")
        expect(hash.validate("12345", newHash)).toBe(true)
    })
})