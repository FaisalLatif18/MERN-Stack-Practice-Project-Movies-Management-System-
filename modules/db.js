const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect("mongodb://localhost:27017/cinemaDb");
        console.log("Connection Succeeded");
    } catch (err) {
        console.error("Error in Connection: " + err);
    }
}

connectDB();

module.exports = mongoose;
