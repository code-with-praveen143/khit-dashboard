export type UserRole = 'admin' | 'accountant'

export interface User {
  _id?: string
  serialNo: string
  staffCode: string
  name: string
  email: string
  type: UserRole
}

