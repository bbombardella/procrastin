import {CommentSchema, PostSchema, UserSchema} from './generated/zod';
import {z} from 'zod';

// COMMENT
export const CommentWithAuthorSchema = CommentSchema.extend({
    author: UserSchema
});

export type CommentWithAuthor = z.infer<typeof CommentWithAuthorSchema>

// POST
export const PostWithAuthorSchema = PostSchema.extend({
    author: UserSchema
});

export type PostWithAuthor = z.infer<typeof PostWithAuthorSchema>

export const PostWithRelationsSchema = PostSchema.extend({
    author: UserSchema,
    comments: CommentWithAuthorSchema.array()
});

export type PostWithRelations = z.infer<typeof PostWithRelationsSchema>
