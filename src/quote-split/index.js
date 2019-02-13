export function quoteSplit(str) {
    return str
        .match(/\w+|"[^"]+"/g)
        .map(s => s
            .replace(/^"/, '')
            .replace(/"$/, '')
        );
}
