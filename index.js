const express = require('express');
const { Pool } = require('pg');
const dotenv = require("dotenv");

// Initialisation de l'application
dotenv.config();
const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Configuration de la base de données
const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
});

// Création de la table "articles"
pool.query(`
    CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author TEXT NOT NULL
    )
`)
    .then(() => console.log("Table 'articles' créée"))
    .catch((err) => console.error(`Erreur lors de la création de la table : ${err}`));

// Route de base
app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API Articles!');
});

// Route GET pour récupérer tous les articles
app.get('/articles', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM articles ORDER BY id ASC");

        if (!result.rows || result.rows.length === 0) {
            throw new Error("Aucun article trouvé.");
        }

        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({
            message: `Erreur lors de la récupération des articles : ${err}.`
        });
    }
});

// Route POST pour ajouter un article
app.post('/articles', async (req, res) => {
    try {
        const { title, content, author } = req.body;

        const check = await pool.query("SELECT 1 FROM articles WHERE title=$1", [title]);
        if (check.rows.length > 0) {
            throw new Error("Un article avec ce titre existe déjà.");
        }

        const result = await pool.query(
            "INSERT INTO articles (title, content, author) VALUES ($1, $2, $3) RETURNING *",
            [title, content, author]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({
            message: `Erreur lors de la création de l'article : ${err}`
        });
    }
});

// Route PUT pour mettre à jour ou ajouter un article
app.put('/articles/edit', async (req, res) => {
    try {
        const { id = null, title, content, author } = req.body;

        const check = await pool.query("SELECT 1 FROM articles WHERE title=$1", [title]);
        if (check.rows.length > 0) {
            throw new Error("Un article avec ce titre existe déjà.");
        }

        if (id === null) {
            const result = await pool.query(
                "INSERT INTO articles (title, content, author) VALUES ($1, $2, $3) RETURNING *",
                [title, content, author]
            );
            res.status(201).json({
                message: "Un nouvel article a été ajouté.",
                article: result.rows[0]
            });
        } else {
            const result = await pool.query(
                "UPDATE articles SET title=$2, content=$3, author=$4 WHERE id=$1 RETURNING *",
                [id, title, content, author]
            );
            res.status(200).json({
                message: "Article mis à jour.",
                article: result.rows[0]
            });
        }
    } catch (err) {
        res.status(500).json({
            message: `Erreur lors de la mise à jour ou de l'ajout de l'article : ${err}`
        });
    }
});

// Route PATCH pour mettre à jour uniquement le contenu d'un article
app.patch('/articles/edit/content', async (req, res) => {
    try {
        const { id, content } = req.body;

        const result = await pool.query(
            "UPDATE articles SET content=$2 WHERE id=$1 RETURNING *",
            [id, content]
        );

        res.status(200).json({
            message: "Le contenu de l'article a été mis à jour.",
            article: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({
            message: `Erreur lors de la mise à jour du contenu : ${err}`
        });
    }
});

// Route DELETE pour supprimer un article
app.delete('/articles/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM articles WHERE id=$1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Article non trouvé."
            });
        }

        res.status(200).json({
            message: "Article supprimé avec succès.",
            article: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({
            message: `Erreur lors de la suppression de l'article : ${err}`
        });
    }
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
