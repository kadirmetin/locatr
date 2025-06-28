import { MfaController } from "../controllers/mfa.controller";
import { MfaService } from "../services/mfa.service";

const mfaService = new MfaService();
const mfaController = new MfaController(mfaService);

export { mfaController, mfaService };
