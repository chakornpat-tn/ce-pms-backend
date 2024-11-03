import { Storage } from '@google-cloud/storage'
import config from '@/config'

const bucketName = config.GOOGLE_STORAGE_BUCKET_NAME
const projectID = config.GOOGLE_PROJECT_ID
const keyFilename = config.GOOGLE_APPLICATION_CREDENTIALS

// Use default ADC on cloud run when run on prod
const storage = new Storage(
  config.RUN_ENV === 'prod'
    ? undefined
    : {
        projectId: projectID,
        keyFilename: keyFilename,
      }
)
const GCS = {
  UploadFile: async (
    filePath: string,
    destination: string,
    folder: string = 'document'
  ) => {
    try {
      const bucket = storage.bucket(bucketName)
      if (!bucket) throw new Error('Bucket not found')

      if (!['document', 'exam-docs'].includes(folder)) {
        throw new Error('Invalid folder')
      }

      const fileDestination = `${folder}/${destination}`
      const file = bucket.file(fileDestination)

      await bucket.upload(filePath, {
        destination: fileDestination,
        resumable: true,
        gzip: true,
        metadata: {
          cacheControl: 'no-cache',
        },
      })

      await file.makePublic()

      return `https://storage.googleapis.com/${bucketName}/${fileDestination}`
    } catch (error) {
      throw error
    }
  },
  DeleteFile: async (fileUrl: string) => {
    try {
      const bucket = storage.bucket(bucketName)
      const urlParts = fileUrl.split(`${bucketName}/`)
      if (urlParts.length !== 2) throw new Error('Invalid file URL')

      const filePath = urlParts[1]
      const file = bucket.file(filePath)

      await file.delete()

      return true
    } catch (error) {
      throw error
    }
  },
}

export { GCS }
