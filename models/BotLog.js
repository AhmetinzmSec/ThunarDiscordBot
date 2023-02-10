const { model, Schema } = require('mongoose')

module.exports = model("logCnDB", new Schema({
    GuildID: String,
    ChannelID: String
}))