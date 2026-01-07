import DonationObject from '#models/donation-object'
import type { HttpContext } from '@adonisjs/core/http'
import { updateDonationObjectValidator } from '#validators/donation_object'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import sharp from 'sharp'
import fs from 'node:fs/promises'

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
    if (!auth.user) return response.unauthorized('Connectez-vous.')

    const formData = request.only(['name', 'description', 'type', 'categorie'])
    const imageFile = request.file('image', {
      size: '5mb', // On peut accepter plus gros au départ car on va compresser
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    let fileName: string | null = null

    if (imageFile) {
      // 1. On prépare le nom du fichier (toujours .webp)
      fileName = `${cuid()}.webp`
      const uploadPath = app.makePath('public/uploads/items', fileName)

      // 2. Utilisation de Sharp pour transformer et compresser
      // .resize(800) redimensionne à 800px de large max (optionnel mais recommandé)
      // .webp({ quality: 80 }) compresse à 80% (excellent ratio)
      if (imageFile.tmpPath) {
        await sharp(imageFile.tmpPath)
          .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 75 }) // Ajustez entre 60 (très compressé) et 80 (bonne qualité)
          .toFile(uploadPath)
      }
    }

    const object = await DonationObject.create({
      userId: auth.user.id,
      name: formData.name,
      description: formData.description,
      type: formData.type === '1',
      categorie: formData.categorie,
      imagePath: fileName,
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

    const updateData: any = {}

    if (payload.name !== undefined) updateData.name = payload.name
    if (payload.description !== undefined) updateData.description = payload.description
    if (payload.type !== undefined) updateData.type = payload.type === 1
    if (payload.categorie !== undefined) updateData.categorie = payload.categorie

    // GESTION DE L'IMAGE AVEC COMPRESSION WEBP
    if (payload.image) {
      const imageFile = payload.image

      // 1. On force l'extension .webp
      const fileName = `${cuid()}.webp`
      const uploadPath = app.makePath('public/uploads/items', fileName)

      // 2. Supprimer l'ancienne image du serveur
      if (object.imagePath) {
        try {
          await fs.unlink(app.makePath('public/uploads/items', object.imagePath))
        } catch (e) {
          // Ignorer si l'ancien fichier était déjà supprimé ou introuvable
        }
      }

      // 3. Traitement de la nouvelle image avec Sharp
      if (imageFile.tmpPath) {
        await sharp(imageFile.tmpPath)
          .resize(1200, 1200, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: 75 }) // Compression "de fou" : tu peux descendre à 60 si besoin
          .toFile(uploadPath)

        updateData.imagePath = fileName
      }
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
