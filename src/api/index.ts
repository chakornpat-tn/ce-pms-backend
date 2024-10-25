import { Elysia } from 'elysia'
import userRoutes from '@/routes/v1/UserRoutes'
import authRoutes from '@/routes/v1/AuthRoutes'
import projectRoutes from '@/routes/v1/ProjectRoutes'
import documentRoutes from '@/routes/v1/DocumentRoutes'
import projectStatusRoutes from '@/routes/v1/ProjectStatusRoutes'

import * as utils from '@/utils'

const app = new Elysia()
  .get('/', () => utils.SuccessMessage('CE-PMS API', 'Health Check'))
  .group('/v1', app => 
    app.use(userRoutes)
       .use(authRoutes)
       .use(projectRoutes)
       .use(documentRoutes)
       .use(projectStatusRoutes)
  )

export default app