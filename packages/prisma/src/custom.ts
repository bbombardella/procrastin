import {PostSchema, UserSchema} from './generated/zod';

export const PostWithAuthorSchema = PostSchema.extend({
    author: UserSchema
});
