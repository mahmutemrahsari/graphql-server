import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import { db } from "../db/db.config.js";

const resolvers = {
  Query: {
    greeting: async () => {
      "Hello !";
    },

    tasks: async () => {
      try {
        const tasks = await db("tasks").select();
        return tasks;
      } catch (error) {
        console.error("Error fetching tasks:", error);
        throw new Error("Failed to fetch tasks");
      }
    },
    task: async (_: unknown, args: { id: number }) => {
      try {
        return db("tasks").where({ id: args.id }).first();
      } catch (error) {
        console.error("Error fetching task:", error);
        throw new Error("Failed to fetch task with id" + args.id);
      }
    },
    users: async () => {
      try {
        return db("users");
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
      }
    },
    user: async (_: unknown, args: { id: number }) => {
      try {
        return db("users").where({ id: args.id }).first();
      } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Failed to fetch user with id:" + args.id);
      }
    },
  },
  User: {
    async tasks(parent: { id: number }) {
      try {
        return db("tasks").where({ user_id: parent.id }).select();
      } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Failed to fetch tasks to the user! ");
      }
    },
  },
  Mutation: {
    async deleteTask(_: unknown, args: { id: number }) {
      try {
        await db("tasks").where("id", args.id).del();
      } catch (error) {
        console.error("Error deleting task:", error);
        throw new Error("Failed to delete task");
      }
    },

    async deleteAllTasks() {
      try {
        await db("tasks").del();
        return "All tasks deleted successfully";
      } catch (error) {
        console.error("Error deleting tasks:", error);
        throw new Error("Failed to delete tasks");
      }
    },

    async addTask(_: unknown, args: { task: unknown }) {
      try {
        return db("tasks")
          .where("id", await db("tasks").insert(args.task))
          .first(); // Return the inserted task
      } catch (error) {
        console.error("Error adding task:", error);
        throw new Error("Failed to add task");
      }
    },
    async updateTask(_: unknown, args: { id: number; edits: unknown }) {
      try {
        await db("tasks").where("id", args.id).update(args.edits);
        return db("tasks").where("id", args.id).first(); // Return the updated task
      } catch (error) {
        console.error("Error updating task:", error);
        throw new Error("Failed to update task");
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs, //apollo server conf
  resolvers, //apollo server conf
});

db.on("error", (error) => {
  console.error("Could not connect to the database", error);
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
