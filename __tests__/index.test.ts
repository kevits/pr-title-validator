import { WorkflowInput } from "../src/config"
import { checkMaxLength, checkSkipPrefix } from "../src/index"
//import { structuredClone } from "@types/node"

const configTemplate: WorkflowInput = {
    letFail: true,
    skipPrefix: null,
    validTypes: null,
    validScopes: null,
    maxLength: null,
    regex: null,
}


describe("Check helper functions", () => {
    test("Test inputs", () => {
        const config: WorkflowInput = {
            letFail: true,
            skipPrefix: "[WIP] ",
            validTypes: null,
            validScopes: null,
            maxLength: null,
            regex: null,
        }
        const skip: boolean = checkSkipPrefix("[WIP] foo", config)
        expect(skip).toBeTruthy()
    })

    test("Test title lengths", () => {
        const config = Object.assign({}, configTemplate);
        let title: string = "fix: some bug"

        config.maxLength = 5
        let lengthValid: boolean = checkMaxLength(title, config)
        expect(lengthValid).toBeFalsy()

        config.maxLength = 13
        lengthValid = checkMaxLength(title, config)
        expect(lengthValid).toBeTruthy()

        config.maxLength = 20
        lengthValid = checkMaxLength(title, config)
        expect(lengthValid).toBeTruthy()
    })
})
