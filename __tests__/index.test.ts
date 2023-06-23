import { getPrNumber } from "../src/index"

describe("Test PR number parsing", () => {
    test("Parse valid string", () => {
        process.env = {
            GITHUB_REF: "refs/pull/123/merge",
        }
        let prNumber: string | null = getPrNumber()
        expect(prNumber).toBe("123")
    })

    test("Parse invalid string", () => {
        process.env = {
            GITHUB_REF: "pull/123/merge",
        }
        let prNumber: string | null = getPrNumber()
        expect(prNumber).toBeNull()
    })

    test("Empty environment variable", () => {
        process.env = {
            GITHUB_REF: "",
        }
        let prNumber: string | null = getPrNumber()
        expect(prNumber).toBeNull()
    })

    test("No environment variable", () => {
        let prNumber: string | null = getPrNumber()
        expect(prNumber).toBeNull()
    })
})

describe("Test getting PR title", () => {
    test("API call successful", () => {
        // mock request call
    })

    test("API call not successful", () => {
        // mock request call
    })

    test("No PR number", () => {
        // mock method call (getPrNumber)
    })
})
