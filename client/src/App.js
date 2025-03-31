import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const uploadBook = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API_URL}/upload`, formData);
};

export const sendMessage = async (message) => {
  return axios.post(`${API_URL}/chat`, { message });
};




function App() {
  <div>
    
  </div>
}

export default App;
