import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementInMemory: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get Statement", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementInMemory = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementInMemory
    );
  });

  it("Should be able get a statement operation for user", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "Test User",
      email: "test@dev.com.br",
      password: "123",
    });

    const statement = await statementInMemory.create({
      amount: 100.0,
      description: "Statament Test",
      type: "deposit" as OperationType,
      user_id: String(user.id),
    });

    const reponseGetStatemant = await getStatementOperationUseCase.execute({
      user_id: String(user.id),
      statement_id: String(statement.id),
    });

    expect(reponseGetStatemant).toHaveProperty("id");
    expect(reponseGetStatemant.user_id).toEqual(String(user.id));
  });

  it("Should not be able get statement operation for id statement not exists", async () => {
    expect(async () => {
      const user = await usersRepositoryInMemory.create({
        name: "Test User",
        email: "test@dev.com.br",
        password: "123",
      });

      await getStatementOperationUseCase.execute({
        user_id: String(user.id),
        statement_id: "statement_id_not_exists",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

  it("Should not be able get statement operation for id user not exists", async () => {
    expect(async () => {
      const user = await usersRepositoryInMemory.create({
        name: "Test User",
        email: "test@dev.com.br",
        password: "123",
      });

      const statement = await statementInMemory.create({
        amount: 100.0,
        description: "Statament Test",
        type: "deposit" as OperationType,
        user_id: String(user.id),
      });

      await getStatementOperationUseCase.execute({
        user_id: "user_id_not_exists",
        statement_id: String(statement.id),
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });
});
