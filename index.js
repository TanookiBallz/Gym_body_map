import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import OpenAI from 'openai'; 

const { Pool } = pg;

const app = express();
const PORT = process.env.SERVER_PORT || 5000;


app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "aydar2005gg", 
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "gym_helper",    
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
});

pool.connect()
    .then(() => console.log('✅ Подключено к PostgreSQL успешно!'))
    .catch(err => console.error('❌ Ошибка подключения к БД:', err));



app.get('/api/exercises/:muscleId', async (req, res) => {
    try {
        const { muscleId } = req.params;
        
        console.log(`📥 Запрос на сервер для мышцы: '${muscleId}'`);

        const query = `SELECT * FROM exercises WHERE muscle_group = $1`;

        const result = await pool.query(query, [muscleId]);
        
        console.log(`✅ Найдено упражнений: ${result.rows.length}`);
        res.json(result.rows);

    } catch (err) {
        console.error("❌ ОШИБКА SQL:", err.message);
        res.status(500).send('Ошибка сервера');
    }
});


app.post('/api/ai-chat', async (req, res) => {
    try {
        const { message } = req.body;
        console.log(`🤖 Вопрос к AI: ${message}`);

        const completion = await openai.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: "Ты — грамотный AI-тренер и нутрициолог считай себя братом пользователя которому ты искрненне желаешь успеха. Ты помогаешь набрать массу или похудеть также помогаешь пользовател. считать КБЖУ. Отвечай кратко, по фактам, используй дружелюбные языки (брат, база, масса, сушка). Твоя цель — мотивировать." 
                },
                { role: "user", content: message }
            ],
            model: "gpt-3.5-turbo", 
        });

        const reply = completion.choices[0].message.content;
        console.log(`🤖 Ответ AI: ${reply}`);
        
        res.json({ reply: reply });

    } catch (error) {
        console.error("❌ Ошибка OpenAI:", error);
        res.status(500).json({ reply: "Мозг перегрелся. Проверь баланс API или попробуй позже." });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});