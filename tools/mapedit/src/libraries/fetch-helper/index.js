/**
 * These functions help communicate with the persistance service
 */
import * as CONSTS from "../../consts";

export async function fetchJSON(url, postData = null) {
    const bPost = !!postData;
    const oRequest = {
        method: bPost ? 'POST' : 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    };
    if (bPost) {
        oRequest.body = JSON.stringify(postData);
    }
    const response = await fetch(url, oRequest);
    const oResponse = await response.json();
    if (response.status === 500) {
        throw new Error('Error 500 : internal server error : ' + oResponse.message);
    }
    return oResponse;
}


export function saveLevel(name, data) {
    return fetchJSON(CONSTS.SERVICE_URL_SAVE + '&name=' + name, {data});
}

export async function loadLevel (name) {
    return fetchJSON(CONSTS.SERVICE_URL_LOAD + '&name=' + name);
}

export async function getLevelList() {
    return fetchJSON(CONSTS.SERVICE_URL_LIST);
}

