import { CommentWithAuthor } from "@procrastin/prisma";
import { Avatar, AvatarFallbackText, AvatarImage } from "./ui/avatar";
import { Box } from "./ui/box";
import { HStack } from "./ui/hstack";
import { Text } from "./ui/text";
import {useMemo} from 'react';
import {VStack} from './ui/vstack';

export default function CommentView({ comment }: {comment: CommentWithAuthor}) {
    const formattedDate = useMemo(() => new Date(comment.createdAt).toLocaleString(), [comment.createdAt])

    return (
        <Box className="p-4 gap-2 background-primary-500">
            <HStack className="items-center" space="sm">
                <Avatar size="sm">
                    <AvatarFallbackText>{comment.author.firstName} {comment.author.lastName}</AvatarFallbackText>
                    <AvatarImage
                        source={{
                            uri: comment.author.profilePictureUrl,
                        }}
                    />
                </Avatar>
                <VStack>
                    <Text>{comment.author.firstName}&nbsp;{comment.author.lastName}</Text>
                    <Text size="sm">{formattedDate}</Text>
                </VStack>
            </HStack>
            <Text>{comment.content}</Text>
        </Box>
    );
}       
