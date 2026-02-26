import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { fetchCharacters } from "../../src/api";
import { Character } from "../../src/types";

export default function Index() {
  //Lista på alla characters från API:t.
  const [characters, setCharacters] = useState<Character[]>([]);
  //Kontrollerar om vi visar en loader eller inte.
  const [loading, setLoading] = useState<boolean>(false);
  //Character som visas i "featured" sektionen högst upp.
  const [featured, setFeatured] = useState<Character | null>(null);

  //Slumpa random character med bild*
  function pickRandomCharacter() {
    if (characters.length === 0) return;

    const randomIndex = Math.floor(Math.random() * characters.length);
    setFeatured(characters[randomIndex]);
  }

  useEffect(() => {
    //Funktion som hämtar data från API:t och uppdaterar state.
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchCharacters();
        setCharacters(data);
        setFeatured(data[0]);
      } catch (error) {
        console.error("Error fetching characters:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <Text>Loading characters...</Text>;
  }

  return (
    <>
      {/* Full-screen gradient bakgrund */}
      <LinearGradient
        colors={["#0f0c29", "#1a2a6c", "#000428"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Pressable wrapper (används just nu som container) */}
        <Pressable style={styles.container}>
          <Image
            style={styles.logo}
            source={require("../../assets/images/disney-logga.png")}
          ></Image>
          <View style={styles.container}>
            {/* Featured card*/}
            {featured && (
              <View style={styles.featuredCard}>
                <Text style={styles.featuredTitle}>Featured Character</Text>
                {/*Visar bild om den finns*/}
                {featured.imageUrl && (
                  <Image
                    source={{ uri: featured.imageUrl }}
                    style={styles.featuredAvatar}
                  />
                )}
                <Text style={styles.featuredName}>{featured.name}</Text>
                {/*Knapp för att visa random character*/}
                <Pressable
                  style={styles.randomButton}
                  onPress={pickRandomCharacter}
                >
                  <Text style={styles.buttonText}>🎲 Slumpa ny</Text>
                </Pressable>
              </View>
            )}
            {/* Lista på alla characters */}
            <FlatList
              data={characters}
              //Renderar varje character som ett kort i listan
              renderItem={({ item }) => (
                <View style={styles.card}>
                  {item.imageUrl && (
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.avatar}
                    />
                  )}
                  <View style={styles.cardContent}>
                    <Text style={styles.name} numberOfLines={1}>
                      {item.name}
                    </Text>
                    {/* Visar bara film sektionen om det finns filmer */}
                    {!!item.films?.length && (
                      <View style={styles.filmsSection}>
                        <Text style={styles.filmsLabel}>Featured In</Text>
                        <View style={styles.filmsList}>
                          {/*Visar max 3 filmer */}
                          {item.films.slice(0, 3).map((film, index) => (
                            <Text key={index} style={styles.filmItem}>
                              •{film}
                            </Text>
                          ))}
                          {/* Om det finns fler än 3 filmer, visa hur många fler */}
                          {item.films.length > 3 && (
                            <Text style={styles.more}>
                              +{item.films.length - 3} more
                            </Text>
                          )}
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              )}
              // Använd _id som nyckel för varje item
              keyExtractor={(item) => String(item._id)}
            />
          </View>
        </Pressable>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    borderRadius: 14,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 14,
    borderRadius: 12,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#1f5cff",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    gap: 12,
  },
  cardContent: {
    flex: 1,
    minWidth: 0,
    marginTop: 10,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f0f0f0",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
    color: "#f5f5f5",
  },
  filmsSection: {
    marginTop: 6,
  },
  filmsList: {
    gap: 4,
  },

  filmsLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#888",
    textTransform: "uppercase",
  },
  films: {
    color: "#f5f5f5",
    fontSize: 14,
  },
  logo: {
    width: 260,
    height: 150,
    resizeMode: "contain",
    alignSelf: "center",
  },
  filmItem: {
    fontSize: 13,
    color: "#f5f5f5",
    marginBottom: 2,
  },

  more: {
    fontSize: 12,
    color: "#1f5cff",
    marginTop: 4,
  },
  featuredCard: {
    backgroundColor: "#111c44",
    margin: 16,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },

  featuredAvatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginBottom: 12,
    backgroundColor: "#f0f0f0",
  },

  featuredTitle: {
    color: "#9db2ff",
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: 6,
  },

  featuredName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 14,
  },

  randomButton: {
    backgroundColor: "#1f5cff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
