const colors = require("colors");
const moment = require("moment");
const date = `[${moment().format("MMMM Do, YYYY h:mm a")}]`;
module.exports = {
  info: string => {
    console.log(`INFO:: ${date}  ${string}`.blue);
  },
  error: string => {
    console.log(`ERR:: ${date} ${string}`.red);
  },
  server: string => {
    console.log(`${date}  ${string}`.rainbow);
  }
};
