import { WorkflowInput } from "../src/config"
import {  } from "../src/index"

const configTemplate: WorkflowInput = {
    letFail: true,
    skipPrefix: null,
    validTypes: null,
    validScopes: null,
    maxLength: null,
    regex: null,
}

test("Test getting PR number", () => {
    expect(true).toBeTruthy()
})
