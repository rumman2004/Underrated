import React, { useState, useCallback } from 'react';
import { Mail, MapPin, Send, MessageSquare, Link as LinkIcon, Image as ImageIcon, Loader2, UploadCloud, X } from 'lucide-react';
import { PrimaryButton } from '../../components/common/Buttons';
import API from '../../utils/api';
import { toast } from 'react-toastify';

const Contact = () => {
  const [activeTab, setActiveTab] = useState('suggest'); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // State for file objects and their preview URLs
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    placeName: '',
    location: '',
    mapUrl: '',
    description: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Image Handling Logic ---

  const handleFiles = (files) => {
    const newFiles = Array.from(files);
    
    // Validate total count
    if (imageFiles.length + newFiles.length > 4) {
      toast.warning("You can upload a maximum of 4 images.");
      return;
    }

    // Process files
    const validFiles = newFiles.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== newFiles.length) {
      toast.warning("Some files were skipped. Only images are allowed.");
    }

    setImageFiles(prev => [...prev, ...validFiles]);

    // Generate Previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [imageFiles]);

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      // Revoke URL to prevent memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // --- Upload Helper ---
  const uploadImagesToBackend = async () => {
    const uploadedUrls = [];
    
    for (const file of imageFiles) {
      const data = new FormData();
      data.append('image', file); // key matches backend 'upload.single("image")'

      try {
        // Upload to the existing places upload route
        const res = await API.post('/places/upload', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedUrls.push(res.data.url);
      } catch (error) {
        console.error("Image upload failed for file:", file.name, error);
        toast.error(`Failed to upload ${file.name}`);
        throw new Error("Image upload failed");
      }
    }
    return uploadedUrls;
  };

  // --- Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email) {
      toast.warning("Please fill in your name and email.");
      return;
    }

    if (activeTab === 'suggest') {
      if (imageFiles.length < 2) {
        toast.warning("Please upload at least 2 images of the place.");
        return;
      }
      if (imageFiles.length > 4) {
        toast.warning("You can only upload up to 4 images.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      let finalImageUrls = [];
      let finalMessage = formData.message;

      // If suggesting a place, Upload Images First
      if (activeTab === 'suggest') {
        finalImageUrls = await uploadImagesToBackend();
        
        // Construct detailed message logic:
        // We still create the text block for the 'message' field,
        // but we ALSO send the images array separately below.
        finalMessage = `
Place Name: ${formData.placeName}
Location: ${formData.location}
Description: ${formData.description}
Google Map: ${formData.mapUrl}
        `.trim();
      }

      // Prepare payload
      const payload = {
        name: formData.name,
        email: formData.email,
        type: activeTab === 'suggest' ? 'Place Suggestion' : 'General Inquiry',
        placeName: activeTab === 'suggest' ? formData.placeName : undefined,
        location: activeTab === 'suggest' ? formData.location : undefined,
        mapUrl: activeTab === 'suggest' ? formData.mapUrl : undefined,
        description: activeTab === 'suggest' ? formData.description : undefined,
        message: finalMessage,
        images: finalImageUrls // FIX: Include the array so Admin can see gallery
      };

      // FIX: Changed endpoint to match the new route created (/api/contacts)
      await API.post('/contacts', payload);
      
      toast.success("Message sent successfully! We'll review your suggestion.");
      
      // Reset form
      setFormData({ name: '', email: '', placeName: '', location: '', mapUrl: '', description: '', message: '' });
      setImageFiles([]);
      setPreviews([]);
      
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-surface)] pt-24 pb-12 md:pt-32 md:pb-24 px-4 md:px-6 relative overflow-hidden font-sans">
      
      {/* Background Decor (Smaller blobs on mobile) */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[var(--color-sapling-300)] rounded-full blur-[80px] md:blur-[120px] opacity-20 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-[var(--color-darkblue-200)] rounded-full blur-[80px] md:blur-[120px] opacity-10 -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-[var(--color-darkblue-50)] border border-[var(--color-darkblue-100)] text-[var(--color-darkblue-600)] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4 md:mb-6">
            <Mail className="w-3 h-3" />
            Get in Touch
          </div>
          <h1 className="text-3xl md:text-6xl font-serif font-bold text-[var(--color-darkblue-900)] mb-3 md:mb-6 leading-tight">
            Share a hidden gem <br />
            <span className="text-[var(--color-darkblue-500)] italic">or just say hello.</span>
          </h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="bg-[var(--color-sapling-100)] p-1 md:p-1.5 rounded-full inline-flex border border-[var(--color-sapling-200)] w-full md:w-auto">
            <button onClick={() => setActiveTab('suggest')} className={`flex-1 md:flex-none px-5 py-2.5 md:px-8 md:py-3 rounded-full text-xs md:text-sm font-bold transition-all duration-300 ${activeTab === 'suggest' ? 'bg-white text-[var(--color-darkblue-900)] shadow-md' : 'text-[var(--color-text-muted)] hover:text-[var(--color-darkblue-600)]'}`}>
              Suggest a Place
            </button>
            <button onClick={() => setActiveTab('message')} className={`flex-1 md:flex-none px-5 py-2.5 md:px-8 md:py-3 rounded-full text-xs md:text-sm font-bold transition-all duration-300 ${activeTab === 'message' ? 'bg-white text-[var(--color-darkblue-900)] shadow-md' : 'text-[var(--color-text-muted)] hover:text-[var(--color-darkblue-600)]'}`}>
              General Inquiry
            </button>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-[var(--color-sapling-200)] shadow-xl p-6 md:p-16 relative">
          <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
            
            {/* Section 1: Who are you? */}
            <div>
              <h3 className="text-xs md:text-sm font-bold text-[var(--color-darkblue-400)] uppercase tracking-wider mb-4 md:mb-6 border-b border-[var(--color-sapling-200)] pb-2">About You</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--color-darkblue-800)]">Your Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-[var(--color-sapling-50)] border border-[var(--color-sapling-200)] rounded-xl px-4 py-3 md:py-3.5 focus:ring-2 focus:ring-[var(--color-sapling-300)] outline-none text-sm md:text-base" placeholder="e.g. Alex Explorer" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--color-darkblue-800)]">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[var(--color-sapling-50)] border border-[var(--color-sapling-200)] rounded-xl px-4 py-3 md:py-3.5 focus:ring-2 focus:ring-[var(--color-sapling-300)] outline-none text-sm md:text-base" placeholder="e.g. alex@example.com" required />
                </div>
              </div>
            </div>

            {/* CONDITIONAL: Suggest a Place */}
            {activeTab === 'suggest' && (
              <div className="space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                   <h3 className="text-xs md:text-sm font-bold text-[var(--color-darkblue-400)] uppercase tracking-wider mb-4 md:mb-6 border-b border-[var(--color-sapling-200)] pb-2">The Hidden Gem</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[var(--color-darkblue-800)]">Place Name</label>
                      <input type="text" name="placeName" value={formData.placeName} onChange={handleChange} className="w-full bg-[var(--color-sapling-50)] border border-[var(--color-sapling-200)] rounded-xl px-4 py-3 md:py-3.5 focus:ring-2 focus:ring-[var(--color-sapling-300)] outline-none text-sm md:text-base" placeholder="e.g. Secret Bamboo Grove" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[var(--color-darkblue-800)]">City / District</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-darkblue-400)] w-5 h-5" />
                        <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-[var(--color-sapling-50)] border border-[var(--color-sapling-200)] rounded-xl pl-12 pr-4 py-3 md:py-3.5 focus:ring-2 focus:ring-[var(--color-sapling-300)] outline-none text-sm md:text-base" placeholder="e.g. Kyoto, Japan" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Image Upload Area */}
                  <div className="mb-6 md:mb-8">
                    <label className="text-sm font-bold text-[var(--color-darkblue-800)] mb-3 block">
                      Photos (2-4 Required)
                    </label>
                    
                    {/* Drag & Drop Zone */}
                    <div 
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                      className={`
                        border-2 border-dashed rounded-2xl p-6 md:p-8 text-center transition-all duration-200
                        ${isDragging 
                          ? 'border-[var(--color-sapling-400)] bg-[var(--color-sapling-50)] scale-[1.01]' 
                          : 'border-[var(--color-sapling-200)] bg-[var(--color-bg-surface)] hover:border-[var(--color-sapling-300)]'
                        }
                      `}
                    >
                      <input 
                        type="file" 
                        id="file-upload" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleFiles(e.target.files)}
                      />
                      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2 md:gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-[var(--color-darkblue-600)]">
                          <UploadCloud className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-[var(--color-darkblue-900)] text-sm md:text-base">
                            Click to upload <span className="font-normal text-[var(--color-text-muted)] hidden md:inline">or drag and drop</span>
                          </p>
                          <p className="text-[10px] md:text-xs text-[var(--color-text-muted)] mt-1">
                            SVG, PNG, JPG or GIF (max 4 photos)
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Previews */}
                    {previews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-4 md:mt-6 animate-in fade-in slide-in-from-top-2">
                        {previews.map((src, index) => (
                          <div key={index} className="relative group rounded-xl overflow-hidden aspect-square border border-[var(--color-sapling-200)] shadow-sm">
                            <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                            >
                              <X className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 mb-6 md:mb-8">
                    <label className="text-sm font-bold text-[var(--color-darkblue-800)]">Google Maps Link</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-darkblue-400)] w-5 h-5" />
                      <input type="url" name="mapUrl" value={formData.mapUrl} onChange={handleChange} className="w-full bg-[var(--color-sapling-50)] border border-[var(--color-sapling-200)] rounded-xl pl-12 pr-4 py-3 md:py-3.5 focus:ring-2 focus:ring-[var(--color-sapling-300)] outline-none text-sm md:text-base" placeholder="Paste the Google Maps share link here..." />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--color-darkblue-800)]">Why is it underrated?</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full bg-[var(--color-sapling-50)] border border-[var(--color-sapling-200)] rounded-xl px-4 py-3 md:py-3.5 focus:ring-2 focus:ring-[var(--color-sapling-300)] outline-none resize-none text-sm md:text-base" placeholder="Tell us about the history, the vibe, or why tourists usually miss it..."></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* CONDITIONAL: General Message */}
            {activeTab === 'message' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <label className="text-sm font-bold text-[var(--color-darkblue-800)]">Your Message</label>
                 <textarea name="message" value={formData.message} onChange={handleChange} rows="6" className="w-full bg-[var(--color-sapling-50)] border border-[var(--color-sapling-200)] rounded-xl px-4 py-3 md:py-3.5 focus:ring-2 focus:ring-[var(--color-sapling-300)] outline-none resize-none text-sm md:text-base" placeholder="How can we help you?"></textarea>
              </div>
            )}

            <div className="pt-4 md:pt-6 border-t border-[var(--color-sapling-200)] flex justify-end">
              <PrimaryButton className="w-full md:w-auto flex items-center justify-center gap-2 md:gap-3 px-8 md:px-10 py-3 md:py-4 text-base md:text-lg bg-[var(--color-darkblue-600)] text-white hover:bg-[var(--color-darkblue-700)] shadow-lg shadow-[var(--color-darkblue-600)]/20" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                <span>{isSubmitting ? 'Uploading & Sending...' : (activeTab === 'suggest' ? 'Submit Location' : 'Send Message')}</span>
              </PrimaryButton>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;