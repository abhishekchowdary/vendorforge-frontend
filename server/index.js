import express from 'express';
import cors from 'cors';
import { billdeskRouter } from './billdeskProxy.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use('/api/bd', billdeskRouter());

const port = process.env.PORT || 5176;
app.listen(port, () => console.log(`API proxy on http://localhost:${port}`));
