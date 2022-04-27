const express = require('express');
const server = express();
const https = require('https');
const cors = require('cors');

server.use(cors({origin: 'http://localhost:3000'}));

server.get('/subreddit_posts/', (request, response) => getHandler(request, response));

server.get('/top_post_comments/', (request, response) => getHandler(request, response));

server.get('/user_comments/', (request, response) => getHandler(request, response));

//handle http request logic
const getHandler = (request, response) =>{
  const httpRequest =(request)=> {
    const options = optionSpecifier(request);
    return new Promise((resolve, reject) => {    
      const req = https.request(options, res => {
        //check for status codes, return rejection if error codes are outside of valid range 200-299
        if(res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error(res.statusCode));
        } 
        //responseBody array will store stream data chunks
        let responseBody = [];
        //add chunk data to responseBody array
        res.on('data', (chunk) => {
          responseBody.push(chunk);
        });
        //detect end of chunk stream, parse responseBody data to JSON, reject on error
        res.on('end', ()=>{
          try {
            //decode byte sequence
            responseBody = JSON.parse(Buffer.concat(responseBody).toString());
          } catch(error) {
            return reject(error);
          }
          resolve(responseBody);
        });
      });
      req.end();
    });
  }

  //call request method
  httpRequest(request)
  .then((data) => {
    response.json(data);
  })
  .catch(e => {
    console.error(e.stack);
    //send error response data
    response.json({errorCode: e.message});
  });
}

//specify options based on route
const optionSpecifier = (request) =>{
  if(request.route.path === "/subreddit_posts/" ){
    return {
      hostname: 'www.reddit.com',
      port: 443,
      path: `/r/${request.query.name}/rising.json`,
      method: 'GET',
      headers: {
        'User-Agent': 'myreddittapp'
      }
    };
  }
  if(request.route.path === "/top_post_comments/" ){
    return {
      hostname: 'www.reddit.com',
      port: 443,
      path: `/r/${request.query.subreddit}/comments/${request.query.postId}.json?sort=top`,
      method: 'GET',
      headers: {
        'User-Agent': 'myreddittapp'
      }
    };
  }
  if(request.route.path === "/user_comments/" ){
    return {
      hostname: 'www.reddit.com',
      port: 443,
      path: `/user/${request.query.userId}/comments.json`,
      method: 'GET',
      headers: {
        'User-Agent': 'myreddittapp'
      }
    };
  }
}

module.exports = server;
