const { model, Schema } = require('mongoose')

module.exports = model("ToggleDB", new Schema({
    GuildID: String,
    UserID: String,
}))