export default interface IAgeCategory {
  name: string
  min?: number
  max?: number
}

export interface IAgeCategoryListView {
  ageCategories: IAgeCategory[]
}

export interface IAgeCategoryReadView {
  ageCategory: {
    name: string | null
    min: number | null
    max: number | null
  }
}
