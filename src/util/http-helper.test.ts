import * as util from "./http-helper";

describe("HTTP responses", () => {
  it("Should return status code 400 when badRequest invocated", () => {
    const response = util.badRequest({});

    expect(response.statusCode).toBe(400);
  });

  it("Should return status code 500 when serverError invocated", () => {
    const response = util.serverError({});

    expect(response.statusCode).toBe(500);
  });

  it("Should return status code 201 when created invocated", () => {
    const response = util.created({});

    expect(response.statusCode).toBe(201);
  });

  it("Should return status code 200 when ok invocated", () => {
    const response = util.ok({});

    expect(response.statusCode).toBe(200);
  });
});
