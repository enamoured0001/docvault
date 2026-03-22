import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  uploadDocument,
  getDocumentsByMember,
  deleteDocument
} from "../services/documentservices";

function MemberDocuments() {

  const { id } = useParams();

  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const fetchDocuments = async () => {

    try {

      setLoading(true);
      const data = await getDocumentsByMember(id);
      setDocuments(data.data || []);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchDocuments();

  }, [id]);

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

    try {

      setIsUploading(true);
      await uploadDocument(id, formData);
      alert("Document uploaded");
      setFile(null);
      setTitle("");
      setShowUploadForm(false);
      await fetchDocuments();

    } catch (error) {

      console.log(error);

    } finally {

      setIsUploading(false);

    }

  };

  const handleDelete = async (docId) => {

    try {

      setDeletingId(docId);
      await deleteDocument(docId);
      alert("Document deleted");
      await fetchDocuments();

    } catch (error) {

      console.log(error);

    } finally {

      setDeletingId(null);

    }

  };

  const iconButtonClass = "flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600";

  return (

    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe,#f8fafc_45%,#eef2ff_100%)]">

      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        <section className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                Documents
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Document Library
              </h1>
            </div>

            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
              {documents.length} item{documents.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="mt-6 max-w-md">
            <button
              type="button"
              onClick={() => setShowUploadForm((prev) => !prev)}
              className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
            >
              {showUploadForm ? "Close Upload Form" : "Upload Document"}
            </button>
          </div>

          {showUploadForm && (
            <form
              onSubmit={handleUpload}
              className="mt-5 max-w-2xl space-y-4 rounded-[28px] border border-slate-200 bg-slate-50 p-5"
            >

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Document Name
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex. Aadhaar Card, Policy Copy"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Select File
                </label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-blue-100 file:px-4 file:py-2 file:font-medium file:text-blue-700 hover:file:bg-blue-200"
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                {file ? `Selected file: ${file.name}` : "No file selected yet"}
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className={`w-full rounded-2xl px-5 py-3 text-sm font-semibold transition duration-300 ${
                  isUploading
                    ? "cursor-not-allowed bg-slate-300 text-slate-600"
                    : "bg-blue-600 text-white hover:-translate-y-0.5 hover:bg-blue-700"
                }`}
              >
                {isUploading ? "Uploading..." : "Submit Document"}
              </button>

            </form>
          )}

        </section>

        <section className="mt-8 rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-[0_12px_45px_rgba(15,23,42,0.08)] backdrop-blur">

          {loading ? (

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
              Loading documents...
            </div>

          ) : documents.length === 0 ? (

            <div className="rounded-3xl border border-dashed border-slate-300 bg-[linear-gradient(135deg,#f8fafc,#eef2ff)] p-10 text-center">
              <h3 className="text-xl font-semibold text-slate-900">
                No documents uploaded yet
              </h3>
              <p className="mt-2 text-slate-500">
                Upload Document par click karke first file add karo.
              </p>
            </div>

          ) : (

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              {documents.map((doc) => (

                <div
                  key={doc._id}
                  className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fbff)] p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_40px_rgba(37,99,235,0.15)]"
                >

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-sm font-bold text-blue-700">
                        {doc.fileType === "pdf" ? "PDF" : "IMG"}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-lg font-semibold text-slate-900">
                          {doc.title}
                        </p>
                        <p className="text-sm text-slate-500">
                          {doc.fileType?.toUpperCase()} Document
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={iconButtonClass}
                      title="View"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2">
                        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </a>

                    <a
                      href={doc.fileUrl}
                      download={doc.title}
                      target="_blank"
                      rel="noreferrer"
                      className={iconButtonClass}
                      title="Download"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2">
                        <path d="M12 3v12" />
                        <path d="m7 10 5 5 5-5" />
                        <path d="M5 21h14" />
                      </svg>
                    </a>

                    <button
                      onClick={() => handleDelete(doc._id)}
                      disabled={deletingId === doc._id}
                      className={`${iconButtonClass} ${
                        deletingId === doc._id ? "cursor-not-allowed opacity-60" : "hover:border-rose-200 hover:text-rose-600"
                      }`}
                      title="Delete"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2">
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                      </svg>
                    </button>
                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </div>

    </div>

  );

}

export default MemberDocuments;
