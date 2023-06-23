import { CommitHeader } from "@kevits/conventional-commit"
import { WorkflowInput } from "./config"

/**
 * Checks if the defined prefix is present at the beginning.
 * @param title pull request title
 * @param config input config from the workflow
 * @returns `true` if validation should skipped, otherweise `false`
 */
export function checkSkipPrefix(title: string, config: WorkflowInput): boolean | undefined {
    if (config.skipPrefix) {
        return title.startsWith(config.skipPrefix)
    }
    return
}

/**
 * Checks if the length of the title does not exceed the defined length.
 * @param title pull request title
 * @param config input config from the workflow
 * @returns `true` if length is within the defined range, otherwise `false`
 */
export function checkMaxLength(title: string, config: WorkflowInput): boolean | undefined {
    if (config.maxLength) {
        return title.length <= config.maxLength
    }
    return
}

/**
 * Checks if the title contains a valid defined commit type.
 * @param title pull request title
 * @param config input config from the workflow
 * @returns `true` if type is valid, otherwise `false`
 */
export function checkType(title: CommitHeader, config: WorkflowInput): boolean | undefined {
    if (config.validTypes && config.validTypes.length) {
        for (let type of config.validTypes) {
            if (title.type == type) {
                return true
            }
        }
        return false
    }
    return
}

/**
 * Checks if the title contains a valid defined commit scope.
 * @param title pull request title
 * @param config input conig from the workflow
 * @returns `true` if scope is valid, otherwise `false`
 */
export function checkScope(title: CommitHeader, config: WorkflowInput): boolean | undefined {
    if (config.validScopes && config.validScopes.length) {
        for (let scope of config.validScopes) {
            if (title.scope == scope) {
                return true
            }
        }
        return false
    }
    return
}

/**
 * Checks if the string with the given pattern is valid.
 * @param title pull request title
 * @param config input config from the workflow
 * @returns `true` if the string matches the regex pattern, otherwise `false`
 */
export function checkRegex(title: string, config: WorkflowInput): boolean | undefined {
    if (config.regex) {
        return config.regex.test(title)
    }
    return
}
