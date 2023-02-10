const { model, Schema } = require('mongoose')

module.exports = model("onlyMedia", new Schema({
    GuildID: String,
    ChannelID: String
}))