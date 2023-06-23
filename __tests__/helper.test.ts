import { WorkflowInput } from "../src/config"
import { checkSkipPrefix, checkMaxLength, checkType, checkScope } from "../src/helper"
import { CommitHeader } from "@kevits/conventional-commit"

const configTemplate: WorkflowInput = {
    letFail: true,
    skipPrefix: null,
    validTypes: null,
    validScopes: null,
    maxLength: null,
    regex: null,
}

describe("Test skip prefix", () => {
    test("A prefix is found", () => {
        const config = Object.assign({}, configTemplate)
        config.skipPrefix = "[WIP] "
        const skip: boolean = checkSkipPrefix("[WIP] feat: foo", config)
        expect(skip).toBeTruthy()
    })

    test("A prefix is not found", () => {
        const config = Object.assign({}, configTemplate)
        config.skipPrefix = "[WIP] "
        const skip: boolean = checkSkipPrefix("feat: foo", config)
        expect(skip).toBeFalsy()
    })

    test("Prefix is empty", () => {
        const config = Object.assign({}, configTemplate)
        config.skipPrefix = ""
        const skip: boolean = checkSkipPrefix("[WIP] feat: foo", config)
        expect(skip).toBeFalsy()
    })

    test("Prefix is null", () => {
        const config = Object.assign({}, configTemplate)
        config.skipPrefix = null
        const skip: boolean = checkSkipPrefix("[WIP] feat: foo", config)
        expect(skip).toBeFalsy()
    })
})

describe("Test title length", () => {
    const title: string = "fix: some bug"

    test("Bigger max length", () => {
        const config = Object.assign({}, configTemplate)
        config.maxLength = 5
        let lengthValid: boolean = checkMaxLength(title, config)
        expect(lengthValid).toBeFalsy()
    })

    test("Equal max length", () => {
        const config = Object.assign({}, configTemplate)
        config.maxLength = 13
        let lengthValid: boolean = checkMaxLength(title, config)
        expect(lengthValid).toBeTruthy()
    })

    test("Smaller max length", () => {
        const config = Object.assign({}, configTemplate)
        config.maxLength = 20
        let lengthValid: boolean = checkMaxLength(title, config)
        expect(lengthValid).toBeTruthy()
    })

    test("Max length is 0", () => {
        const config = Object.assign({}, configTemplate)
        config.maxLength = 0
        let lengthValid: boolean = checkMaxLength(title, config)
        expect(lengthValid).toBeTruthy()
    })

    test("Max length is null", () => {
        const config = Object.assign({}, configTemplate)
        config.maxLength = null
        let lengthValid: boolean = checkMaxLength(title, config)
        expect(lengthValid).toBeTruthy()
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
        let typeValid: boolean = checkType(header, config)
        expect(typeValid).toBeTruthy()
    })

    test("Type should be invalid", () => {
        const config = Object.assign({}, configTemplate)
        config.validTypes = ["feat", "core"]
        let header = Object.assign({}, headerTemplate)
        header.type = "wip"
        let typeValid: boolean = checkType(header, config)
        expect(typeValid).toBeFalsy()
    })

    test("No type in title", () => {
        const config = Object.assign({}, configTemplate)
        config.validTypes = ["feat", "core"]
        let header = Object.assign({}, headerTemplate)
        header.type = ""
        let typeValid: boolean = checkType(header, config)
        expect(typeValid).toBeFalsy()
    })

    test("Types are not defined (null value)", () => {
        const config = Object.assign({}, configTemplate)
        config.validTypes = null
        let header = Object.assign({}, headerTemplate)
        header.type = "feat"
        let typeValid: boolean = checkType(header, config)
        expect(typeValid).toBeTruthy()
    })

    test("Types are not defined (empty list)", () => {
        const config = Object.assign({}, configTemplate)
        config.validTypes = []
        let header = Object.assign({}, headerTemplate)
        header.type = "feat"
        let typeValid: boolean = checkType(header, config)
        expect(typeValid).toBeTruthy()
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
        let typeScope: boolean = checkScope(header, config)
        expect(typeScope).toBeTruthy()
    })

    test("Scope should be invalid", () => {
        const config = Object.assign({}, configTemplate)
        config.validScopes = ["app", "test"]
        let header = Object.assign({}, headerTemplate)
        header.scope = "main"
        let typeScope: boolean = checkScope(header, config)
        expect(typeScope).toBeFalsy()
    })

    test("No scope in title", () => {
        const config = Object.assign({}, configTemplate)
        config.validScopes = ["app", "test"]
        let header = Object.assign({}, headerTemplate)
        header.scope = ""
        let typeScope: boolean = checkScope(header, config)
        expect(typeScope).toBeFalsy()
    })

    test("Scopes are not defined (null value)", () => {
        const config = Object.assign({}, configTemplate)
        config.validScopes = null
        let header = Object.assign({}, headerTemplate)
        header.scope = "app"
        let typeScope: boolean = checkScope(header, config)
        expect(typeScope).toBeTruthy()
    })

    test("Scopes are not defined (empty list)", () => {
        const config = Object.assign({}, configTemplate)
        config.validScopes = []
        let header = Object.assign({}, headerTemplate)
        header.scope = "app"
        let typeScope: boolean = checkScope(header, config)
        expect(typeScope).toBeTruthy()
    })
})
