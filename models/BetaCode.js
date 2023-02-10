const { model, Schema } = require('mongoose')

module.exports = model("BetaCode", new Schema({
    UserID: String,
    Code: String,
}))