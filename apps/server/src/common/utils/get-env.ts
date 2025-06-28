export const getEnvironment = (key: string, defaultValue = "") => {
  const value = process.env[key];

  if (value === undefined) {
    if (defaultValue) return defaultValue;
    throw new Error(`Enviroment variable ${key} is not defined`);
  }

  return value;
};
