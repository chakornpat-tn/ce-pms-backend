import Mongoose, { Schema } from 'mongoose'
import { AdvisorRequest } from './User'
import { DeveloperRequest } from './Developer'

const projectStatusSchema: Schema<StatusTypes> = new Schema(
  {
    documentStatus: String,
    projectStatus: String,
  },
  { _id: false }
)

const schema = new Mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      lowercase: true,
    },
    password: String,
    title: String,
    detail: String,
    titleEng: String,
    detailEng: String,
    type: String,
    academicYear: Number,
    semester: { type: Number, enum: [1, 2, 3], default: 1 },
    abstract: String,
    projectNameEng: String,
    abstractEng: String,
    status: projectStatusSchema,
    developers: [{ studentId: String, name: String, _id: false }],
    advisors: [
      {
        advisorId: String,
        name: String,
        _id: false,
      },
    ],
    updateBy: String,
  },
  { timestamps: true }
)

type StatusTypes = IProjectStatus | IPreProjectStatus

type IProjectStatus = {
  documentStatus:
    | 'ใบขอสอบ2.0'
    | 'ใบซ้อมนำเสนอ3.0'
    | 'ใบประเมินคณะกรรมการ4.0'
    | 'ใบส่งชิ้นงาน5.0'
    | 'ส่งปริญญานิพนธ์'
  projectStatus:
    | 'ผ่านการเตรียมโครงงาน'
    | 'ดำเนินการจัดทำโครงงาน'
    | 'อนุญาติสอบ'
    | 'อยู่ระหว่างดำเนินการสอบ'
    | 'ดำเนินการสอบแล้ว'
    | 'แก้ไขเอกสารและชิ้นงาน'
    | 'ผ่านรายวิชาโครงงาน'
    | 'ดำเนินการยื่นเรื่องขอติด i'
    | 'ตรวจเอกสาร'
}
type IPreProjectStatus = {
  documentStatus:
    | ''
    | 'CE02-ฉบับร่าง'
    | 'CE02-ฉบับสมบูรณ์'
    | 'CE03-อนุมัติการขอสอบ'
    | 'CE04-เสร็จสิ้นกระบวนการขอสอบ'
    | 'CE02 ฉบับสมบูรณ์ '

  projectStatus:
    | 'ดำเนินการเตรียมโครงงาน'
    | 'ดำเนินการสอบ'
    | 'ไม่ผ่านการเตรียมโครงงาน'
    | 'ผ่านการเตรียมโครงงาน'
}

export default Mongoose.model('Project', schema)

export interface Projects {
  username: string
  password?: string
  projectName: string
  projectNameEng?: string
  abstract?: string
  abstractEng?: string
  detail?: string
  detailEng?: string
  semester: number
  academicYear: number
  type: string
}

export interface CreateProjectRequest {
  username: string
  password?: string
  projectName: string
  projectNameEng?: string
  abstract?: string
  abstractEnd?: string
  detail?: string
  detailEnd?: string
  semester?: number
  academicYear: number
  type?: string
  projectStatusId?: string
  developers: DeveloperRequest[]
  advisors: AdvisorRequest[]
}
