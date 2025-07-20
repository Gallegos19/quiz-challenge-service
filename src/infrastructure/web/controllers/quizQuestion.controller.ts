import { Request, Response } from "express";
import { container } from "../../config/container";
import { CreateQuizQuestion } from "../../../application/quiz/CreateQuizQuestion";
import { GetQuizQuestions } from "../../../application/quiz/GetQuizQuestions";
import { GetQuestionById } from "../../../application/quiz/GetQuestionById";
import { UpdateQuizQuestion } from "../../../application/quiz/UpdateQuizQuestion";
import { DeleteQuizQuestion } from "../../../application/quiz/DeleteQuizQuestion";
import { AddQuizOption } from "../../../application/quiz/AddQuizOption";
import { UpdateQuizOption } from "../../../application/quiz/UpdateQuizOption";
import { DeleteQuizOption } from "../../../application/quiz/DeleteQuizOption";

/**
 * Create a new quiz question
 */
export const createQuizQuestion = async (req: Request, res: Response) => {
  try {
    const questionData = {
      ...req.body,
      createdBy: req.user?.userId,
    };

    // Validate required fields
    if (!questionData.quizId || !questionData.questionText) {
      return res
        .status(400)
        .json({ message: "Quiz ID and question text are required" });
    }

    const createQuizQuestionUseCase = container.get(CreateQuizQuestion);
    const question = await createQuizQuestionUseCase.execute(questionData);

    return res.status(201).json(question);
  } catch (error: any) {
    console.error("Error creating quiz question:", error);

    if (error.message === "Quiz not found") {
      return res.status(404).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Error creating quiz question",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get questions for a quiz
 */
export const getQuizQuestions = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params;

    if (!quizId) {
      return res.status(400).json({ message: "Quiz ID is required" });
    }

    const getQuizQuestionsUseCase = container.get(GetQuizQuestions);
    const questions = await getQuizQuestionsUseCase.execute(quizId);

    return res.status(200).json(questions);
  } catch (error: any) {
    console.error("Error getting quiz questions:", error);

    if (error.message === "Quiz not found") {
      return res.status(404).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Error retrieving quiz questions",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get a question by ID
 */
export const getQuestionById = async (req: Request, res: Response) => {
  try {
    const { questionId } = req.params;

    if (!questionId) {
      return res.status(400).json({ message: "Question ID is required" });
    }

    const getQuestionByIdUseCase = container.get(GetQuestionById);
    const question = await getQuestionByIdUseCase.execute(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.status(200).json(question);
  } catch (error: any) {
    console.error("Error getting question by ID:", error);
    return res.status(500).json({
      message: "Error retrieving question",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Update a quiz question
 */
export const updateQuizQuestion = async (req: Request, res: Response) => {
  try {
    const { questionId } = req.params;
    const updateData = {
      ...req.body,
      updatedBy: req.user?.userId,
    };

    if (!questionId) {
      return res.status(400).json({ message: "Question ID is required" });
    }

    const updateQuizQuestionUseCase = container.get(UpdateQuizQuestion);
    const question = await updateQuizQuestionUseCase.execute(
      questionId,
      updateData
    );

    return res.status(200).json(question);
  } catch (error: any) {
    console.error("Error updating quiz question:", error);

    if (error.message === "Question not found") {
      return res.status(404).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Error updating quiz question",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Delete a quiz question
 */
export const deleteQuizQuestion = async (req: Request, res: Response) => {
  try {
    const { questionId } = req.params;

    if (!questionId) {
      return res.status(400).json({ message: "Question ID is required" });
    }

    const deleteQuizQuestionUseCase = container.get(DeleteQuizQuestion);
    await deleteQuizQuestionUseCase.execute(questionId);

    return res.status(204).send();
  } catch (error: any) {
    console.error("Error deleting quiz question:", error);

    if (error.message === "Question not found") {
      return res.status(404).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Error deleting quiz question",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Add an option to a question
 */
export const addQuizOption = async (req: Request, res: Response) => {
  try {
    const { questionId } = req.params;
    const optionData = req.body;

    if (!questionId) {
      return res.status(400).json({ message: "Question ID is required" });
    }

    if (!optionData.optionText) {
      return res.status(400).json({ message: "Option text is required" });
    }

    if (typeof optionData.isCorrect !== "boolean") {
      return res.status(400).json({ message: "isCorrect must be a boolean" });
    }

    const addQuizOptionUseCase = container.get(AddQuizOption);
    const option = await addQuizOptionUseCase.execute(questionId, optionData);

    return res.status(201).json(option);
  } catch (error: any) {
    console.error("Error adding quiz option:", error);

    if (error.message === "Question not found") {
      return res.status(404).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Error adding quiz option",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Update a quiz option
 */
export const updateQuizOption = async (req: Request, res: Response) => {
  try {
    const { optionId } = req.params;
    const updateData = req.body;

    if (!optionId) {
      return res.status(400).json({ message: "Option ID is required" });
    }

    const updateQuizOptionUseCase = container.get(UpdateQuizOption);
    const option = await updateQuizOptionUseCase.execute(optionId, updateData);

    return res.status(200).json(option);
  } catch (error: any) {
    console.error("Error updating quiz option:", error);
    return res.status(500).json({
      message: "Error updating quiz option",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Delete a quiz option
 */
export const deleteQuizOption = async (req: Request, res: Response) => {
  try {
    const { optionId } = req.params;

    if (!optionId) {
      return res.status(400).json({ message: "Option ID is required" });
    }

    const deleteQuizOptionUseCase = container.get(DeleteQuizOption);
    await deleteQuizOptionUseCase.execute(optionId);

    return res.status(204).send();
  } catch (error: any) {
    console.error("Error deleting quiz option:", error);
    return res.status(500).json({
      message: "Error deleting quiz option",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
