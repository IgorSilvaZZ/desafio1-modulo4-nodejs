import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("List User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      usersRepositoryInMemory
    );
  });

  it("Should be able return user", async () => {
    const createdUser = await usersRepositoryInMemory.create({
      name: "Test User",
      email: "test@dev.com.br",
      password: "123",
    });

    const user = await showUserProfileUseCase.execute(String(createdUser.id));

    expect(user).toEqual(createdUser);
  });

  it("Should not able if user not exists", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("user_id_not_exists");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
