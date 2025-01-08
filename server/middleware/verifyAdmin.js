const { User } = require('../models');  // Importujemy model User

const verifyAdmin = (req, res, next) => {
    if (!req.userId) {
        return res.status(401).json({ error: "Brak tokena, autoryzacja nie powiodła się" });
    }

    User.findByPk(req.userId).then(user => {
        if (!user || !user.admin) {
            return res.status(403).json({ error: "Brak uprawnień" });
        }
        next();
    }).catch(error => {
        res.status(500).json({ error: "Błąd serwera", details: error.message });
    });
};

module.exports = verifyAdmin;   
