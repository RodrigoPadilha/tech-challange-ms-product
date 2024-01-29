import request from "supertest";
import { ExpressAdapter } from "./ExpressAdapter";

describe("ExpressAdapter", () => {
  let expressAdapter: ExpressAdapter;
  const testPort = 3000;

  beforeAll(async () => {
    expressAdapter = new ExpressAdapter();
    await expressAdapter.start(testPort);
  });

  afterAll(async () => {
    await expressAdapter.stop();
  });

  it("should handle health check", async () => {
    const response = await request(expressAdapter.app).get("/health");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Hello World");
  });

  // Add more test cases based on your application requirements

  it.skip("should handle a custom route", async () => {
    // Example: Test a GET request to /custom-route
    await expressAdapter.register("get", "/custom-route", () => {
      return { custom: "response" };
    });
    const response = await request(expressAdapter.app).get("/custom-route");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ custom: "response" });
  });

  it.skip("should handle a POST request", async () => {
    // Example: Test a POST request to /api/resource
    const response = await request(expressAdapter.app)
      .post("/api/resource")
      .send({ data: "some data" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ success: true });
  });

  // Add more test cases as needed
});
