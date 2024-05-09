const secrets = {
  PORT: process.env.PORT as string,
  MONGO_URI: process.env.MONGO_URI || ("mongodb://localhost:27017" as string),
  JWT_SECRET: process.env.JWT_SECRET as string,
};

export default secrets;
