import express from 'express';
import { userLogin } from '../../Controllers/userLogin.js';

const router = express.Router();

router.post('/login', userLogin);

export default router;