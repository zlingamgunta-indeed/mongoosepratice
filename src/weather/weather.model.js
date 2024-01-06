const mongoose = require("mongoose")

const schema = mongoose.Schema({
    date: Date,
    city: String,
    state: String,
    country: String,
    temperature: Number,
    condition: String
})

module.exports = mongoose.model("WeatherStatus", schema)