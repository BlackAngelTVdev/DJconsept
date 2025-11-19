// #validators/donation_object.ts

import vine from '@vinejs/vine'

export const updateDonationObjectValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(255),
    description: vine.string().trim().minLength(10),
    // Ajoutez d'autres champs si nécessaire
  })
)