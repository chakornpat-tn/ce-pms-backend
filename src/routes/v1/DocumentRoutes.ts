import { Elysia } from 'elysia'
import useDocumentController from '@/controllers/v1/DocumentController'

const documentApp = new Elysia()
const documentController = useDocumentController(documentApp)

documentApp.group('/document', app => app
  .use(documentController.CreateDocument)
  .use(documentController.ListDocument)
  .use(documentController.UpdateDocument)
  .use(documentController.DeleteDocument)
)

export default documentApp