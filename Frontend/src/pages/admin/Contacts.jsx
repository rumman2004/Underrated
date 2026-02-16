import React, { useEffect, useState } from 'react';
import { Mail, MapPin, Trash2, Check, ExternalLink, MessageSquare, Image as ImageIcon, Loader2 } from 'lucide-react';
import API from '../../utils/api';
import { toast } from 'react-toastify';

const Contacts = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Place Suggestion'); // 'Place Suggestion' | 'General Inquiry'

  const fetchSubmissions = async () => {
    try {
      const { data } = await API.get('/contacts');
      setSubmissions(data);
    } catch (error) {
      console.error("Failed to load contacts", error);
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await API.delete(`/contacts/${id}`);
      setSubmissions(prev => prev.filter(s => s._id !== id));
      toast.success("Submission deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const filteredSubmissions = submissions.filter(s => s.type === activeTab);

  if (loading) return (
    <div className="h-64 flex flex-col items-center justify-center text-[var(--color-text-muted)]">
      <Loader2 className="w-8 h-8 animate-spin mb-2" />
      <p>Loading Messages...</p>
    </div>
  );

  return (
    <div className="pb-20">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[var(--color-darkblue-900)]">Inbox</h1>
          <p className="text-[var(--color-text-muted)]">Manage community suggestions and inquiries</p>
        </div>
        
        {/* Tabs */}
        <div className="bg-[var(--color-sapling-100)] p-1 rounded-xl inline-flex">
          <button 
            onClick={() => setActiveTab('Place Suggestion')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'Place Suggestion' ? 'bg-white shadow-sm text-[var(--color-darkblue-900)]' : 'text-[var(--color-darkblue-600)] hover:bg-[var(--color-sapling-200)]'}`}
          >
            Suggestions
          </button>
          <button 
            onClick={() => setActiveTab('General Inquiry')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'General Inquiry' ? 'bg-white shadow-sm text-[var(--color-darkblue-900)]' : 'text-[var(--color-darkblue-600)] hover:bg-[var(--color-sapling-200)]'}`}
          >
            Inquiries
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredSubmissions.length > 0 ? (
          filteredSubmissions.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl border border-[var(--color-sapling-200)] p-6 shadow-sm hover:shadow-md transition-shadow">
              
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-sapling-50)] flex items-center justify-center text-[var(--color-darkblue-700)] font-bold">
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--color-darkblue-900)]">{item.name}</h3>
                    <p className="text-xs text-[var(--color-text-muted)]">{item.email} • {new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(item._id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Content Based on Type */}
              {item.type === 'Place Suggestion' ? (
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4 bg-[var(--color-bg-surface)] p-4 rounded-xl border border-[var(--color-sapling-100)]">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-[var(--color-darkblue-800)]">
                        <MapPin className="w-4 h-4 text-[var(--color-sapling-400)]" /> {item.placeName}
                      </div>
                      <p className="text-sm text-[var(--color-text-muted)]">{item.location}</p>
                      {item.mapUrl && (
                        <a href={item.mapUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" /> View Map Link
                        </a>
                      )}
                    </div>
                    {item.images && item.images.length > 0 && (
                      <div className="flex gap-2">
                        {item.images.map((img, i) => (
                          <a key={i} href={img} target="_blank" rel="noreferrer" className="w-16 h-16 rounded-lg overflow-hidden border border-[var(--color-sapling-200)]">
                            <img src={img} alt="Suggestion" className="w-full h-full object-cover hover:scale-110 transition-transform" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 text-sm text-[var(--color-darkblue-800)] leading-relaxed">
                    <span className="block text-xs font-bold uppercase text-[var(--color-text-muted)] mb-1">Reason for Suggestion:</span>
                    {item.message}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-gray-50 text-sm text-[var(--color-darkblue-800)] leading-relaxed">
                  <MessageSquare className="w-4 h-4 inline mr-2 text-[var(--color-sapling-400)]" />
                  {item.message}
                </div>
              )}

            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-[var(--color-sapling-200)] border-dashed">
            <Mail className="w-12 h-12 text-[var(--color-sapling-200)] mx-auto mb-3" />
            <p className="text-[var(--color-text-muted)]">No messages in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contacts;