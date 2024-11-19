import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FileUpload } from '@/components/ui/file-upload';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertCircle, 
  Upload,
  FileText,
  Send
} from 'lucide-react';
import { Assessment, AssessmentSubmission } from '@/types/training.types';

interface AssessmentFormProps {
  assessment: Assessment;
  onSubmit: (submission: AssessmentSubmission) => Promise<void>;
}

const AssessmentForm = ({ assessment, onSubmit }: AssessmentFormProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleFileUpload = (questionId: string, uploadedFiles: File[]) => {
    setFiles(prev => ({
      ...prev,
      [questionId]: uploadedFiles
    }));
  };

  const isComplete = () => {
    return assessment.questions.every(question => {
      if (question.required) {
        if (question.type === 'file') {
          return files[question.id]?.length > 0;
        }
        return answers[question.id]?.trim().length > 0;
      }
      return true;
    });
  };

  const handleSubmit = async () => {
    if (!isComplete()) {
      setError('Please complete all required fields');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const submission: AssessmentSubmission = {
        assessmentId: assessment.id,
        answers,
        files: Object.entries(files).reduce((acc, [questionId, fileList]) => {
          acc[questionId] = Array.from(fileList);
          return acc;
        }, {} as Record<string, File[]>),
        submittedAt: new Date().toISOString()
      };

      await onSubmit(submission);
    } catch (err) {
      setError('Failed to submit assessment. Please try again.');
      console.error('Assessment submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-white">{assessment.title}</h3>
            <p className="text-sm text-gray-400 mt-1">{assessment.description}</p>
          </div>
          {assessment.deadline && (
            <Badge variant="outline">
              Due: {new Date(assessment.deadline).toLocaleDateString()}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-8">
          {assessment.questions.map((question, index) => (
            <div key={question.id} className="space-y-4">
              <div className="flex items-start gap-2">
                <span className="text-gray-400">{index + 1}.</span>
                <div>
                  <p className="text-white">{question.text}</p>
                  {question.description && (
                    <p className="text-sm text-gray-400 mt-1">
                      {question.description}
                    </p>
                  )}
                  {question.required && (
                    <Badge variant="secondary" className="mt-2">
                      Required
                    </Badge>
                  )}
                </div>
              </div>

              <div className="ml-6">
                {question.type === 'text' && (
                  <Textarea
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    placeholder="Enter your answer..."
                    className="min-h-[100px]"
                  />
                )}

                {question.type === 'choice' && (
                  <RadioGroup
                    value={answers[question.id] || ''}
                    onValueChange={(value) => handleAnswerChange(question.id, value)}
                  >
                    {question.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                        <label
                          htmlFor={`${question.id}-${optionIndex}`}
                          className="text-white cursor-pointer"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {question.type === 'file' && (
                  <div className="space-y-2">
                    <FileUpload
                      onUpload={(files) => handleFileUpload(question.id, files)}
                      maxFiles={question.maxFiles || 1}
                      acceptedTypes={question.acceptedTypes}
                      maxSize={question.maxSize}
                    />
                    {files[question.id]?.map((file, fileIndex) => (
                      <div
                        key={fileIndex}
                        className="flex items-center justify-between p-2 bg-gray-700/50 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-white">{file.name}</span>
                          <span className="text-xs text-gray-400">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            const newFiles = files[question.id].filter((_, i) => i !== fileIndex);
                            handleFileUpload(question.id, newFiles);
                          }}
                          className="text-red-500 hover:text-red-400"
                        >
                          <AlertCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {error && (
            <div className="p-4 bg-red-500/10 text-red-500 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setAnswers({});
                setFiles({});
              }}
            >
              Clear Form
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !isComplete()}
              className="min-w-[120px]"
            >
              {submitting ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentForm;
