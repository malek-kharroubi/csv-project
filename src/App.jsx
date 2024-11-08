import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {

    //make sure it is a CSV file
    if (e.target.files[0] && e.target.files[0].type !== 'text/csv') {
      setMessage('Veuillez sélectionner un fichier CSV valide.');
      setFile(null);
      return;
    }
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a download link.
      const link = document.createElement('a');
      link.href = url;
      link.download = 'result.zip';
      document.body.appendChild(link);
      link.click();
      setMessage('File processed and downloaded successfully.');

      // free up memory.
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log('error ',error)
      setMessage('Error uploading file.');
    }
  };

  return (
    <div>
      <h2>Upload CSV File</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
