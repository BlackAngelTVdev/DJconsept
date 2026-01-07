import DonationObject from '#models/donation-object'
import type { HttpContext } from '@adonisjs/core/http'
import { updateDonationObjectValidator } from '#validators/donation_object'
import app from '@adonisjs/core/services/app' // Retirez les accolades
import { cuid } from '@adonisjs/core/helpers'
import fs from 'node:fs/promises' // Pour supprimer l'ancienne image
// Vous pouvez garder fs si vous en avez besoin ailleurs,
// mais Adonis gère le déplacement des fichiers nativement.
import db from '@adonisjs/lucid/services/db'

export default class DonationObjectsController {
  async index({ request, view }: HttpContext) {
    const filterType = request.input('filter_type')
    const filterCategorie = request.input('filter_categorie')

    let query = DonationObject.query().orderBy('created_at', 'desc')

    if (filterType === '0') {
      query = query.where('type', false)
    } else if (filterType === '1') {
      query = query.where('type', true)
    }

    if (filterCategorie && filterCategorie !== '') {
      query = query.where('categorie', filterCategorie)
    }

    const objects = await query

    const categoriesResult = await db
      .from('donation_objects')
      .distinct('categorie')
      .orderBy('categorie', 'asc')

    const categories = categoriesResult.map((row) => row.categorie)

    return view.render('pages/home', {
      objects,
      filterType,
      filterCategorie,
      categories,
    })
  }

  async create({ view }: HttpContext) {
    return view.render('pages/new-object')
  }

  async store({ request, response, auth }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized('Vous devez être connecté.')
    }

    const userId = auth.user.id
    const formData = request.only(['name', 'description', 'type', 'categorie'])
    const isLending = formData.type === '1'

    const imageFile = request.file('image', {
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    let fileName: string | null = null

    if (imageFile) {
      // Génère un nom unique : clv12345.jpg
      fileName = `${cuid()}.${imageFile.extname}`

      // Déplace le fichier vers public/uploads/items
      await imageFile.move(app.makePath('public/uploads/items'), {
        name: fileName,
      })
    }

    const object = await DonationObject.create({
      userId: userId,
      name: formData.name,
      description: formData.description,
      type: isLending,
      categorie: formData.categorie,
      // On enregistre uniquement le nom du fichier (ex: "clv123.jpg")
      imagePath: fileName, // Assurez-vous que le champ s'appelle imagePath dans votre modèle
      status: 1,
    })

    return response.redirect().toPath(`/item/${object.id}`)
  }

  async show({ params, view }: HttpContext) {
    const object = await DonationObject.query()
      .where('id', params.id)
      .preload('user') // Charge les données de l'utilisateur associé au userId
      .firstOrFail()
    return view.render('pages/details', { object })
  }

  async edit({ params, view, auth, response }: HttpContext) {
    const user = auth.user!

    const object = await DonationObject.findOrFail(params.id)

    if (object.userId === user.id) {
      return view.render('pages/edit-object', { object })
    } else {
      return response.redirect().toRoute('donation_objects.index')
    }
  }

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateDonationObjectValidator)
    const object = await DonationObject.findOrFail(params.id)

    // On prépare les données de mise à jour
    const updateData: any = {}

    if (payload.name !== undefined) updateData.name = payload.name
    if (payload.description !== undefined) updateData.description = payload.description
    if (payload.type !== undefined) updateData.type = payload.type === 1
    if (payload.categorie !== undefined) updateData.categorie = payload.categorie

    // GESTION DE L'IMAGE PHYSIQUE
    if (payload.image) {
      const imageFile = payload.image

      // 1. Générer un nom unique (ex: clv123.jpg)
      const fileName = `${cuid()}.${imageFile.extname}`

      // 2. Supprimer l'ancienne image du serveur si elle existe pour ne pas encombrer le disque
      if (object.imagePath) {
        try {
          await fs.unlink(app.makePath('public/uploads/items', object.imagePath))
        } catch (e) {
          // Si le fichier n'existe pas déjà, on ignore l'erreur
        }
      }

      // 3. Déplacer le nouveau fichier vers le dossier public
      await imageFile.move(app.makePath('public/uploads/items'), {
        name: fileName,
      })

      // 4. Enregistrer le nom du fichier dans l'objet de mise à jour
      updateData.imagePath = fileName
    }

    object.merge(updateData)
    await object.save()

    return response.redirect(`/item/${object.id}`)
  }

  async destroy({ params, response }: HttpContext) {
    const object = await DonationObject.findOrFail(params.id)

    // SUPPRESSION DE L'IMAGE SUR LE DISQUE
    if (object.imagePath) {
      try {
        await fs.unlink(app.makePath('public/uploads/items', object.imagePath))
      } catch (e) {
        // Ignorer si le fichier physique est déjà absent
      }
    }

    await object.delete()
    return response.redirect().toPath('/account')
  }
}
