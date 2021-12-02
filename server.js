const express = require("express")
const expressGraphQL = require('express-graphql').graphqlHTTP
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = require("graphql")
const app = express()

const footballPlayers = [
    {
        id: 1,
        name: "Kylian Mbappe",
        clubID: 1,
    },
    {
        id: 2,
        name: "Cristiano Ronaldo",
        clubID: 2,
    },
    {
        id: 3,
        name: "Jadon Sancho",
        clubID: 2,
    },
    {
        id: 4,
        name: "Mesut Ozil",
        clubID: 3,
    }
];

const footballClubs = [
    {
        id: 1,
        name: "Paris Saint Germain",
        director: "Pepe 1",
    },
    {
        id: 2,
        name: "Manchester United",
        director: "Pepe 2",
    },
    {
        id: 3,
        name: "Werder Bremen",
        director: "Pepe 3",
    }
]

const footballPlayerType = new GraphQLObjectType({
    name: "Players",
    description: "This represents football player",
    fields: () => ({
        id: { type: GraphQLInt},
        name: { type: GraphQLString},
        clubID: { type: GraphQLInt},
        club: {
           type: footballClubType,
           resolve: (player) => {
               return footballClubs.find(club => club.id === player.clubID)
           }
        }
    })
})

const footballClubType = new GraphQLObjectType({
    name: "Clubs",
    description: "This represents football clubs",
    fields: () => ({
        id: {type: GraphQLInt},
        name: {type: GraphQLString},
        director: {type: GraphQLString},
    })
})

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () => ({
        player: {
            type: footballPlayerType,
            description: "Single Football Player",
            args: {
                id: { type: GraphQLInt}
            },
            resolve: (parent, args) => footballPlayers.find(player => player.id === args.id),
        },
        players: {
            type: new GraphQLList(footballPlayerType),
            description: "List of All Players",
            resolve: () => footballPlayers,
        },
        club: {
            type: footballClubType,
            description: "Single Club",
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => footballClubs.find(club => club.id === args.id)
        },
        clubs: {
            type: new GraphQLList(footballClubType),
            description: "List of All Clubs",
            resolve: () => footballClubs,
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",
    fields: () => ({
        addPlayer: {
            type: footballPlayerType,
            description: "Add a player",
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                clubID: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
                const player = {
                    id: footballPlayers.length + 1,
                    name: args.name,
                    clubID: args.clubID
                }
                footballPlayers.push(player)
                return player
            }
        },
        addClub: {
            type: footballClubType,
            description: "Add a Football Club",
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                director: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent, args) => {
                const club = {
                    id: footballClubs.length + 1,
                    name: args.name,
                    director: args.director
                }
                footballClubs.push(club)
                return club
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))
app.listen(5000., () => console.log("server is running"))
