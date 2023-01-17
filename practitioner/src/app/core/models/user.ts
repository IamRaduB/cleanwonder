export enum UserRoles {
  PRACTITIONER = 'PRACTITIONER',
  PATIENT = 'PATIENT'
}

export enum EmailStates {
  PENDING = 1,
  VALID = 2,
  COMPLETED = 3
}

export interface User {
  id: number
  email: string
  role: UserRoles
  emailState: EmailStates
}
