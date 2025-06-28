import React from "react";
import { Text, View } from "react-native";

import { UserType } from "~/lib/types/user.type";

import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Card, CardContent } from "../../ui/card";
import { H4, Small } from "../../ui/typography";

interface UserInfoSectionProps {
  user: UserType;
}

const UserInfoSection = ({ user }: UserInfoSectionProps) => {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <View className="flex flex-row gap-4">
          <Avatar alt="user avatar" className="h-28 w-28">
            <AvatarImage source={{ uri: user?.avatar }} />
            <AvatarFallback>
              <Text className="text-4xl text-foreground font-poppins-semibold">
                {user?.firstName[0] ?? "L"}
              </Text>
            </AvatarFallback>
          </Avatar>

          <View className="flex flex-col gap-4">
            <H4>
              {user?.firstName} {user?.lastName}
            </H4>
            <Small>{user?.email}</Small>
            <Small className={`${user?.bio ? "" : "text-muted-foreground"}`}>
              {user?.bio ? user.bio : "Nothing to share here yet."}
            </Small>
            <Small className="text-muted-foreground">
              Joined at{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : ""}
            </Small>
          </View>
        </View>
      </CardContent>
    </Card>
  );
};

export default UserInfoSection;
