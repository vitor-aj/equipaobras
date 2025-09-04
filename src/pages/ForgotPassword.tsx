import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Mail, Building2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    
    // Simular envio de email
    setTimeout(() => {
      setEmailSent(true);
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
      setIsLoading(false);
    }, 1500);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Logo/Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="h-12 w-12 bg-success rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success-foreground" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Email Enviado!
            </h1>
            <p className="text-muted-foreground">
              Verifique sua caixa de entrada
            </p>
          </div>

          <Card className="shadow-custom-lg border-border">
            <CardContent className="p-6 text-center space-y-4">
              <div className="h-16 w-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <Mail className="h-8 w-8 text-success" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Email de recuperação enviado</h3>
                <p className="text-sm text-muted-foreground">
                  Enviamos um link para redefinir sua senha para <strong>{form.getValues("email")}</strong>
                </p>
                <p className="text-xs text-muted-foreground">
                  Verifique também sua pasta de spam caso não encontre o email na caixa de entrada.
                </p>
              </div>
              
              <div className="pt-4">
                <Link to="/login">
                  <Button className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar ao Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Não recebeu o email?{" "}
              <button
                onClick={() => {
                  setEmailSent(false);
                  form.reset();
                }}
                className="text-primary hover:text-primary/80 font-medium"
              >
                Tentar novamente
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Recuperar Senha
          </h1>
          <p className="text-muted-foreground">
            Digite seu email para receber o link de recuperação
          </p>
        </div>

        {/* Forgot Password Form */}
        <Card className="shadow-custom-lg border-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Esqueceu sua senha?</CardTitle>
            <CardDescription className="text-center">
              Não se preocupe, isso acontece. Digite seu email abaixo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Digite seu email cadastrado"
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar Link de Recuperação
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar ao Login
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Help */}
        <Card className="shadow-custom-md border-border bg-muted/30">
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Precisa de ajuda?
              </p>
              <p className="text-xs text-muted-foreground">
                Entre em contato com o suporte em{" "}
                <strong>suporte@exemplo.com</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;