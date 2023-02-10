const { model, Schema } = require('mongoose')

module.exports = model("Team", new Schema({
    TeamCreator: String,
    TeamName: String
}))