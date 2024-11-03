const userRoles = {
  ProjectTeacher: 1, // อาจารย์ประจำวิชา pro
  preProjectTeacher: 2, // อาจารย์ประจำวิชา pre pro
  Teacher: 3, // อาจารย์ธรรมดา
  Student: 4, // นักศึกษา project(ตัวแทนกลุ่ม) ไม่เก็บใน user table
}

export default userRoles
