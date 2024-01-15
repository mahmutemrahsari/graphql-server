export const typeDefs = `#graphql
  
  type Task {
    id:Int!
    title:String!
    completed:Boolean!
    user_id:Int!
  }

  type User {
    id:Int!
    name:String!
    tasks:[Task!]
  }

  type Query {
    greeting:String
    tasks:[Task!]!
    task(id:Int!):Task
    users:[User!]!
    user(id:Int!):User
  }  

  type Mutation {
    addTask(task:AddTaskInput!):Task
    deleteTask(id:Int!):[Task]
    deleteAllTasks: String
    updateTask(id:Int!, edits:EditTaskInput!):Task
  }

  input AddTaskInput{
    id:Int!
    title:String!
    completed:Boolean!
    user_id:Int!
  }
  input EditTaskInput{
    title:String
    completed:Boolean
    user_id:Int
  }
`;
