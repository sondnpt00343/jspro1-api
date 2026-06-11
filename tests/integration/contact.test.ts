import { describeDb, useIntegrationApp } from "./helpers.js";

describeDb("contact messages", () => {
  const ctx = useIntegrationApp();

  it("validates message length and stores new contact messages", async () => {
    const invalidResponse = await ctx.app.inject({
      method: "POST",
      url: "/api/contact-messages",
      payload: {
        name: "Nguyễn Văn A",
        email: "contact@example.com",
        message: "Ngắn"
      }
    });

    expect(invalidResponse.statusCode).toBe(400);

    const validResponse = await ctx.app.inject({
      method: "POST",
      url: "/api/contact-messages",
      payload: {
        name: "Nguyễn Văn A",
        email: "contact@example.com",
        message: "Nội dung cần ít nhất mười kí tự."
      }
    });

    expect(validResponse.statusCode).toBe(201);
    expect(validResponse.json().contactMessage.status).toBe("new");
  });
});
