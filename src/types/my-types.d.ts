type ranking = {
  id: string
  title: string
  description: string
  source: string
  no1: string
  no2: string
  no3: string
}
type question = {
  id: string
  title: string
  rankings: ranking[]
}
