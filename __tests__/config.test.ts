import { parseNumberProperty, parseStringProperty, WorkflowInput, getWorkflowInput } from "../src/config"

describe("Test string parsing", () => {
    test("Valild string", () => {
        const core = require("@actions/core")
        core.getInput = jest.fn().mockReturnValueOnce("some value")
        const input = parseStringProperty("some-name")
        expect(input).toBe("some value")
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
        expect(number).toBe(987)
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

describe("Check input parsing", () => {
    test("Test inputs", () => {
        const input: WorkflowInput = getWorkflowInput()
        expect(input).not.toBeNull()
    })
})
