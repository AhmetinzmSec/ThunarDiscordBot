const { model, Schema } = require('mongoose')

module.exports = model("BetaCodeS", new Schema({
    ServerID: String,
    Code: String,
}))