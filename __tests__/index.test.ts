import { WorkflowInput } from "../src/config"
import { checkSkipPrefix } from "../src/index"

describe("Check helper functions", () => {
    test("Test inputs", () => {
        const config: WorkflowInput = {
            letFail: true,
            skipPrefix: "[WIP] ",
            validTypes: null,
            validScopes: null,
            maxLenght: null,
            regex: null
        }
        const skip: boolean = checkSkipPrefix("[WIP] foo", config)
        expect(skip).toBeTruthy()
    })
})