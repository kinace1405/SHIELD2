import { Award, Download, Calendar, RefreshCw, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Certificate } from '@/types/training.types';

interface CertificateCardProps {
  certificate: Certificate;
  onDownload?: (certificateId: string) => void;
  onRenew?: (certificateId: string) => void;
}

const CertificateCard = ({ 
  certificate,
  onDownload,
  onRenew
}: CertificateCardProps) => {
  const isExpiringSoon = () => {
    const expiryDate = new Date(certificate.expiryDate);
    const monthAway = new Date();
    monthAway.setMonth(monthAway.getMonth() + 1);
    return expiryDate <= monthAway && certificate.status === 'active';
  };

  const isExpired = () => {
    return new Date(certificate.expiryDate) <= new Date();
  };

  return (
    <Card className={`bg-gray-800/50 border-gray-700 ${
      isExpired() ? 'opacity-75' : ''
    }`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              isExpired() ? 'bg-gray-700' : 'bg-custom-purple/20'
            }`}>
              <Award className={`w-6 h-6 ${
                isExpired() ? 'text-gray-400' : 'text-custom-purple'
              }`} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">
                {certificate.title}
              </h3>
              <p className="text-sm text-gray-400">
                Certificate #{certificate.id}
              </p>
            </div>
          </div>
          {certificate.status === 'active' && (
            <div className="bg-custom-green/20 px-2 py-1 rounded-full">
              <span className="text-xs text-custom-green">Active</span>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300">
              Issued: {new Date(certificate.issueDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300">
              Expires: {new Date(certificate.expiryDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {isExpiringSoon() && (
          <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg">
            <p className="text-sm text-yellow-500">
              This certificate will expire soon. Consider renewing it.
            </p>
          </div>
        )}

        <div className="mt-4 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onDownload?.(certificate.id)}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          
          {certificate.status === 'active' && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.open(certificate.verificationUrl, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Verify
            </Button>
          )}

          {(isExpiringSoon() || isExpired()) && onRenew && (
            <Button
              className="flex-1"
              onClick={() => onRenew(certificate.id)}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Renew
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificateCard;
