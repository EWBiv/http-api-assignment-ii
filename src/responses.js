const users = {};

const fs = require('fs');

// Preloaded files
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

// Objects used for making JSON/XML objects

const createJSONMessage = (isError, msg, errorID) => {
  const json = { };
  json.message = msg;
  if (isError) json.id = errorID;
  return json;
};

const respondHeaderJSON = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const respondJSON = (request, response, status, json) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(json));
  response.end();
};

const badRequest = (request, response, onlyHead) => {
  if (onlyHead) {
    respondHeaderJSON(request, response, 400);
  } else {
    const m = createJSONMessage(true, 'Bad Request! You are required to include name and age for a user.', 'badRequest');
    respondJSON(request, response, 400, m);
  }
};

const notFound = (request, response, onlyHead) => {
  if (onlyHead) {
    respondHeaderJSON(request, response, 404);
  } else {
    const m = createJSONMessage(true, 'Page not found!', 'pageNotFound');
    respondJSON(request, response, 404, m);
  }
};

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end(); //  cannot .write() after .end()
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

const getUsers = (request, response) => {
  // https://developer.mozilla.org/en-US/docs/Web/API/Request/method
  if (request.method === 'GET') {
    respondJSON(request, response, 200, users);
  } else if (request.method === 'HEAD') {
    respondHeaderJSON(request, response, 200);
  }
};

const notReal = (request, response) => {
  if (request.method === 'GET') {
    notFound(request, response, false);
  } else if (request.method === 'HEAD') {
    notFound(request, response, true);
  }
};

const addUser = (request, response, body) => {
  // Check if missing name or age (or both) - if it does, 400
  if (!body.name || !body.age) {
    return badRequest(request, response, false);
  }

  if (!users[body.name]) {
    // If none of those, create user and add, return 201
    users[body.name] = {};
    users[body.name].name = body.name;
    users[body.name].age = body.age;
    return respondJSON(request, response, 201, users[body.name]);
  }

  users[body.name].age = body.age;
  return respondHeaderJSON(request, response, 204);
};

// Exports

module.exports = {
  getIndex,
  getCSS,
  getUsers,
  notReal,
  addUser,
  notFound,
};
