const { model, Schema } = require('mongoose')

module.exports = model("weldb", new Schema({
    GuildID: String,
    ChannelID: String
}))