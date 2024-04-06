import { Configuration, OpenAIApi } from 'openai';
import User from '../models/User.js';

export const githubInterview = async(req, res) => {

    try{
        const config = new Configuration({
            apiKey: process.env.OPENAI_API_KEY
        });

        const openai = new OpenAIApi(config);
        let {githubUsername, githubRepo, userId, questionAnswer} = req.body;
        userId = "661060525b132bef648c9cfd"
        
        console.log(githubRepo, githubUsername, questionAnswer);

        let usr = await User.findById(userId);

        if(!usr){
            return res.status(401).json({
                message : "unauthorised"
            })
        }

        if(githubUsername && githubRepo){
            usr.allContests.push(0);
            usr.githubAnswers = [];
            usr.githubQuestions = [];
            await usr.save();

        }

        if((usr.githubQuestions.length == 0) && (!githubUsername || !githubRepo || !userId)){
            return res.status(400).json({
                message:"fields cannot be empty"
            })
        }


        if(usr.githubQuestions.length == 11){
            
            let responses = "";
            for(let i = 0 ; i < usr.githubQuestions.length ; i++){

                responses +=  ` This was your ${i}th question ` + usr.githubQuestions.at(i) + 't which i replied' + usr.githubAnswers.at(i) + ", "; 

            }

           responses += "As an interviewer now give me mark out of 100 based on these question ans answers and also provide some feedback in aprox 20 words ans give the marks to the user as low ans accurate as you can and make it realisic by checking length of answer , the marking scheme should be based on length, accuracy and technical knowledge.........-------> the score should always be the last word of your answer "
        
            let response = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{ 
                    role: "user", 
                    content: responses,
                }],
            })

           usr.githubAnswers = [];
            usr.githubQuestions = [];
           await usr.save();

            return res.status(200).json({
                success : true,
                message : response.data.choices[0].message.content
                // response
            })

        }

        let url = "https://github.com/" + githubUsername + "/" + githubRepo;
        let sendmessage;
        
        let prevQuestion = "";
        if(usr.githubQuestions.length) prevQuestion = usr.githubQuestions.at(-1),  usr.githubAnswers.push(questionAnswer);
       
        if(usr.githubQuestions.length == 0) 
            sendmessage = "hi chatgpt it this my github repo link : " +  url + " , and  you are my interview ask me question from it, and act like my interview, you will give me a question then i will answer it and so on, if I type 'STOP'  then stop taking my interview "
        else
            sendmessage = `the response for ${prevQuestion} is ${questionAnswer} , now as an Interviwer ask me next question {prefferred to be technical more} no matter the answer is provide is right or  wrong.`
       

        
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ 
                role: "user", 
                content: sendmessage,
            }],
          })

      
          const incommingMessage = response.data.choices[0].message.content;
          usr.githubQuestions.push(incommingMessage);
          await usr.save();
          res.status(200).json({
            success: true,
            message: incommingMessage,
          })


    }catch(e){

        res.status(500).json({
            success: false,
            message: e.message,
           })
        }

}

