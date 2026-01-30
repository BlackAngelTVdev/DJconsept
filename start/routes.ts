/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.on('/').render('pages/home').as('home')
router.on('/comment-ca-marche').render('pages/how_it_works').as('how-it-works')
router.on('/login').render('pages/login').as('login')
router.on('/register').render('pages/register').as('register')