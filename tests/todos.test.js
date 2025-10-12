import { jest } from "@jest/globals";
import handler from "../api/todos.js";

test("Crear un ToDo sin user_id devuelve 400", async () => {
  const req = { method: "POST", body: { text: "Tarea de prueba" } };

  const res = { 
    status: jest.fn().mockReturnThis(), 
    json: jest.fn(), 
    setHeader: jest.fn(), 
    end: jest.fn() 
  };

  await handler(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
});
