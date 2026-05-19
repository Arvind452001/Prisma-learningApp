import { Request, Response } from "express";
import prisma from "../prisma/studentPrisma";

export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany();
    res.status(200).json({students:students, message:"student find successfully"});
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

export const getStudentById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    console.log(id)
    const student = await prisma.student.findUnique({
      where: { id: Number(id) },
    });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch student" });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { name, email, age, course } = req.body;
    const student = await prisma.student.create({
      data: { name, email, age, course },
    });
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: "Failed to create student" });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, age, course } = req.body;
    const student = await prisma.student.update({
      where: { id: Number(id) },
      data: { name, email, age, course },
    });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: "Failed to update student" });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.student.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete student" });
  }
};