import { z } from 'zod'

export const checkoutSchema = z.object({
  email: z.string()
    .min(1, { message: 'checkout.emailRequired' })
    .email({ message: 'checkout.invalidEmail' }),
  name: z.string()
    .min(1, { message: 'checkout.nameRequired' })
    .min(3, { message: 'checkout.nameTooShort' }),
  address: z.string()
    .min(1, { message: 'checkout.addressRequired' })
    .min(10, { message: 'checkout.addressTooShort' }),
  city: z.string()
    .min(1, { message: 'checkout.cityRequired' }),
  postalCode: z.string()
    .min(1, { message: 'checkout.postalCodeRequired' })
    .regex(/^\d{4,10}$/, { message: 'checkout.invalidPostalCode' }),
  country: z.string()
    .min(1, { message: 'checkout.countryRequired' }),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
