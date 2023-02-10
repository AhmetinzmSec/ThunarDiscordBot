const { model, Schema } = require('mongoose')

module.exports = model("verifyCnDB", new Schema({
    GuildID: String,
    ChannelID: String
}))