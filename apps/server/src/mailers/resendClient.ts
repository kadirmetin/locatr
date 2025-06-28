import { Resend } from "resend";

import { config } from "../configs/app.config";

export const resend = new Resend(config.RESEND.API_KEY);
