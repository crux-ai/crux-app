export type FormState =
  | {
    errors?: {
      email?: string[];
      password?: string[];
    };
    message?: string;
  }
  | undefined;

export type SessionPayload = {
  userId: string | number;
  expiresAt: Date;
};
