module.exports = {
    baseDir: '../data',

    apis: [
        {
            api: '/bch/services/pub/login/:filename'
        },

        {
            api: '/bch/services/pub/:filename',
            alias: ['checkcode.check']
        }
    ]
}
