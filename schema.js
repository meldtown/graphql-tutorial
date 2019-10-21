const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLString
} = require('graphql');

const users = require('./users');
const comments = require('./comments');


const User = new GraphQLObjectType({
    name: 'User',
    description: 'Basic user info',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        comments: {
            type: new GraphQLList(Comment),
            resolve({id}) {
               return comments.filter(({authorId}) => authorId === id);     
            }
        }
    })
});

const Comment = new GraphQLObjectType({
    name: 'Comment',
    description: 'This is basic comment info',
    fields: () => ({
        id: { type: GraphQLID },
        text: { type: GraphQLString },
        date: { type: GraphQLString },
        authorId: {type: GraphQLID},
        author: {
            type: User,
            resolve({authorId: id}) {
                console.log(id);
                const user = users.find(user => user.id === +id);

                return user; 
            }
        }
    })
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    description: 'This is the root query',
    fields: {
        users: {
            type: new GraphQLList(User),
            args: {
                count: { type: GraphQLInt }
            },
            resolve(parent, { count }) {
                return count ? users.slice(0, count) : users;
            }
        },
        user: {
            type: User,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, { id }) {
                const user = users.find(user => user.id === +id);

                return user;
            }
        },
        comments: {
            type: new GraphQLList(Comment),
            args: {
                count: { type: GraphQLInt }
            },
            resolve(parent, { count }) {
                return count ? comments.slice(0, count) : comments;
            }
        },
        comment: {
            type: Comment,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, { id }) {
                const comment = comments.find(comment => comment.id === +id);

                return comment;
            }
        },
    }
});


const schema = new GraphQLSchema({
    query: RootQuery
});

module.exports = schema;

