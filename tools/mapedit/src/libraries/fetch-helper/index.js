/**
 * These functions help communicate with the persistance service
 */
import * as CONSTS from "../../consts";
import {fetchJSON, deleteJSON} from "../../../../../src/fetch-json";

export function saveLevel(name, data) {
    return fetchJSON(CONSTS.SERVICE_URL_SAVE + name, {data});
}

export async function loadLevel (name) {
    return fetchJSON(CONSTS.SERVICE_URL_LOAD + name);
}

export async function deleteLevel(name) {
    return deleteJSON(CONSTS.SERVICE_URL_DELETE + name);
}

export async function getLevelList() {
    return fetchJSON(CONSTS.SERVICE_URL_LIST);
}

