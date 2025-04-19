import express from 'express';
import axios from 'axios';
import querystring from 'querystring';

const router = express.Router();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

router.get('/login', (req, res) => {
    const scope = 'user-read-private user-read-email user-top-read';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id,
            scope,
            redirect_uri,
        }));
});

router.get('/callback', async (req, res) => {
    const code = req.query.code || null;
    try {
        const response = await axios.post('https://accounts.spotify.com/api/token',
            querystring.stringify({
                code,
                redirect_uri,
                grant_type: 'authorization_code',
            }),
            {
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });

        req.session.access_token = response.data.access_token;
        res.redirect('http://localhost:5173'); // Frontend URL
    } catch (error) {
        res.status(500).json({ error: 'Failed to get access token' });
    }
});

export default router;
