import type { User, Session } from 'lucia'

export const useUser = () => useState<User | null>('user', () => null)
export const useUserSession = () =>
  useState<Session | null>('session', () => null)
