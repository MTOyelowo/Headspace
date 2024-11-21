import { meditations } from "@src/data/meditations";
import { router, useLocalSearchParams } from "expo-router";
import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

interface Props {}

const MeditationDetails: FC<Props> = (props) => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { top } = useSafeAreaInsets();

  const meditation = meditations.find((item) => item.id === Number(id));

  if (!meditation) return <Text>Meditation not found</Text>;

  return (
    <SafeAreaView>
      <AntDesign
        onPress={() => router.back()}
        name="close"
        size={24}
        color={"black"}
        style={{ top: top + 2 }}
        className="absolute right-4 z-10"
      />

      <Text className="text-3xl">
        {meditation.title}: {top}
      </Text>
    </SafeAreaView>
  );
};

export default MeditationDetails;
