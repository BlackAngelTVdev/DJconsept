# 🚀 DJ Consept
![Stars](https://img.shields.io/github/stars/BlackAngelTVdev/DJconsept?style=for-the-badge&color=yellow)
![Commits](https://img.shields.io/github/commit-activity/m/BlackAngelTVdev/DJconsept?style=for-the-badge&color=blue)
![Issues](https://img.shields.io/github/issues/BlackAngelTVdev/DJconsept?style=for-the-badge&color=orange)
![Forks](https://img.shields.io/github/forks/BlackAngelTVdev/DJconsept?style=for-the-badge&color=808080)
![Last Commit](https://img.shields.io/github/last-commit/BlackAngelTVdev/DJconsept?style=for-the-badge&color=blue)

> **Le mix parfait entre DJs & Organisateurs**

---

## 🧐 Aperçu
-- Bientôt -- 
<!--![AntiAdBlockZone](Asset/Img/banner.png)-->

## ✨ Fonctionnalités
- ✅ **Inscription simple** : Créez votre compte en quelques secondes.
- ✅ **Profil custom** : Personnalisez votre espace selon vos envies.
- ✅ **Données sécurisées** : Chiffrement total pour une confidentialité absolue.

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
2. **Installation et Configuration**
   Installez les dépendances, copiez et renommez le fichier d'environnement, puis générez la clé:
   ```bash
   npm install
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
| **Administrateur** | `admin@djconsept.fr` | `admin` |
| **Inviter (pas de perm)** | `gm@djconsept.fr`| `gmguest`|

si vous voulez modifier le compte par defaut il faut aller dans ```database/seeders/user_seeder.ts``` puis modifier les users par defaut
  ```js

import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        fullName: 'Damien Rochat',
        email: 'admin@djconsept.fr',
        password: 'admin',
        location: 'Morges',
        isAdmin: true,
        instagramUrl: 'https://www.instagram.com/dj_dams08',
        youtubeUrl:'https://www.youtube.com/@Dj-Dam-s',
      }
      ,
      {
        fullName: 'GM',
        email: 'gm@djconsept.fr',
        password: 'gmguest',
        location: 'Lausanne',
      },
      
    ])
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

**BlackAngelTVdev**
![Follow](https://img.shields.io/github/followers/BlackAngelTVdev?label=Follow%20Me&style=social)

---
## 📄 Licence

Ce projet est sous licence :
![GitHub License](https://img.shields.io/github/license/BlackAngelTVdev/DJconsept?style=flat-square&color=blue)
