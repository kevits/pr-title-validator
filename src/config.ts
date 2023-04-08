import { getInput, warning } from "@actions/core"

export type WorkflowInput = {
    letFail: boolean
    skipPrefix: string | null
    validTypes: string[] | null
    validScopes: string[] | null
    maxLenght: number | null
    regex: RegExp | null
}

function parseStringProperty(name: string): string | null {
    return getInput(name) || null
}

function parseNumberProperty(name: string): number | null {
    let inputStr: string | null = getInput(name) || null
    let inputNum: number | null = Number(inputStr)
    if (Number.isNaN(inputNum) || inputNum <= 0) {
        inputNum = null
    }
    return inputNum
}

function parseStringArrayProperty(name: string): string[] | null {
    let inputStr: string | null = getInput(name) || null
    if (inputStr != null) {
        return inputStr.split(",")
    }
    return null
}

function parseRegexProperty(name: string): RegExp | null {
    try {
        let inputStr: string | null = getInput(name) || null
        if (inputStr != null) {
            return RegExp(inputStr)
        }
        return null
    } catch (e) {
        warning(`Could not parse regex expression, falling back to default.\n${e}`)
        return null
    }
}

export function getWorkflowInput(): WorkflowInput {
    return {
        letFail: Boolean(getInput("let-fail")),
        skipPrefix: parseStringProperty("skip-prefix"),
        validTypes: parseStringArrayProperty("valid-types"),
        validScopes: parseStringArrayProperty("valid-scopes"),
        maxLenght: parseNumberProperty("max-length"),
        regex: parseRegexProperty("regex"),
    }
}
