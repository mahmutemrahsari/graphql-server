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
    task(_: any, args: { id: number }) {
      return db("tasks").where({ id: args.id }).first();
    },
    users() {
      return db("users");
    },
    user(_: any, args: { id: number }) {
      return db("users").where({ id: args.id }).first();
    },
  },
  User: {
    async tasks(parent: { id: number }) {
      return db("tasks").where({ user_id: parent.id }).select();
    },
  },
  Mutation: {
    async deleteTask(_: any, args: { id: number }) {
      await db("tasks").where("id", args.id).del();
    },
    async addTask(_: any, args: { task: any }) {
      const [taskId] = await db("tasks").insert(args.task);
      return db("tasks").where("id", taskId).first(); // Return the inserted task
    },
    async updateTask(_: any, args: { id: number; edits: any }) {
      await db("tasks").where("id", args.id).update(args.edits);
      return db("tasks").where("id", args.id).first(); // Return the updated task
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

db.on("error", (error) => {
  console.error("Could not connect to the database", error);
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
