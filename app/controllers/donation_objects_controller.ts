import DonationObject from '#models/donation-object'
import type { HttpContext } from '@adonisjs/core/http'

export default class DonationObjectsController {
  /**
   * Afficher la liste des objets 
   */
  async index({ view }: HttpContext) {

    const objects = await DonationObject.all()

    return view.render('pages/home', { objects })
  }

  /**
   * affichage du formulaire pour ajouter un nouvelle objet
   */
  async create({ view }: HttpContext) {
    
    return view.render('pages/new-object')
  }

  /**
   * requetes pour ajouter a la db un nouvelle objet
   */
 async store({ request, response }: HttpContext) {

  const data = request.only(['name', 'description'])
  const object = await DonationObject.create(data)

  return response.redirect().toPath(`/item/${object.id}`)
}

  /**
   * voir un seul objet
   */
  async show({ params, view }: HttpContext) {

    const object = await DonationObject.findOrFail(params.id)

    return view.render('pages/details', { object })
  }

  // /**
  //  * Edit individual record
  //  */
  // async edit({ params }: HttpContext) {}

  // /**
  //  * Handle form submission for the edit action
  //  */
  // async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
/**
 * Delete record
 */
  async destroy({ params, response }: HttpContext) {
    
    const object = await DonationObject.findOrFail(params.id)


    await object.delete()


    return response.redirect().toPath('/home')
  }
}