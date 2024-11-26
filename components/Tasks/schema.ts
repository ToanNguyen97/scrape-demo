import { z } from "zod"

export const taskSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must include an alphabetic character, a minimum of 8 characters, a lowercase character, an uppercase character, and a special character'),
  url: z.string().url(),
  resume_url: z.instanceof(File).optional(),
  cover_letter: z.string().optional(),
})

export type TaskFormValues = z.infer<typeof taskSchema>