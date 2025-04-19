import express from 'express';
import fs from 'fs';

const router = express.Router();

router.get('/usage', (req, res) => {
    const data = JSON.parse(fs.readFileSync('./mock_data/users.json'));
    res.json({ users: data });
});

export default router;
