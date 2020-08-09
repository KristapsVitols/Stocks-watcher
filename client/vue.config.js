module.exports = {
    devServer: {
        disableHostCheck: true,
        port: 3000,
        public: process.env.NODE_ENV === 'development' ? 'https://stockswatcher.local' : 'http://localhost:8080',
    },
    css: {
        loaderOptions: {
            sass: {
                prependData: `@import "@/scss/main.scss"`
            },
        }
    },
}
