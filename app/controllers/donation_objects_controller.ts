import DonationObject from '#models/donation-object'
import type { HttpContext } from '@adonisjs/core/http'
import { updateDonationObjectValidator } from '#validators/donation_object'
import * as fs from 'fs/promises'

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

    const categoriesResult = await db.from('donation_objects').distinct('categorie').orderBy('categorie', 'asc')
    

    const categories = categoriesResult.map(row => row.categorie)

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
    
    // 1. Vérification de l'utilisateur
    if (!auth.user) {
      return response.unauthorized('Vous devez être connecté pour ajouter un objet.')
    }
    
    // Récupération de l'ID de l'utilisateur connecté
    const userId = auth.user.id
    
    const formData = request.only(['name', 'description', 'type', 'categorie'])
    // 'type' est une chaîne de caractères ('1' ou '0') dans le formulaire. La conversion en booléen est correcte.
    const isLending = formData.type === '1'

    if (!formData.categorie) {
      return response.badRequest('Le champ catégorie est manquant.')
    }
    
    const imageFile = request.file('image', {
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    let imageBase64: string | null = null

    if (imageFile) {
      if (!imageFile.tmpPath) {
        return response.badRequest('Fichier image manquant ou non prêt.')
      }
      
      const fileContent = await fs.readFile(imageFile.tmpPath)
      
      const mimeType = imageFile.extname ? `image/${imageFile.extname.replace('jpg', 'jpeg')}` : 'application/octet-stream'
      imageBase64 = `data:${mimeType};base64,${fileContent.toString('base64')}`
    }

    // 2. Création de l'objet et intégration du user_id
    const object = await DonationObject.create({
      userId: userId, // 🔥 AJOUT : L'ID de l'utilisateur connecté est inséré ici.
      name: formData.name,
      description: formData.description,
      type: isLending,
      categorie: formData.categorie, 
      imageBase64: imageBase64,
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


  async edit({ params, view, auth,response }: HttpContext) {
    
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

    const updateData: { 
      name?: string, 
      description?: string, 
      type?: boolean, 
      categorie?: string, 
      imageBase64?: string | null 
    } = {}

    if (payload.name !== undefined) updateData.name = payload.name
    if (payload.description !== undefined) updateData.description = payload.description
    
    if (payload.type !== undefined) updateData.type = payload.type === 1 
    
    if (payload.categorie !== undefined) updateData.categorie = payload.categorie

    if (payload.image) {
      const imageFile = payload.image
      let imageBase64: string | null = null

      if (!imageFile.tmpPath) {
        return response.badRequest('Fichier image manquant ou non prêt.')
      }

      const fileContent = await fs.readFile(imageFile.tmpPath)
      
      const mimeType = imageFile.extname ? `image/${imageFile.extname.replace('jpg', 'jpeg')}` : 'application/octet-stream'
      imageBase64 = `data:${mimeType};base64,${fileContent.toString('base64')}`
      
      updateData.imageBase64 = imageBase64
    }
    
    object.merge(updateData)
    await object.save()

    return response.redirect(`/item/${object.id}`);
  }

  async destroy({ params, response }: HttpContext) {
    const object = await DonationObject.findOrFail(params.id)
    await object.delete()
    return response.redirect().toPath('/account')
  }
}