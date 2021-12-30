let CACHE = {};


function store(id, oCanvas) {
    CACHE[id] = oCanvas;
}

function load(id) {
    return CACHE[id];
}

function remove(id) {
    delete CACHE[id];
}

function clear() {
    CACHE = {};
}

function getCacheContent() {
    return CACHE;
}

export default {
    store, load, remove, clear, getCacheContent
}