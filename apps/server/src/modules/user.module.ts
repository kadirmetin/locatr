import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";

const userService = new UserService();
const userController = new UserController(userService);

export { userController, userService };
