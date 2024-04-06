import express from 'express';
import {githubInterview} from '../controllers/githubInterview.js'

import {techInterview} from '../controllers/techInterview.js'
const Interview = express.Router();

Interview.post("/github", githubInterview);
Interview.post("/tech", techInterview);

export default Interview;