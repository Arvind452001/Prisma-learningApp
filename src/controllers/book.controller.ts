import { Request, Response } from "express";
import prisma from "../prisma/studentPrisma";

// ================= CREATE BOOK =================
export const createBook = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { title, author, quantity } = req.body;

    // Validation
    if (!title || !author || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message:
          "Title, author and quantity are required",
      });
    }

    if (Number(quantity) < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity can not be negative",
      });
    }

    // Check existing book
    const existingBook = await prisma.book.findFirst({
      where: {
        title,
        author,
      },
    });

    if (existingBook) {
      return res.status(409).json({
        success: false,
        message: "Book already exists",
      });
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        quantity: Number(quantity),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    console.error("Create Book Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create book",
      error:
        error instanceof Error
          ? error.message
          : "Internal Server Error",
    });
  }
};

// ================= GET ALL BOOKS =================
export const getBooks = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const books = await prisma.book.findMany();

    return res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.error("Get Books Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch books",
      error:
        error instanceof Error
          ? error.message
          : "Internal Server Error",
    });
  }
};

// ================= GET BOOK BY ID =================
export const getBookById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const book = await prisma.book.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book fetched successfully",
      data: book,
    });
  } catch (error) {
    console.error("Get Book Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch book",
      error:
        error instanceof Error
          ? error.message
          : "Internal Server Error",
    });
  }
};

// ================= UPDATE BOOK =================
export const updateBook = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    const { title, author, quantity } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    // Check book exists
    const existingBook = await prisma.book.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const updatedBook = await prisma.book.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        author,
        quantity:
          quantity !== undefined
            ? Number(quantity)
            : undefined,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    console.error("Update Book Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update book",
      error:
        error instanceof Error
          ? error.message
          : "Internal Server Error",
    });
  }
};

// ================= DELETE BOOK =================
export const deleteBook = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const existingBook = await prisma.book.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    await prisma.book.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("Delete Book Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete book",
      error:
        error instanceof Error
          ? error.message
          : "Internal Server Error",
    });
  }
};