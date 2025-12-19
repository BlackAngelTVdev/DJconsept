# 🚀 Je donne, Je prete
![Stars](https://img.shields.io/github/stars/BlackAngelTVdev/Je-donne-ou-je-prete?style=for-the-badge&color=yellow)
![Commits](https://img.shields.io/github/commit-activity/m/BlackAngelTVdev/Je-donne-ou-je-prete?style=for-the-badge&color=blue)
![Issues](https://img.shields.io/github/issues/BlackAngelTVdev/Je-donne-ou-je-prete?style=for-the-badge&color=orange)
![Forks](https://img.shields.io/github/forks/BlackAngelTVdev/Je-donne-ou-je-prete?style=for-the-badge&color=808080)
![Last Commit](https://img.shields.io/github/last-commit/BlackAngelTVdev/Je-donne-ou-je-prete?style=for-the-badge&color=blue)

> **[Une seule phrase simple qui décrit l'utilité du projet]**
> *Exemple : Une extension Chrome pour automatiser la gestion de stock.*

---

## 🧐 Aperçu
![LoginJeDonneJePrête](https://i.postimg.cc/prCQYVDm/Capture-d-ecran-2025-12-19-112200.png)

## ✨ Fonctionnalités
- ✅ **Fonction 1** : Description rapide.
- ✅ **Fonction 2** : Pourquoi c'est cool.
- ✅ **Fonction 3** : Ce qui le différencie des autres.

## 🛠 Tech Stack

| Technologie | Usage |
| :--- | :--- |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) | Logique backend & scripts |
| ![AdonisJS](https://img.shields.io/badge/AdonisJS-220052?style=for-the-badge&logo=adonisjs&logoColor=white) | Framework Node.js |
| ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) | Base de données |
| ![Edge](https://img.shields.io/badge/Edge-5A45FF?style=for-the-badge&logo=edge&logoColor=white) | Moteur de template |

## 🚀 Installation & Lancement

1. **Cloner le projet**
   ```bash
   git clone https://github.com/BlackAngelTVdev/Je-donne-ou-je-prete.git
   cd Je-donne-ou-je-prete
   ```
2. **Configuration de l'environnement**
   Copiez le fichier d'exemple et générez votre clé d'application :
   ```bash
   npm i
   cp .env.example .env
   node ace generate:key
3. **Migration et ajout de données dans la base**
    ```
    node ace migration:fresh --seed
    ```
4. **Lancer l'application**
   ```
   npm run dev
   ```
## 📖 Utilisation

Une fois le serveur lancé, vous pouvez vous connecter avec les identifiants par défaut :

| Compte | Identifiant | Mot de passe |
| :--- | :--- | :--- |
| **Administrateur** | `Admin` | `Admin` |
| **Inviter (pas de perm)** | `Guest`| `Guest`|

si vous voulez modifier le compte par defaut il faut aller dans ```database/seeders/1-UserSeeder.ts``` puis modifier les users par defaut
  ```js

export default class extends BaseSeeder {
  async run() {

    const users = [{
      username: 'Admin',
      password: 'Admin',
    },{
      username: 'Test',
      password: '1234',
    },{
      username: 'Guest',
      password: 'Guest',
    },
  ]

      await User.createMany(users)
   }
}
  ```
## 🤝 Contribution
1. Forkez le projet
2. Créez votre branche (git checkout -b feature/AmazingFeature)
3. Commit (git commit -m 'Add some AmazingFeature')
4. Push (git push origin feature/AmazingFeature)
5. Ouvrez une Pull Request

## 👤 Auteur

- **BlackAngelTVdev**
![Follow](https://img.shields.io/github/followers/BlackAngelTVdev?label=Follow%20Me&style=social)
- **alberrboyyy**
![Follow](https://img.shields.io/github/followers/alberrboyyy?label=Follow%20Me&style=social)
- **Gianmarco-Ruberti**
![Follow](https://img.shields.io/github/followers/Gianmarco-Ruberti?label=Follow%20Me&style=social)
---
## 📄 Licence

Ce projet est sous licence :
![GitHub License](https://img.shields.io/github/license/BlackAngelTVdev/Je-donne-ou-je-prete?style=flat-square&color=blue)
