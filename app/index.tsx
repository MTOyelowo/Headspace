import { Text, View, FlatList } from "react-native";

import { meditations } from "@src/data/meditations";
import { MeditationListItem } from "@src/components/MeditationListItem";

export default function HomeScreen() {
  return (
    <FlatList
      data={meditations}
      contentContainerClassName="gap-5 p-3"
      renderItem={({ item, index }) => (
        <MeditationListItem meditation={item} key={index} />
      )}
    />
  );
}
