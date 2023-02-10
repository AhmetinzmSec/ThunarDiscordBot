const { model, Schema } = require('mongoose')

module.exports = model("LoginSystem", new Schema({
    GuildID: String,
    Role: String
}))