import axios from 'axios'

const API = axios.create({
    baseURL: 'http://localhost:5000' ,
})

export const uploadBook = (file, title) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
  
    return API.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };
  

export const getBooks = () => API.get('/books');

export const sendMessage = (bookId, message) => {
    return API.post('/chat',{bookId,message});
}


