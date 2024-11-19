import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { Quiz, Question, QuestionType } from '@/types/training.types';

interface QuizComponentProps {
  quiz: Quiz;
  onComplete: (score: number, passed: boolean) => void;
  minPassingScore?: number;
}

const QuizComponent = ({ 
  quiz, 
  onComplete,
  minPassingScore = 70 
}: QuizComponentProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit || 0);

  useEffect(() => {
    if (quiz.timeLimit && timeLeft > 0 && !submitted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, submitted]);

  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    let correctAnswers = 0;

    quiz.questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (Array.isArray(question.correctAnswer)) {
        // Multiple select
        const correct = arrayEquals(
          (userAnswer as string[] || []).sort(),
          question.correctAnswer.sort()
        );
        if (correct) correctAnswers++;
      } else {
        // Single answer
        if (userAnswer === question.correctAnswer) correctAnswers++;
      }
    });

    const finalScore = (correctAnswers / quiz.questions.length) * 100;
    setScore(finalScore);
    setSubmitted(true);
    onComplete(finalScore, finalScore >= minPassingScore);
  };

  const arrayEquals = (a: string[], b: string[]) => {
    return Array.isArray(a) && 
      Array.isArray(b) && 
      a.length === b.length && 
      a.every((val, index) => val === b[index]);
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <RadioGroup
            value={answers[question.id] as string || ''}
            onValueChange={value => handleAnswer(question.id, value)}
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={option} 
                  id={`${question.id}-${index}`}
                  disabled={submitted}
                />
                <label 
                  htmlFor={`${question.id}-${index}`}
                  className="text-white cursor-pointer"
                >
                  {option}
                </label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'multiple_select':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${index}`}
                  checked={(answers[question.id] as string[] || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const currentAnswers = answers[question.id] as string[] || [];
                    const newAnswers = checked 
                      ? [...currentAnswers, option]
                      : currentAnswers.filter(a => a !== option);
                    handleAnswer(question.id, newAnswers);
                  }}
                  disabled={submitted}
                />
                <label 
                  htmlFor={`${question.id}-${index}`}
                  className="text-white cursor-pointer"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      case 'short_answer':
        return (
          <Input
            value={answers[question.id] as string || ''}
            onChange={e => handleAnswer(question.id, e.target.value)}
            placeholder="Enter your answer"
            disabled={submitted}
            className="max-w-md"
          />
        );

      default:
        return null;
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">{quiz.title}</h3>
          {quiz.timeLimit && (
            <div className="text-sm text-gray-400">
              Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {submitted ? (
          <div className="space-y-6">
            <div className={`p-4 rounded-lg ${
              score >= minPassingScore
                ? 'bg-custom-green/20 text-custom-green'
                : 'bg-red-500/20 text-red-500'
            }`}>
              <div className="flex items-center gap-2">
                {score >= minPassingScore ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="font-medium">
                  {score >= minPassingScore ? 'Quiz Passed!' : 'Quiz Failed'}
                </span>
              </div>
              <p className="mt-2">
                Your score: {Math.round(score)}% (Required: {minPassingScore}%)
              </p>
            </div>

            {score < minPassingScore && quiz.retryAllowed && (
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setAnswers({});
                  setTimeLeft(quiz.timeLimit || 0);
                }}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Quiz
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-lg text-white mb-2">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </p>
              <p className="text-gray-400">
                {quiz.questions[currentQuestionIndex].question}
              </p>
            </div>

            <div className="space-y-4">
              {renderQuestion(quiz.questions[currentQuestionIndex])}
            </div>

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>

              {currentQuestionIndex < quiz.questions.length - 1 ? (
                <Button
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  disabled={!answers[quiz.questions[currentQuestionIndex].id]}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length !== quiz.questions.length}
                >
                  Submit Quiz
                </Button>
              )}
            </div>

            {/* Progress Indicator */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Progress</span>
                <span>{Object.keys(answers).length} of {quiz.questions.length} answered</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full">
                <div
                  className="h-full bg-custom-purple rounded-full transition-all"
                  style={{
                    width: `${(Object.keys(answers).length / quiz.questions.length) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizComponent;
