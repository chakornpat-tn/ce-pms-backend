import { ProjectCommitteePointRes } from "@/models/Project";
import course from "@/statics/constants/course/course";

interface TransformedStudentProject {
  projectName: string;
  studentId: string;
  name: string;
  [key:string] : string | number | null;
}

function TransformDataProjectForExcel(projects: ProjectCommitteePointRes[], courseSelect:number): TransformedStudentProject[] {
  const result: TransformedStudentProject[] = [];
  
  projects.forEach(project => {
    const projectName = project.projectName;
    
    const projectPoints: { [key: string]: (string | number | null)[] } = {
      committeePoint: []
    };
    
    project.users.forEach((userObj, index) => {
      const pointValue = courseSelect === course.Project ? userObj.projectPoint : userObj.prepPoint;
      
      if (pointValue !== null && pointValue !== undefined) {
        if (!projectPoints['กรรมการ']) {
          projectPoints['กรรมการ'] = [];
        }
        projectPoints['กรรมการ'][index] = pointValue;
      } else {
        if (!projectPoints['กรรมการ']) {
          projectPoints['กรรมการ'] = [];
        }
        projectPoints['กรรมการ'][index] = userObj.user.name;
      }
    });
    
    project.students.forEach(studentObj => {
      const student = studentObj.student;
      
      const newObj: TransformedStudentProject = {
        projectName: projectName,
        studentId: student.studentId,
        name: student.name,
      };

      if (projectPoints['กรรมการ']) {
        projectPoints['กรรมการ'].forEach((point, index) => {
          newObj[`กรรมการ${index + 1}`] = point;
        });
      }
      
      result.push(newObj);
    });
  });
  
  return result.sort((a, b) => a.studentId.localeCompare(b.studentId));
}

export { TransformDataProjectForExcel }