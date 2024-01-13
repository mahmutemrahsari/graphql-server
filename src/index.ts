import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import { db } from "../db/db.config.js";

const resolvers = {
  //thoose resolvers are entry point to the graph
  Query: {
    greeting: () => {
      return "HELLO HELL!";
    },
    tasks() {
      return db("tasks");
    },
    task(_: any, args: { id: number }) {
      return db("tasks").where({ id: args.id }).first();
      // return db.tasks.find((t) => t.id === args.id);
    },
    users() {
      return db("users");
    },
    user(_: any, args: { id: number }) {
      return db("users").where({ id: args.id }).first();
    },
  },
  // Retuns specified user with its tasks
  User: {
    tasks(parent: { id: number }) {
      return db("tasks").where({ user_id: parent.id }).first();
      // return db("tasks").filter((t) => t.user_id === parent.id);
    },
  },
  Mutation: {
    deleteTask(_: any, args: { id: number }) {
      db("tasks").where("id", args.id).del();
      //   return db.tasks.filter((task) => task.id !== args.id);
    },
    addTask(_: any, args: { task: any }) {
      db("tasks").insert(args.task);
      //   db.tasks.push(args.task);
    },
    updateTask(_: any, args: { id: number; edits: any }) {
      db("tasks").where("id", args.id).update(args.edits);

      // const updatedTasks = db.tasks.map((t) => {
      //   if (t.id === args.id) {
      //     return { ...t, ...args.edits };
      //   }
      //   return t;
      // });
      // return updatedTasks.find((t) => t.id === args.id);
    },
  },
};
// "_" = parent resolver
// "args" =  arguments , we can access any query variable sent with the query
// "context" = context object for supplying context values across all of our resolvers
// such as authentication information

// Nested query based on id

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
