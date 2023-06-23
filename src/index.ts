import { error, setFailed } from "@actions/core"
import { run } from "./main"

run().catch((err) => {
    const e: Error = err
    console.log(e)
    error(e)
    setFailed(e.message)
})
