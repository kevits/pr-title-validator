import { getInput } from "@actions/core"

type WorkflowInput = {
    letFail: boolean
    skipPrefix: string
    validTypes: string[]
    validScoped: string[]
    maxLenght: number
    regex: RegExp
}

export function getWorkflowInput(): WorkflowInput {
    return {
        letFail: true,
    }
}
