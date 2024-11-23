import { meditations } from "@src/data/meditations";
import { router, useLocalSearchParams } from "expo-router";
import { FC, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";

interface Props {}

const MeditationDetails: FC<Props> = (props) => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [position, setPosition] = useState<number | null>(null);

  async function playPauseSound() {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  }

  async function loadSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/meditations/audio.mp3"),
      { shouldPlay: false }
    );
    setSound(sound);
    setIsPlaying(false);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
        setDuration(status.durationMillis || 0);
        setPosition(status.positionMillis || 0);
      }
    });
  }

  // Load the sound when the component mounts
  useEffect(() => {
    loadSound();
  }, []);

  // Clean up the sound (pause and unload) when the component unmounts
  useEffect(() => {
    return () => {
      if (sound) {
        sound.pauseAsync();
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handleSliderChange = async (value: number) => {
    if (sound && duration) {
      const seekPosition = value * duration;
      await sound.setPositionAsync(seekPosition);
    }
  };

  const formatTime = (millis: number | null) => {
    if (!millis) return "00:00";
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // const { top } = useSafeAreaInsets();

  const meditation = meditations.find((item) => item.id === Number(id));

  if (!meditation) return <Text>Meditation not found</Text>;

  return (
    <SafeAreaView className="bg-orange-500 flex-1 justify-between">
      <View className="flex-1">
        <View className="flex-1">
          {/*Header*/}
          <View className="flex-row items-center justify-between p-10">
            <AntDesign
              onPress={() => router.back()}
              name="infocirlceo"
              size={24}
              color={"black"}
              className=""
            />
            <View className="bg-zinc-800 p-2 rounded-md">
              <Text className="text-zinc-100 font-semibold">
                Today's meditation
              </Text>
            </View>
            <AntDesign
              onPress={() => router.back()}
              name="close"
              size={24}
              color={"black"}
              className=""
            />
          </View>
          <Text className="text-3xl mt-5 text-zinc-800 text-center font-semibold">
            {meditation.title}
          </Text>
        </View>

        <Pressable
          onPress={playPauseSound}
          className="bg-zinc-800 self-center items-center justify-center p-6 w-fit aspect-square rounded-full"
        >
          <FontAwesome6
            name={isPlaying ? "pause" : "play"}
            size={24}
            color={"snow"}
          />
        </Pressable>

        {/*Bottom part*/}
        <View className="flex-1">
          {/*Footer: Player*/}
          <View className="p-10 mt-auto gap-5">
            <View className="flex-row justify-between">
              <MaterialIcons name="airplay" size={24} color="#3A3937" />
              <MaterialCommunityIcons
                name="cog-outline"
                size={24}
                color="#3A3937"
              />
            </View>
            <View>
              <Slider
                style={{ width: "100%", height: 3 }}
                value={position && duration ? position / duration : 0}
                onSlidingComplete={handleSliderChange}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor="#3A3937"
                maximumTrackTintColor="#3A393755"
                thumbTintColor="#3A3937"
              />
            </View>
            <View className="w-full flex-row justify-between">
              <Text>{formatTime(position)}</Text>
              <Text>{formatTime(duration)}</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MeditationDetails;
