import { Request, Response } from "express";
import prisma from "../prisma/studentPrisma";

//===================createBook========================//
export const createBook = async (
  req: Request,
  res: Response
) => {
  try {
    const { title, author, quantity } = req.body;

    const book = await prisma.book.create({
      data: {
        title,
        author,
        quantity,
      },
    });

    res.status(201).json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//===================getBooks========================//
export const getBooks = async (
  req: Request,
  res: Response
) => {
  try {
    const books = await prisma.book.findMany();

    res.json(books);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching books",
    });
  }
};