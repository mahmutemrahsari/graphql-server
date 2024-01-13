export const typeDefs = `#graphql
  
  type Task {
    id: ID!
    title: String!
    completed: Boolean!
    user_id:ID!
  }

  type User {
    id:ID!
    name:String!
    tasks:[Task!]
  }

  type Query {
    greeting:String
    tasks: [Task!]!
    task(id:ID!):Task
    users:[User!]!
    user(id:ID!):User
  }  

  type Mutation {
    addTask(task:AddTaskInput!):Task
    deleteTask(id: ID!): [Task]
    updateTask(id:ID!, edits:EditTaskInput! ):Task
  }

  input AddTaskInput{
    id: ID!
    title: String!
    completed: Boolean!
    user_id:ID!
  }
  input EditTaskInput{
    title: String
    completed: Boolean
    user_id:ID
  }
`;
