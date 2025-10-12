// tests/simple.test.js
import handler from "../api/users.js";

test("Login con usuario inexistente devuelve 401", async () => {
  const req = { 
    method: "POST", 
    body: { action: "login", username: "noexiste", password: "1234" } 
  };

  const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), setHeader: jest.fn(), end: jest.fn() };

  await handler(req, res);

  expect(res.status).toHaveBeenCalledWith(401);
});