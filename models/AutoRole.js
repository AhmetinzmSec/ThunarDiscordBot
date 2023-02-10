const { model, Schema } = require('mongoose')

module.exports = model("AutoRole", new Schema({
    GuildID: String,
    Role: String
}))