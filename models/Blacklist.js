const { model, Schema } = require('mongoose')

module.exports = model("BlckLst", new Schema({
    GuildID: String,
    UserID: {
        String,
    },
}))