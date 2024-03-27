import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';

const BlogDetailScreen = ({ route, navigation }) => {
  const { blogId } = route.params;
  const [blogData, setBlogData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const getBlogById = async () => {
      try {
        const response = await fetch(`https://heyiamhasan.com/porto/iprintNew/Api/getBlogById/${blogId}`);
        const json = await response.json();
        console.log("=========================")
        console.log(json.data)
        console.log(blogId)
        console.log("=========================")
        if (json.status) {
          setBlogData(json.data);
        } else {
          alert(json.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getBlogById();
  }, [blogId]);

  const source = {
    html: blogData ? blogData.isi : ''
  };
  const tagsStyles = {
    body: {color: 'black'}, // Ubah warna teks menjadi hitam atau warna yang diinginkan
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevron-back" size={30} color="#6200EE" />
            </TouchableOpacity>
            {isLoading ? (
            <Text style={styles.title}>Memuat...</Text>
            ) : blogData ? (
            <Text style={styles.title}>{blogData.judul}</Text>
            ) : (
            <Text style={styles.title}>Blog tidak ditemukan</Text>
            )}
        </View>
        {/* Content */}
        <ScrollView style={styles.container}>
            {isLoading ? (
            <ActivityIndicator size="large" color="#6200EE" />
            ) : blogData ? (
            <View style={styles.content}>
                <Image source={{ uri: blogData.foto }} style={styles.blogImage} />
                <RenderHtml
                tagsStyles={tagsStyles}
                contentWidth={width}
                source={{ html: blogData.isi }}
                />
            </View>
            ) : (
            <Text>Blog tidak ditemukan!</Text>
            )}
        </ScrollView>
        </SafeAreaView>

  );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 12,
        backgroundColor: '#fff', // or any color that fits your design
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0', // light grey
        zIndex: 10,
      },
      backButton: {
        position: 'absolute',
        left: 10,
        top: 12,
      },
      title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#6200EE',
      },
      container: {
        flex: 1,
      },

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    marginTop: 20,
    marginLeft: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6200EE',
    textAlign: 'center',
    marginVertical: 20,
  },
  content: {
    paddingHorizontal: 20,
  },
  blogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  blogImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 15,
  },
  // Rest of your styles...
});

export default BlogDetailScreen;
