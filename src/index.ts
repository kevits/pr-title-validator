import { error, info, setFailed, setOutput } from "@actions/core"
import * as github from "@actions/github"
import { CommitHeader, validateHeader } from "@kevits/conventional-commit"
import { graphql, GraphQlQueryResponseData } from "@octokit/graphql"
import { WorkflowInput, getWorkflowInput } from "./config"

function getPrNumber(): string | null {
    let ref: string | undefined = process.env.GITHUB_REF
    if (ref == undefined) {
        return null
    }

    const match: RegExpMatchArray | null = ref.trim().match(/refs\/pull\/(?<number>\d+)\/merge/)
    if (match == null || match.groups == undefined) {
        return null
    }

    return match.groups["number"]
}

async function getPrTitle(): Promise<string> {
    const prNumber: string | null = getPrNumber()
    if (prNumber == null) {
        setFailed("Pull request number was not found")
    }

    const graphqlWithAuth = graphql.defaults({
        headers: {
            authorization: `token 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`,
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

export function checkSkipPrefix(title: string, config: WorkflowInput): boolean {
    if (config.skipPrefix != null) {
        return title.startsWith(config.skipPrefix)
    }
    return true
}

export function checkType(title: CommitHeader, config: WorkflowInput): boolean {
    if (config.validTypes != null) {
        for (let type of config.validTypes) {
            if (title.type == type) {
                return true
            }
        }
        return false
    }
    return true
}

export function checkScope(title: CommitHeader, config: WorkflowInput): boolean {
    if (config.validScopes != null) {
        for (let scope of config.validScopes) {
            if (title.scope == scope) {
                return true
            }
        }
        return false
    }
    return true
}

export function checkMaxLength(title: string, config: WorkflowInput): boolean {
    if (config.maxLenght != null) {
        return title.length <= config.maxLenght
    }
    return true
}

export function checkRegex(title: string, config: WorkflowInput): boolean {
    if (config.regex != null) {
        // TODO: implement
    }
    return true
}

function checkPrTitle(title: string): boolean {
    info(`Event name: ${github.context.eventName}`)
    if (github.context.eventName == "pull_request" && github.context.payload.pull_request != undefined) {
        info(`The PR title is: ${title}`)
        return validateHeader(title)
    }
    return false
}

async function run() {
    const workflowInput: WorkflowInput = getWorkflowInput()

    info(`eventName: ${github.context.eventName}`)
    info(`Owner: ${github.context.repo.owner}`)
    info(`Repo: ${github.context.repo.repo}`)
    info(`GITHUB_REF: ${process.env.GITHUB_REF}`)
    info(`GITHUB_EVENT_PATH: ${process.env.GITHUB_EVENT_PATH}`)

    const prTitle: string = await getPrTitle()

    info(`PR title: ${prTitle}`)
    let isValid: boolean = validateHeader(prTitle)
    setOutput("is-valid", isValid)
}

run().catch((err) => {
    const e: Error = err
    console.log(e)
    error(e)
    setFailed(e.message)
})
