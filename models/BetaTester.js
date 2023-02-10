const { model, Schema } = require('mongoose')

module.exports = model("BetaTester", new Schema({
    GuildID: String,
    UserID: String,
}))