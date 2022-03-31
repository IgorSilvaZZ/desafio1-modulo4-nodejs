import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

import { CreateStatementError } from "./CreateStatementError";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Create Statement", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementInMemory
    );
  });

  it("Should be able a create new statament with type deposit", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "Test User",
      email: "test@dev.com.br",
      password: "123",
    });

    const responseStatement = await createStatementUseCase.execute({
      amount: 100.0,
      description: "Statement Test",
      type: "deposit" as OperationType,
      user_id: String(user.id),
    });

    expect(responseStatement.type).toEqual("deposit");
  });

  it("Should be able a create new statament with type withdraw", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "Test User",
      email: "test@dev.com.br",
      password: "123",
    });

    await createStatementUseCase.execute({
      amount: 100.0,
      description: "Statement Test",
      type: "deposit" as OperationType,
      user_id: String(user.id),
    });

    const responseStatement = await createStatementUseCase.execute({
      amount: 50.0,
      description: "Statement Test",
      type: "withdraw" as OperationType,
      user_id: String(user.id),
    });

    expect(responseStatement.type).toEqual("withdraw");
  });

  it("Should not be able withdraw if balance insufficient", async () => {
    expect(async () => {
      const user = await usersRepositoryInMemory.create({
        name: "Test user",
        email: "test.dev@dev.com.br",
        password: "123",
      });

      await createStatementUseCase.execute({
        amount: 10.0,
        description: "Statement Test",
        type: "withdraw" as OperationType,
        user_id: String(user.id),
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("Should not be able withdraw if balance insufficient", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        amount: 10.0,
        description: "Statement Test",
        type: "withdraw" as OperationType,
        user_id: "id_user_not_exists",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
});
