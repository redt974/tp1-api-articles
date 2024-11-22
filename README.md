# API Articles

Création d’articles pour un site vitrine, permettant de gérer et de stocker des articles ayant vocation à être affichés sur le site vitrine d’un développeur
web et devant comporter au minimum les colonnes suivantes : id, title, content, author.

## Prérequis

Avant de commencer, assurez-vous que vous avez les éléments suivants installés sur votre machine :

- [Node.js](https://nodejs.org/) (version 16 ou supérieure)
- [PostgreSQL](https://www.postgresql.org/)
- [Postman](https://www.postman.com/) (pour tester les requêtes HTTP)

## Installation

1. Clonez ce dépôt sur votre machine locale :
   ```bash
   git clone <url_du_dépôt>
   ```

2. Allez dans le dossier du projet :
   ```bash
   cd <nom_du_dossier_du_projet>
   ```

3. Installez les dépendances du projet :
   ```bash
   npm install
   ```

4. Créez un fichier `.env` à la racine du projet et ajoutez les informations de votre base de données PostgreSQL :
   ```bash
   DATABASE_USER=your_db_user
   DATABASE_HOST=localhost
   DATABASE_NAME=your_db_name
   DATABASE_PASSWORD=your_db_password
   DATABASE_PORT=5432
   ```

5. Lancez le serveur :
   ```bash
   npm start
   ```

Le serveur sera accessible sur `http://localhost:3000`.

---

## Endpoints de l'API

### 1. **GET /articles**
Récupère tous les articles.

**Méthode :** `GET`

**Réponse attendue :**
```json
[
  {
    "id": 1,
    "title": "Titre de l'article",
    "content": "Contenu de l'article",
    "author": "Nom de l'auteur"
  },
  {
    "id": 2,
    "title": "Autre titre",
    "content": "Autre contenu",
    "author": "Autre auteur"
  }
]
```

### 2. **POST /articles**
Ajoute un nouvel article.

**Méthode :** `POST`

**URL :** `http://localhost:3000/articles`

**Payload :**
```json
{
  "title": "Titre de l'article",
  "content": "Contenu de l'article",
  "author": "Nom de l'auteur"
}
```

**Réponse attendue :**
```json
{
  "id": 1,
  "title": "Titre de l'article",
  "content": "Contenu de l'article",
  "author": "Nom de l'auteur"
}
```

### 3. **PUT /articles/edit**
Met à jour un article existant ou en crée un nouveau si l'ID est manquant.

**Méthode :** `PUT`

**URL :** `http://localhost:3000/articles/edit`

**Payload (Mise à jour d'un article) :**
```json
{
  "id": 1,
  "title": "Titre mis à jour",
  "content": "Contenu mis à jour",
  "author": "Auteur mis à jour"
}
```

**Payload (Création d'un nouvel article) :**
```json
{
  "title": "Nouveau titre",
  "content": "Nouveau contenu",
  "author": "Nouvel auteur"
}
```

**Réponse attendue :**
- Mise à jour :
  ```json
  {
    "message": "Article mis à jour.",
    "article": {
      "id": 1,
      "title": "Titre mis à jour",
      "content": "Contenu mis à jour",
      "author": "Auteur mis à jour"
    }
  }
  ```
- Création :
  ```json
  {
    "message": "Un nouvel article a été ajouté.",
    "article": {
      "id": 2,
      "title": "Nouveau titre",
      "content": "Nouveau contenu",
      "author": "Nouvel auteur"
    }
  }
  ```

### 4. **PATCH /articles/edit/content**
Met à jour uniquement le contenu d'un article.

**Méthode :** `PATCH`

**URL :** `http://localhost:3000/articles/edit/content`

**Payload :**
```json
{
  "id": 1,
  "content": "Nouveau contenu mis à jour"
}
```

**Réponse attendue :**
```json
{
  "message": "Le contenu de l'article a été mis à jour.",
  "article": {
    "id": 1,
    "title": "Titre de l'article",
    "content": "Nouveau contenu mis à jour",
    "author": "Nom de l'auteur"
  }
}
```

### 5. **DELETE /articles/:id**
Supprime un article par son ID.

**Méthode :** `DELETE`

**URL :** `http://localhost:3000/articles/1` (remplacez `1` par l'ID de l'article à supprimer)

**Réponse attendue :**
```json
{
  "message": "Article supprimé avec succès.",
  "article": {
    "id": 1,
    "title": "Titre de l'article",
    "content": "Contenu de l'article",
    "author": "Nom de l'auteur"
  }
}
```

---

## Exemples de Requêtes Postman

Voici les payloads Postman pour tester votre API :

### 1. **GET /articles**
Pas de corps de requête nécessaire, simplement une requête `GET` vers `http://localhost:3000/articles`.

### 2. **POST /articles**
Envoyer un `POST` avec le corps de la requête suivant :
```json
{
  "title": "Titre de l'article",
  "content": "Contenu de l'article",
  "author": "Nom de l'auteur"
}
```

### 3. **PUT /articles/edit**
Envoyer un `PUT` avec l'ID de l'article à mettre à jour ou un nouveau titre :
```json
{
  "id": 1,
  "title": "Titre mis à jour",
  "content": "Contenu mis à jour",
  "author": "Auteur mis à jour"
}
```
Ou pour créer un nouvel article :
```json
{
  "title": "Nouveau titre",
  "content": "Nouveau contenu",
  "author": "Nouvel auteur"
}
```

### 4. **PATCH /articles/edit/content**
Envoyer un `PATCH` pour mettre à jour le contenu d'un article :
```json
{
  "id": 1,
  "content": "Nouveau contenu mis à jour"
}
```

### 5. **DELETE /articles/:id**
Envoyer un `DELETE` vers `http://localhost:3000/articles/1` pour supprimer l'article avec l'ID 1.

