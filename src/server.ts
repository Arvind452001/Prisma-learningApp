import express from "express";
import studentRoutes from "./routes/student.routes";
import bookRoutes from "./routes/book.routes";
import issueRoutes from "./routes/issue.routes";
import prisma from "./prisma/studentPrisma";
import { errorMiddleware } from "./middlewares/errorMiddleware";

const app = express();

app.use(express.json());

app.use("/api/students", studentRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/issues", issueRoutes);


app.use(errorMiddleware);

const PORT = process.env.PORT || "5000";

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log("❌ Database connection failed");
    console.error(error);
  }
};

startServer();