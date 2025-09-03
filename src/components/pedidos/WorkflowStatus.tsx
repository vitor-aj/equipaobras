import { CheckCircle, Clock, AlertTriangle, XCircle } from "lucide-react";

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  status: "completed" | "current" | "pending" | "error";
}

interface WorkflowStatusProps {
  currentStep: number;
  hasError?: boolean;
  errorMessage?: string;
}

export function WorkflowStatus({ currentStep, hasError, errorMessage }: WorkflowStatusProps) {
  const steps: WorkflowStep[] = [
    {
      id: 1,
      title: "Análise da IA",
      description: "Validação automática dos documentos",
      status: currentStep > 1 ? "completed" : currentStep === 1 ? (hasError ? "error" : "current") : "pending"
    },
    {
      id: 2,
      title: "Análise do Faturista",
      description: "Revisão humana e aprovação",
      status: currentStep > 2 ? "completed" : currentStep === 2 ? (hasError ? "error" : "current") : "pending"
    },
    {
      id: 3,
      title: "Pedido Finalizado",
      description: "Aprovado e pronto para faturamento",
      status: currentStep === 3 ? "completed" : "pending"
    }
  ];

  const getStepIcon = (step: WorkflowStep) => {
    switch (step.status) {
      case "completed":
        return <CheckCircle className="h-6 w-6 text-success" />;
      case "current":
        return <Clock className="h-6 w-6 text-warning" />;
      case "error":
        return <XCircle className="h-6 w-6 text-destructive" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getStepColor = (step: WorkflowStep) => {
    switch (step.status) {
      case "completed":
        return "bg-success/10 border-success/20";
      case "current":
        return "bg-warning/10 border-warning/20";
      case "error":
        return "bg-destructive/10 border-destructive/20";
      default:
        return "bg-muted border-border";
    }
  };

  const getConnectorColor = (index: number) => {
    if (index >= steps.length - 1) return "";
    
    const currentStepStatus = steps[index].status;
    const nextStepStatus = steps[index + 1].status;
    
    if (currentStepStatus === "completed") {
      return "bg-success";
    } else if (currentStepStatus === "error") {
      return "bg-destructive";
    } else {
      return "bg-border";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Status do Workflow
        </h3>
        
        <div className="text-sm text-muted-foreground">
          Etapa {Math.min(currentStep, 3)} de 3
        </div>
      </div>

      <div className="relative">
        {/* Steps */}
        <div className="flex items-center justify-between relative">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              {/* Step Circle */}
              <div 
                className={`
                  h-16 w-16 rounded-full border-2 flex items-center justify-center
                  transition-all duration-300 shadow-custom-sm
                  ${getStepColor(step)}
                `}
              >
                {getStepIcon(step)}
              </div>
              
              {/* Step Info */}
              <div className="mt-4 text-center max-w-32">
                <p className={`
                  text-sm font-medium 
                  ${step.status === "completed" ? "text-success" : 
                    step.status === "current" ? "text-warning" :
                    step.status === "error" ? "text-destructive" :
                    "text-muted-foreground"}
                `}>
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {step.description}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div 
                  className={`
                    absolute top-8 left-8 w-full h-1 -z-10
                    transition-all duration-300
                    ${getConnectorColor(index)}
                  `}
                  style={{ width: 'calc(100vw / 3 - 4rem)' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Progress Line Background */}
        <div className="absolute top-8 left-8 right-8 h-1 bg-border -z-20 rounded-full" />
      </div>

      {/* Error Message */}
      {hasError && errorMessage && (
        <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">
              Pedido Devolvido para Ajuste
            </span>
          </div>
          <p className="text-sm text-foreground">
            {errorMessage}
          </p>
        </div>
      )}

      {/* Current Step Details */}
      {!hasError && (
        <div className="p-4 bg-card/50 border border-border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-warning" />
            <span className="text-sm font-medium text-foreground">
              Status Atual
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {currentStep === 1 && "Documentos sendo analisados pela IA para validação automática."}
            {currentStep === 2 && "Aguardando revisão e aprovação do faturista responsável."}
            {currentStep === 3 && "Pedido aprovado e pronto para processamento de faturamento."}
          </p>
        </div>
      )}
    </div>
  );
}