import {User} from '@procrastin/prisma';
import {Avatar, AvatarFallbackText, AvatarImage} from './ui/avatar';
import {VStack} from './ui/vstack';
import {Heading} from './ui/heading';
import {Text} from './ui/text';
import {HStack} from './ui/hstack';
import {useMemo} from 'react';

export function PostHeader({date, author, size}: { date: Date | string, author: User, size: 'sm' | 'lg' }) {
    const formattedDate = useMemo(() => new Date(date).toLocaleString(), [date])

    return (
        <HStack className="items-center" space={size}>
            <Avatar size="md">
                <AvatarFallbackText>{author.firstName} {author.lastName}</AvatarFallbackText>
                <AvatarImage
                    source={{
                        uri: author.profilePictureUrl,
                    }}
                />
            </Avatar>
            <VStack>
                <Heading size={size} bold>
                    {author.firstName}&nbsp;{author.lastName}
                </Heading>
                <Text>{formattedDate}</Text>
            </VStack>
        </HStack>
    )
}
