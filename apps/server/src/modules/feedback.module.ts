import { FeedbackController } from "../controllers/feedback.controller";
import { FeedbackService } from "../services/feedback.service";

const feedbackService = new FeedbackService();
const feedbackController = new FeedbackController(feedbackService);

export { feedbackController, feedbackService };
