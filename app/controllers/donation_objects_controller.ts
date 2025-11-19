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
  
  const payload = await request.validateUsing(updateDonationObjectValidator)
  
  const object = await DonationObject.findOrFail(params.id)


  object.merge(payload)
  await object.save()

  return response.redirect(`/item/${object.id}`);
}

  async destroy({ params, response }: HttpContext) {
    const object = await DonationObject.findOrFail(params.id)
    await object.delete()
    return response.redirect().toPath('/home')
  }
}