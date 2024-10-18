import express from 'express'
import useDocumentController from '@/controllers/v1/DocumentController'

const router = express.Router()
const DocumentController = useDocumentController()

router.get('', DocumentController.ListDocument)
router.put('', DocumentController.UpdateDocument)
router.post('', DocumentController.CreateDocument)
router.delete('/:id', DocumentController.DeleteDocument)

export = router
