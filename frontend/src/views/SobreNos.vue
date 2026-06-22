<script setup lang="ts">
import { onMounted } from "vue";
import Cabecalho from "../components/cabecalho.vue";
import Footer from "../components/footer.vue";

const pilares = [
  {
    numero: "01",
    titulo: "Comércio Justo e Real",
    desc: "Eliminamos intermediários abusivos. 100% do valor premium pago retorna diretamente para as mãos de quem cultivou a terra.",
  },
  {
    numero: "02",
    titulo: "Preservação Cultural",
    desc: "Apoiamos métodos ancestrais e sementes crioulas. Proteger a tradição é garantir a sobrevivência da nossa biodiversidade.",
  },
  {
    numero: "03",
    titulo: "Sustentabilidade Orgânica",
    desc: "Nosso tempo é o tempo da natureza. Plantio consorciado, adubação verde e respeito absoluto aos lençóis freáticos.",
  },
];

onMounted(() => {
  const els = document.querySelectorAll(".reveal");

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("active");
        } else {
          e.target.classList.remove("active");
        }
      });
    },
    {
      threshold: 0.05,
      rootMargin: "-20px 0px",
    },
  );

  els.forEach((el) => obs.observe(el));
});
</script>

<template>
  <div
    class="min-h-screen bg-[#FAF6F0] text-[#1E1A16] font-sans antialiased overflow-x-hidden selection:bg-[#C49A55]/20"
  >

    <section class="pt-28 pb-24 md:pt-32 md:pb-32 relative z-10">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid lg:grid-cols-12 gap-8 items-start">
          <div class="lg:col-span-8 space-y-6 reveal">
            <span class="text-xs font-bold tracking-[0.3em] uppercase text-[#C49A55] block">
              Manifesto de Origem
            </span>
            <h1 class="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]">
              Nascidos da terra, guiados pelo <span class="italic text-[#C49A55] font-normal">respeito</span>.
            </h1>
          </div>
          <div class="lg:col-span-4 lg:mt-16 border-l-2 border-[#C49A55]/30 pl-6 reveal" style="transition-delay: 150ms;">
            <p class="text-black/70 text-lg font-light leading-relaxed">
              Não somos uma distribuidora. Somos uma ponte viva entre paladares exigentes e os guardiões da agricultura familiar mais pura do país.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="pb-40 relative">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-12 gap-6 md:gap-10 items-center">
          
          <div class="col-span-12 md:col-span-5 reveal">
            <div class="relative group rounded-[40px] overflow-hidden shadow-2xl aspect-[4/5] bg-[#EDE4D5]">
              <img 
                src="https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=800&q=80" 
                alt="Colheita manual de café na roça"
                class="w-full h-full object-cover scale-102 group-hover:scale-105 transition transform duration-1000 ease-out filter sepia-[10%] contrast-[105%]"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[#1e1a16]/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
            </div>
          </div>

          <div class="col-span-12 md:col-span-7 md:pl-8 space-y-8 reveal" style="transition-delay: 100ms;">
            <h2 class="font-serif text-3xl sm:text-5xl font-bold leading-tight tracking-tight text-[#2C251E]">
              Acreditamos que o luxo contemporâneo está na verdade daquilo que consumimos.
            </h2>
            <div class="space-y-6 text-black/70 text-base sm:text-lg font-light leading-relaxed max-w-xl">
              <p>
                O projeto nasceu nas montanhas de Minas Gerais com um propósito inegociável: resgatar a dignidade do pequeno produtor rural e oferecer alimentos em seu estado de pureza máxima, sem maquiagens industriais ou pressa comercial.
              </p>
              <p>
                Cada grão de café colhido à mão, cada bloco de rapadura moldado no tacho e cada saca de farinha artesanal carrega a identidade, o suor e a história de uma família. Conectar você a esse micro-lote é a nossa arte.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <section class="py-32 bg-[#F5EFE4] border-y border-[#EDE4D5] relative overflow-hidden">
      <div class="absolute inset-0 opacity-[0.015] pointer-events-none bg-[radial-gradient(#C49A55_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <div class="reveal mb-20 text-center max-w-2xl mx-auto space-y-4">
          <span class="text-xs font-bold tracking-[0.3em] uppercase text-[#C49A55] block">Como Operamos</span>
          <h2 class="font-serif text-4xl sm:text-5xl font-bold tracking-tight">Nossos Compromissos</h2>
        </div>

        <div class="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div 
            v-for="(pilar, idx) in pilares" 
            :key="idx"
            class="reveal bg-[#FAF6F0] rounded-[36px] p-8 lg:p-10 border border-[#ECE6DC] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group"
            :style="{ transitionDelay: idx * 100 + 'ms' }"
          >
            <div class="flex items-center justify-between mb-8">
              <span class="font-serif text-4xl font-bold text-[#C49A55]/25 group-hover:text-[#C49A55] transition-colors duration-500 block">
                {{ pilar.numero }}
              </span>
              <div class="w-8 h-[1px] bg-[#C49A55]/30 group-hover:w-16 group-hover:bg-[#C49A55] transition-all duration-500"></div>
            </div>
            <h3 class="text-xl font-bold tracking-wide text-[#1E1A16] mb-4 group-hover:text-[#C49A55] transition-colors duration-300">
              {{ pilar.titulo }}
            </h3>
            <p class="text-sm sm:text-base text-black/60 font-light leading-relaxed">
              {{ pilar.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-48 relative bg-[#FAF6F0] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-[0.04] mix-blend-overlay"></div>
      
      <div class="max-w-4xl mx-auto px-6 text-center reveal relative z-10">
        <span class="text-5xl text-[#C49A55] font-serif block mb-4">“</span>
        <blockquote class="font-serif text-3xl sm:text-5xl italic text-[#3A332C] leading-snug tracking-tight">
          "Alimento não é mercadoria de prateleira em massa. Alimento é cultura, identidade e, acima de tudo, respeito pelo tempo perfeito da terra."
        </blockquote>
        <div class="mt-8 inline-flex items-center gap-4">
          <div class="w-8 h-[1px] bg-[#C49A55]"></div>
          <span class="text-xs uppercase tracking-widest font-bold text-black/50">Conselho de Curadoria do Campo</span>
        </div>
      </div>
    </section>

    <section class="pb-40">
      <div class="max-w-5xl mx-auto px-6">
        <div class="reveal border border-[#C49A55]/20 rounded-[50px] p-12 sm:p-20 text-center space-y-8 bg-gradient-to-br from-[#FDFCFB] to-[#F5EFE4] shadow-xl relative overflow-hidden">
          
          <div class="relative z-10 space-y-6">
            <h3 class="font-serif text-3xl sm:text-5xl font-bold text-[#1E1A16]">Que tal experimentar a diferença na mesa?</h3>
            <p class="text-black/70 max-w-lg mx-auto font-light text-base sm:text-lg leading-relaxed">
              Nossas safras mudam de acordo com as estações. Descubra as raridades que as famílias produtoras separaram exclusivamente para este mês.
            </p>
            <div class="pt-6">
              <RouterLink
                to="/catalogo"
                class="group relative inline-flex px-12 py-5 bg-[#C49A55] text-white rounded-full font-medium tracking-wider overflow-hidden shadow-2xl shadow-[#C49A55]/30 hover:shadow-[#C49A55]/50 transition-all duration-500 transform hover:-translate-y-1"
              >
                <span class="relative z-10 flex items-center gap-3 text-xs uppercase tracking-widest font-bold">
                  Explorar Coleções da Roça
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform group-hover:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
                <div class="absolute inset-0 bg-[#AD8443] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out"></div>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer class="border-t border-[#EDE4D5]" />
  </div>
</template>

<style scoped>
/* Importação limpa das fontes direto no escopo do estilo */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');

.font-sans {
  font-family: "Plus Jakarta Sans", sans-serif;
}
.font-serif {
  font-family: "Playfair Display", serif;
}

.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition:
    opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1),
    transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
}

.reveal.active {
  opacity: 1;
  transform: translateY(0);
}
</style>