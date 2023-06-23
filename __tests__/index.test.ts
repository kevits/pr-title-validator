import { getPrNumber, getPrTitle } from "../src/index"

describe("Test PR number parsing", () => {
    test("Parse valid string", () => {
        process.env = {
            GITHUB_REF: "refs/pull/123/merge",
        }
        let prNumber = getPrNumber()
        expect(prNumber).toBe("123")
    })

    test("Parse invalid string", () => {
        process.env = {
            GITHUB_REF: "pull/123/merge",
        }
        let prNumber = getPrNumber()
        expect(prNumber).toBeNull()
    })

    test("Empty environment variable", () => {
        process.env = {
            GITHUB_REF: "",
        }
        let prNumber = getPrNumber()
        expect(prNumber).toBeNull()
    })

    test("No environment variable", () => {
        let prNumber = getPrNumber()
        expect(prNumber).toBeNull()
    })
})

describe("Test getting PR title", () => {
    // TODO: mock GitHub GraphQL API call

    test.skip("API call successful", async () => {
        const indexModule = require("../src/index")
        jest.spyOn(indexModule, "getPrNumber").mockReturnValueOnce("123")
        // mock request call
        const prTitle: string = await getPrTitle()
    })

    test.skip("API call not successful", async () => {
        const indexModule = require("../src/index")
        jest.spyOn(indexModule, "getPrNumber").mockReturnValueOnce("123")
        // mock request call
        const prTitle: string = await getPrTitle()
    })

    test.skip("No PR number", async () => {
        // check if setFailed is called
        const prTitle: string = await getPrTitle()
    })
})
