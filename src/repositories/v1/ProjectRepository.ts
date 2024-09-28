import Project,{Projects} from '../../models/Project'

export interface ListProjectsFilter {
  academicYear?: number
  semester?: number
  title?: string
  status?: {
    documentStatus?: string
    projectStatus?: string
  }
}

export const CreateProject = async (projectData: any) => {
  const project = new Project({
    ...projectData,
  })

  return await project.save()
}

// export const ListProjects = async (filter: ListProjectsFilter = {}) => {
//   const projects = await Project.find(filter)
//     .select('-username -password')
//     .exec()
//   return projects
// }

const useProjectRepository = async () => {
  const CreateProject = async (projectData: Projects) => {
    
  }

  const UpdateProject = async (projectData: Projects) => {
    
  }


  
  return {}
}