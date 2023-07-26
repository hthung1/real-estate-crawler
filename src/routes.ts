import express from 'express';
import 'dotenv/config';
const router = express.Router();
router.get('/', (_, res) => {
    res.send('Working yo');
});

export default router;
