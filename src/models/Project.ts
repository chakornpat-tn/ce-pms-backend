import Mongoose from 'mongoose'

const schema = new Mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      lowercase: true,
    },
    password: String,
    projectName: String,
    academicYear: Number,
    abstract: String,
    projectNameEng: String,
    abstractEng: String,
    status: { documentStatus: String, projectStatus: String },
    developers: [{ studentId: String, studentName: String }],
    advisors: [
      {
        advisorId: String,
        name: String,
      },
    ],
    updateBy: String,
  },
  { timestamps: true }
)
