import { Elysia, t } from 'elysia'
import useDocumentController from '@/controllers/v1/DocumentController'

const documentRoutes = new Elysia({ prefix: '/document' })
const documentController = useDocumentController()

documentRoutes
  .get('/', documentController.ListDocument)
  .put('/', documentController.UpdateDocument)
  .post('/', documentController.CreateDocument)
  .delete('/:id', documentController.DeleteDocument)

export default documentRoutes