const sequelize = require('./db')
const {DataTypes} = require("sequelize");

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const UserMessage = sequelize.define('User_Message', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

    },
    {
        timestamps: false
    }
)

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

// association
User.User1 = User.hasMany(UserMessage, {foreignKey: 'user1'})
User.User2 = User.hasMany(UserMessage, {foreignKey: 'user2'})

Message.UserMessage = Message.belongsTo(UserMessage, {foreignKey: 'userMessageId', foreignKeyConstraint: true})
Message.User = Message.belongsTo(User, {foreignKey: 'userId', foreignKeyConstraint: true})

UserMessage.Message = UserMessage.hasMany(Message, {foreignKey: 'userMessageId'})
UserMessage.User1 = UserMessage.belongsTo(User, {foreignKey: "user1", foreignKeyConstraint: true, as: 'user_1'})
UserMessage.User2 = UserMessage.belongsTo(User, {foreignKey: "user2", foreignKeyConstraint: true, as: 'user_2'})

module.exports = {User, Message, UserMessage}