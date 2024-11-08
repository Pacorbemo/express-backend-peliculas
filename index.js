import express from "express";
import fs from "fs";
import cors from "cors";
import { readFileAsync } from "./readFile.js";
import { cutArray } from "./cutArray.js";


const app = express();

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

app.get("/:id", async (req, res) => {
    try{
        const data = await readFileAsync();
        const movie = data.find( movie => movie.href == req.params.id)
        res.json(movie);
    } catch{
        res.status(500).json({ error: "Error reading file" });
    }
})

app.post('/', async (req, res) => {
    const page = req.body.page || req.query.page;
    const search = req.body.search || req.query.search
    const maxPages = req.body.maxPages || req.query.maxPages

    try{
        const movies = await readFileAsync();

        if(maxPages){
            const response = Math.ceil(movies.length / 20)
            res.json({ maxPages : response })
        } else if (page && search) {
            // console.log("page y search")
            const filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(search.toLowerCase()));
            res.json(cutArray(filteredMovies, page));
        } else if (page) {
            // console.log("page")
            res.json(cutArray(movies, page));
        } else if (search) {
            const filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(search.toLowerCase()));
            const maxPages = Math.ceil(filteredMovies.length / 20)
            res.json({filteredMovies : cutArray(filteredMovies), maxPages});
        } else {
            res.status(400).json({ error: "No page or search parameter provided" });
        }
    } catch{
        res.status(500).json({error : "No parametros"})
    }

});

app.post('/favorites', async(req,res) => {
    const favoritesArray = req.body.movies._value
    try{
        const movies = await readFileAsync();

        const favoriteMovies = movies.filter(movie => favoritesArray.includes(movie.href));
        res.json(favoriteMovies);
    }catch{
        res.status(500).json({error : "Error"})
    }
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});