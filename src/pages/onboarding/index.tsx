import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Building2, Users, Mail, Phone, Briefcase } from 'lucide-react';

const OnboardingForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: '',
    businessAddress: '',
    contactName: '',
    email: '',
    mobile: '',
    natureOfBusiness: '',
    employeeCount: '',
    certifications: {
      iso9001: false,
      iso14001: false,
      iso45001: false
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const data = await response.json();
        router.push(`/subscription?recommended=${data.recommendedTier}`);
      }
    } catch (error) {
      console.error('Onboarding error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <h1 className="heading-1">Welcome to Senator Safety</h1>
            <p className="subtitle">Tell us about your business to get started</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-white mb-2">
                    <Building2 className="w-5 h-5" />
                    Business Information
                  </label>
                  <input
                    type="text"
                    placeholder="Business Name"
                    className="input w-full"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    required
                  />
                  <textarea
                    placeholder="Business Address"
                    className="input w-full mt-2"
                    value={formData.businessAddress}
                    onChange={(e) => setFormData({...formData, businessAddress: e.target.value})}
                    required
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-white mb-2">
                      <Mail className="w-5 h-5" />
                      Contact Email
                    </label>
                    <input
                      type="email"
                      className="input w-full"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-white mb-2">
                      <Phone className="w-5 h-5" />
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      className="input w-full"
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-white mb-2">
                    <Briefcase className="w-5 h-5" />
                    Nature of Business
                  </label>
                  <textarea
                    className="input w-full"
                    value={formData.natureOfBusiness}
                    onChange={(e) => setFormData({...formData, natureOfBusiness: e.target.value})}
                    required
                    rows={3}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-white mb-2">
                    <Users className="w-5 h-5" />
                    Number of Employees
                  </label>
                  <select
                    className="input w-full"
                    value={formData.employeeCount}
                    onChange={(e) => setFormData({...formData, employeeCount: e.target.value})}
                    required
                  >
                    <option value="">Select employee count</option>
                    <option value="1-5">1-5 employees</option>
                    <option value="6-20">6-20 employees</option>
                    <option value="21-50">21-50 employees</option>
                    <option value="51-100">51-100 employees</option>
                    <option value="100+">100+ employees</option>
                  </select>
                </div>

                <div>
                  <label className="text-white mb-2">Current ISO Certifications</label>
                  <div className="space-y-2">
                    {Object.entries({
                      iso9001: 'ISO 9001',
                      iso14001: 'ISO 14001',
                      iso45001: 'ISO 45001'
                    }).map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.certifications[key]}
                          onChange={(e) => setFormData({
                            ...formData,
                            certifications: {
                              ...formData.certifications,
                              [key]: e.target.checked
                            }
                          })}
                          className="w-4 h-4 rounded border-gray-700 text-custom-purple focus:ring-custom-purple"
                        />
                        <span className="text-white">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full">
                Continue to Subscription Selection
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingForm;
