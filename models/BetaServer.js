const { model, Schema } = require('mongoose')

module.exports = model("BetaServer", new Schema({
    GuildID: String,
}))