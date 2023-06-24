import { getInput, warning, InputOptions } from "@actions/core"

export type WorkflowInput = {
    letFail: boolean
    skipPrefix?: string
    validTypes?: string[]
    validScopes?: string[]
    maxLength?: number
    regex?: RegExp
}

export function parseStringProperty(name: string, options?: InputOptions): string | undefined {
    return getInput(name, options) || undefined
}

export function parseNumberProperty(name: string): number | undefined {
    let inputStr: string | undefined = getInput(name) || undefined
    let inputNum: number | undefined = Number(inputStr)
    if (Number.isInteger(inputNum) && inputNum > 0) {
        return inputNum
    }
    return
}

export function parseStringArrayProperty(name: string): string[] | undefined {
    let inputStr: string = getInput(name)
    if (inputStr) {
        return inputStr.split(",")
    }
    return
}

export function parseRegexProperty(name: string): RegExp | undefined {
    try {
        let inputStr: string = getInput(name)
        if (inputStr) {
            return RegExp(inputStr)
        }
    } catch (e) {
        warning(`Could not parse regex expression, falling back to default.\n${e}`)
    }
    return
}

export function getWorkflowInput(): WorkflowInput {
    return {
        letFail: Boolean(getInput("let-fail")),
        skipPrefix: parseStringProperty("skip-prefix", {trimWhitespace: false}),
        validTypes: parseStringArrayProperty("valid-types"),
        validScopes: parseStringArrayProperty("valid-scopes"),
        maxLength: parseNumberProperty("max-length"),
        regex: parseRegexProperty("regex"),
    }
}
