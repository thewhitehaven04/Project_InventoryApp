import { type UploadImageRequestBody } from '@models/requests/body/types'
import { type Request } from 'express'
import multer from 'multer'
import { join } from 'path'

const ImageStorage = multer.diskStorage({
  destination: join(__dirname, './../../resources/images'),
  filename: function (
    req: Request<any, any, UploadImageRequestBody, any>,
    file,
    cb
  ) {
    const filenameSplit = file.originalname.split('.')
    const filename =
      filenameSplit[0] + '_' + Date.now() + '.' + filenameSplit[1]
    req.body.imageUrl = filename
    cb(null, filename)
  }
})

const uploadImage = multer({
  storage: ImageStorage
})
export { uploadImage }
