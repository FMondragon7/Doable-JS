// Fetch => => Mock Fetch => Simular un Fetch => Retornan Promesas
// Mock Fetch Jest

export function login({ username, password } = {}) {
  return new Promise((resolve, reject) => {
    if (username === "testino" && password === "letmein") {
      resolve({
        username,
        email: "testino@mail.com",
        token: "super_secret_token_1234",
      });
    } else {
      reject(new Error("Invalid credentials"));
    }
  });
}
