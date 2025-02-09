import {PostSchema, UserSchema} from './generated/zod';
import {z} from 'zod';

export const PostWithAuthorSchema = PostSchema.extend({
    author: UserSchema
});

export type PostWithAuthor = z.infer<typeof PostWithAuthorSchema>
