import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
  Shield,
  Users,
  HardDrive,
  MessageSquare,
  Check,
  Star,
  Clock,
  Building2,
  Zap,
  HeartHandshake,
  Trophy,
  Crown,
  PhoneCall,
  FileText,
  Settings,
  Lock,
  ArrowRight
} from 'lucide-react';

const SubscriptionPage = () => {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState(null);
  const [showAnnualPricing, setShowAnnualPricing] = useState(false);
  const [calculatedUsers, setCalculatedUsers] = useState(0);
  const [companySize, setCompanySize] = useState('1-5');
  const [loading, setLoading] = useState(false);

  const subscriptionTiers = [
    {
      id: 'miles',
      name: 'Miles',
      icon: Shield,
      monthlyPrice: 249,
      annualPrice: 2490,
      setupFee: 300,
      highlight: 'Perfect for small businesses starting their QHSE journey',
      target: 'Small businesses (1-5 employees)',
      userLimit: '1 user',
      supportLevel: 'Business hours email support (48hr response)',
      aiAccess: 'Basic SHIELD AI access with limited queries',
      storageLimit: '5GB',
      aiQueriesLimit: '100/month',
      features: [
        'QHSE AI Expert Chat (business hours only)',
        'Basic document templates',
        'Monthly system health report',
        '1 user dashboard',
        'Essential compliance tracking',
        'Basic risk assessments',
        'Standard document management',
        'Email support'
      ],
      addOns: [
        'Additional user (£49/month)',
        'Extra storage (£5/GB/month)',
        'Additional AI queries (£0.50/query)'
      ]
    },
    {
      id: 'centurion',
      name: 'Centurion',
      icon: Trophy,
      monthlyPrice: 399,
      annualPrice: 3990,
      setupFee: 400,
      highlight: 'Advanced features for growing businesses',
      target: 'Medium businesses (5-20 employees)',
      userLimit: '3 users',
      supportLevel: 'Priority email support (24hr response)',
      aiAccess: 'Extended SHIELD AI access (increased query limit)',
      storageLimit: '20GB',
      aiQueriesLimit: '250/month',
      features: [
        'Full QHSE AI Expert Chat Interface',
        'Advanced document templates',
        'Weekly compliance reports',
        '3 user dashboards',
        'Advanced risk assessments',
        'Incident tracking system',
        'Training management portal',
        'Priority email support',
        'Custom workflows',
        'Basic API access',
        '2 training sessions included'
      ],
      addOns: [
        'Additional user (£39/month)',
        'Extra storage (£4/GB/month)',
        'Additional AI queries (£0.40/query)',
        'Custom template design (£199/template)'
      ]
    },
    {
      id: 'tribune',
      name: 'Tribune',
      icon: Crown,
      monthlyPrice: 599,
      annualPrice: 5990,
      setupFee: 600,
      highlight: 'Comprehensive solution for established organizations',
      target: 'Large businesses (20-50 employees)',
      userLimit: '5 users',
      supportLevel: 'Priority tech support (12hr response)',
      aiAccess: 'Full SHIELD AI access',
      storageLimit: '30GB',
      aiQueriesLimit: '500/month',
      recommended: true,
      features: [
        'Complete automation suite',
        'Advanced AI analytics',
        'Custom KPI dashboards',
        'Full API access',
        'Dedicated support team',
        'Unlimited templates',
        'Advanced reporting',
        'Mobile app access',
        '5 training sessions included',
        'Monthly consulting (2 hours)',
        'Priority incident support',
        'Custom integration options',
        'Regulatory update alerts',
        'Multi-site management'
      ],
      addOns: [
        'Additional user (£29/month)',
        'Extra storage (£3/GB/month)',
        'Additional AI queries (£0.30/query)',
        'Custom development (POA)',
        'Additional consulting hours (£150/hour)'
      ]
    },
    {
      id: 'consul',
      name: 'Consul',
      icon: HeartHandshake,
      monthlyPrice: 999,
      annualPrice: 9990,
      setupFee: 1000,
      highlight: 'Enterprise-grade QHSE management solution',
      target: 'Corporate (50-100 employees)',
      userLimit: 'Unlimited users',
      supportLevel: '24/7 premium support',
      aiAccess: 'Unlimited SHIELD AI usage',
      storageLimit: '100GB',
      aiQueriesLimit: 'Unlimited',
      features: [
        'Everything in Tribune, plus:',
        'Unlimited users',
        'Unlimited AI queries',
        'Custom AI model training',
        'Weekly consulting (4 hours)',
        'Custom solutions development',
        'Full automation suite',
        'Integration support',
        'Dedicated account manager',
        'Custom reporting',
        '24/7 emergency support',
        'Onsite training sessions',
        'Multi-language support',
        'Advanced security features',
        'Compliance guarantee'
      ],
      addOns: [
        'Additional storage (£2/GB/month)',
        'Custom development (POA)',
        'Additional consulting hours (£120/hour)',
        'On-site support days (POA)'
      ]
    },
    {
      id: 'emperor',
      name: 'Emperor',
      icon: Star,
      monthlyPrice: null,
      annualPrice: null,
      setupFee: null,
      highlight: 'Bespoke enterprise solution',
      target: 'Enterprise (100+ employees)',
      userLimit: 'Unlimited users + Multi-site',
      supportLevel: 'Dedicated account manager',
      aiAccess: 'Custom AI implementation',
      storageLimit: 'Custom',
      aiQueriesLimit: 'Custom',
      features: [
        'Custom development',
        'Quarterly on-site support',
        'Board level consulting',
        'Multi-site management',
        'Custom API development',
        'White-label options',
        'Global deployment support',
        'Custom security measures',
        'Regulatory compliance guarantee',
        'Custom AI model development',
        'Dedicated development team',
        'Enterprise-grade SLAs',
        'Custom integration suite',
        'Unlimited storage',
        'Full source code access'
      ],
      contact: true
    }
  ];

  const handleSelectTier = async (tier) => {
    setSelectedTier(tier);
    setLoading(true);
    try {
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tierId: tier.id,
          annual: showAnnualPricing,
          setupFee: tier.setupFee
        })
      });
      const { url } = await response.json();
      router.push(url);
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="heading-1 mb-4">Choose Your SHIELD Plan</h1>
          <p className="subtitle max-w-2xl mx-auto">
            Select the perfect plan to enhance your organization's QHSE management
          </p>

          {/* Pricing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm ${!showAnnualPricing ? 'text-white' : 'text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setShowAnnualPricing(!showAnnualPricing)}
              className={`relative w-16 h-8 rounded-full transition-colors ${
                showAnnualPricing ? 'bg-custom-purple' : 'bg-gray-700'
              }`}
            >
              <div
                className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${
                  showAnnualPricing ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${showAnnualPricing ? 'text-white' : 'text-gray-400'}`}>
                Annual
              </span>
              <span className="text-xs text-custom-green">Save 20%</span>
            </div>
          </div>

          {/* Company Size Selector */}
          <div className="mt-8">
            <label className="text-white mb-2 block">Company Size</label>
            <select
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              className="input max-w-xs"
            >
              <option value="1-5">1-5 employees</option>
              <option value="5-20">5-20 employees</option>
              <option value="20-50">20-50 employees</option>
              <option value="50-100">50-100 employees</option>
              <option value="100+">100+ employees</option>
            </select>
          </div>
        </div>

        {/* Subscription Tiers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {subscriptionTiers.map((tier) => (
            <Card
              key={tier.id}
              className={`bg-gray-800/50 border-gray-700 relative ${
                tier.recommended
                  ? 'ring-2 ring-custom-purple'
                  : 'hover:border-gray-600'
              }`}
            >
              {tier.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-custom-purple text-white px-4 py-1 rounded-full text-sm">
                    Recommended
                  </span>
                </div>
              )}

              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-custom-purple/20 rounded-lg">
                    <tier.icon className="w-6 h-6 text-custom-purple" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                    <p className="text-sm text-gray-400">{tier.target}</p>
                  </div>
                </div>

                {tier.monthlyPrice ? (
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-white">
                        £{showAnnualPricing ? Math.floor(tier.annualPrice / 12) : tier.monthlyPrice}
                      </span>
                      <span className="text-gray-400 ml-2">/month</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      Setup fee: £{tier.setupFee}
                    </p>
                    {showAnnualPricing && (
                      <p className="text-sm text-custom-green mt-1">
                        Save £{(tier.monthlyPrice * 12) - tier.annualPrice} annually
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mb-6">
                    <p className="text-xl font-bold text-white">Custom Pricing</p>
                    <p className="text-sm text-gray-400">Contact for quote</p>
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-custom-purple" />
                    <span className="text-gray-300">{tier.userLimit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-custom-purple" />
                    <span className="text-gray-300">{tier.aiAccess}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-custom-purple" />
                    <span className="text-gray-300">{tier.storageLimit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-custom-purple" />
                    <span className="text-gray-300">{tier.aiQueriesLimit}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-custom-green flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {tier.addOns && (
                  <div className="mb-6">
                    <h4 className="text-white font-medium mb-2">Available Add-ons</h4>
                    <div className="space-y-2">
                      {tier.addOns.map((addon, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Plus className="w-4 h-4 text-custom-purple" />
                          <span className="text-gray-300">{addon}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {tier.contact ? (
                  <button
                    onClick={() => router.push('/contact')}
                    className="btn-primary w-full"
                  >
                    Contact Sales
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleSelectTier(tier)}
                    className="btn-primary w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Get Started
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </span>
                    )}
                  </button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-16">
          <h2 className="heading-2 text-center mb-8">Detailed Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 text-gray-400">Feature</th>
                  {subscriptionTiers.map((tier) => (
                    <th key={tier.id} className="p-4 text-center">
                      <span className="text-white font-medium">{tier.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    category: 'Core Features',
                    features: [
                      {
                        name: 'SHIELD AI Access',
                        tooltip: 'AI-powered QHSE consultation and support',
                        tiers: {
                          miles: 'Basic',
                          centurion: 'Extended',
                          tribune: 'Full',
                          consul: 'Unlimited',
                          emperor: 'Custom'
                        }
                      },
                      {
                        name: 'Document Management',
                        tooltip: 'Store and manage QHSE documentation',
                        tiers: {
                          miles: 'Basic',
                          centurion: 'Advanced',
                          tribune: 'Premium',
                          consul: 'Enterprise',
                          emperor: 'Custom'
                        }
                      },
                      {
                        name: 'Risk Assessments',
                        tooltip: 'Conduct and manage risk assessments',
                        tiers: {
                          miles: 'Basic',
                          centurion: 'Advanced',
                          tribune: 'Premium',
                          consul: 'Enterprise',
                          emperor: 'Custom'
                        }
                      }
                    ]
                  },
                  {
                    category: 'Support',
                    features: [
                      {
                        name: 'Response Time',
                        tooltip: 'Maximum response time for support requests',
                        tiers: {
                          miles: '48 hours',
                          centurion: '24 hours',
                          tribune: '12 hours',
                          consul: '1 hour',
                          emperor: 'Immediate'
                        }
                      },
                      {
                        name: 'Support Channels',
                        tooltip: 'Available support communication channels',
                        tiers: {
                          miles: 'Email',
                          centurion: 'Email, Chat',
                          tribune: 'Email, Chat, Phone',
                          consul: '24/7 All Channels',
                          emperor: 'Dedicated Team'
                        }
                      }
                    ]
                  },
                  {
                    category: 'Training & Consulting',
                    features: [
                      {
                        name: 'Training Sessions',
                        tooltip: 'Included training sessions per year',
                        tiers: {
                          miles: '1',
                          centurion: '2',
                          tribune: '5',
                          consul: '12',
                          emperor: 'Unlimited'
                        }
                      },
                      {
                        name: 'Consulting Hours',
                        tooltip: 'Monthly included consulting hours',
                        tiers: {
                          miles: '-',
                          centurion: '1',
                          tribune: '2',
                          consul: '4',
                          emperor: 'Unlimited'
                        }
                      }
                    ]
                  },
                  {
                    category: 'Technical Features',
                    features: [
                      {
                        name: 'API Access',
                        tooltip: 'Access to API for custom integrations',
                        tiers: {
                          miles: '-',
                          centurion: 'Basic',
                          tribune: 'Full',
                          consul: 'Enterprise',
                          emperor: 'Custom'
                        }
                      },
                      {
                        name: 'Custom Development',
                        tooltip: 'Custom feature development',
                        tiers: {
                          miles: '-',
                          centurion: '-',
                          tribune: 'Available',
                          consul: 'Included',
                          emperor: 'Dedicated Team'
                        }
                      }
                    ]
                  }
                ].map((section) => (
                  <React.Fragment key={section.category}>
                    <tr className="bg-gray-800/50">
                      <td colSpan={6} className="p-4 font-medium text-white">
                        {section.category}
                      </td>
                    </tr>
                    {section.features.map((feature) => (
                      <tr key={feature.name} className="border-b border-gray-700">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-300">{feature.name}</span>
                            <Tooltip content={feature.tooltip}>
                              <InfoIcon className="w-4 h-4 text-gray-400" />
                            </Tooltip>
                          </div>
                        </td>
                        {subscriptionTiers.map((tier) => (
                          <td key={tier.id} className="p-4 text-center">
                            <span className="text-gray-300">
                              {feature.tiers[tier.id]}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="heading-2 text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                question: 'Can I change plans later?',
                answer: 'Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades take effect at the end of your billing cycle.'
              },
              {
                question: 'What payment methods are accepted?',
                answer: 'We accept all major credit cards, direct debit, and bank transfers for annual plans.'
              },
              {
                question: 'Is there a minimum contract period?',
                answer: 'No minimum contract for monthly plans. Annual plans are paid upfront for the year.'
              },
              {
                question: 'What happens if I exceed my limits?',
                answer: 'We'll notify you when you're approaching your limits. You can purchase add-ons or upgrade your plan to increase limits.'
              }
            ].map((faq, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-400">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-br from-custom-purple/20 to-custom-green/20 border-gray-700 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h2 className="heading-2 mb-4">Need Help Choosing?</h2>
              <p className="text-gray-300 mb-6">
                Our QHSE experts are here to help you select the perfect plan for your organization.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/contact')}
                  className="btn-primary"
                >
                  <PhoneCall className="w-5 h-5 mr-2" />
                  Schedule a Call
                </button>
                <button
                  onClick={() => router.push('/demo')}
                  className="btn-secondary"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Tooltip Component
const Tooltip = ({ content, children }) => {
  return (
    <div className="relative group">
      <div className="cursor-help">{children}</div>
      <div className="absolute z-10 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all bg-gray-800 text-white text-sm p-2 rounded shadow-lg -top-2 left-full ml-2 w-48">
        {content}
      </div>
    </div>
  );
};

export default SubscriptionPage;
