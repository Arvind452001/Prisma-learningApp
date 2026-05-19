import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//=====================issueBook=====================//
export const issueBook = async (
  req: Request,
  res: Response
) => {
  try {
    const { studentId, bookId } = req.body;

    // check student exists
    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // check book exists
    const book = await prisma.book.findUnique({
      where: {
        id: bookId,
      },
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // issue book
    const issue = await prisma.issue.create({
      data: {
        studentId,
        bookId,
      },
    });

    res.status(201).json({
      success: true,
      data: issue,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};


//=====================getStudentsWithBooks=====================//
export const getStudentsWithBooks = async (
  req: Request,
  res: Response
) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        issues: {
          include: {
            book: true,
          },
        },
      },
    });

    res.json(students);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

//=====================returnBook=====================//
export const returnBook = async (
  req: Request,
  res: Response
) => {
  try {
    const { issueId } = req.body;

    // find issue
    const issue = await prisma.issue.findUnique({
      where: {
        id: issueId,
      },
    });

    if (!issue) {
      return res.status(404).json({
        message: "Issue record not found",
      });
    }

    // already returned
    if (issue.isReturned) {
      return res.status(400).json({
        message: "Book already returned",
      });
    }

    // update issue
    const updatedIssue = await prisma.issue.update({
      where: {
        id: issueId,
      },
      data: {
        isReturned: true,
        returnDate: new Date(),
      },
    });

    res.json({
      success: true,
      data: updatedIssue,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};


//=====================returnBook=====================//
export const pendingBooks = async (
  req: Request,
  res: Response
) => {

  try {

    const data = await prisma.issue.findMany({
      where: {
        isReturned: false,
      },
      include: {
        student: true,
        book: true,
      },
    });

    res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error,
    });

  }
};