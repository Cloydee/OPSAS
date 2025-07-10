import React, { useState } from 'react';
import { FileText, Clock, MapPin, Users, Download } from 'lucide-react';
import jsPDF from 'jspdf';

interface FormData {
  fullName: string;
  rank: string;
  timeOut: string;
  timeReturn: string;
  placesToVisit: string;
  reasonForVisit: string;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    rank: '',
    timeOut: '',
    timeReturn: '',
    placesToVisit: '',
    reasonForVisit: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ranks = [
    'Teacher I',
    'Teacher II', 
    'Teacher III',
    'Master Teacher I',
    'School Head',
    'Principal',
    'ADAS',
    'ADA'
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.rank) {
      newErrors.rank = 'Rank is required';
    }
    if (!formData.timeOut) {
      newErrors.timeOut = 'Time to be out is required';
    }
    if (!formData.timeReturn) {
      newErrors.timeReturn = 'Time to return is required';
    }
    if (!formData.placesToVisit.trim()) {
      newErrors.placesToVisit = 'Place(s) to be visited is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('GNHS-OPSAS', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Guinsiliban National High School', 105, 30, { align: 'center' });
    doc.text('Online Pass Slip Application System', 105, 40, { align: 'center' });
    
    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('PASS SLIP APPLICATION', 105, 60, { align: 'center' });
    
    // Form details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    let yPosition = 80;
    
    doc.text(`Full Name: ${formData.fullName}`, 20, yPosition);
    yPosition += 15;
    
    doc.text(`Rank: ${formData.rank}`, 20, yPosition);
    yPosition += 15;
    
    doc.text(`Time to be Out: ${formData.timeOut}`, 20, yPosition);
    yPosition += 15;
    
    doc.text(`Time to Return: ${formData.timeReturn}`, 20, yPosition);
    yPosition += 15;
    
    doc.text(`Place(s) to be Visited: ${formData.placesToVisit}`, 20, yPosition);
    yPosition += 15;
    
    if (formData.reasonForVisit) {
      doc.text(`Reason(s) for Visit: ${formData.reasonForVisit}`, 20, yPosition);
      yPosition += 15;
    }
    
    // Approval section
    yPosition += 20;
    doc.text('Approved: ____________________', 20, yPosition);
    yPosition += 20;
    doc.text('School Principal', 20, yPosition);
    
    // Footer
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 280);
    
    doc.save(`pass-slip-${formData.fullName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate form submission delay
    setTimeout(() => {
      generatePDF();
      setIsSubmitting(false);
      
      // Reset form
      setFormData({
        fullName: '',
        rank: '',
        timeOut: '',
        timeReturn: '',
        placesToVisit: '',
        reasonForVisit: ''
      });
      
      alert('Pass slip application submitted successfully! PDF has been generated.');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">GNHS-OPSAS</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Guinsiliban National High School - Online Pass Slip Application System
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <div className="flex items-center text-white">
                <FileText className="w-8 h-8 mr-3" />
                <h2 className="text-2xl font-bold">Pass Slip Application Form</h2>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    Enter your complete name: First Name, Middle Initial, Surname
                  </p>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                        errors.fullName 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder="e.g., Juan M. Dela Cruz"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

                {/* Rank */}
                <div>
                  <label htmlFor="rank" className="block text-sm font-semibold text-gray-700 mb-2">
                    Rank <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="rank"
                    value={formData.rank}
                    onChange={(e) => handleInputChange('rank', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      errors.rank 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-300 focus:border-blue-500'
                    }`}
                  >
                    <option value="">Select your rank</option>
                    {ranks.map((rank) => (
                      <option key={rank} value={rank}>
                        {rank}
                      </option>
                    ))}
                  </select>
                  {errors.rank && (
                    <p className="mt-1 text-sm text-red-600">{errors.rank}</p>
                  )}
                </div>

                {/* Time Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="timeOut" className="block text-sm font-semibold text-gray-700 mb-2">
                      Time to be Out <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="time"
                        id="timeOut"
                        value={formData.timeOut}
                        onChange={(e) => handleInputChange('timeOut', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                          errors.timeOut 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-300 focus:border-blue-500'
                        }`}
                      />
                    </div>
                    {errors.timeOut && (
                      <p className="mt-1 text-sm text-red-600">{errors.timeOut}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="timeReturn" className="block text-sm font-semibold text-gray-700 mb-2">
                      Time to Return <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="time"
                        id="timeReturn"
                        value={formData.timeReturn}
                        onChange={(e) => handleInputChange('timeReturn', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                          errors.timeReturn 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-300 focus:border-blue-500'
                        }`}
                      />
                    </div>
                    {errors.timeReturn && (
                      <p className="mt-1 text-sm text-red-600">{errors.timeReturn}</p>
                    )}
                  </div>
                </div>

                {/* Places to Visit */}
                <div>
                  <label htmlFor="placesToVisit" className="block text-sm font-semibold text-gray-700 mb-2">
                    Place(s) to be Visited <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      id="placesToVisit"
                      value={formData.placesToVisit}
                      onChange={(e) => handleInputChange('placesToVisit', e.target.value)}
                      rows={3}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors resize-none ${
                        errors.placesToVisit 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder="e.g., Division Office, District Office, etc."
                    />
                  </div>
                  {errors.placesToVisit && (
                    <p className="mt-1 text-sm text-red-600">{errors.placesToVisit}</p>
                  )}
                </div>

                {/* Reason for Visit */}
                <div>
                  <label htmlFor="reasonForVisit" className="block text-sm font-semibold text-gray-700 mb-2">
                    Reason(s) for the Visit <span className="text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                    id="reasonForVisit"
                    value={formData.reasonForVisit}
                    onChange={(e) => handleInputChange('reasonForVisit', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    placeholder="e.g., Attend meeting, Submit documents, etc."
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center px-6 py-4 text-lg font-semibold text-white rounded-lg transition-all transform hover:scale-105 ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing Application...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5 mr-2" />
                        Submit Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2025 GNHS-OPSAS Developed by GNHS ICT Department
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;