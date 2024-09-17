import { Router } from "express";
import { testing } from "../controller/test.js";

const test = Router()

test.get("/test",testing)

export default test

