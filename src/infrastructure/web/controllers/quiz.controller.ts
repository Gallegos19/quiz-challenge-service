import { Request, Response } from "express";
import { container } from "../../config/container";
import { GetQuizzesByTopic } from "../../../application/quiz/GetQuizzesByTopic";
import { GetQuizById } from "../../../application/quiz/GetQuizById";
import { CreateQuiz } from "../../../application/quiz/CreateQuiz";
import { UpdateQuiz } from "../../../application/quiz/UpdateQuiz";
import { DeleteQuiz } from "../../../application/quiz/DeleteQuiz";
import { PublishQuiz } from "../../../application/quiz/PublishQuiz";
import { UnpublishQuiz } from "../../../application/quiz/UnpublishQuiz";
import { CreateQuizDto } from "../../../domain/dto/CreateQuizDto";

/**
 * Get quizzes by topic
 */
export const getQuizzesByTopic = async (req: Request, res: Response) => {
  try {
    const { topicId } = req.params;

    if (!topicId) {
      return res.status(400).json({ message: "Topic ID is required" });
    }

    const getQuizzesByTopicUseCase = container.get(GetQuizzesByTopic);
    const quizzes = await getQuizzesByTopicUseCase.execute(topicId);

    return res.status(200).json(quizzes);
  } catch (error: any) {
    console.error("Error getting quizzes by topic:", error);
    return res.status(500).json({
      message: "Error retrieving quizzes",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get quiz by ID
 */
export const getQuizById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Quiz ID is required" });
    }

    const getQuizByIdUseCase = container.get(GetQuizById);
    const quiz = await getQuizByIdUseCase.execute(id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    return res.status(200).json(quiz);
  } catch (error: any) {
    console.error("Error getting quiz by ID:", error);
    return res.status(500).json({
      message: "Error retrieving quiz",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Create a new quiz
 */
export const createQuiz = async (req: Request, res: Response) => {
  try {
    const quizData: CreateQuizDto = {
      ...req.body,
      createdBy: req.user?.userId,
    };

    // Validate required fields
    if (!quizData.title || !quizData.topicId) {
      return res
        .status(400)
        .json({ message: "Title and topicId are required" });
    }

    const createQuizUseCase = container.get(CreateQuiz);
    const quiz = await createQuizUseCase.execute(quizData);

    return res.status(201).json(quiz);
  } catch (error: any) {
    console.error("Error creating quiz:", error);
    return res.status(500).json({
      message: "Error creating quiz",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Update a quiz
 */
export const updateQuiz = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ message: "Quiz ID is required" });
    }

    // Check if quiz exists
    const getQuizByIdUseCase = container.get(GetQuizById);
    const existingQuiz = await getQuizByIdUseCase.execute(id);

    if (!existingQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const updateQuizUseCase = container.get(UpdateQuiz);
    const updatedQuiz = await updateQuizUseCase.execute(
      id,
      updateData,
      req.user?.userId
    );

    return res.status(200).json(updatedQuiz);
  } catch (error: any) {
    console.error("Error updating quiz:", error);
    return res.status(500).json({
      message: "Error updating quiz",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Delete a quiz
 */
export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Quiz ID is required" });
    }

    // Check if quiz exists
    const getQuizByIdUseCase = container.get(GetQuizById);
    const existingQuiz = await getQuizByIdUseCase.execute(id);

    if (!existingQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const deleteQuizUseCase = container.get(DeleteQuiz);
    await deleteQuizUseCase.execute(id);

    return res.status(204).send();
  } catch (error: any) {
    console.error("Error deleting quiz:", error);
    return res.status(500).json({
      message: "Error deleting quiz",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Publish a quiz
 */
export const publishQuiz = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Quiz ID is required" });
    }

    // Check if quiz exists
    const getQuizByIdUseCase = container.get(GetQuizById);
    const existingQuiz = await getQuizByIdUseCase.execute(id);

    if (!existingQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const publishQuizUseCase = container.get(PublishQuiz);
    const publishedQuiz = await publishQuizUseCase.execute(id);

    return res.status(200).json(publishedQuiz);
  } catch (error: any) {
    console.error("Error publishing quiz:", error);
    return res.status(500).json({
      message: "Error publishing quiz",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Unpublish a quiz
 */
export const unpublishQuiz = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Quiz ID is required" });
    }

    // Check if quiz exists
    const getQuizByIdUseCase = container.get(GetQuizById);
    const existingQuiz = await getQuizByIdUseCase.execute(id);

    if (!existingQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const unpublishQuizUseCase = container.get(UnpublishQuiz);
    const unpublishedQuiz = await unpublishQuizUseCase.execute(id);

    return res.status(200).json(unpublishedQuiz);
  } catch (error: any) {
    console.error("Error unpublishing quiz:", error);
    return res.status(500).json({
      message: "Error unpublishing quiz",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
