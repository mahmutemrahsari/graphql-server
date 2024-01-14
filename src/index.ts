import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import { db } from "../db/db.config.js";

const resolvers = {
  Query: {
    greeting: async () => {
      // Add this before other database operations to log the connection details
      db.raw("SELECT 1")
        .then(() => {
          console.log("Connected to the database!");
        })
        .catch((error) => {
          console.error("Error connecting to the database:", error);
        });
      db.raw("SELECT * FROM tasks")
        .then((result) => {
          // Log or process the query result
          console.log(result);
        })
        .catch((error) => {
          // Handle any errors during the query execution
          console.error("Error executing raw query:", error);
        });
      console.log(db.from("tasks").select().first());
      return await db.from("tasks").select();
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

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
