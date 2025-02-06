import { Comment } from "@prisma/client";
import { Avatar, AvatarFallbackText, AvatarImage } from "./ui/avatar";
import { Box } from "./ui/box";
import { HStack } from "./ui/hstack";
import { Text } from "./ui/text";

export default function CommentView({ comment }: Comment) {

    return (
        <Box className="p-4 background-primary-500">
            <HStack alignItems="center" space="sm">
                <Avatar size="sm">
                    <AvatarFallbackText>{comment.authorId}</AvatarFallbackText>
                    <AvatarImage
                        source={{
                            uri: `https://picsum.photos/id/${200+comment.id}/12/12`,
                        }}
                    />
                </Avatar>
                <Text>
                    {comment.authorId}
                </Text>
            </HStack>
            <Text>
                {comment.content}
            </Text>
        </Box>
    );
}       