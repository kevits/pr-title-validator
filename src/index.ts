import {
    error,
    getInput,
    info,
    setFailed,
    setOutput
} from "@actions/core"
import * as github from "@actions/github"
import { validateHeader } from "@kevits/conventional-commit"
import { graphql, GraphQlQueryResponseData }  from "@octokit/graphql"


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

function checkPrTitle(title: string): boolean {
    info(`Event name: ${github.context.eventName}`)
    if (github.context.eventName == "pull_request" && github.context.payload.pull_request != undefined) {
        info(`The PR title is: ${title}`)
        return validateHeader(title)
    }
    return false
}

async function run() {

    const graphqlWithAuth = graphql.defaults({
        headers: {
            authorization: `token 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`,
        },
    });

    
    info(`eventName: ${github.context.eventName}`)
    info(`Owner: ${github.context.repo.owner}`)
    info(`Repo: ${github.context.repo.repo}`)
    info(`GITHUB_REF: ${process.env.GITHUB_REF}`)
    info(`GITHUB_EVENT_PATH: ${process.env.GITHUB_EVENT_PATH}`)

    const prNumber: string | null = getPrNumber()
    if (prNumber == null) {
        throw new Error("Pull request number was not found");
    }

    const response: GraphQlQueryResponseData = await graphqlWithAuth(`
        {
            repository(name: "${github.context.repo.repo}", owner: "${github.context.repo.owner}") {
                pullRequest(number: ${prNumber}) {
                    title
                }
            }
        }
    `)

    const prTitle: string = response.repository.pullRequest.title
    info(`PR title: ${response.repository.pullRequest.title}`)
    let isValid: boolean = validateHeader(prTitle)
    setOutput("is-valid", isValid)
}

run().catch(err => {
    const e: Error = err;
    console.log(e)
    error(e);
    setFailed(e.message);
});