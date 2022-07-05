import * as FH from "libs/fetch-json";

let bEditorStatus = false
let bFetched = false

export async function fetchEditorStatus () {
    try {
        if (!bFetched) {
            const { status } = await FH.fetchJSON('/editor/status')
            bEditorStatus = status
            bFetched = true
        }
        return bEditorStatus
    } catch (e) {
        console.error('Could not get Editor Status')
        console.error(e)
    }
}
