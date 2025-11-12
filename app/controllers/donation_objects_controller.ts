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

  // /**
  //  * Display form to create a new record
  //  */
  // async create({}: HttpContext) {}

  // /**
  //  * Handle form submission for the create action
  //  */
  // async store({ request }: HttpContext) {}

  // /**
  //  * Show individual record
  //  */
async show({ params, view }: HttpContext) {
    // findOrFail renvoie une erreur 404 si l'objet n'est pas trouvé
    const object = await DonationObject.findOrFail(params.id) 

    return view.render('pages/show-object', { object })
  }

  // /**
  //  * Edit individual record
  //  */
  // async edit({ params }: HttpContext) {}

  // /**
  //  * Handle form submission for the edit action
  //  */
  // async update({ params, request }: HttpContext) {}

  // /**
  //  * Delete record
  //  */
  // async destroy({ params }: HttpContext) {}
}