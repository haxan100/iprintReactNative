import Axios from 'axios';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';

// Inisialisasi cookie jar
const cookieJar = new CookieJar();
console.log("COKIEEEEEE?")
console.log(CookieJar)
console.log("COKIEEEEEE?")
// Membuat instance Axios yang mendukung cookies
const Api = wrapper(Axios.create({ jar: cookieJar, withCredentials: true }));

export default Api;