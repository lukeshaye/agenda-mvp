import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // Pega o hostname (ex: viking.horariolivre.online)
  // O cabeçalho 'host' é mais confiável em proxies reversos (Traefik)
  const hostname = req.headers.get("host") || "";

  // Defina seu domínio principal aqui (para diferenciar localhost e produção)
  // Em produção, queremos detectar subdomínios de horariolivre.online
  const currentHost =
    process.env.NODE_ENV === "production"
      ? hostname.replace(".horariolivre.online", "") // Remove o domínio principal
      : hostname.replace(".localhost:3000", "");     // Remove localhost em dev

  // Se o host for o domínio raiz ("horariolivre.online") ou "www", 
  // deixa seguir normal para a Landing Page (src/app/page.tsx)
  if (currentHost === "horariolivre.online" || currentHost === "www" || currentHost === "localhost:3000") {
    return NextResponse.next();
  }

  // --- A MÁGICA ACONTECE AQUI ---
  // Se for um subdomínio (ex: "viking"), reescreve a URL internamente
  // O usuário vê: viking.horariolivre.online
  // O Next processa: /viking (que cai na sua pasta src/app/[slug])
  
  // Evita reescrever arquivos estáticos ou API
  if (url.pathname.startsWith("/_next") || url.pathname.startsWith("/api") || url.pathname.includes(".")) {
    return NextResponse.next();
  }

  // Reescreve para a rota dinâmica [slug]
  url.pathname = `/${currentHost}${url.pathname}`;
  
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Roda em todas as rotas exceto:
     * - api (rotas de API)
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico (ícone)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};