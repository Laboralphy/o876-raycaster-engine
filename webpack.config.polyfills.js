const polyfillConfig = {
    resolve: {
        fallback: {
            url: require.resolve('url/'),
        }
    }
}

module.exports = polyfillConfig