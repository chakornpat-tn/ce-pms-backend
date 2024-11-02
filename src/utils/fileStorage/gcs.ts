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
const GCS = () => {
  const UploadFile = async (filePath: string, destination: string) => {
    try {
      const bucket = storage.bucket(bucketName)

      const documentDestination = `document/${destination}`
      const file = bucket.file(documentDestination)

      await bucket.upload(filePath, {
        destination: documentDestination,
        resumable: true,
        gzip: true,
        metadata: {
          cacheControl: 'no-cache',
        },
      })

      await file.makePublic()

      return `https://storage.googleapis.com/${bucketName}/${documentDestination}`
    } catch (error) {
      throw error
    }
  }

  const DeleteFile = async (fileUrl: string) => {
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
  }

  return {
    UploadFile,
    DeleteFile,
  }
}

export { GCS }
