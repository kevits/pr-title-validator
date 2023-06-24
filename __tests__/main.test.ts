import * as core from "@actions/core"
import * as github from "@actions/github"

import { WorkflowInput } from "../src/config"
import { getPrNumber, getPrTitle, run } from "../src/main"

beforeAll(() => {
    jest.spyOn(core, "info").mockImplementation(jest.fn())
    jest.spyOn(core, "warning").mockImplementation(jest.fn())
    jest.spyOn(core, "error").mockImplementation(jest.fn())
    jest.spyOn(core, "setOutput").mockImplementation(jest.fn())

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

beforeEach(() => {
    github.context.eventName = "pull_request"
})

afterEach(() => {
    jest.clearAllMocks()
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
    test("No PR number", async () => {
        await expect(getPrTitle()).rejects.toThrow("process.exit: 1")
        expect(core.setFailed).toHaveBeenCalledTimes(1)
    })
})

describe("Test tile validation run", () => {
    test("Valid title with undefined inputs", async () => {
        const config: WorkflowInput = {
            letFail: true,
        }
        const configModule = require("../src/config")
        jest.spyOn(configModule, "getWorkflowInput").mockReturnValueOnce(config)
        const mainModule = require("../src/main")
        jest.spyOn(mainModule, "getPrTitle").mockResolvedValueOnce("feat(app)!: some comment")

        await run()

        expect(core.setOutput).toHaveBeenCalledTimes(1)
        expect(core.setOutput).toHaveBeenCalledWith("is-valid", true)
        expect(core.setFailed).not.toHaveBeenCalled()
    })

    test("Valid title with defined inputs", async () => {
        const config: WorkflowInput = {
            letFail: true,
            validTypes: ["feat", "fix"],
            validScopes: ["app", "test"],
            maxLength: 30,
        }
        const configModule = require("../src/config")
        jest.spyOn(configModule, "getWorkflowInput").mockReturnValueOnce(config)
        const mainModule = require("../src/main")
        jest.spyOn(mainModule, "getPrTitle").mockResolvedValueOnce("feat(app)!: some comment")

        await run()

        expect(core.setOutput).toHaveBeenCalledTimes(1)
        expect(core.setOutput).toHaveBeenCalledWith("is-valid", true)
        expect(core.setFailed).not.toHaveBeenCalled()
    })

    test("Validation should skip", async () => {
        const config: WorkflowInput = {
            letFail: true,
            skipPrefix: "[WIP] ",
        }
        const configModule = require("../src/config")
        jest.spyOn(configModule, "getWorkflowInput").mockReturnValueOnce(config)
        const mainModule = require("../src/main")
        jest.spyOn(mainModule, "getPrTitle").mockResolvedValueOnce("[WIP] feat some comment")

        await run()

        expect(core.setOutput).toHaveBeenCalledTimes(1)
        expect(core.setOutput).toHaveBeenCalledWith("is-valid", true)
        expect(core.warning).toHaveBeenCalledTimes(1)
    })

    test("Invalid title and pipeline should fail", async () => {
        const config: WorkflowInput = {
            letFail: true,
        }
        const configModule = require("../src/config")
        jest.spyOn(configModule, "getWorkflowInput").mockReturnValueOnce(config)
        const mainModule = require("../src/main")
        jest.spyOn(mainModule, "getPrTitle").mockResolvedValueOnce("feat(app) some comment")

        await expect(run()).rejects.toThrow("process.exit: 1")

        expect(core.setOutput).toHaveBeenCalledTimes(1)
        expect(core.setOutput).toHaveBeenCalledWith("is-valid", false)
        expect(core.setFailed).toHaveBeenCalledTimes(1)
    })

    test("Invalid title and pipeline should not fail", async () => {
        const config: WorkflowInput = {
            letFail: false,
        }
        const configModule = require("../src/config")
        jest.spyOn(configModule, "getWorkflowInput").mockReturnValueOnce(config)
        const mainModule = require("../src/main")
        jest.spyOn(mainModule, "getPrTitle").mockResolvedValueOnce("feat(app) some comment")

        await run()

        expect(core.setOutput).toHaveBeenCalledTimes(1)
        expect(core.setOutput).toHaveBeenCalledWith("is-valid", false)
        expect(core.setFailed).not.toHaveBeenCalled()
    })

    test("Invalid event name", async () => {
        github.context.eventName = "push"
        await expect(run()).rejects.toThrow("process.exit: 1")
        expect(core.setFailed).toHaveBeenCalledTimes(1)
        expect(core.setOutput).not.toHaveBeenCalled()
    })
})
