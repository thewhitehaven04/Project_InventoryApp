import { type UploadImageRequestBody } from '@models/requests/body/types'
import { type Request } from 'express'
import multer from 'multer'
import { join } from 'path'

const figurineImageStorage = multer.diskStorage({
  destination: join(__dirname, './../../resources/images'),
  filename: (req: Request<any, any, UploadImageRequestBody, any>, file, cb) => {
    const filenameSplit = file.originalname.split('.')
    const filename =
      filenameSplit[0] + '_' + Date.now() + '.' + filenameSplit[1]
    req.body.imageUrl = '/resources/images/' + filename
    cb(null, filename)
  }
})

const uploadImage = multer({
  storage: figurineImageStorage
})
export { uploadImage }
