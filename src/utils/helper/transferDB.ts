import { ProjectCommitteePointRes } from "@/models/Project";
import course from "@/statics/constants/course/course";

interface TransformedStudentProject {
  studentId: string;
  name: string;
  projectName: string;
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
        // projectPoints['กรรมการ'][index] = userObj.user.name;
        projectPoints['กรรมการ'][index] = 0;
      }
    });
    
    project.students.forEach(studentObj => {
      const student = studentObj.student;
      
      const newObj: TransformedStudentProject = {
        studentId: student.studentId,
        name: student.name,
        projectName: projectName,
      };

      if (projectPoints['กรรมการ']) {
        projectPoints['กรรมการ'].forEach((point, index) => {
          newObj[index === 0 ? 'ประธานกรรมการ' : `กรรมการ${index}`] = point;
        });
      }
      
      result.push(newObj);
    });
  });
  
  return result.sort((a, b) => a.studentId.localeCompare(b.studentId));
}
export { TransformDataProjectForExcel }