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
      title: "Pendente",
      description: "Aguardando processamento",
      status: currentStep > 1 ? "completed" : currentStep === 1 ? "current" : "pending"
    },
    {
      id: 2,
      title: "Pedido Faturado",
      description: "Pedido finalizado",
      status: currentStep === 2 ? "completed" : "pending"
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
        return "bg-card border-success/30";
      case "current":
        return "bg-card border-warning/30";
      case "error":
        return "bg-card border-destructive/30";
      default:
        return "bg-card border-border";
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

  const getProgressWidth = () => {
    if (steps.length <= 1) return '0%';
    // Distância entre os centros dos círculos (primeiro ao último)
    // 0% = entre círculo 1 e 2, 100% = entre círculo 1 e 2 completado
    const progress = ((currentStep - 1) / (steps.length - 1)) * 100;
    return `${Math.min(progress, 100)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Status do Workflow
        </h3>
        
        <div className="text-sm text-muted-foreground">
          Etapa {Math.min(currentStep, 2)} de 2
        </div>
      </div>

      {/* Circles + connecting line row */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div 
                className={`
                  h-16 w-16 rounded-full border-2 flex items-center justify-center shrink-0
                  transition-all duration-300 shadow-custom-sm z-10 bg-card
                  ${getStepColor(step)}
                `}
              >
                {getStepIcon(step)}
              </div>
            </div>
            
            {/* Connector line between circles */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 bg-border rounded-full relative mx-2">
                {/* Progress fill */}
                <div
                  className="absolute top-0 left-0 h-full bg-success rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((currentStep - 1) / (steps.length - 1), 1) * 100}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Text labels row */}
      <div className="flex justify-between px-2">
        {steps.map((step) => (
          <div key={`label-${step.id}`} className="text-center" style={{ width: '4rem' }}>
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
        ))}
      </div>

      {/* Current Step Details */}
      <div className="p-4 bg-card/50 border border-border rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4 text-warning" />
          <span className="text-sm font-medium text-foreground">
            Status Atual
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {currentStep === 1 && "Pedido aguardando processamento e análise."}
          {currentStep === 2 && "Pedido faturado com sucesso."}
        </p>
      </div>
    </div>
  );
}