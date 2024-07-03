import { Status } from '../constants/index.js';
import logger from '../logs/logger.js';
import { User } from '../models/user.js';
import { Task } from '../models/task.js';

async function getUsers(req, res) {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'password','status'],
            order: [['id', 'DESC']],
            where: { 
                status: Status.ACTIVE
            }
        })
        res.json(users);
    } catch (error) {
        logger.error(error.message)
        res.status(500).json({ 
            message: error.message
        })
    }
}

async function createUser(req, res) {
    const { username, password } = req.body;
    try {
        logger.info('[userController] createuser' + username)
        const user = await User.create({ 
            username, 
            password 
        });
        return res.json(user);
    } catch (error) {
        logger.error(error.message)
        res.status(500).json({ 
            message: error.message
        })
    }
}

async function getUser(req, res) {
    const { id } = req.params;
    try {
        const user = await User.findOne({
            attributes: ['username', 'status'],
            where: { id }
        });
        if (!user) 
            return res.status(404).json({ 
                message: 'User no encontrado'
            });
        
        res.json(user);
    } catch (error) {
        logger.error(error.message)
        res.status(500).json({ 
            message: error.message
        })
    }
}

async function updateUser(req, res) {
    const { id } = req.params;
    const { username, password } = req.body;
    try {
        const user = await User.findOne({
            where: { id }
        });
        if (!user) 
            return res.status(404).json({ 
                message: 'User no encontrado'
            });
        
        user.username = username;
        user.password =  password;
        await user.save();
        res.json(user);
    } catch (error) {
        logger.error(error.message)
        res.status(500).json({ 
            message: error.message
        })
    }
}

async function deleteUser(req, res) { 
    const { id } = req.params;
    try {
        await Task.destroy({ where: { userId: id} });
        await User.destroy({ where: { id } });
        return res.sendStatus(204);
    } catch (error) {
        logger.error(error.message)
        res.status(500).json({ 
            message: error.message
        })
    }
}

async function activeInactive(req, res) {
    const { id } = req.params;
    try {
        const user = await User.findOne({
            where: { id }
        });
        if (!user) 
            return res.status(404).json({ 
                message: 'User no encontrado'
            });
        
        user.status = user.status === Status.ACTIVE? Status.INACTIVE : Status.ACTIVE;
        await user.save();
        res.json(user);
    } catch (error) {
        logger.error(error.message)
        res.status(500).json({ 
            message: error.message
        })
    }
}

async function getTasks(req, res) {
    const { id } = req.params;
    try {
        const user = await User.findOne({
            attributes: ['username'],
            where: { id },
            include: [{
                model: Task,
                attributes: ['name', 'done']
            }]
        });
        if (!user) 
            return res.status(404).json({ 
                message: 'User no encontrado'
            });
        
        res.json(user);
    } catch (error) {
        logger.error(error.message)
        res.status(500).json({ 
            message: error.message
        })
    }
}

export default {
    getUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    activeInactive,
    getTasks
}