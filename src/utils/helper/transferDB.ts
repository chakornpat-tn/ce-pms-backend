import { ProjectCommitteePointRes } from "@/models/Project";
import course from "@/statics/constants/course/course";

interface TransformedStudentProject {
  projectName: string;
  studentId: string;
  name: string;
  committeePoint: (string | number | null)[]; 
}

function TransformDataProjectForExcel(projects: ProjectCommitteePointRes[], courseSelect:number): TransformedStudentProject[] {
  const result: TransformedStudentProject[] = [];
  
  projects.forEach(project => {
    const projectName = project.projectName;
    
    const projectPoints: { committeePoint: (string | number | null)[] } = {
      committeePoint: []
    };
    
    project.users.forEach((userObj, index) => {
      const pointValue = courseSelect === course.Project ? userObj.projectPoint : userObj.prepPoint;
      
      if (pointValue !== null && pointValue !== undefined) {
        projectPoints.committeePoint[index] = pointValue;
      } else {
        projectPoints.committeePoint[index] = userObj.user.name;
      }
    });
    
    project.students.forEach(studentObj => {
      const student = studentObj.student;
      
      const newObj: TransformedStudentProject = {
        projectName: projectName,
        studentId: student.studentId,
        name: student.name,
        committeePoint: projectPoints.committeePoint
      };
      
      result.push(newObj);
    });
  });
  
  return result.sort((a, b) => a.studentId.localeCompare(b.studentId));
}

export { TransformDataProjectForExcel }