const fs = require("fs");
const path = require("path");

const fastify = require("fastify")({
  logger: false,
});

fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/",
});

fastify.register(require("@fastify/formbody"));

fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

const seo = require("./src/seo.json");
if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}

const data = require("./src/data.json");
const db = require("./src/" + data.database);


fastify.get("/", async (request, reply) => {
  let params = request.query.raw ? {} : { seo: seo };

  const options = await db.getOptions();
  if (options) {
    params.optionNames = options.map((choice) => choice.language);
    params.optionCounts = options.map((choice) => choice.picks);
  }
  else params.error = data.errorMessage;

  if (options && params.optionNames.length < 1)
    params.setup = data.setupMessage;

  return request.query.raw
    ? reply.send(params)
    : reply.view("/src/pages/index.hbs", params);
});

fastify.post("/", async (request, reply) => {
  let params = request.query.raw ? {} : { seo: seo };

  params.results = true;
  let options;

  if (request.body.language) {
    options = await db.processVote(request.body.language);
    if (options) {
      params.optionNames = options.map((choice) => choice.language);
      params.optionCounts = options.map((choice) => choice.picks);
    }
  }
  params.error = options ? null : data.errorMessage;

  return request.query.raw
    ? reply.send(params)
    : reply.view("/src/pages/index.hbs", params);
});


fastify.post("/reset", async (request, reply) => {
  let params = request.query.raw ? {} : { seo: seo };

  if (
    !request.body.key ||
    request.body.key.length < 1 ||
    !process.env.ADMIN_KEY ||
    request.body.key !== process.env.ADMIN_KEY
  ) {
    console.error("Auth fail");

    params.failed = "You entered invalid credentials!";
  }

  const status = params.failed ? 401 : 200;
  return request.query.raw
    ? reply.status(status).send(params)
    : reply.status(status).view("/src/pages/admin.hbs", params);
});


fastify.get("/roview", async (request, reply) => {
  let params = request.query.raw ? {} : { seo: seo };

  return request.query.raw
    ? reply.send(params)
    : reply.view("/src/pages/roview.hbs", params);
});

fastify.get("/help", async (request, reply) => {
  let params = request.query.raw ? {} : { seo: seo };

  return request.query.raw
    ? reply.send(params)
    : reply.view("/src/pages/help.hbs", params);
});

fastify.get("/generate", async (request, reply) => {
  let params = request.query.raw ? {} : { seo: seo };

  return request.query.raw
    ? reply.send(params)
    : reply.view("/src/pages/generate.hbs", params);
});

fastify.get("/frames", async (request, reply) => {
  let params = request.query.raw ? {} : { seo: seo };

  return request.query.raw
    ? reply.send(params)
    : reply.view("/src/pages/frames.hbs", params);
});

fastify.get("/alpha", async (request, reply) => {
  let params = request.query.raw ? {} : { seo: seo };

  return request.query.raw
    ? reply.send(params)
    : reply.view("/src/pages/alpha.hbs", params);
});

fastify.get("/about", async (request, reply) => {
  let params = request.query.raw ? {} : { seo: seo };

  return request.query.raw
    ? reply.send(params)
    : reply.view("/src/pages/about.hbs", params);
});

fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
