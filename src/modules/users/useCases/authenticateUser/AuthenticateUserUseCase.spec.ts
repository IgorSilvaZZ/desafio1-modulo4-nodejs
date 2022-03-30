import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let userRepositoritoryInMemory: InMemoryUsersRepository;

describe("Authenticate User", () => {
  beforeEach(() => {
    userRepositoritoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoritoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      userRepositoritoryInMemory
    );
  });

  it("Should be ale to authenticate an user", async () => {
    await createUserUseCase.execute({
      name: "User Test",
      email: "email.test@dev.com",
      password: "123",
    });

    const response = await authenticateUserUseCase.execute({
      email: "email.test@dev.com",
      password: "123",
    });

    expect(response).toHaveProperty("token");
  });

  it("Should not be able to authenticate with incorrect password", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "User Test",
        email: "email.test@dev.com",
        password: "123",
      });

      await authenticateUserUseCase.execute({
        email: "email.test@dev.com",
        password: "123455",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should not able to authenticate an nonexistent user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "test@dev.com",
        password: "1234567",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
