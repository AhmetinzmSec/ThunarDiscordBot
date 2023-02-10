const { model, Schema } = require('mongoose')

module.exports = model("botblacklist", new Schema({
    GuildID: String,
    BotID: String,
    Sebep: String,
    Code: String,
    Ekleyen: String,
}))