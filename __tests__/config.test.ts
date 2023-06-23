import * as core from "@actions/core"

import {
    parseNumberProperty,
    parseStringProperty,
    parseStringArrayProperty,
    parseRegexProperty,
    WorkflowInput,
    getWorkflowInput,
} from "../src/config"

// Inputs for mock @actions/core
let inputs = {} as any

describe("Test string parsing", () => {
    test("Valild string", () => {
        const core = require("@actions/core")
        core.getInput = jest.fn().mockReturnValueOnce("some value")
        const input = parseStringProperty("some-name")
        expect(input).toEqual("some value")
    })

    test("Invalild string", () => {
        const core = require("@actions/core")
        core.getInput = jest.fn().mockReturnValueOnce("")
        const input = parseStringProperty("some-name")
        expect(input).toBeUndefined
    })
})

describe("Test number parsing ", () => {
    test("Valid number", () => {
        const core = require("@actions/core")
        core.getInput = jest.fn().mockReturnValueOnce("987")
        let number = parseNumberProperty("some-name")
        expect(number).toEqual(987)
    })

    test("Invalid number", () => {
        const core = require("@actions/core")
        core.getInput = jest.fn().mockReturnValueOnce("s987")
        let number = parseNumberProperty("some-name")
        expect(number).toBeUndefined()
    })

    test("Zero should be undefind", () => {
        const core = require("@actions/core")
        core.getInput = jest.fn().mockReturnValueOnce("0")
        let number = parseNumberProperty("some-name")
        expect(number).toBeUndefined()
    })

    test("Negativ number should be undefind", () => {
        const core = require("@actions/core")
        core.getInput = jest.fn().mockReturnValueOnce("-1")
        let number = parseNumberProperty("some-name")
        expect(number).toBeUndefined()
    })
})

describe("Test array parsing", () => {
    test("Valid array", () => {
        const core = require("@actions/core")
        core.getInput = jest.fn().mockReturnValueOnce("feat,fix,chore")
        const strings = parseStringArrayProperty("some-name")
        expect(strings).not.toBeUndefined()
        expect(strings?.length).toEqual(3)
        expect(strings).toEqual(expect.arrayContaining(["feat", "fix", "chore"]))
    })

    test("Invalid array", () => {
        const core = require("@actions/core")
        core.getInput = jest.fn().mockReturnValueOnce("feat;fix;chore")
        const strings = parseStringArrayProperty("some-name")
        expect(strings).not.toBeUndefined()
        expect(strings?.length).toEqual(1)
        expect(strings).toEqual(expect.arrayContaining(["feat;fix;chore"]))
    })

    test("Empty string", () => {
        const core = require("@actions/core")
        core.getInput = jest.fn().mockReturnValueOnce("")
        const strings = parseStringArrayProperty("some-name")
        expect(strings).toBeUndefined()
    })
})

describe("Test Regex parsing", () => {
    beforeAll(() => {
        jest.spyOn(core, "getInput").mockImplementation((name: string) => inputs[name])
        jest.spyOn(core, "warning").mockImplementation(jest.fn())
    })

    test("Valid regex", () => {
        inputs.someName = ".*: [a-z]"
        const regex = parseRegexProperty("someName")
        expect(regex).not.toBeUndefined()
        expect(regex).toEqual(RegExp(/.*: [a-z]/))
    })

    test("Invalid regex", () => {
        inputs.someName = "[a-z"
        const regex = parseRegexProperty("someName")
        expect(regex).toBeUndefined()
    })

    test("Empty string", () => {
        inputs.someName = ""
        const regex = parseRegexProperty("someName")
        expect(regex).toBeUndefined()
        expect(core.warning).toHaveBeenCalledTimes(1)
    })
})

describe("Check input parsing", () => {
    test("Test inputs", () => {
        const core = require("@actions/core")
        core.getInput = jest
            .fn()
            .mockReturnValueOnce("true")
            .mockReturnValueOnce("[WIP]")
            .mockReturnValueOnce("feat,fix")
            .mockReturnValueOnce("app,test")
            .mockReturnValueOnce("98")
            .mockReturnValueOnce(".*: [a-z]")

        const input: WorkflowInput = getWorkflowInput()
        expect(input.letFail).toBeTruthy()
        expect(input.skipPrefix).toEqual("[WIP]")
        expect(input.validTypes).toEqual(expect.arrayContaining(["feat", "fix"]))
        expect(input.validScopes).toEqual(expect.arrayContaining(["app", "test"]))
        expect(input.maxLength).toEqual(98)
        expect(input.regex).toEqual(RegExp(/.*: [a-z]/))
    })
})
