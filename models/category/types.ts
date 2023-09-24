export default interface ICategory {
  name: string
  description: string
  url?: string
}
export interface ICategoryListView {
  categories: ICategory[]
}

export interface ICategoryView {
  category: ICategory
}
