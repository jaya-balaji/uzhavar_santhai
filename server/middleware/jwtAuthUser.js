const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
    
        if (token == null) return res.status(401).json({ message: 'No token provided' });
    
        jwt.verify(token, 'pvQCvCYknO8DpRi', (err, user) => {
            if (err) return res.status(403).json({ message: 'Forbidden' });
            next();
        });
    } catch (error) {
        res.status(500).json({ error: 'Error in authenticateToken' });
    }
};

const getUserIdFromJWT = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
    
        if (token == null) return res.status(401).json({ message: 'No token provided' });
    
        jwt.verify(token, 'pvQCvCYknO8DpRi', (err, user) => {
            if (err) return res.status(403).json({ message: 'Forbidden' });
            req.body.user = user.id
            next();
        });
    } catch (error) {
        res.status(500).json({ error: 'Error in getUserIdFromJWT' });
    }
};

module.exports = {authenticateToken,getUserIdFromJWT}