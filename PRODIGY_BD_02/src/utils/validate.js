export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidUser = (user) => {
  const { name, email, age } = user;
  return (
    typeof name === "string" &&
    name.trim().length > 0 &&
    isValidEmail(email) &&
    typeof age === "number" &&
    age >= 0
  );
};
