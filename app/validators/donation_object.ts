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

export const createDonationObjectValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    description: vine.string().trim().escape().maxLength(5000).optional(),
    type: vine.enum(['0', '1']), // On attend les strings du formulaire
    categorie: vine.string().trim(),
    image: vine
      .file({
        size: '5mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })
      .optional(), // Mettre .optional() si l'image n'est pas obligatoire
  })
)
export const updateDonationObjectValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    description: vine.string().trim().escape().maxLength(5000).optional(),
    type: vine.enum(['0', '1']), // On attend les strings du formulaire
    categorie: vine.string().trim(),
    image: vine
      .file({
        size: '5mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })
      .optional(), // Mettre .optional() si l'image n'est pas obligatoire
  })
)
