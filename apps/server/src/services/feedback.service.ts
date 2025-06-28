import { NotFoundException } from "../common/utils/catch-error";
import UserModel from "../database/models/user.model";
import { sendFeedbackEmail } from "../helpers/feedback.helper";

export class FeedbackService {
  public async createFeedback(
    name: string,
    email: string,
    feedback: {
      type: "bug" | "feature" | "general";
      subject: string;
      description: string;
    },
  ) {
    const user = await UserModel.findOne({ email });
    if (!user) throw new NotFoundException("User not found");

    const { id, message } = await sendFeedbackEmail(name, email, feedback);

    return {
      id,
      message,
    };
  }
}
