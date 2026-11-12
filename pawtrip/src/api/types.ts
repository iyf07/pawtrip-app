import type { Database } from '@/lib/database.types';

type T = Database['public']['Tables'];

export type Profile = T['profiles']['Row'];
export type Dog = T['dogs']['Row'];
export type DogInsert = T['dogs']['Insert'];
export type Trip = T['trips']['Row'];
export type TripInsert = T['trips']['Insert'];

/** Raised by the database / RPCs with a stable code in `message`. */
export const isCode = (e: unknown, code: string) => e instanceof Error && e.message.includes(code);
