"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Instagram, MessageCircle, MapPin, Video, ArrowLeft, Check, Loader2 } from "lucide-react"
import { toast } from "sonner" // <--- Biblioteca correta importada

// --- CONFIGURAÇÃO (Futuramente virá do Banco de Dados/Metadata) ---
const barberConfig = {
  name: "Barbearia Golden",
  color: "#D4AF37", // Dourado (Use cores hexadecimais)
  slug: "golden",
  socials: {
    whatsapp: "https://wa.me/5551999999999",
    instagram: "https://instagram.com/barbearia",
    tiktok: "https://tiktok.com/@barbearia",
    maps: "https://goo.gl/maps/exemplo"
  },
  // Simulação de horários vindos da API
  slots: ["09:00", "09:30", "10:00", "11:00", "14:00", "15:00", "16:30", "17:00", "18:00"]
}

export default function AgendamentoFunil({ params }: { params: { slug: string } }) {
  // Controle do Funil: 1 = Data, 2 = Horário, 3 = Cadastro
  const [step, setStep] = useState(1)
  
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [clientName, setClientName] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [loading, setLoading] = useState(false)

  // Avança automaticamente quando seleciona a data
  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) return
    setDate(newDate)
    setStep(2) // Pula para horários
  }

  // Avança automaticamente quando seleciona horário
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep(3) // Pula para cadastro
  }

  // Envio final para o n8n
  async function handleFinalizar() {
    if (!date || !selectedTime || !clientName || !clientPhone) {
      toast.warning("Preencha todos os campos!")
      return
    }

    setLoading(true)
    
    try {
      // ⚠️ IMPORTANTE: TROQUE PELO SEU ENDEREÇO DO N8N/VPS
      const API_URL = "https://n8n.seu-dominio.com/webhook/agendar" 
      
      // Simulação de chamada (remova o setTimeout e descomente o fetch em produção)
      // await fetch(API_URL, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ 
      //     barber: params.slug, 
      //     date, 
      //     time: selectedTime, 
      //     name: clientName, 
      //     phone: clientPhone 
      //   })
      // })

      // Simulando delay de rede para você ver o loading
      await new Promise(resolve => setTimeout(resolve, 1500))

      toast.success("Agendamento Confirmado!", {
        description: `Te esperamos dia ${format(date, "dd/MM")} às ${selectedTime}.`,
        duration: 5000,
      })

      // Opcional: Reiniciar o fluxo após sucesso
      setTimeout(() => {
        setStep(1)
        setClientName("")
        setClientPhone("")
        setDate(undefined)
        setSelectedTime(null)
      }, 2000)

    } catch (e) {
      console.error(e)
      toast.error("Erro ao conectar", {
        description: "Verifique sua internet ou chame no WhatsApp."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 transition-colors"
      // Injeta a cor do cliente como variável CSS dinâmica
      style={{ "--primary-color": barberConfig.color } as React.CSSProperties}
    >
      <div className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-500">
        
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden ring-1 ring-gray-200 dark:ring-zinc-800 bg-white dark:bg-zinc-900">
          
          {/* --- CABEÇALHO SOCIAL (Persistente) --- */}
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 flex flex-col items-center gap-4 border-b border-gray-100 dark:border-zinc-800">
            <div className="text-center space-y-1">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                {barberConfig.name}
              </h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">
                Agendamento Oficial
              </p>
            </div>

            <div className="flex gap-3">
              <SocialIcon icon={<MessageCircle size={18} />} href={barberConfig.socials.whatsapp} />
              <SocialIcon icon={<Instagram size={18} />} href={barberConfig.socials.instagram} />
              <SocialIcon icon={<Video size={18} />} href={barberConfig.socials.tiktok} />
              <SocialIcon icon={<MapPin size={18} />} href={barberConfig.socials.maps} />
            </div>
          </div>

            {/* CONTEÚDO DINÂMICO DO FUNIL */}
            <CardContent className="p-6 min-h-[400px] flex flex-col relative">
            
            {/* --- PASSO 1: ESCOLHA O DIA --- */}
            {step === 1 && (
              <div className="flex-1 flex flex-col items-center animate-in slide-in-from-left-4 fade-in duration-300">
                <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">
                  1. Escolha a Data
                </h2>
                <div className="w-full flex justify-center bg-white rounded-xl border border-gray-100 p-2 shadow-sm">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    locale={ptBR}
                    className="p-0"
                    classNames={{
                      head_cell: "text-gray-400 font-normal text-[0.8rem] w-9",
                      cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-transparent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: "h-9 w-9 p-0 font-medium aria-selected:opacity-100 hover:bg-gray-100 rounded-full transition-all text-gray-700",
                      day_selected: "bg-[var(--primary-color)] text-white hover:bg-[var(--primary-color)] hover:text-white shadow-md font-bold scale-110",
                      day_today: "bg-gray-100 text-gray-900 font-bold",
                    }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-4 text-center">
                  Horários de Brasília (GMT-3)
                </p>
              </div>
            )}

            {/* --- PASSO 2: ESCOLHA O HORÁRIO --- */}
            {step === 2 && (
              <div className="flex-1 flex flex-col h-full animate-in slide-in-from-right-4 fade-in duration-300">
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                  <Button variant="ghost" size="icon" onClick={() => setStep(1)} className="-ml-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={20} className="text-gray-600" />
                  </Button>
                  <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                    {date ? format(date, "dd 'de' MMMM", { locale: ptBR }) : ""}
                  </h2>
                  <div className="w-8" />
                </div>

                <div className="grid grid-cols-3 gap-3 overflow-y-auto pb-4">
                  {barberConfig.slots.map((time) => (
                    <Button
                      key={time}
                      variant="outline"
                      onClick={() => handleTimeSelect(time)}
                      className="rounded-xl h-12 border-gray-200 text-gray-600 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] hover:bg-[var(--primary-color)]/5 transition-all font-medium"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* --- PASSO 3: FINALIZAÇÃO --- */}
            {step === 3 && (
              <div className="flex-1 flex flex-col h-full animate-in zoom-in-95 fade-in duration-300">
                <div className="flex items-center gap-3 mb-6 bg-[var(--primary-color)]/10 p-4 rounded-2xl border border-[var(--primary-color)]/20">
                  <Button variant="ghost" size="icon" onClick={() => setStep(2)} className="h-8 w-8 hover:bg-white/50 rounded-full -ml-1">
                    <ArrowLeft size={18} className="text-[var(--primary-color)]" />
                  </Button>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium uppercase">Resumo</span>
                    <span className="font-bold text-gray-900 text-sm">
                      {date ? format(date, "dd/MMM", { locale: ptBR }) : ""} às {selectedTime}h
                    </span>
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase text-gray-400 font-bold tracking-wider pl-1">Seu Nome</Label>
                    <Input 
                      className="rounded-xl h-12 bg-gray-50 border-gray-200 focus-visible:ring-[var(--primary-color)] text-lg" 
                      placeholder="Ex: João Silva"
                      value={clientName}
                      onChange={e => setClientName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase text-gray-400 font-bold tracking-wider pl-1">Seu WhatsApp</Label>
                    <Input 
                      className="rounded-xl h-12 bg-gray-50 border-gray-200 focus-visible:ring-[var(--primary-color)] text-lg" 
                      placeholder="(99) 99999-9999"
                      type="tel"
                      value={clientPhone}
                      onChange={e => setClientPhone(e.target.value)}
                    />
                  </div>
                </div>

                <Button 
                  className="w-full h-14 rounded-xl text-base font-bold mt-6 shadow-lg shadow-[var(--primary-color)]/20 text-white transition-all active:scale-95 hover:opacity-90"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                  onClick={handleFinalizar}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      Confirmar Agendamento
                      <Check className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            )}

          </CardContent>
        </Card>
        
        <div className="text-center mt-8 opacity-30 text-[10px] font-bold tracking-widest uppercase text-gray-500">
          🔒 Seguro • Rápido • Agenda Barber
        </div>

      </div>
    </div>
  )
}

// Componente auxiliar de Ícone
function SocialIcon({ icon, href }: { icon: React.ReactNode, href: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer"
      className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 shadow-sm border border-gray-100 dark:border-zinc-700 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-[var(--primary-color)] hover:border-[var(--primary-color)] transition-all hover:-translate-y-1 hover:shadow-md"
    >
      {icon}
    </a>
  )
}