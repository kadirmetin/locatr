import { DeviceController } from "../controllers/device.controller";
import { DeviceService } from "../services/device.service";

const deviceService = new DeviceService();
const deviceController = new DeviceController(deviceService);

export { deviceController, deviceService };
