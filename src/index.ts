import { error, info, setFailed, setOutput, getInput } from "@actions/core"
import * as github from "@actions/github"
import { CommitHeader, validateHeader, parseHeader } from "@kevits/conventional-commit"
import { graphql, GraphQlQueryResponseData } from "@octokit/graphql"
import { WorkflowInput, getWorkflowInput } from "./config"
import { checkMaxLength, checkType, checkScope } from "./helper"

export function getPrNumber(): string | null {
    let ref: string | undefined = process.env.GITHUB_REF
    if (ref) {
        const match: RegExpMatchArray | null = ref.trim().match(/refs\/pull\/(?<number>\d+)\/merge/)
        if (match && match.groups) {
            return match.groups["number"]
        }
    }
    return null
}

export async function getPrTitle(): Promise<string> {
    const prNumber: string | null = exports.getPrNumber()
    if (prNumber == null) {
        setFailed("Pull request number was not found")
    }

    const graphqlWithAuth = graphql.defaults({
        headers: {
            authorization: `token ${getInput("token")}`,
        },
    })

    const response: GraphQlQueryResponseData = await graphqlWithAuth(`
    {
        repository(name: "${github.context.repo.repo}", owner: "${github.context.repo.owner}") {
            pullRequest(number: ${prNumber}) {
                title
            }
        }
    }
    `)
    return String(response.repository.pullRequest.title)
}

async function run() {
    const workflowInput: WorkflowInput = getWorkflowInput()

    info(`eventName: ${github.context.eventName}`)
    info(`Owner: ${github.context.repo.owner}`)
    info(`Repo: ${github.context.repo.repo}`)
    info(`GITHUB_REF: ${process.env.GITHUB_REF}`)
    info(`GITHUB_EVENT_PATH: ${process.env.GITHUB_EVENT_PATH}`)

    const prTitle: string = await getPrTitle()

    // The conditions are checked in the following order:
    // 1. Check if the validation will be skipped
    // 2. Valid conventional commit
    // 3. Check character length
    // 4. Check type
    // 5. Check scope
    info(`Checking PR title: "${prTitle}"`)

    let isValid: boolean = validateHeader(prTitle)
    let commitHeader: CommitHeader | null = parseHeader(prTitle)
    if (isValid && commitHeader != null) {
        info("Title is a valid conventional commit")
    } else {
        error("Title is not a valid conventional commit")
    }

    let lengthValid: boolean | undefined = checkMaxLength(prTitle, workflowInput)
    if (workflowInput.maxLength == null) {
        info(`Skip: Defined length is null`)
    } else if (lengthValid) {
        info(`Length within ${workflowInput.maxLength} characters`)
    } else {
        error(`Length exceeds ${workflowInput.maxLength} characters`)
    }

    let typeValid: boolean | undefined
    if (workflowInput.validTypes && commitHeader) {
        typeValid = checkType(commitHeader, workflowInput)
        if (typeValid) {
            info(`The type '${commitHeader.type}' is valid`)
        } else {
            error(`The type '${commitHeader.type}' is not valid`)
        }
    } else {
        info("Skip: No types are defined")
    }

    let scopeValid: boolean | undefined
    if (workflowInput.validScopes && commitHeader) {
        scopeValid = checkScope(commitHeader, workflowInput)
        if (scopeValid) {
            info(`The scope '${commitHeader.scope}' is valid`)
        } else {
            error(`The scope '${commitHeader.scope}' is not valid`)
        }
    } else {
        info("Skip: No scopes are defined")
    }

    let checksPassed: boolean =
        isValid &&
        (lengthValid == undefined ? true : lengthValid) &&
        (typeValid == undefined ? true : typeValid) &&
        (scopeValid == undefined ? true : scopeValid)

    setOutput("is-valid", checksPassed)
    if (!checksPassed) {
        setFailed(`The PR title is not valid`)
    }
}

run().catch((err) => {
    const e: Error = err
    console.log(e)
    error(e)
    setFailed(e.message)
})
