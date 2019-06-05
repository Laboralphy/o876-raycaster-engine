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


export async function deleteJSON(url) {
    const headers = new Headers();

    const oRequest = {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    };
    const response = await fetch(url, oRequest);
    const oResponse = await response.json();
    if (response.status === 500) {
        throw new Error('Error 500 : internal server error : ' + oResponse.message);
    }
    return oResponse;
}