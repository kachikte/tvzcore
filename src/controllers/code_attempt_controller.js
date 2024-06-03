const CodeAttempt = require('../models/CodeAttempt')
const axios = require('axios');
const constants = require('../utils/constants');
const ResponseDto = require('../dto/response_dto')
const sanitizeHtml = require('sanitize-html');


const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com/submissions';
const RAPIDAPI_KEY = 'd7cd3168c1msh2745150b4938343p19458djsn7f75d6b80d60'; 

const runJudge = async (code) => {
    try {
      const response = await axios.post(JUDGE0_API_URL, {
        source_code: code,
        language_id: 63, // Example for JavaScript
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
          'x-rapidapi-key': RAPIDAPI_KEY,
        },
      });
  
      const { token } = response.data;
      const result = await axios.get(`${JUDGE0_API_URL}/${token}`, {
        headers: {
          'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
          'x-rapidapi-key': RAPIDAPI_KEY,
        },
      });

      console.log('this is the raw submission data -- ', result.data);

  
      return {
        coutput: result.data.compile_output,
        output: result.data.stdout || result.data.stderr,
        result: result.data.status.description,
      };
    } catch (error) {
      return {
        output: error.message,
        result: 'Error',
      };
    }
  };




exports.runCode = async (req, res) => {
    const { code } = req.body;
    try {

    const { output, result, coutput } = await runJudge(code);

        res.status(constants.SUCCESSCODE).json({ output, result, coutput });
    } catch (err) {
        res.status(constants.SERVERERRORCODE).json({ error: err.message });
    }
}

exports.submitCode = async (req, res) => {

    const { code, problemId, email } = req.body;
    try {


        const { output, result, coutput } = await runJudge(code);

        await CodeAttempt.create({ code: code, output: output, result: result ? 'Success' : 'Fail', problemId: problemId, userEmail: email, coutput: coutput });
        res.status(constants.SUCCESSCODE).json({ message: 'Code submitted successfully!' });
    } catch (err) {


        res.status(constants.SERVERERRORCODE).json({ error: err.message });
    }
};


exports.getProlems = async (req, res) => {
    try {
      const problems = await Problem.findAll();
      res.status(constants.SUCCESSCODE).json(problems);
    } catch (err) {
      res.status(constants.SERVERERRORCODE).json({ error: err.message });
    }
  }
  
exports.addProblem = async (req, res) => {
    const { title, description, platform } = req.body;
  
    try {
      const problem = await Problem.create({ title: title,description: description, platform: platform });
      res.status(constants.SUCCESSCODE).json(problem);
    } catch (err) {
      res.status(constants.SERVERERRORCODE).json({ error: err.message });
    }
  };


  exports.getAttempts = (req, res) => {

    const isAdmin = req.fromAdmin

    if (!isAdmin) {
        return res.status(constants.BADREQUESTCODE).json(new ResponseDto(constants.UNAUTHORIZEDCODE, constants.UNAUTHORIZEDMESSAGE, 'You are not authorized to create an admin'))
    }

    CodeAttempt.findAll().then(attempts => {
        return attempts.map(attempt => ({
            ...attempt,
            code: sanitizeHtml(attempt.code),
          }));
    }).then(sanitizedAttempts => {
        return res.status(constants.SUCCESSCODE).json(new ResponseDto(constants.SUCCESSCODE, constants.SUCCESSMESSAGE, sanitizedAttempts))
    }).catch(err => {
        return res.status(constants.SERVERERRORCODE).json(new ResponseDto(constants.SERVERERRORCODE, constants.SERVERERRORMESSAGE, err.toString()))
    })
  }

  exports.getAttemptsByUser = (req, res) => {

    const email = req.body['email']
    
    console.log('user attempt email -- ', email);

    CodeAttempt.findAll({
        where: {
            userEmail: email
        }
    }).then(attempts => {
        return attempts.map(attempt => ({
            ...attempt,
            code: sanitizeHtml(attempt.code),
          }));
    }).then(sanitizedAttempts => {
        return res.status(constants.SUCCESSCODE).json(new ResponseDto(constants.SUCCESSCODE, constants.SUCCESSMESSAGE, sanitizedAttempts))
    }).catch(err => {
        console.log('GET ATTEMPTS ERROR - ', err.toString());
        // return res.status(constants.SERVERERRORCODE).json(new ResponseDto(constants.SERVERERRORCODE, constants.SERVERERRORMESSAGE, err.toString()))
    })
  }