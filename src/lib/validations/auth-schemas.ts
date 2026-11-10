import { z } from "zod";

export const loginSchema = z.object({
  // The server accepts a username or an e-mail address here; the field keeps its old name
  // so the auth endpoint contract does not change.
  email: z
    .string()
    .trim()
    .min(1, { message: "E-posta adresinizi veya kullanıcı adınızı girin." }),
  // Length rules belong to account creation; at login any wrong password gets the same answer.
  password: z.string().min(1, { message: "Şifrenizi girin." }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
