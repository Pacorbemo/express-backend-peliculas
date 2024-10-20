import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { serialize } from "v8";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const filePath = path.join(__dirname, "movies-2020s.json");


app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            res.status(500).json({ error: "Error reading file" });
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.get("/:id", (req, res) => {
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            res.status(500).json({ error: "Error reading file" });
            return;
        }
        const movie = JSON.parse(data).find( movie => movie.href == req.params.id)
        res.json(movie);
    });
})

app.post('/', (req, res) => {
    const page = req.body.pagina || req.query.pagina;
    const search = req.body.search || req.query.search

    if (page) {
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                res.status(500).json({ error: "Error reading file" });
                return;
            }
            const start = 20 * (page - 1)
            const finish = 20 * page
            const first20Movies = JSON.parse(data).slice(start, finish);
            res.json(first20Movies);
        });
    }
    else if(search){
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                res.status(500).json({ error: "Error reading file" });
                return;
            }

            let count = 0;
            const movies = [];
            JSON.parse(data).forEach(movie => {
                if (movie.title.toLowerCase().includes(search.toLowerCase()) && count < 20) {
                    movies.push(movie);
                    count++;
                }
            });
            res.json(movies);
        })
    }
    else {
      res.status(400).send('No se recibió ningún parámetro de búsqueda');
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});