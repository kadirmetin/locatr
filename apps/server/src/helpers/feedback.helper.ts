import { InternalServerException } from "../common/utils/catch-error";
import { config } from "../configs/app.config";
import { sendEmail } from "../mailers/mailer";
import { feedbackTemplate } from "../mailers/templates/feedback.template";

interface Feedback {
  type: "bug" | "feature" | "general";
  subject: string;
  description: string;
}

export const sendFeedbackEmail = async (
  name: string,
  email: string,
  feedback: Feedback,
  brandColor?: string,
  brandName?: string,
) => {
  const adminEmailRecipient = config.ADMIN_EMAIL;

  const { data, error } = await sendEmail({
    to: adminEmailRecipient,
    ...feedbackTemplate(name, email, feedback, brandColor, brandName),
  });

  if (!data?.id) {
    throw new InternalServerException(
      `Failed to send feedback email: ${error?.name || "Unknown Error"} - ${error?.message || "No message provided"}`,
    );
  }

  return {
    message: "Feedback email sent successfully",
    id: data.id,
  };
};
