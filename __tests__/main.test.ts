import * as core from "@actions/core"
import * as github from "@actions/github"

import { getPrNumber, getPrTitle } from "../src/main"

beforeAll(() => {
    jest.spyOn(core, "setFailed").mockImplementation(() => {
        throw new Error("process.exit: 1")
    })

    jest.spyOn(github.context, "repo", "get").mockImplementation(() => {
        return {
            owner: "some-owner",
            repo: "some-repo",
        }
    })
})

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

    test("No PR number", async () => {
        await expect(getPrTitle()).rejects.toThrow("process.exit: 1")
        expect(core.setFailed).toHaveBeenCalledTimes(1)
    })
})
