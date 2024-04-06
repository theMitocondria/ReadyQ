import { Configuration, OpenAIApi } from 'openai';
import User from '../models/User.js';

export const techInterview = async(req, res) => {

    try{
        const config = new Configuration({
            apiKey: process.env.OPENAI_API_KEY
        });

        const openai = new OpenAIApi(config);

        let {level, stack, userId, questionAnswer} = req.body;
        userId = "661060525b132bef648c9cfd"
        
        let usr = await User.findById(userId);

        if(!usr){
            return res.status(401).json({
                message : "unauthorised"
            })
        }

        

        if((usr.techQuestions.length == 0) && (!stack || !level || !userId)){
            return res.status(400).json({
                message:"fields cannot be empty"
            })
        }


        if(usr.techQuestions.length == 11){
            
            let responses = "";
            for(let i = 0 ; i < usr.techQuestions.length ; i++){
                responses +=  ` This was your ${i}th question ` + usr.techQuestions.at(i) + 't which i replied' + usr.techAnswers.at(i) + ", "; 
            }

           responses += "As an interviewer now give me mark out of 100 based on these question ans answers and also provide some feedback in aprox 20 words ans give the marks to the user as low ans accurate as you can and make it realisic by checking length of answer , the marking scheme should be based on length, accuracy and technical knowledge.........-------> the score should always be the last word of your answer "
        
            let response = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{ 
                    role: "user", 
                    content: responses,
                }],
            })

           usr.techAnswers = [];
            usr.techQuestions = [];
           await usr.save();

            return res.status(200).json({
                success : true,
                message : response.data.choices[0].message.content
            })

        }

       
        let sendmessage;
        
        let prevQuestion = "";
        if(usr.techQuestions.length) prevQuestion = usr.techQuestions.at(-1),  usr.techAnswers.push(questionAnswer);
       
        if(usr.techQuestions.length == 0) 
            sendmessage = "hi chatgpt u need to take my interview as a " +  level + " level " + stack + " developer . U need to take my interview for above position and behave as one . Be as acurate and technical as possible and dont repeat questions . If user does not know anything of that topic move to another topic."
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
          usr.techQuestions.push(incommingMessage);
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

