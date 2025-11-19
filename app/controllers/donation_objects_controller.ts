import DonationObject from '#models/donation-object'
import type { HttpContext } from '@adonisjs/core/http'
import { updateDonationObjectValidator } from '#validators/donation_object'

export default class DonationObjectsController {
  
  async index({ view }: HttpContext) {
    const objects = await DonationObject.all()
    return view.render('pages/home', { objects })
  }

  async create({ view }: HttpContext) {
    return view.render('pages/new-object')
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['name', 'description'])
    const object = await DonationObject.create(data)
    return response.redirect().toPath(`/item/${object.id}`)
  }

  async show({ params, view }: HttpContext) {
    const object = await DonationObject.findOrFail(params.id)
    return view.render('pages/details', { object })
  }

  async edit({ params, view }: HttpContext) {
    const object = await DonationObject.findOrFail(params.id)
    return view.render('pages/edit-object', { object })
  }

  async update({ params, request, response }: HttpContext) {
  // 1. Validation et récupération du payload
  const payload = await request.validateUsing(updateDonationObjectValidator)
  
  // 2. Récupération de l'objet existant
  const object = await DonationObject.findOrFail(params.id)

  // 3. Mise à jour de l'objet
  object.merge(payload)
  await object.save()

  // 4. Redirection vers la page de l'objet mis à jour
  
  // Si vous utilisez un nom de route :
  return response.redirect(`/item/${object.id}`);

  // OU si vous utilisez un chemin direct :
  // return response.redirect(`/donations/${object.id}`) 
}

  async destroy({ params, response }: HttpContext) {
    const object = await DonationObject.findOrFail(params.id)
    await object.delete()
    return response.redirect().toPath('/home')
  }
}