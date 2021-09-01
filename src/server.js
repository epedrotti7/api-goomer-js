import express from 'express';
import router from './routes';
import cors from 'cors';

/** Ao importar dessa forma, ele executa a função do arquivo runMigrations */
import './database/runMigrations.js';

import { connectOnDb } from './database/connection';

const PORT = 3333;

const app = express();

app.use(cors())
app.use(express.json());
app.use(router);


app.listen(PORT, () => {
    /**Executa a função de conexão com o mysql */
    connectOnDb();
    console.log(`Server is running on ${PORT}`);
});


