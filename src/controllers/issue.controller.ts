import { Request, Response } from "express";
import prisma from "../prisma/studentPrisma";

// ===================== ISSUE BOOK ===================== //
export const issueBook = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { studentId, bookId } = req.body;

    // Validation
    if (!studentId || !bookId) {
      return res.status(400).json({
        success: false,
        message: "Student ID and Book ID are required",
      });
    }

    // Check student exists
    const student = await prisma.student.findUnique({
      where: {
        id: Number(studentId),
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check book exists
    const book = await prisma.book.findUnique({
      where: {
        id: Number(bookId),
      },
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Check quantity
    if (book.quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Book is out of stock",
      });
    }

    // Check already issued and not returned
    const alreadyIssued = await prisma.issue.findFirst({
      where: {
        studentId: Number(studentId),
        bookId: Number(bookId),
        isReturned: false,
      },
    });

    if (alreadyIssued) {
      return res.status(409).json({
        success: false,
        message: "Book already issued to this student",
      });
    }

    // Create issue + decrease quantity
    const issue = await prisma.issue.create({
      data: {
        studentId: Number(studentId),
        bookId: Number(bookId),
      },
    });

    await prisma.book.update({
      where: {
        id: Number(bookId),
      },
      data: {
        quantity: {
          decrement: 1,
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Book issued successfully",
      data: issue,
    });
  } catch (error) {
    console.error("Issue Book Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to issue book",
      error:
        error instanceof Error
          ? error.message
          : "Internal Server Error",
    });
  }
};

// ===================== GET STUDENTS WITH BOOKS ===================== //
export const getStudentsWithBooks = async (
  req: Request,
  res: Response
): Promise<any> => {
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

    return res.status(200).json({
      success: true,
      message: "Students with books fetched successfully",
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error(
      "Get Students With Books Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch students data",
      error:
        error instanceof Error
          ? error.message
          : "Internal Server Error",
    });
  }
};

// ===================== RETURN BOOK ===================== //
export const returnBook = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { issueId } = req.body;

    // Validation
    if (!issueId) {
      return res.status(400).json({
        success: false,
        message: "Issue ID is required",
      });
    }

    // Find issue
    const issue = await prisma.issue.findUnique({
      where: {
        id: Number(issueId),
      },
      include: {
        book: true,
      },
    });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue record not found",
      });
    }

    // Already returned
    if (issue.isReturned) {
      return res.status(400).json({
        success: false,
        message: "Book already returned",
      });
    }

    // Update issue
    const updatedIssue = await prisma.issue.update({
      where: {
        id: Number(issueId),
      },
      data: {
        isReturned: true,
        returnDate: new Date(),
      },
    });

    // Increase quantity
    await prisma.book.update({
      where: {
        id: issue.bookId,
      },
      data: {
        quantity: {
          increment: 1,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Book returned successfully",
      data: updatedIssue,
    });
  } catch (error) {
    console.error("Return Book Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to return book",
      error:
        error instanceof Error
          ? error.message
          : "Internal Server Error",
    });
  }
};

// ===================== PENDING BOOKS ===================== //
export const pendingBooks = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const data = await prisma.issue.findMany({
      where: {
        isReturned: false,
      },
      include: {
        student: true,
        book: true,
      }
     });

    return res.status(200).json({
      success: true,
      message: "Pending books fetched successfully",
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Pending Books Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending books",
      error:
        error instanceof Error
          ? error.message
          : "Internal Server Error",
    });
  }
};