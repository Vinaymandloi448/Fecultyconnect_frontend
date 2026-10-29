/**
 * DocumentsPage — Shared Files and Academic Documents Repository
 *
 * Dedicated files view showing syllabus blueprints, lab manuals,
 * rosters, and research papers with search, category filtering,
 * preview modal, and upload modal.
 */

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  FileText,
  FileSpreadsheet,
  Download,
  Eye,
  Upload,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  User,
  Hash,
  X,
  FilePlus,
} from 'lucide-react';
import Modal from '../components/ui/Modal';
import {
  setSelectedCategory,
  setSearchQuery,
  addDocument,
} from '../features/documents/documentsSlice';

export default function DocumentsPage() {
  const dispatch = useDispatch();
  const { documents, selectedCategory, searchQuery } = useSelector((state) => state.documents);
  const { user } = useSelector((state) => state.auth);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  // Upload modal state
  const [uploadName, setUploadName] = useState('');
  const [uploadChannel, setUploadChannel] = useState('faculty-resources');
  const [uploadCategory, setUploadCategory] = useState('Curriculum');
  const [uploadSize, setUploadSize] = useState('1.5 MB');

  const categories = ['All', 'Examinations', 'Lab Manuals', 'Rosters', 'Curriculum', 'Research', 'Guidelines'];

  const filteredDocs = documents
    .filter((d) => (selectedCategory === 'All' ? true : d.category === selectedCategory))
    .filter(
      (d) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.sharedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.channel.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadName.trim()) return;

    const ext = uploadName.includes('.') ? uploadName.split('.').pop() : 'pdf';

    dispatch(
      addDocument({
        name: uploadName.trim(),
        type: ext,
        size: uploadSize,
        sharedBy: user?.fullName || 'Faculty Member',
        sharedByRole: user?.designation || 'Faculty',
        channel: uploadChannel,
        category: uploadCategory,
      }),
    );

    setIsUploadModalOpen(false);
    setUploadName('');
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'xlsx':
      case 'xls':
      case 'csv':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
      case 'docx':
      case 'doc':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'pdf':
      default:
        return <FileText className="w-5 h-5 text-rose-600" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6 select-none">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Shared Academic Documents & Files
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Course curriculum blueprints, lab manuals, examination rosters, and research grant guidelines.
          </p>
        </div>

        {/* Action Button: Upload */}
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Share Document</span>
        </button>
      </div>

      {/* ── FILTERS & SEARCH ROW ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => dispatch(setSelectedCategory(cat))}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search documents or sharer..."
            className="w-full sm:w-64 pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-600"
          />
        </div>
      </div>

      {/* ── DOCUMENTS TABLE / GRID ── */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Document Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Shared By</th>
                <th className="py-3 px-4">Upload Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No documents found matching the filter.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* File Name & Icon */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2.5 min-w-[200px]">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          {getFileIcon(doc.type)}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-bold text-slate-800" title={doc.name}>
                            {doc.name}
                          </div>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {doc.size}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-semibold text-[11px]">
                        {doc.category || 'General'}
                      </span>
                    </td>

                    {/* Channel */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1 font-mono text-[11px]">
                        <Hash className="w-3 h-3 text-slate-400" />
                        <span>{doc.channel}</span>
                      </div>
                    </td>

                    {/* Shared by */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="truncate max-w-[140px] font-medium">
                        {doc.sharedBy}
                      </div>
                    </td>

                    {/* Upload date */}
                    <td className="py-3.5 px-4 text-slate-400">
                      {doc.uploadDate}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="p-1.5 rounded-md text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                          title="Preview document"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => alert(`Simulated download for: ${doc.name}`)}
                          className="p-1.5 rounded-md text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                          title="Download document"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── PREVIEW MODAL ── */}
      {previewDoc && (
        <Modal
          isOpen={Boolean(previewDoc)}
          onClose={() => setPreviewDoc(null)}
          title={previewDoc.name}
          subtitle={`Shared by ${previewDoc.sharedBy} in #${previewDoc.channel}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-slate-800">
            <div className="p-8 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-800 mx-auto flex items-center justify-center">
                {getFileIcon(previewDoc.type)}
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900">{previewDoc.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  File Size: {previewDoc.size} · Uploaded: {previewDoc.uploadDate}
                </p>
              </div>
              <div className="max-w-md mx-auto p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 leading-relaxed text-left">
                <span className="font-bold block text-slate-800 mb-1">Academic Resource Abstract:</span>
                This document is part of the official curriculum repository for FacultyConnect members. It has been verified by the respective department committee for syllabus compliance.
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  alert(`Downloading ${previewDoc.name}`);
                  setPreviewDoc(null);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-700 text-white text-xs font-semibold hover:bg-purple-800"
              >
                <Download className="w-4 h-4" />
                <span>Download File</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── UPLOAD MODAL ── */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Share Academic Document"
        subtitle="Upload syllabi, question blueprints, lab manuals, or conference templates."
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4 text-slate-800">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Document Name
            </label>
            <input
              type="text"
              required
              value={uploadName}
              onChange={(e) => setUploadName(e.target.value)}
              placeholder="e.g. CSE_701_Cloud_Architecture_Syllabus.pdf"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-purple-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Target Channel
              </label>
              <select
                value={uploadChannel}
                onChange={(e) => setUploadChannel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              >
                <option value="faculty-resources">#faculty-resources</option>
                <option value="computer-science">#computer-science</option>
                <option value="examination-updates">#examination-updates</option>
                <option value="general">#general</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Category
              </label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              >
                <option value="Curriculum">Curriculum</option>
                <option value="Lab Manuals">Lab Manuals</option>
                <option value="Examinations">Examinations</option>
                <option value="Rosters">Rosters</option>
                <option value="Research">Research</option>
              </select>
            </div>
          </div>

          {/* Development mock notice */}
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
            <strong>Development Notice:</strong> When running without a backend file storage endpoint, uploaded documents are registered in client-side memory for testing.
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-purple-700 text-white text-xs font-semibold hover:bg-purple-800"
            >
              Share Document
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
