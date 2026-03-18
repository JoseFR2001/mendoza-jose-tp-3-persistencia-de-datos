import express from 'express';
import session from 'express-session';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001

app.use(session({
    secret: 'mi-clave-secreta',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Express sirve automáticamente la carpeta public y busca el index.html
app.use(express.static(join(__dirname, 'public')));

app.use((req, res, next) => {
    if (!req.session.alumnos) {
        req.session.alumnos = [];
    }
    next();
});

app.get('/datos', (req, res) => {
    res.json(req.session.alumnos);
});

app.post('/alumno', (req, res) => {
    const { nombre, edad, nota } = req.body;
    if (nombre && edad && nota) {
        req.session.alumnos.push({ nombre, edad, nota });
    }
    res.redirect('/');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('Servidor corriendo en http://localhost:' + PORT);
});