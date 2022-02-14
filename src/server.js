const http = require('http');
const url = require('url');
const query = require('querystring');

const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, handler) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    handler(request, response, bodyParams);
  });
};

// Called when they make a request to server
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  console.log(parsedUrl.pathname);

  // make an array of the accepted type(s) given
  // const acceptedTypes = request.headers.accept.split(',');
  // console.log(acceptedTypes);

  switch (parsedUrl.pathname) {
    case '/':
      responseHandler.getIndex(request, response);
      break;
    case '/style.css':
      responseHandler.getCSS(request, response);
      break;
    case '/getUsers':
      responseHandler.getUsers(request, response);
      break;
    case '/notReal':
      responseHandler.notReal(request, response);
      break;
    case '/addUser':
      parseBody(request, response, responseHandler.addUser);
      break;
    default:
      responseHandler.notFound(request, response, false);
      break;
  }
};

// Setting up server + its callback function when setup
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1${port}`);
});
