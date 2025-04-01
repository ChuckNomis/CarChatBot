import react, {useState} from 'react';
import {uploadBook} from '../api';
export default function UploadBook({ onUpload }){
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!file || !title) return alert('Please select a file and enter a title');
        try {
            await uploadBook(file,title);
            alert('Uploaded!');
            onUpload(); // Refresh book list
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Book title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
            <button type="submit">Upload</button>
        </form>
    );

}