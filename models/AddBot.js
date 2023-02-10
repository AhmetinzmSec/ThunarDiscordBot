const { model, Schema } = require('mongoose')

module.exports = model("addCnDB", new Schema({
    GuildID: String,
    ChannelID: String
}))