export interface Department {
  id: number
  name: string
  description: string
  leaderName: string
  icon: string
}

export interface ClubInfo {
  name: string
  description: string
  foundedYear: number
  memberCount: number
  address: string
  contactEmail: string
  contactPhone: string
}

export interface ClubCulture {
  title: string
  description: string
  icon: string
}
