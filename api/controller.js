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
router.get("/movies", verifyToken, (req, res) => {
    jwt.verify(req.token, "secretkey", (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            Movie.find((err, movies) => {
                if (err) {
                    res.send("Error in fetching movies: " + err);
                } else {
                    res.json(movies);
                }
            });
        }
    });
});

// Search movie by ID
router.get("/movies/:id", (req, res) => {
    const id = req.params.id;
    Movie.findById(id, (err, movie) => {
        if (err || !movie) {
            res.status(400).send("Movie not found");
        } else {
            res.json(movie);
        }
    });
});

// Delete movie by ID
router.delete("/deleteMovie/:id", (req, res) => {
    const id = req.params.id;
    Movie.findByIdAndDelete(id, (err) => {
        if (err) {
            res.send("Error in deleting movie: " + err);
        } else {
            res.send("Movie is deleted");
        }
    });
});

// Update movie by ID
router.put("/updateMovie", (req, res) => {
    const updatedMovie = req.body;
    Movie.findByIdAndUpdate(updatedMovie.id, updatedMovie, { new: true }, (err, movie) => {
        if (err || !movie) {
            res.status(400).send("Movie not found");
        } else {
            res.send("Movie is updated");
        }
    });
});

module.exports = router;
