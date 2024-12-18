const express = require('express');
const app = express();
const db = require('./models');
const cors =  require('cors');


app.use(cors());

// Middleware
app.use(express.json()); // Parsowanie JSON
app.use("/users", require('./routes/Users')); // Użycie routingu

db.sequelize.sync({}).then(() => {
    app.listen(5000, () => {
        console.log("Server running on port 5000");
    });
}).catch((err) => {
    console.error("Błąd synchronizacji bazy danych:", err);
});
