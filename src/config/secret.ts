const secrets = {
  port: (process.env.port as string) || 7000,

  // MONGODB
  mongo_uri: process.env.mongo_uri as string,

  // JWT
  jwt_secret: process.env.jwt_secret as string,

  // BKASH
  bkash_sandbox_baseurl: process.env.sandboxurl as string,
  bkash_app_key: process.env.app_key as string,
  bkash_secret_key: process.env.secret_key as string,
  bkash_username: process.env.username as string,
  bkash_password: process.env.password as string,
  bkash_refresh_token: process.env.refresh_token as string,

  // for Steadfast
  STEADFAST_BASE_URL: process.env.STEADFAST_BASE_URL as string,
  STEADFAST_API_KEY: process.env.STEADFAST_API_KEY as string,
  STEADFAST_SECRECT_KEY: process.env.STEADFAST_SECRECT_KEY as string,

  //nodemailer
  nodemailer_email: process.env.nodemailer_email as string,
  nodemailer_password: process.env.nodemailer_password as string,
};

export default secrets;
