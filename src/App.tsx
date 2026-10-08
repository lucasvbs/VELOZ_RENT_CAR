import { useEffect, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import ArrowDown from 'lucide-react/dist/esm/icons/arrow-down.js';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.js';
import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.js';
import Check from 'lucide-react/dist/esm/icons/check.js';
import Menu from 'lucide-react/dist/esm/icons/menu.js';
import MessageCircle from 'lucide-react/dist/esm/icons/message-circle.js';
import XIcon from 'lucide-react/dist/esm/icons/x.js';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function useScrollReveal() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-scroll-reveal]'),
    );

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -36px 0px' },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

// Número informado pelo cliente: 71 9997240191.
const WHATSAPP_NUMBER = '55719997240191';
const WHATSAPP_MESSAGE = 'Oi, Fábio! Vim pelo site e quero saber mais sobre aluguel para rodar de app.';

function trackLead(source: string) {
  window.dispatchEvent(new CustomEvent('veloz:lead', { detail: { source } }));
  const pixelWindow = window as Window & { fbq?: (...args: unknown[]) => void };
  pixelWindow.fbq?.('track', 'Lead', { content_name: source });
}

function whatsappUrl(source: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`${WHATSAPP_MESSAGE} [${source}]`)}`;
}

function WhatsAppLink({ source, children, className = 'button', label, onClick }: {
  source: string;
  children: ReactNode;
  className?: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <a
      className={className}
      href={whatsappUrl(source)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      data-testid={`link-whatsapp-${source}`}
      onClick={() => {
        trackLead(source);
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useScrollReveal();

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [mobileMenuOpen]);

  return (
    <main className="site-shell">
      <header className="topbar">
        <div className="container topbar-inner">
          <a className="brand" href="#inicio" aria-label="Veloz Rent a Car, início" data-testid="link-home" onClick={() => setMobileMenuOpen(false)}>
            <img src="/images/veloz-logo.jpg" alt="Veloz Rent a Car" />
          </a>
          <nav className="topnav" aria-label="Navegação principal">
            <a href="#como-funciona" data-testid="link-nav-como-funciona">Como funciona</a>
            <a href="#valores" data-testid="link-nav-valores">Valores</a>
            <a href="#duvidas" data-testid="link-nav-duvidas">Dúvidas</a>
            <WhatsAppLink source="menu" label="Fale conosco pelo WhatsApp">Fale conosco <ArrowUpRight size={16} /></WhatsAppLink>
          </nav>
          <button
            type="button"
            className="mobile-menu-toggle"
            aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            aria-controls="mobile-navigation"
            aria-expanded={mobileMenuOpen}
            data-testid="button-mobile-navigation-toggle"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <XIcon size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Navegação para celular"
          hidden={!mobileMenuOpen}
        >
          <a href="#como-funciona" data-testid="link-mobile-nav-como-funciona" onClick={() => setMobileMenuOpen(false)}>Como funciona</a>
          <a href="#valores" data-testid="link-mobile-nav-valores" onClick={() => setMobileMenuOpen(false)}>Valores</a>
          <a href="#duvidas" data-testid="link-mobile-nav-duvidas" onClick={() => setMobileMenuOpen(false)}>Dúvidas</a>
          <WhatsAppLink
            source="mobile-menu"
            label="Fale conosco pelo WhatsApp"
            onClick={() => setMobileMenuOpen(false)}
          >
            Fale conosco <ArrowUpRight size={16} />
          </WhatsAppLink>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <div className="container hero-grid">
          <div className="hero-copy reveal">
            <div className="eyebrow">Aluguel semanal para motorista de app</div>
            <h1 className="display">Chega de pagar <em>IPVA e seguro</em> do carro que você roda.</h1>
            <p className="hero-intro">Aluguel de carro para quem roda de Uber, 99 e InDrive em Salvador e Lauro de Freitas. Seguro e IPVA por conta da Veloz. Carro revisado.</p>
            <WhatsAppLink source="hero" label="Chamar Fábio no WhatsApp para falar sobre aluguel">
              <MessageCircle size={18} /> Fale conosco <ArrowUpRight size={16} />
            </WhatsAppLink>
            <span className="hero-note">Atendimento direto no WhatsApp • Sem compromisso</span>
            <div className="hero-price"><strong>A partir de R$ 550</strong><span>por semana</span></div>
          </div>
          <div className="hero-media">
            <img src="/images/fiat-strada-rental.jpg" alt="Fiat Strada branca anunciada para locação pela Veloz Rent a Car" fetchPriority="high" />
          </div>
        </div>
      </section>
      <div className="proof-strip" aria-label="Destaques do aluguel">
        <div className="container proof-inner">
          <span><b>01</b> Salvador e Lauro de Freitas</span>
          <span><b>02</b> Seguro por conta da Veloz</span>
          <span><b>03</b> IPVA por conta da Veloz</span>
        </div>
      </div>

      <section className="section" id="proposta">
        <div className="container intro-grid">
          <div className="intro-copy scroll-reveal reveal-left" data-scroll-reveal>
            <span className="section-kicker">O peso de ter carro próprio</span>
            <h2>Você dirige.<br />A Veloz cuida do resto.</h2>
            <p>Quem roda de app sabe: o carro come boa parte do que você faz na semana. IPVA, seguro, revisão, imprevisto.</p>
            <p>Na Veloz Rent Car, você aluga o carro e para de carregar esse peso. <strong>O seguro e o IPVA ficam com a gente, e o carro vem revisado.</strong></p>
            <p>Você paga o plano da semana, liga o app e roda. A partir de <strong>R$ 550 por semana.</strong></p>
            <div className="big-quote">Mais clareza no custo do carro. Mais foco nas corridas.</div>
          </div>
          <div className="editorial-photo scroll-reveal reveal-right" data-scroll-reveal>
            <img src="/images/motorista-app-salvador.jpg" alt="Imagem de campanha da Veloz com Salvador ao fundo e carro para motorista de aplicativo" loading="lazy" />
            <div className="photo-caption">Seu caminho com mais liberdade</div>
          </div>
        </div>
      </section>

      <section className="section pain">
        <div className="container pain-grid">
          <div className="scroll-reveal reveal-left" data-scroll-reveal>
            <span className="section-kicker">A conta do carro não espera</span>
            <h2>Não é falta de esforço. É carregar tudo sozinho.</h2>
            <p>Quem trabalha de app e depende de carro próprio ou financiado conhece o aperto. A conta não para quando o movimento cai.</p>
          </div>
          <div>
            <div className="questions">
              <div className="question scroll-reveal reveal-right" data-scroll-reveal><b>?</b><span>Você já fechou o mês e o IPVA comeu parte do lucro?</span></div>
              <div className="question scroll-reveal reveal-right" data-scroll-reveal data-reveal-delay="1"><b>?</b><span>Já ficou com o carro parado porque não tinha dinheiro para a revisão?</span></div>
              <div className="question scroll-reveal reveal-right" data-scroll-reveal data-reveal-delay="2"><b>?</b><span>Já ficou com medo de rodar sem seguro, ou com o seguro vencendo?</span></div>
              <div className="question scroll-reveal reveal-right" data-scroll-reveal data-reveal-delay="3"><b>?</b><span>Já passou a semana trabalhando mais só para cobrir o custo do carro?</span></div>
            </div>
            <p className="pain-ending">Você não precisa carregar também o IPVA, o seguro e a revisão.</p>
          </div>
        </div>
      </section>

      <section className="section plan" id="como-funciona">
        <div className="container plan-grid">
          <div className="scroll-reveal reveal-left" data-scroll-reveal>
            <span className="section-kicker">Plano Veloz</span>
            <h2>Você escolhe o carro. Paga por semana. E roda.</h2>
            <p className="plan-copy">O que pesa no bolso de quem tem carro próprio fica com a Veloz. Um plano semanal para você focar no que importa: as corridas.</p>
            <div className="included-list">
              <div className="included"><span className="included-mark"><Check size={16} /></span> Seguro por conta da Veloz</div>
              <div className="included"><span className="included-mark"><Check size={16} /></span> IPVA por conta da Veloz</div>
              <div className="included"><span className="included-mark"><Check size={16} /></span> Veículo revisado</div>
            </div>
          </div>
          <aside className="plan-aside scroll-reveal reveal-right" data-scroll-reveal>
            <img src="/images/fiat-strada-rental.jpg" alt="Fiat Strada branca, veículo apresentado no material de locação Veloz" loading="lazy" />
            <p>Consulte com Fábio qual carro está disponível e confira os detalhes do plano antes de fechar.</p>
          </aside>
        </div>
      </section>

      <section className="section benefits">
        <div className="container benefit-layout">
          <div className="scroll-reveal reveal-left" data-scroll-reveal>
            <span className="section-kicker">Menos peso na semana</span>
            <h2>O que muda quando você aluga?</h2>
            <WhatsAppLink source="beneficios" label="Perguntar sobre o plano no WhatsApp"><MessageCircle size={17} /> Tirar dúvidas com Fábio</WhatsAppLink>
          </div>
          <div className="benefit-list">
            <article className="benefit-item scroll-reveal reveal-right" data-scroll-reveal><span className="benefit-index">01</span><div><h3>IPVA por conta da Veloz</h3><p>Essa conta não chega para você pagar pelo carro alugado.</p></div></article>
            <article className="benefit-item scroll-reveal reveal-right" data-scroll-reveal data-reveal-delay="1"><span className="benefit-index">02</span><div><h3>Seguro por conta da Veloz</h3><p>O seguro está incluso. Confirme as condições de cobertura diretamente com Fábio.</p></div></article>
            <article className="benefit-item scroll-reveal reveal-right" data-scroll-reveal data-reveal-delay="2"><span className="benefit-index">03</span><div><h3>Carro revisado</h3><p>O veículo é entregue revisado. Pergunte sobre as regras durante a locação.</p></div></article>
            <article className="benefit-item scroll-reveal reveal-right" data-scroll-reveal data-reveal-delay="3"><span className="benefit-index">04</span><div><h3>Plano semanal</h3><p>Saiba o valor do plano e as condições antes de combinar a locação.</p></div></article>
          </div>
        </div>
      </section>

      <section className="campaign">
        <div className="container">
          <div className="campaign-heading scroll-reveal reveal-left" data-scroll-reveal>
            <div><span className="section-kicker">Na rota de quem trabalha</span><h2>Informação para rodar melhor em Salvador.</h2></div>
            <a href="#duvidas" className="button button-dark" data-testid="link-campaign-duvidas">Veja como funciona <ArrowDown size={16} /></a>
          </div>
          <div className="campaign-images">
            <figure className="scroll-reveal reveal-scale" data-scroll-reveal>
              <img src="/images/motorista-planejamento.jpg" alt="Material de campanha Veloz sobre planejamento para motorista de aplicativo na Cidade Baixa, Salvador" loading="lazy" />
              <figcaption>Planejamento e escolhas para quem vive da direção.</figcaption>
            </figure>
            <figure className="scroll-reveal reveal-scale" data-scroll-reveal data-reveal-delay="1">
              <img src="/images/motorista-faturamento.jpg" alt="Material de campanha Veloz sobre organização e faturamento de motorista em Salvador" loading="lazy" />
              <figcaption>Organização, disciplina e rotina de trabalho.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="section offer" id="valores">
        <div className="container offer-layout">
          <div className="scroll-reveal reveal-left" data-scroll-reveal>
            <span className="section-kicker">Investimento sem surpresa</span>
            <h2>Converse com Fábio e confirme os detalhes do seu plano.</h2>
            <p style={{ color: '#c4c4c4', lineHeight: 1.7 }}>A Veloz atende motoristas em Salvador, Lauro de Freitas e Grande Salvador. Valores apresentados como ponto de partida; condições variam conforme o plano e o veículo disponível.</p>
            <div className="steps">
              <div className="step"><span className="step-number">1</span><div><strong>Chame Fábio no WhatsApp</strong><p>Conte que roda ou quer rodar por aplicativo.</p></div></div>
              <div className="step"><span className="step-number">2</span><div><strong>Confirme valores e condições</strong><p>Veja os carros disponíveis e tire suas dúvidas antes de decidir.</p></div></div>
              <div className="step"><span className="step-number">3</span><div><strong>Confira os documentos</strong><p>CNH com EAR e comprovante de residência são informados na conversa.</p></div></div>
            </div>
          </div>
          <div className="price-card scroll-reveal reveal-right" data-scroll-reveal>
            <span className="section-kicker">Valores a partir de</span>
            <div className="price-line"><span>Plano semanal</span><strong>R$ 550 / semana</strong></div>
            <div className="price-line"><span>Caução</span><strong>R$ 1.500</strong></div>
            <p className="price-footnote">Os valores são “a partir de”. Consulte com Fábio a condição aplicável ao veículo e o plano.</p>
            <WhatsAppLink source="valores" label="Consultar valores e condições com Fábio no WhatsApp">Consultar condições <ArrowRight size={17} /></WhatsAppLink>
          </div>
        </div>
      </section>

      <section className="section truth">
        <div className="container truth-grid">
          <div className="scroll-reveal reveal-left" data-scroll-reveal>
            <span className="section-kicker">Tudo combinado antes</span>
            <h2>Clareza antes de pegar a chave.</h2>
          </div>
          <div className="truth-copy scroll-reveal reveal-right" data-scroll-reveal>
            <p>Valor da semana, caução e regras precisam estar claros antes de você assinar. Pergunte sobre cobertura do seguro, manutenção durante a locação, quilometragem, multas e devolução da caução.</p>
            <p>São detalhes importantes para a sua rotina. Fábio pode explicar as condições do plano e o contrato antes de qualquer decisão.</p>
            <div className="truth-callout">A Veloz informa como benefícios confirmados: seguro e IPVA por conta da empresa, além de veículo revisado. Para outros detalhes, confirme diretamente no WhatsApp.</div>
            <div style={{ marginTop: 22 }}><WhatsAppLink source="condicoes" label="Confirmar regras da locação com Fábio">Confirmar as regras <ArrowUpRight size={16} /></WhatsAppLink></div>
          </div>
        </div>
      </section>

      <section className="section faq" id="duvidas">
        <div className="container faq-layout">
          <div className="scroll-reveal reveal-left" data-scroll-reveal>
            <span className="section-kicker">Perguntas frequentes</span>
            <h2>O que você quer saber?</h2>
            <p style={{ color: '#555', lineHeight: 1.7 }}>Se a resposta depende das condições do veículo, fale com Fábio antes de combinar.</p>
          </div>
          <div className="faq-list">
            <details className="scroll-reveal" data-scroll-reveal><summary data-testid="faq-summary-preco">Quanto custa para alugar?</summary><p>Os planos começam a partir de R$ 550 por semana, com caução a partir de R$ 1.500. Confirme com Fábio os valores para o carro disponível.</p></details>
            <details className="scroll-reveal" data-scroll-reveal data-reveal-delay="1"><summary data-testid="faq-summary-incluso">O que está incluso no plano?</summary><p>Seguro e IPVA ficam por conta da Veloz, e o veículo vem revisado.</p></details>
            <details className="scroll-reveal" data-scroll-reveal data-reveal-delay="2"><summary data-testid="faq-summary-documentos">Quais documentos preciso?</summary><p>A Veloz informa CNH com EAR e comprovante de residência. Converse primeiro com Fábio; documentos só devem ser solicitados depois que você estiver informado sobre o uso.</p></details>
            <details className="scroll-reveal" data-scroll-reveal data-reveal-delay="3"><summary data-testid="faq-summary-aplicativos">Posso rodar em Uber, 99 e InDrive?</summary><p>O aluguel é voltado para motorista de aplicativo. Confirme com Fábio se o veículo disponível atende ao seu uso e às categorias aceitas.</p></details>
            <details className="scroll-reveal" data-scroll-reveal data-reveal-delay="4"><summary data-testid="faq-summary-prazo">Quanto tempo leva para pegar o carro?</summary><p>O prazo depende das condições e da disponibilidade. Chame Fábio para confirmar os detalhes do momento.</p></details>
            <details className="scroll-reveal" data-scroll-reveal><summary data-testid="faq-summary-km">Tem limite de quilometragem?</summary><p>Essa informação não foi confirmada. Pergunte a Fábio sobre a regra de quilometragem do plano antes de fechar.</p></details>
            <details className="scroll-reveal" data-scroll-reveal data-reveal-delay="1"><summary data-testid="faq-summary-manutencao">Quem paga manutenção durante o aluguel?</summary><p>O carro é entregue revisado, mas as regras de manutenção durante a locação precisam ser confirmadas com Fábio.</p></details>
            <details className="scroll-reveal" data-scroll-reveal data-reveal-delay="2"><summary data-testid="faq-summary-regiao">Em quais regiões vocês atendem?</summary><p>Salvador, Lauro de Freitas e Grande Salvador.</p></details>
            <details className="scroll-reveal" data-scroll-reveal data-reveal-delay="3"><summary data-testid="faq-summary-seguro-caucao">Como funciona seguro, caução e contrato?</summary><p>Os detalhes de cobertura, devolução da caução e condições do contrato devem ser confirmados diretamente com Fábio antes de assinar.</p></details>
            <p className="faq-note">Quer confirmar mais alguma condição? Fale diretamente pelo WhatsApp. Sem formulário.</p>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="container final-inner scroll-reveal reveal-scale" data-scroll-reveal>
          <span className="section-kicker">Sua semana, mais leve</span>
          <h2 className="display">Você cuida de rodar.<br />A Veloz cuida do que pesa.</h2>
          <p>Imagine fechar a semana sem pensar em IPVA e seguro. Só você, o carro e as corridas. Chame Fábio e veja qual carro está disponível para você.</p>
          <WhatsAppLink source="final" label="Fale conosco pelo WhatsApp"><MessageCircle size={18} /> Fale conosco <ArrowUpRight size={16} /></WhatsAppLink>
          <div className="final-note">Resposta direta no WhatsApp • Planos a partir de R$ 550/semana</div>
        </div>
      </section>

      <section className="privacy" id="privacidade">
        <div className="container privacy-inner scroll-reveal" data-scroll-reveal>
          <span className="section-kicker">Privacidade</span>
          <h2 className="display">Política de privacidade</h2>
          <p>Esta página não coleta dados por formulário. Ao clicar em um botão de WhatsApp, você abre uma conversa com a Veloz e decide quais informações compartilhar. O link abre o WhatsApp com uma mensagem inicial; o atendimento acontece nesse serviço, sujeito também às políticas do WhatsApp.</p>
          <p>Documentos como CNH com EAR e comprovante de residência só devem ser solicitados após você ser informado, pelo atendimento, sobre a finalidade e as condições da locação. Não envie documentos antes de compreender por que são necessários. Para dúvidas sobre o uso das informações, fale com Fábio pelo WhatsApp.</p>
          <p>Os cliques nos botões de contato emitem um evento local “Lead” para integração de mensuração quando configurada. Nenhum identificador de pixel ou serviço de análise foi presumido nesta página.</p>
        </div>
      </section>
      <footer className="footer">
        <div className="container footer-inner">
          <a href="#inicio" aria-label="Voltar ao início" data-testid="link-footer-home"><img src="/images/veloz-logo.jpg" alt="Veloz Rent a Car" loading="lazy" /></a>
          <small>Veloz Rent a Car • Salvador, Lauro de Freitas e Grande Salvador</small>
          <div className="footer-links"><a href="#privacidade" data-testid="link-privacy">Política de Privacidade</a><a href="#inicio" data-testid="link-back-top">Voltar ao topo</a></div>
        </div>
      </footer>
      <WhatsAppLink source="mobile-fixo" className="button floating-wa" label="Fale conosco pelo WhatsApp">
        <MessageCircle size={19} /> Chamar no WhatsApp
      </WhatsAppLink>
    </main>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
