import { WorkflowInput, getWorkflowInput } from "../src/config"

describe("Check input parsing", () => {
    test("Test inputs", () => {
        const input: WorkflowInput = getWorkflowInput()
        expect(input).not.toBeNull()
    })
})
