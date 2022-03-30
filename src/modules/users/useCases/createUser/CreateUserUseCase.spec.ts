import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create a new User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be able a create new user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "emai.test@dev.com",
      password: "123",
    });

    expect(user).toHaveProperty("id");
  });

  it("Should not be able create user if email exists", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "User Test",
        email: "emai.test@dev.com",
        password: "123",
      });

      await createUserUseCase.execute({
        name: "User Test",
        email: "emai.test@dev.com",
        password: "123",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
