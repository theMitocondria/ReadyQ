import express from 'express';
import {githubInterview} from './controllers/githubInterview.js'
const GithubInterview = express.Router();

GithubInterview.post("/github", githubInterview);

export default GithubInterview;