import { Knex } from "knex";
import { faker } from "@faker-js/faker";
import { Task, User } from "../../src/types";

function generateUsers(length: number): Omit<User, "id">[] {
  return Array.from({ length }, () => ({ name: faker.person.firstName() }));
}

function generateTasks(length: number): Omit<Task, "id" | "completed">[] {
  return Array.from({ length }, () => ({
    title: faker.word.noun(),
    user_id: Math.floor(Math.random() * 10),
  }));
}

export async function seed(knex: Knex): Promise<void> {
  const LENGTH = 10;
  // Deletes ALL existing entries
  await knex("tasks").truncate();
  await knex("users").truncate();

  const users = generateUsers(LENGTH);
  const tasks = generateTasks(LENGTH);

  for (const user of users) {
    await knex("users").insert(user);
  }

  for (const task of tasks) {
    await knex("tasks").insert(task);
  }
}
