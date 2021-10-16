import { Response, Request } from "express";
import { User } from "../user/user.entity";

export type ContextType = {
  res: Response;
  req: Request;
  user?: User;
};
