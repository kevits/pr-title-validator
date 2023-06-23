import { getInput, warning } from "@actions/core"

export type WorkflowInput = {
    letFail: boolean
    skipPrefix?: string
    validTypes?: string[]
    validScopes?: string[]
    maxLength?: number
    regex?: RegExp
}

export function parseStringProperty(name: string): string | undefined {
    return getInput(name) || undefined
}

export function parseNumberProperty(name: string): number | undefined {
    let inputStr: string | undefined = getInput(name) || undefined
    let inputNum: number | undefined = Number(inputStr)
    if (Number.isInteger(inputNum) && inputNum > 0) {
        return inputNum
    }
    return
}

function parseStringArrayProperty(name: string): string[] | undefined {
    let inputStr: string | null = getInput(name) || null
    if (inputStr != null) {
        return inputStr.split(",")
    }
    return
}

function parseRegexProperty(name: string): RegExp | undefined {
    try {
        let inputStr: string | null = getInput(name) || null
        if (inputStr != null) {
            return RegExp(inputStr)
        }
        return
    } catch (e) {
        warning(`Could not parse regex expression, falling back to default.\n${e}`)
        return
    }
}

export function getWorkflowInput(): WorkflowInput {
    return {
        letFail: Boolean(getInput("let-fail")),
        skipPrefix: parseStringProperty("skip-prefix"),
        validTypes: parseStringArrayProperty("valid-types"),
        validScopes: parseStringArrayProperty("valid-scopes"),
        maxLength: parseNumberProperty("max-length"),
        regex: parseRegexProperty("regex"),
    }
}
