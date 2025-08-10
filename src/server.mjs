import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerRoutes } from './utiles/routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// API 라우트
registerRoutes(app);

// 정적 파일 (클라이언트)
app.use(express.static(path.join(__dirname, '../public')));

// 헬스체크
app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
    console.log(`\n🚀 Korea dashboard running: http://localhost:${PORT}\n`);
});