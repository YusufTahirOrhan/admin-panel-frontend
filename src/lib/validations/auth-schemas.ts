import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "E-posta adresi zorunludur." })
    .email({ message: "Geçerli bir e-posta adresi giriniz." }),
  password: z
    .string()
    .min(1, { message: "Şifre zorunludur." })
    .min(6, { message: "Şifre en az 6 karakter olmalıdır." }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
