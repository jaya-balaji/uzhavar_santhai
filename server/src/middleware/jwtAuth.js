const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, 'pvQCvCYknO8DpRi', (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        req.body.creator=user.id;
        console.log("REQ BODY",req.body.creator)
        console.log("CREATOR ID : ",req.body.creator)
        next();
    });
};

const authenticateTokenOnDelete = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, 'pvQCvCYknO8DpRi', (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        console.log("REQ HEADER ID",req.headers.id)
        next();
    });
};
module.exports = {authenticateToken,authenticateTokenOnDelete}