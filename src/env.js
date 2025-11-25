// MJS doesnt work with tsx which we need for seeding
export const env = {
  NODE_ENV: process.env.NODE_ENV,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
};
