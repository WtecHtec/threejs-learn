import axios from 'axios'
const httpService = axios.create({
  baseURL: 'http://127.0.0.1:3000',
  timeout: 45000,
  method: 'post',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/octet-stream'
  },
  responseType: 'arraybuffer'
})

export default httpService