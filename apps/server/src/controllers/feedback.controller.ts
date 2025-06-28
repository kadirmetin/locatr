import { Request, Response } from "express";

import { createFeedbackSchema } from "../common/validators/feedback.validator";
import { HTTPSTATUS } from "../configs/http.config";
import { asyncHandler } from "../middlewares/asyncHandler";
import { FeedbackService } from "../services/feedback.service";

export class FeedbackController {
  private feedbackService: FeedbackService;

  constructor(feedbackService: FeedbackService) {
    this.feedbackService = feedbackService;
  }

  public createFeedback = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const { name, email, feedback } = createFeedbackSchema.parse({
        ...req.body,
      });

      const { id, message } = await this.feedbackService.createFeedback(
        name,
        email,
        feedback,
      );

      return res.status(HTTPSTATUS.OK).json({
        message,
        id,
      });
    },
  );
}
