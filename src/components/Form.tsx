import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useMutation } from 'react-query';
import axiosInstance from '../api/axiosInstance';

const MyForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const mutation = useMutation((formData: FormData) => {
    return axiosInstance.post('/upload', formData);
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    mutation.mutate(formData);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // ✅ JSX must be returned from the component
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept="video/*" // Only allow video files
        onChange={handleFileChange}
        className='cursor-pointer'
      />
      <button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
};

export default MyForm;
