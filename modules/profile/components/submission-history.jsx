import React from 'react';
import { Code, Clock, MemoryStick as Memory, CheckCircle, XCircle, AlertCircle, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';


const SubmissionsHistory= ({ submissions }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Wrong Answer':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Accepted':
        return 'success';
      case 'Wrong Answer':
        return 'destructive';
      default:
        return 'warning';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const parseMetrics = (metricString) => {
    try {
      const parsed = JSON.parse(metricString);
      return Array.isArray(parsed) ? parsed[0] : metricString;
    } catch {
      return metricString;
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center gap-3">
        <Code className="w-6 h-6 text-amber-500" />
          <CardTitle className="text-2xl">Submissions History</CardTitle>
          <Badge variant="secondary">
          {submissions.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>

      <div className="space-y-4">
        {submissions.map((submission, index) => (
          <Card
            key={submission.id}
            className="hover:shadow-md transition-all duration-200"
          >
            <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(submission.status)}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">
                          Submission #{submissions.length - index}
                        </span>
                        <Badge variant={getStatusStyle(submission.status)}>
                          {submission.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Code className="w-3 h-3" />
                          {submission.language}
                        </span>
                        <span>{formatDate(submission.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-blue-50 dark:bg-blue-950/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-medium">Runtime</span>
                    </div>
                    <p className="text-sm font-semibold">
                      {parseMetrics(submission.time)}
                    </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-purple-500 dark:text-purple-400 mb-1">
                      <Memory className="w-4 h-4" />
                      <span className="text-xs font-medium">Memory</span>
                    </div>
                    <p className="text-sm font-semibold">
                      {parseMetrics(submission.memory)}
                    </p>
                  </div>
                </div>

                <Collapsible>
                  <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    View Source Code
                    <ChevronDown className="w-4 h-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-3 bg-muted rounded-lg p-4 border">
                      <pre className="text-xs overflow-x-auto font-mono leading-relaxed">
                      <code>{submission.sourceCode}</code>
                    </pre>
                  </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
            </CardContent>
          </Card>
        ))}
      </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionsHistory;