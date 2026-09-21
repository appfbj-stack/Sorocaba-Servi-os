/**
 * Seed inicial do banco:
 *   - Cria usuário admin (ADMIN_EMAIL/ADMIN_PASSWORD do .env)
 *   - Insere Sorocaba/SP como cidade principal + 30 bairros
 *   - Insere 12 categorias padrão de serviço
 *   - Popula tabela settings com defaults de monetização
 *
 * Idempotente — pode rodar várias vezes sem duplicar.
 *   npm run db:seed
 */

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db, pool } from './client.ts';
import {
  cities,
  neighborhoods,
  serviceCategories,
  users,
  settings,
} from './schema.ts';

const BAIRROS_SOROCABA = [
  'Centro', 'Jardim América', 'Vila Helena', 'Campolim', 'Alto da Boa Vista',
  'Jardim Vergueiro', 'Parque Campolim', 'Vila Progresso', 'Jardim Faculdade',
  'Wanel Ville', 'Vila Hortência', 'Jardim Saira', 'Jardim Residencial Tivoli Park',
  'Parque Esmeralda', 'Jardim dos Estados', 'Vila Nova Sorocaba', 'Éden',
  'Cajuru do Sul', 'Brigadeiro Tobias', 'Vila Sabiá', 'Jardim Botânico',
  'Jardim das Flores', 'Parque São Bento', 'Vila Yolanda', 'Vila Santana',
  'Jardim Luciana', 'Aparecidinha', 'Vila Independência', 'Jardim Ipanema',
  'Mangal',
];

const CATEGORIAS_PADRAO = [
  { nome: 'Eletricista', icone: 'Zap', descricao: 'Instalações elétricas, reparos e manutenção.' },
  { nome: 'Encanador', icone: 'Wrench', descricao: 'Reparos hidráulicos, vazamentos e instalações.' },
  { nome: 'Diarista', icone: 'Sparkles', descricao: 'Limpeza residencial e comercial.' },
  { nome: 'Pedreiro', icone: 'HardHat', descricao: 'Construção, reforma e acabamento.' },
  { nome: 'Pintor', icone: 'Paintbrush', descricao: 'Pintura residencial e comercial.' },
  { nome: 'Marceneiro', icone: 'Hammer', descricao: 'Móveis sob medida, reparos e montagem.' },
  { nome: 'Mecânico', icone: 'Wrench', descricao: 'Mecânica automotiva geral.' },
  { nome: 'Eletricista Automotivo', icone: 'Car', descricao: 'Elétrica de veículos.' },
  { nome: 'Costureira', icone: 'Scissors', descricao: 'Ajustes, consertos e confecção.' },
  { nome: 'Manicure e Pedicure', icone: 'Hand', descricao: 'Cuidados com unhas.' },
  { nome: 'Cabeleireira', icone: 'Scissors', descricao: 'Corte, coloração e tratamentos.' },
  { nome: 'Borracharia', icone: 'Circle', descricao: 'Pneus, alinhamento e balanceamento.' },
];

const DEFAULT_SETTINGS: Array<{ key: string; value: unknown; descricao: string }> = [
  { key: 'monetization_enabled', value: false, descricao: 'Liga/desliga cobrança (false = MVP grátis)' },
  { key: 'lojista_price_monthly', value: 19.99, descricao: 'Mensalidade lojista em R$' },
  { key: 'lojista_free_months', value: 6, descricao: 'Meses grátis iniciais do lojista' },
  { key: 'profissional_free_credits', value: 10, descricao: 'Créditos grátis ao cadastrar profissional' },
  { key: 'profissional_free_credits_validity_days', value: 180, descricao: 'Validade dos créditos grátis (dias)' },
  { key: 'credit_pack_qty', value: 10, descricao: 'Quantidade de créditos por pacote pago' },
  { key: 'credit_pack_price', value: 49.90, descricao: 'Preço do pacote de créditos em R$' },
  { key: 'credit_pack_validity_days', value: 90, descricao: 'Validade dos créditos comprados (dias)' },
  { key: 'pix_key', value: process.env.PIX_KEY ?? '02598018796', descricao: 'Chave PIX padrão' },
  { key: 'pix_key_type', value: process.env.PIX_KEY_TYPE ?? 'cpf', descricao: 'Tipo da chave PIX' },
  { key: 'promo_text', value: '', descricao: 'Texto do banner de promoção' },
  { key: 'promo_active', value: false, descricao: 'Liga/desliga banner de promoção' },
  { key: 'monetization_enabled_at', value: null, descricao: 'Timestamp em que monetização foi ativada (auditoria)' },
];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  // eslint-disable-next-line no-console
  console.log('[seed] iniciando seed do Kairós Serviços…');

  // ---------- Admin ----------
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@kairos.com';
  const existingAdmin = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);

  if (existingAdmin.length === 0) {
    const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123';
    const hash = await bcrypt.hash(adminPassword, 10);
    await db.insert(users).values({
      nome: process.env.ADMIN_NAME ?? 'Administrador',
      email: adminEmail,
      passwordHash: hash,
      role: 'admin',
    });
    // eslint-disable-next-line no-console
    console.log(`[seed] ✓ admin criado: ${adminEmail} / ${adminPassword} (TROQUE A SENHA!)`);
  } else {
    // eslint-disable-next-line no-console
    console.log('[seed] · admin já existe, pulando');
  }

  // ---------- Cidades ----------
  const sorocabaExisting = await db.select().from(cities).where(eq(cities.slug, 'sorocaba-sp')).limit(1);
  let sorocabaId: string;

  if (sorocabaExisting.length === 0) {
    const [inserted] = await db.insert(cities).values({
      nome: 'Sorocaba',
      estado: 'SP',
      slug: 'sorocaba-sp',
      cidadePrincipal: true,
    }).returning();
    sorocabaId = inserted!.id;
    // eslint-disable-next-line no-console
    console.log('[seed] ✓ cidade Sorocaba/SP criada');
  } else {
    sorocabaId = sorocabaExisting[0]!.id;
    // eslint-disable-next-line no-console
    console.log('[seed] · Sorocaba já existe, pulando');
  }

  // ---------- Bairros ----------
  const existingBairros = await db.select().from(neighborhoods).where(eq(neighborhoods.cityId, sorocabaId));
  if (existingBairros.length === 0) {
    await db.insert(neighborhoods).values(
      BAIRROS_SOROCABA.map((nome, i) => ({
        cityId: sorocabaId,
        nome,
        principal: i < 5, // 5 primeiros marcados como principais
      })),
    );
    // eslint-disable-next-line no-console
    console.log(`[seed] ✓ ${BAIRROS_SOROCABA.length} bairros de Sorocaba inseridos`);
  } else {
    // eslint-disable-next-line no-console
    console.log(`[seed] · ${existingBairros.length} bairros já existem, pulando`);
  }

  // ---------- Categorias ----------
  for (const cat of CATEGORIAS_PADRAO) {
    const slug = slugify(cat.nome);
    const exists = await db.select().from(serviceCategories).where(eq(serviceCategories.slug, slug)).limit(1);
    if (exists.length === 0) {
      await db.insert(serviceCategories).values({
        nome: cat.nome,
        slug,
        icone: cat.icone,
        descricao: cat.descricao,
        popular: ['Eletricista', 'Encanador', 'Diarista', 'Pedreiro', 'Pintor'].includes(cat.nome),
        servicosPadrao: [],
      });
    }
  }
  // eslint-disable-next-line no-console
  console.log(`[seed] ✓ ${CATEGORIAS_PADRAO.length} categorias processadas`);

  // ---------- Settings ----------
  for (const s of DEFAULT_SETTINGS) {
    const exists = await db.select().from(settings).where(eq(settings.key, s.key)).limit(1);
    if (exists.length === 0) {
      await db.insert(settings).values({
        key: s.key,
        value: s.value as never,
        descricao: s.descricao,
      });
    }
  }
  // eslint-disable-next-line no-console
  console.log(`[seed] ✓ ${DEFAULT_SETTINGS.length} settings inicializadas`);

  // eslint-disable-next-line no-console
  console.log('[seed] ✓ seed completo!');
  await pool.end();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[seed] ✗ falhou:', err);
  process.exit(1);
});
