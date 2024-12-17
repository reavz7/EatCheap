const express = require('express')
const app = express()

app.use(express.json())
const db = require('./models')

// Routers
const userRouter = require('./routes/Users')
app.use("/users", userRouter);

db.sequelize.sync({ alter: true }).then(() => {
    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}).catch((err) => {
    console.error("Błąd synchronizacji bazy danych:", err);
});
