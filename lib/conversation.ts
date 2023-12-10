import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export const getOrCreateConversation = async (
  memberOneID: string,
  memberTwoId: string
) => {
  let conversation =
    (await findConvesation(memberOneID, memberTwoId)) ||
    (await findConvesation(memberTwoId, memberOneID));

  if (!conversation) {
    conversation = await createNewConvesation(memberOneID, memberTwoId);
  }

  return conversation;
};

const findConvesation = async (memberOneID: string, memberTwoId: string) => {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId: memberOneID }, { memberTwoId: memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch {
    return null;
  }
};

const createNewConvesation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch {
    return null;
  }
};
