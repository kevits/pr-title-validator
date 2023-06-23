import { WorkflowInput } from "../src/config"
import { checkSkipPrefix, checkMaxLength, checkType, checkScope, checkRegex } from "../src/helper"
import { CommitHeader } from "@kevits/conventional-commit"

const configTemplate: WorkflowInput = {
    letFail: true,
}

describe("Test skip prefix", () => {
    test("A prefix is found", () => {
        const config = Object.assign({}, configTemplate)
        config.skipPrefix = "[WIP] "
        const skip = checkSkipPrefix("[WIP] feat: foo", config)
        expect(skip).toBeTruthy()
    })

    test("A prefix is not found", () => {
        const config = Object.assign({}, configTemplate)
        config.skipPrefix = "[WIP] "
        const skip = checkSkipPrefix("feat: foo", config)
        expect(skip).toBeFalsy()
    })

    test("Prefix is empty", () => {
        const config = Object.assign({}, configTemplate)
        config.skipPrefix = ""
        const skip = checkSkipPrefix("[WIP] feat: foo", config)
        expect(skip).toBeFalsy()
    })

    test("Prefix is not defined", () => {
        const config = Object.assign({}, configTemplate)
        const skip = checkSkipPrefix("[WIP] feat: foo", config)
        expect(skip).toBeUndefined()
    })
})

describe("Test title length", () => {
    const title: string = "fix: some bug"

    test("Bigger max length", () => {
        const config = Object.assign({}, configTemplate)
        config.maxLength = 5
        let lengthValid = checkMaxLength(title, config)
        expect(lengthValid).toBeFalsy()
    })

    test("Equal max length", () => {
        const config = Object.assign({}, configTemplate)
        config.maxLength = 13
        let lengthValid = checkMaxLength(title, config)
        expect(lengthValid).toBeTruthy()
    })

    test("Smaller max length", () => {
        const config = Object.assign({}, configTemplate)
        config.maxLength = 20
        let lengthValid = checkMaxLength(title, config)
        expect(lengthValid).toBeTruthy()
    })

    test("Max length is 0", () => {
        const config = Object.assign({}, configTemplate)
        config.maxLength = 0
        let lengthValid = checkMaxLength(title, config)
        expect(lengthValid).toBeUndefined()
    })

    test("Max length is not defined", () => {
        const config = Object.assign({}, configTemplate)
        let lengthValid = checkMaxLength(title, config)
        expect(lengthValid).toBeUndefined()
    })
})

describe("Test commit type", () => {
    const headerTemplate: CommitHeader = {
        type: "",
        scope: "",
        breaking: false,
        description: "",
    }

    test("Type should be valid", () => {
        const config = Object.assign({}, configTemplate)
        config.validTypes = ["feat", "core"]
        let header = Object.assign({}, headerTemplate)
        header.type = "feat"
        let typeValid = checkType(header, config)
        expect(typeValid).toBeTruthy()
    })

    test("Type should be invalid", () => {
        const config = Object.assign({}, configTemplate)
        config.validTypes = ["feat", "core"]
        let header = Object.assign({}, headerTemplate)
        header.type = "wip"
        let typeValid = checkType(header, config)
        expect(typeValid).toBeFalsy()
    })

    test("No type in title", () => {
        const config = Object.assign({}, configTemplate)
        config.validTypes = ["feat", "core"]
        let header = Object.assign({}, headerTemplate)
        header.type = ""
        let typeValid = checkType(header, config)
        expect(typeValid).toBeFalsy()
    })

    test("Types are not defined (empty list)", () => {
        const config = Object.assign({}, configTemplate)
        config.validTypes = []
        let header = Object.assign({}, headerTemplate)
        header.type = "feat"
        let typeValid = checkType(header, config)
        expect(typeValid).toBeUndefined()
    })

    test("Types are not defined", () => {
        const config = Object.assign({}, configTemplate)
        let header = Object.assign({}, headerTemplate)
        header.type = "feat"
        let typeValid = checkType(header, config)
        expect(typeValid).toBeUndefined()
    })
})

describe("Test commit scope", () => {
    const headerTemplate: CommitHeader = {
        type: "",
        scope: "",
        breaking: false,
        description: "",
    }

    test("Scope should be valid", () => {
        const config = Object.assign({}, configTemplate)
        config.validScopes = ["app", "test"]
        let header = Object.assign({}, headerTemplate)
        header.scope = "app"
        let typeScope = checkScope(header, config)
        expect(typeScope).toBeTruthy()
    })

    test("Scope should be invalid", () => {
        const config = Object.assign({}, configTemplate)
        config.validScopes = ["app", "test"]
        let header = Object.assign({}, headerTemplate)
        header.scope = "main"
        let typeScope = checkScope(header, config)
        expect(typeScope).toBeFalsy()
    })

    test("No scope in title", () => {
        const config = Object.assign({}, configTemplate)
        config.validScopes = ["app", "test"]
        let header = Object.assign({}, headerTemplate)
        header.scope = ""
        let typeScope = checkScope(header, config)
        expect(typeScope).toBeFalsy()
    })

    test("Scopes are not defined (empty list)", () => {
        const config = Object.assign({}, configTemplate)
        config.validScopes = []
        let header = Object.assign({}, headerTemplate)
        header.scope = "app"
        let typeScope = checkScope(header, config)
        expect(typeScope).toBeUndefined()
    })

    test("Scopes are not defined", () => {
        const config = Object.assign({}, configTemplate)
        let header = Object.assign({}, headerTemplate)
        header.scope = "app"
        let typeScope = checkScope(header, config)
        expect(typeScope).toBeUndefined()
    })
})

describe("Test custom regex", () => {
    test("Title should match regex pattern", () => {
        const config = Object.assign({}, configTemplate)
        config.regex = /.*: [a-z]/
        let stringValid = checkRegex("test: some string", config)
        expect(stringValid).toBeTruthy()
    })

    test("Title should not match regex pattern", () => {
        const config = Object.assign({}, configTemplate)
        config.regex = /.*: [a-z]/
        let stringValid = checkRegex("some string", config)
        expect(stringValid).toBeFalsy()
    })

    test("No regex pattern defined", () => {
        const config = Object.assign({}, configTemplate)
        let stringValid = checkRegex("some string", config)
        expect(stringValid).toBeUndefined()
    })
})
