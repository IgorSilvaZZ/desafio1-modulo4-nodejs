import { rejects } from "assert";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";

import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementInMemory: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get Balance", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementInMemory = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementInMemory,
      usersRepositoryInMemory
    );
  });

  it("Should be able a get balance a user", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "Test User",
      email: "test@dev.com.br",
      password: "123",
    });

    await statementInMemory.create({
      amount: 100.0,
      description: "Statament Test",
      type: "deposit" as OperationType,
      user_id: String(user.id),
    });

    await statementInMemory.create({
      amount: 20.0,
      description: "Statament Test",
      type: "withdraw" as OperationType,
      user_id: String(user.id),
    });

    const responseBalance = await getBalanceUseCase.execute({
      user_id: String(user.id),
    });

    expect(responseBalance).toHaveProperty("balance");
    expect(responseBalance.balance).toEqual(80);
  });

  it("Should not be able get balance if not exists user", async () => {
    expect(async () => {
      const responseBalance = await getBalanceUseCase.execute({
        user_id: "user_not_exists",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
