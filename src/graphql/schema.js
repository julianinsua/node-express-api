const { buildSchema } = require("graphql");

module.exports = buildSchema(`
      type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
      }
      
      type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]!
      }
      
      type AuthData {
        token: String!
        userId: String!
      }
      
      input UserInput {
        email: String!
        name: String!
        password: String!
      }
      
      input PostInput {
        title: String!
        content: String!
        imageUrl: String!
      }
      
      type PostList {
        posts: [Post!]!
        totalPosts: Int!
      }
      
      type RootMutation {
        createUser(userInput: UserInput): User!
        createPost(postInput: PostInput): Post!
        updatePost(id: ID!, postInput: PostInput): Post!
        deletePost(id: ID!): Boolean!
        updateStatus(status: String!): User!
      }
      
      type RootQuery {
        login(email: String!, password: String!): AuthData!
        posts(page: Int!): PostList!
        post(id: ID!): Post!
        user: User!
      }
      
      schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
