/**
 * These functions help communicate with the persistance service
 */
import * as CONSTS from "../../consts";
import {fetchJSON, putJSON, deleteJSON} from "libs/fetch-json";

export function saveLevel(name, data) {
    return putJSON(CONSTS.SERVICE_URL_SAVE + name, data);
}

export function loadLevel (name) {
    return fetchJSON(CONSTS.SERVICE_URL_LOAD + name + '.json');
}

export function exportLevel (name) {
    return putJSON(CONSTS.SERVICE_URL_EXPORT + name, {});
}

export function deleteLevel(name) {
    return deleteJSON(CONSTS.SERVICE_URL_DELETE + name);
}

export function getLevelList() {
    return fetchJSON(CONSTS.SERVICE_URL_LIST);
}

export function getUserData() {
    return fetchJSON(CONSTS.SERVICE_URL_USER);
}
