import DonationObject from '#models/donation-object'
import { BaseSeeder } from '@adonisjs/lucid/seeders'


export default class extends BaseSeeder {
  async run() {

    // 15 objets avec la nouvelle colonne 'categorie'
    const objects = [{
      name: 'Ballon de foot',
      description: 'Légèrement usé, taille 5',
      type: true, 
      status: 1,
      categorie: 'Sport & Loisirs' 
    },{
      name: 'Ballon de basket',
      description: 'Coupe du monde 2015, excellent état',
      type: false,
      status: 1,
       categorie: 'Sport & Loisirs' 
    },{
      name: 'Livre - Le Seigneur des Anneaux',
      description: 'Trilogie complète, édition de poche',
      type: true,
      status: 1,
       categorie: 'Culture & Livres' 
    },{
      name: 'Veste d\'hiver',
      description: 'Taille M, couleur bleu marine, très chaude',
      type: true,
      status: 1,
       categorie: 'Vêtements' 
    },{
      name: 'Console de jeu (ancienne génération)',
      description: 'Fonctionnelle, vendue sans manettes',
      type: false,
      status: 2, 
       categorie: 'Informatique & Tech'  // Électronique/Tech
    },{
      name: 'Assiettes en porcelaine',
      description: 'Lot de 6 assiettes plates blanches',
      type: true,
      status: 1,
       categorie: 'Maison & Cuisine' 
    },{
      name: 'Tapis de yoga',
      description: 'Neuf, couleur verte, épaisseur 5mm',
      type: true,
      status: 1,
       categorie: 'Sport & Loisirs' 
    },{
      name: 'Ordinateur portable',
      description: 'Écran fissuré, pour pièces uniquement',
      type: false,
      status: 3, 
       categorie: 'Informatique & Tech' 
    },{
      name: 'Jeu de construction pour enfants',
      description: 'Boîte presque complète (quelques pièces manquantes)',
      type: true,
      status: 1,
       categorie: 'Jouets & Enfants' 
    },{
      name: 'Chaussures de randonnée',
      description: 'Taille 42, très bon état',
      type: true,
      status: 1,
       categorie: 'Vêtements' 
    },{
      name: 'Micro-ondes',
      description: 'Fonctionne parfaitement, couleur noire',
      type: false,
      status: 1,
       categorie: 'Électroménager' 
    },{
      name: 'Guitare acoustique',
      description: 'Corde de Mi grave cassée',
      type: true,
      status: 2,
       categorie: 'Musique & Art' 
    },{
      name: 'Lot de stylos et crayons',
      description: 'Matériel de bureau neuf',
      type: true,
      status: 1,
       categorie: 'Bureau & Fournitures' 
    },{
      name: 'Écran PC 24 pouces',
      description: 'Moniteur Full HD, quelques légères rayures',
      type: false,
      status: 1,
       categorie: 'Informatique & Tech' 
    },{
      name: 'AMD EPYC 9965',
      description: 'AMD EPYC 9965 est un processeur serveur haut de gamme...',
      type: true,
      status: 1,
       categorie: 'Informatique & Tech'  // CPU
    },]

    // Le tableau 'objects' contient maintenant 15 items.

    await DonationObject.createMany(objects)
  }
}
