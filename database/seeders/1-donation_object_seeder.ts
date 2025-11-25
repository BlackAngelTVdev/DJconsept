import DonationObject from '#models/donation-object'
import { BaseSeeder } from '@adonisjs/lucid/seeders'


export default class extends BaseSeeder {
  async run() {

    const objects = [{
      name: 'Ballon de foot',
      description: 'Légèrement usé, taille 5',
      type: true, 
      status: 1,
    },{
      name: 'Ballon de basket',
      description: 'Coupe du monde 2015, excellent état',
      type: false,
      status: 1,
    },{
      name: 'Livre - Le Seigneur des Anneaux',
      description: 'Trilogie complète, édition de poche',
      type: true,
      status: 1,
    },{
      name: 'Veste d\'hiver',
      description: 'Taille M, couleur bleu marine, très chaude',
      type: true,
      status: 1,
    },{
      name: 'Console de jeu (ancienne génération)',
      description: 'Fonctionnelle, vendue sans manettes',
      type: false,
      status: 2, // Exemple de statut différent
    },{
      name: 'Assiettes en porcelaine',
      description: 'Lot de 6 assiettes plates blanches',
      type: true,
      status: 1,
    },{
      name: 'Tapis de yoga',
      description: 'Neuf, couleur verte, épaisseur 5mm',
      type: true,
      status: 1,
    },{
      name: 'Ordinateur portable',
      description: 'Écran fissuré, pour pièces uniquement',
      type: false,
      status: 3, // Exemple de statut pour objet endommagé
    },{
      name: 'Jeu de construction pour enfants',
      description: 'Boîte presque complète (quelques pièces manquantes)',
      type: true,
      status: 1,
    },{
      name: 'Chaussures de randonnée',
      description: 'Taille 42, très bon état',
      type: true,
      status: 1,
    },{
      name: 'Micro-ondes',
      description: 'Fonctionne parfaitement, couleur noire',
      type: false,
      status: 1,
    },{
      name: 'Guitare acoustique',
      description: 'Corde de Mi grave cassée',
      type: true,
      status: 2,
    },{
      name: 'Lot de stylos et crayons',
      description: 'Matériel de bureau neuf',
      type: true,
      status: 1,
    },{
      name: 'Écran PC 24 pouces',
      description: 'Moniteur Full HD, quelques légères rayures',
      type: false,
      status: 1,
    },{
      name: 'Couvertures polaires',
      description: 'Lot de deux couvertures, couleurs assorties',
      type: true,
      status: 1,
    },]

    // Le tableau 'objects' contient maintenant 15 items.

    await DonationObject.createMany(objects)
  }
}