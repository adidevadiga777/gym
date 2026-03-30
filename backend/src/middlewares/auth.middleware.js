const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    let token;
    
    // Prioritize Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } 
    // Fallback to cookie
    else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token || token === 'undefined' || token === 'null') {
        return res.status(401).json({ message: 'Unauthorized: No valid token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

module.exports = authenticate;
