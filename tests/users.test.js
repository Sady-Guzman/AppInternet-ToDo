import { jest } from "@jest/globals";
import handler from "../api/users.js";

test("Login con usuario inexistente devuelve 401", async () => {
  const req = {
    method: "POST",
    body: { username: "noexiste", password: "123", action: "login" },
  };

  const res = { 
    status: jest.fn().mockReturnThis(), 
    json: jest.fn(), 
    setHeader: jest.fn(), 
    end: jest.fn() 
  };

  await handler(req, res);

  expect(res.status).toHaveBeenCalledWith(401);
});
