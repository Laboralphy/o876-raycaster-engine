export async function fetchJSON(url, postData = null) {
    try {
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
        const oJSON = await response.json();
        if (response.status === 500) {
            throw new Error('Error 500 : internal server error : ' + oJSON.message);
        }
        return oJSON;
    } catch (e) {
        throw new Error('FetchJSON Error while fetching ' + url + ' - ' + e.message);
    }
}


export async function deleteJSON(url) {

    const oRequest = {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    };
    const response = await fetch(url, oRequest);
    const oJSON = await response.json();
    if (response.status === 500) {
        throw new Error('Error 500 : internal server error : ' + oJSON.message);
    }
    return oJSON;
}