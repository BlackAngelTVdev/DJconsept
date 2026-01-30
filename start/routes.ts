import router from '@adonisjs/core/services/router'

// On importe le controller
const UsersController = () => import('#controllers/users_controller')

/*
|--------------------------------------------------------------------------
| Routes Publiques (Accessibles par tout le monde)
|--------------------------------------------------------------------------
*/
router.on('/').render('pages/home').as('home')
router.on('/comment-ca-marche').render('pages/how_it_works').as('how-it-works')
router.on('/login').render('pages/login').as('login')
router.on('/register').render('pages/register').as('register')


/*
|--------------------------------------------------------------------------
| Espace Membres (CRUD Users)
|--------------------------------------------------------------------------
| On groupe ici tout ce qui demande d'être connecté.
| Pour l'instant on ne met pas de middleware, on prépare juste la structure.
*/
router.group(() => {
  
  // Affiche la liste des DJs (index)
  router.get('/users', [UsersController, 'index']).as('users.index')
  
  // Affiche un profil spécifique (show)
  router.get('/users/:id', [UsersController, 'show']).as('users.show')
  
  // Formulaire d'édition (edit)
  router.get('/users/:id/edit', [UsersController, 'edit']).as('users.edit')
  
  // Actions de mise à jour et suppression (update/destroy)
  router.put('/users/:id', [UsersController, 'update']).as('users.update')
  router.delete('/users/:id', [UsersController, 'destroy']).as('users.destroy')

}).prefix('/log') // Optionnel: toutes ces routes commenceront par /app/users...