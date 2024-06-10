// api/controller.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Movie = require('../modules/movies'); // Adjust the path as necessary

// Add movie
router.post("/addMovie", async (req, res) => {
    try {
        const movie = new Movie({
            name: req.body.name,
            releaseDate: req.body.releaseDate,
            director: req.body.director
        });
        
        await movie.save();
        res.send("Movie Added Successfully");
    } catch (err) {
        res.send("Error in Movie add: " + err);
    }
});

// JWT
router.post("/login", (req, res) => {
    jwt.sign({ movies: Movie }, "secretkey", (err, token) => {
        if (err) {
            res.status(500).send("Error generating token");
        } else {
            res.json({ token });
        }
    });
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403); // Forbidden
    }
}

// API to get all movies data
router.get("/movies", verifyToken, async (req, res) => {
    jwt.verify(req.token, "secretkey", async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                const allMovies = await Movie.find();
                res.json(allMovies);
            } catch (err) {
                res.send("Error in fetching movies: " + err);
            }
        }
    });
});

// Search movie by ID
router.get("/movies/:id", async (req, res) => {
    const id = req.params.id;
   try{
   const movie=await Movie.findById(id);
   res.json(movie);
}catch(err)
{
    res.status(400).send("Error in search by id"+err);
}
});

// Delete movie by ID
router.delete("/deleteMovie/:id", async (req, res) => {
    const id = req.params.id;
    try{
    const flag=await Movie.findByIdAndDelete(id);
    res.status(200).send("Movie Deleted");
    }catch(err){
        res.status(404).send("Error in Deleting Movie"+err);
    }
});

// Update movie by ID
router.put("/updateMovie/:id", async (req, res) => {
    const id = req.params.id;
    const updatedMovie = req.body;
    try {
        const movie = await Movie.findById(id);
        if (movie) {
            movie.name = updatedMovie.name;
            movie.releaseDate = updatedMovie.releaseDate;
            movie.director = updatedMovie.director;
            await movie.save();
            res.send("Movie is Updated");
        } else {
            res.status(400).send("Movie not found");
        }
    } catch (err) {
        res.status(500).send("Error updating movie: " + err);
    }
});


module.exports = router;
