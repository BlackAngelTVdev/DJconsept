import vine from '@vinejs/vine'

// Définition des catégories pour validation (doit correspondre aux options du formulaire)
const categoriesList = [
  'Sport & Loisirs',
  'Culture & Livres',
  'Vêtements',
  'Informatique & Tech',
  'Maison & Cuisine',
  'Jouets & Enfants',
  'Électroménager',
  'Musique & Art',
  'Bureau & Fournitures',
]

export const updateDonationObjectValidator = vine.compile(
  vine.object({
    // Nom (Optionnel pour l'édition)
    name: vine.string().trim().maxLength(255).optional(), 
    
    // Description (Optionnel pour l'édition)
    description: vine.string().trim().minLength(10).optional(),
    
    // Catégorie (Optionnel pour l'édition, validation de l'inclusion)
    categorie: vine.string().trim().in(categoriesList).optional(),
    
    // Type (Statut: 0 pour donner, 1 pour prêter. Optionnel)
    type: vine.number().withoutDecimals().range([0, 1]).optional(),
    
    // Image (Fichier, Optionnel pour l'édition)
    image: vine.file({
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    }).optional(),

  })
)