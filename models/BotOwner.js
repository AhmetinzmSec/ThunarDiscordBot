const { model, Schema } = require('mongoose')

module.exports = model("botAndowner", new Schema({
    GuildID: String,
    OwnerID: String,
    Prefix: String,
    BotID: String
}))