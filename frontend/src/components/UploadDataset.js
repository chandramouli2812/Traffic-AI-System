import React, { useState } from 'react'
import { API } from '../api'

export function UploadDataset() {

  const [file, setFile] = useState(null)

  const uploadFile = async () => {

    const formData = new FormData()

    formData.append('file', file)

    await API.post('/upload-dataset', formData)

    alert('Dataset Uploaded')
  }

  return (
    <div className="panel-section">
      <h2>Upload Dataset</h2>

      <input
        type='file'
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={uploadFile} disabled={!file}>
        Upload Dataset
      </button>
    </div>
  )
}
