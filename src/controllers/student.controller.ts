import { Request, Response } from "express";
import prisma from "../prisma/studentPrisma";

// ================= GET ALL STUDENTS =================
export const getStudents = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const students = await prisma.student.findMany();

    return res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error("Get Students Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      error:
        error instanceof Error
          ? error.message
          : "Internal Server Error",
    });
  }
};

// ================= GET STUDENT BY ID =================
export const getStudentById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const student = await prisma.student.findUnique({
      where: { id: Number(id) },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student fetched successfully",
      data: student,
    });
  } catch (error) {
    console.error("Get Student Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch student",
      error:
        error instanceof Error
          ? error.message
          : "Internal Server Error",
    });
  }
};

// ================= CREATE STUDENT =================
export const createStudent = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { name, email, age, course } = req.body;

    // Validation
    if (!name || !email || !age || !course) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, age and course are required",
      });
    }

    // Check existing email
    const existingStudent = await prisma.student.findUnique({
      where: { email },
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const student = await prisma.student.create({
      data: {
        name,
        email,
        age: Number(age),
        course,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    console.error("Create Student Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create student",
      error:
        error instanceof Error
          ? error.message
          : "Internal Server Error",
    });
  }
};

// ================= UPDATE STUDENT =================
export const updateStudent = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    const { name, email, age, course } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    // Check student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id: Number(id) },
    });

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const updatedStudent = await prisma.student.update({
      where: { id: Number(id) },
      data: {
        name,
        email,
        age: age ? Number(age) : undefined,
        course,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    console.error("Update Student Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update student",
      error:
        error instanceof Error
          ? error.message
          : "Internal Server Error",
    });
  }
};

// ================= DELETE STUDENT =================
export const deleteStudent = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to delete student",
    });
  } catch (error) {
    console.error("Delete Student Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete student",
      error:
        error instanceof Error
          ? error.message
          : "Internal Server Error",
    });
  }
};

// export const deleteStudent = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     await prisma.student.delete({
//       where: { id: Number(id) },
//     });
//     res.status(204).send();
//   } catch (error) {
//     res.status(500).json({ error: "Failed to delete student" });
//   }
// };



