import jwt from 'jsonwebtoken';
import 'dotenv/config';

export function authenticateToken(req, res, next) {
    // Obtener el token q esta en la cabecera de autorizacion
    const authHeader = req.headers['authorization'];
    // Bearer
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) return res.sendStatus(401);

    // Verificar el token
    jwt.verify(token,process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        
        console.log('user: ', user);
        req.user = user;
        next();
    });
}