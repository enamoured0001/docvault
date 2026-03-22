import { useState } from "react";
import { uploadDocument } from "../services/documentservices";

function UploadDocument({ memberId }) {

  const [file,setFile] = useState(null);
  const [title, setTitle] = useState("");

  const handleUpload = async (e) => {

    e.preventDefault();

    if (!title.trim()) {
      alert("Enter document name");
      return;
    }

    if (!file) {
      alert("Select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    formData.append("title", title.trim());

    try{

      const data = await uploadDocument(memberId, formData);

      alert("Document uploaded successfully");

      setTitle("");
      setFile(null);

      console.log(data);

    }catch(error){

      console.log(error);

    }

  };

  return (

    <form onSubmit={handleUpload} className="space-y-4">

      <input
        type="text"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
        placeholder="Enter document name"
        className="w-full rounded border px-3 py-2"
      />

      <input
        type="file"
        onChange={(e)=>setFile(e.target.files[0])}
        className="w-full rounded border px-3 py-2"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Upload
      </button>

    </form>

  );

}

export default UploadDocument;
