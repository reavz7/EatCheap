const express = require('express')
const app = express()

app.use(express.json())
const db = require('./models')

// Routers

db.sequelize.sync({ alter: true }).then(() => {
    app.listen(5000, () => {
        console.log("Server running on port 5000");
    });
}).catch((err) => {
    console.error("Błąd synchronizacji bazy danych:", err);
});
