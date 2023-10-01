import Figurine from '@models/figurine'
import { type IFigurineListView } from '@models/figurine/types'
import { type Request } from 'express'
import expressAsyncHandler from 'express-async-handler'
import type ViewResponse from 'types/ViewResponse'

const getAllItems = expressAsyncHandler(
  async (req: Request, res: ViewResponse<IFigurineListView>) => {
    const figurines = await Figurine.find({})
      .populate<{ age: { name: string } }>('age')
      .populate<{ category: { name: string } }>('category')
      .exec()

    res.render('figurine_list', {
      title: 'All figurines',
      items: figurines.map((fig) => {
        return {
          name: fig.name,
          age: fig.age.name,
          price: fig.price,
          category: fig.category.name,
          imageUrl: fig.imageUrl
        }
      })
    })
  }
)

export { getAllItems }
