import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import db from "./_db.js";
import { typeDefs } from "./schema.js";

const resolvers = {
  //thoose resolvers are entry point to the graph
  Query: {
    greeting: () => {
      return "HELLO HELL!";
    },
    tasks() {
      return db.tasks;
    },
    task(_: any, args: { id: string }) {
      return db.tasks.find((t) => t.id === args.id);
    },
    users() {
      return db.users;
    },
    user(_: any, args: { id: string }) {
      return db.users.find((u) => u.id === args.id);
    },
  },
  // Retuns specified user with its tasks
  User: {
    tasks(parent: { id: string }) {
      return db.tasks.filter((t) => t.user_id === parent.id);
    },
  },
  Mutation: {
    deleteTask(_: any, args: { id: string }) {
      db.tasks = db.tasks.filter((task) => task.id !== args.id);
      return db.tasks;
    },
    addTask(_: any, args: { task: any }) {
      let task = {
        ...args.task,
      };
      db.tasks.push(task);
    },
    updateTask(_: any, args: { id: string; edits: any }) {
      db.tasks = db.tasks.map((t) => {
        if (t.id === args.id) {
          return { ...t, ...args.edits };
        }
        return t;
      });
      return db.tasks.find((t) => t.id === args.id);
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
