const isProd = process.env.APP_ENV === "production";

module.exports = {
  basePath: isProd ? "/ber-cph" : "",
};
