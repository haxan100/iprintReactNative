import React,{useState,useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  Linking 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Make sure to install this package
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Axios } from 'axios';
import { Toast } from 'react-native-alert-notification';

const {width: viewportWidth} = Dimensions.get('window');

const HomeScreen = ({navigation,route, notificationCount}) => {
  const [userName, setUserName] = useState('User');
  const [activeSlide, setActiveSlide] = useState(0); // State for active slide index
  const [blogPosts, setBlogPosts] = useState([]);
  const [MPs, setMPs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await fetch('https://heyiamhasan.com/porto/iprintNew/Api/getFotoProfile');
        console.log("ssssssssssssssssssssssssssssssssssssssssssssssssss")
        
        const data = await response.json();
        console.log(data)
        console.log("ssssssssssssssssssssssssssssssssssssssssssssssssss")
        console.log(data.message)
        if (data && data.status) {   
          console.log(data)       
          if (data.message === "Harap Login Terlebih Dahulu!") {
            // alert('Harap Login Terlebih Dahulu!');
            Toast('Harap Login Terlebih Dahulu')
            navigation.navigate('Login');
          }

        } else {
          if (data.message === "Harap Login Terlebih Dahulu!") {
            // alert('Harap Login Terlebih Dahulu!');
            // Toast('Harap Login Terlebih Dahulu')
            navigation.navigate('Login');
          }
          console.log('Failed to fetch profile:', data.message);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    getProfile();
  }, []);


  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('https://heyiamhasan.com/porto/iprintNew/Api/getBlog');
        const data = await response.json();
        setBlogPosts(data.data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);
  


  useEffect(() => {
    const fetchMPs = async () => {
      try {
        const response = await fetch('https://heyiamhasan.com/porto/iprintNew/Api/getMarketplace');
        const data = await response.json();
        setMPs(data.data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMPs();
  }, []);

  const renderCarouselItemBlog = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('BlogDetail', { blogId: item.id_blog })} style={styles.slide}>
    <Image source={{ uri: item.foto }} style={styles.carouselImage} />
    <Text style={styles.titleStyle}>{item.judul}</Text>
  </TouchableOpacity>
  );
  const handlePress = async (url) => {
    console.log('Trying to open URL:', url);    
    try {
      const supported = await Linking.openURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.error("Can't handle URL: " + url);
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  };
  // const renderCarouselItemMP = ({ item }) => (
  //   <TouchableOpacity onPress={console.log({item})} style={styles.slide}>
  //   <Image source={{ uri: item.foto }} style={styles.carouselImage} />
  //   <Text style={styles.titleStyle}>{item.judul}</Text>
  // </TouchableOpacity>
  // );
  const renderCarouselItemMP = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item.link)} style={styles.slide}>
      <Image source={{ uri: item.foto }} style={styles.carouselImage} />
      <Text style={styles.titleStyle}>{item.judul}</Text>
    </TouchableOpacity>
  );
  const pagination = () => {
    return (
      <Pagination
        dotsLength={blogPosts.length}
        activeDotIndex={activeSlide}
        containerStyle={styles.paginationContainer}
        dotStyle={styles.paginationDot}
        inactiveDotStyle={styles.paginationInactiveDot}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        const userData = JSON.parse(userDataString);
        const firstName = userData?.nama_user.split(' ')[0] || 'User';
        setUserName(firstName);

      } catch (error) {
        console.error('Failed to load user data', error);
      }
    };

    loadUserData();
  }, []);

  const handlePrintOnly = () => {
    navigation.navigate('PrintOnly');
  }
  const handlePrintCut = () => {
    navigation.navigate('PrintCut');
  }
  const topSliderItems = [
    {
      imageUrl:
        'https://www.iprint.id/wp-content/uploads/2023/02/tentang-kami-iprint.jpg',
    },
    {
      imageUrl:
        'https://www.iprint.id/wp-content/uploads/2024/02/cara-mencuci-bed-cover-400x267.webp',
    },
    // ... more items
  ];

  const renderCarouselItem = ({item}) => (
    <Image source={{uri: item.imageUrl}} style={styles.carouselImage} />
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Selamat datang, {userName}!</Text>
        <TouchableOpacity onPress={()=> navigation.navigate('Cart')}>
          <View style={styles.cartIconContainer}    >
            <Icon name="cart" size={24} color="#5D3FD3" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>{notificationCount}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.actionSection}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (          
          <>
            <Carousel
              data={blogPosts}
              renderItem={renderCarouselItemBlog}
              sliderWidth={viewportWidth}
              itemWidth={viewportWidth}
              loop
              onSnapToItem={(index) => setActiveSlide(index)}
            />
            {pagination()}
          </>
        )}
      </View>
      
      <View style={styles.actionSection}>
      <Text style={styles.promoText}>Buat Kain Favorit-mu Sekarang</Text>

        <TouchableOpacity style={styles.card}
        onPress={handlePrintOnly}>
          <ImageBackground
            source={require('./assets/images/print.png')}
            style={styles.cardBackground}>
            {/* <Text style={styles.cardText}>Print Only</Text> */}
            <Icon
              name="printer"
              size={24}
              color="#FFFFFF"
              style={styles.cardIcon}
            />
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={handlePrintCut}>
          <ImageBackground
          source={require('./assets/images/kainprint.png')}
            style={styles.cardBackground}>
            {/* <Text style={styles.cardText}>Cut n Print</Text> */}
            <Icon
              name="scissors-cutting"
              size={24}
              color="#FFFFFF"
              style={styles.cardIcon}
            />
          </ImageBackground>
        </TouchableOpacity>
      </View>
      <View style={styles.actionSection}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (          
          <>
            <Carousel
              data={MPs}
              renderItem={renderCarouselItemMP}
              sliderWidth={viewportWidth}
              itemWidth={viewportWidth}
              loop
              onSnapToItem={(index) => setActiveSlide(index)}
            />
            {pagination()}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  slide: {
    width: viewportWidth,
    height: 250, // Adjust the height as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    position: 'absolute', // Make it fill the TouchableOpacity
  },
  titleStyle: {
    color: 'black',
    borderWidth:2,
    borderRadius:10,
    backgroundColor:'white',
    fontSize: 20,
    // fontWeight: 'bold',
    textAlign: 'center',
    marginTop: -51, // Adjust the margin as needed
  },
  ationContainer: {
    // backgroundColor: 'rgba(0, 0, 0, 0.75)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  paginationDot: {
    marginTop: -5, // Adjust the margin as needed
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: 'black'
  },
  promoText: {
    marginTop: -5, // Adjust the margin as needed

    fontSize: 21,
    fontWeight: 'bold',
    color:'#331864',
    // Positioning the text above the ImageBackground
    // position: 'absolute',
    zIndex: 1, // Make sure text is above the background image
    alignSelf: 'center', // Center the text within the promo container
    marginTop: 10, // Adjust the distance from the top
    marginBottom: 10, // Adjust the distance from the top
    // backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
    paddingTop: -51, // Padding inside the background
    borderRadius: 20, // Rounded corners
  },
  actionSection: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 2,
  },
  card: {
    elevation: 3, // for shadow on Android
    shadowOpacity: 0.1, // for shadow on iOS
    shadowRadius: 4,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    borderRadius: 10,
    overflow: 'hidden', // This keeps the child image within the border radius
    marginBottom: 10, // Space between cards
  },
  cardBackground: {
    width: 300, // Your custom width
    height: 150, // Your custom height
    justifyContent: 'flex-end', // Align text to the bottom
    alignItems: 'center', // Align text to the center
    padding: 10, // Padding for text inside the card
  },
  cardText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardIcon: {
    // Positioning the icon if necessary
    position: 'absolute',
    top: 10,
    right: 10,
  },
  headerIcon: {
    color: '#3A0CA3',
  },

  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    marginTop: 20,
    marginBottom: 25,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  container: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 20,
  },
  carouselImage: {
    width: viewportWidth, // Width of the viewport
    height: 200,
    borderRadius: 8,
  },
  carouselImageBlog: {
    width: viewportWidth, // Width of the viewport
    height: 210,
    borderRadius: 8,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  optionButton: {
    backgroundColor: '#fff', // A background color
    elevation: 2, // Shadow for Android
    padding: 15,
    borderRadius: 8,
  },
  carouselContainer: {
    marginVertical: 20,
  },
  cartIconContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Add additional styles for bottom tab navigation as needed
});

export default HomeScreen;
