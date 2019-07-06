const fs = require('fs');
const loader = require('csv-load-sync');

module.exports.getDrivers = function getDrivers(req, res) {
  const data = fs.readFileSync('server/data/drivers_data.json');
  const parsedData = JSON.parse(data);

  res.send(parsedData);
};

module.exports.getTimes = function getTimes(req, res) {
  const csv = loader('server/data/expected_running_times.csv');

  res.send(csv);
};
