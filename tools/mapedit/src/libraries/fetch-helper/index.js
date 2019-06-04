/**
 * These functions help communicate with the persistance service
 */
import * as CONSTS from "../../consts";
import {fetchJSON} from "../../../../../src/fetch-json";

export function saveLevel(name, data) {
    return fetchJSON(CONSTS.SERVICE_URL_SAVE + '&name=' + name, {data});
}

export async function loadLevel (name) {
    return fetchJSON(CONSTS.SERVICE_URL_LOAD + '&name=' + name);
}

export async function getLevelList() {
    return fetchJSON(CONSTS.SERVICE_URL_LIST);
}

