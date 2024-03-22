import { User } from "src/user/entities";
import { DirectConversation, GroupConversation } from "../entities";
import { Message } from "src/message/entities";
import { IntersectionType, OmitType } from "@nestjs/swagger";

class ConversationItemExtension {
    otherUsers: User[];
    latestMessage: Message;
}

export class DirectConversationItemQueryResponse extends IntersectionType(
    OmitType(
        DirectConversation,
        ['messages', 'users', 'userConversations'] as const
    ),
    ConversationItemExtension,
) { }

export class GroupConversationItemQueryResponse extends IntersectionType(
    OmitType(
        GroupConversation,
        ['messages', 'users', 'userConversations'] as const
    ),
    ConversationItemExtension,
) { }