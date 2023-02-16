"use strict";
const dotenv = require("dotenv");
const Career_1 = require("../src/entities/Career");
const Comment_1 = require("../src/entities/Comment");
const CommentLike_1 = require("../src/entities/CommentLike");
const Field_1 = require("../src/entities/Field");
const MainCategory_1 = require("../src/entities/MainCategory");
const Post_1 = require("../src/entities/Post");
const PostLike_1 = require("../src/entities/PostLike");
const RankerProfile_1 = require("../src/entities/RankerProfile");
const Ranking_1 = require("../src/entities/Ranking");
const SubCategory_1 = require("../src/entities/SubCategory");
const Tier_1 = require("../src/entities/Tier");
const User_1 = require("../src/entities/User");
dotenv.config();
const config = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: false,
    entities: [
        Career_1.Career,
        Comment_1.Comment,
        CommentLike_1.CommentLike,
        Field_1.Field,
        MainCategory_1.MainCategory,
        Post_1.Post,
        PostLike_1.PostLike,
        RankerProfile_1.RankerProfile,
        Ranking_1.Ranking,
        SubCategory_1.SubCategory,
        Tier_1.Tier,
        User_1.User,
    ],
};
module.exports = config;
//# sourceMappingURL=ormConfig.js.map