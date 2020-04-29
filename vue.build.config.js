const path = require('path');

module.exports = {
    "assetsDir": "../static",
    "publicPath": undefined,
    "outputDir": path.resolve(__dirname, '../back/templates'),
    "runtimeCompiler": undefined,
    "productionSourceMap": undefined,
    "parallel": undefined,
    "css": undefined,
    "transpileDependencies": [
        "vuetify"
    ]
}