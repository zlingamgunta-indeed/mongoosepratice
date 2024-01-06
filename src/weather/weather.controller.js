const WeatherStatus = require("./weather.model")

async function list(req, res) {
  res.status(200).json(await WeatherStatus.find());
}

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({
        status: 400,
        message: `Must include a ${propertyName}`
    });
  };
}

async function create(req, res) {
    const {data} = req.body;

    const weatherStatus = new WeatherStatus({
        ...data,
        date: new Date(data.date)
    })
    await weatherStatus.save()
  
  res.status(201).json({ data: weatherStatus });
}

async function weatherStatusExists(req, res, next) {
  const { weatherStatusId } = req.params;
  const foundWeatherStatus = await WeatherStatus.findOne({"_id":weatherStatusId});
  if (foundWeatherStatus) {
    res.locals.weatherStatus = foundWeatherStatus;
    return next();
  }
  next({
    status: 404,
    message: `Weather Status id not found: ${weatherStatusId}`,
  });
};

function read(req, res, next) {
  res.status(200).json({data: res.locals.weatherStatus});
}

async function update(req, res) {
    const status = res.locals.weatherStatus
    const { data } = req.body;
    status.date = new Date(data.date);
    status.city = data.city;
    status.state = data.state;
    status.country = data.country;
    status.temperature = data.temperature;
    status.condition = data.condition;
    status.save()
  res.status(200).json({data: status});
}

async function destroy(req, res) {
    const { weatherStatusId } = req.params;
    WeatherStatus.deleteOne({"_id": weatherStatusId})
  res.sendStatus(204);
}

module.exports = {
  list,
  create: [
      bodyDataHas("date"),
      bodyDataHas("city"),
      bodyDataHas("state"),
      bodyDataHas("country"),
      bodyDataHas("temperature"),
      bodyDataHas("condition"),
      create
  ],
  read: [weatherStatusExists, read],
  update: [
      weatherStatusExists,
      bodyDataHas("date"),
      bodyDataHas("city"),
      bodyDataHas("state"),
      bodyDataHas("country"),
      bodyDataHas("temperature"),
      bodyDataHas("condition"),
      update
  ],
  delete: [weatherStatusExists, destroy],
};