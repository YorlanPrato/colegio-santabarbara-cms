import { defineConfig, defineCollection } from 'astro/config'; // 'z' se elimina de aquí
import netlify from '@astrojs/netlify/functions';
import { z } from 'zod'; // 'z' se importa directamente desde 'zod'

// Define tus colecciones de contenido aquí
const institucionCollection = defineCollection({
  type: 'content', // 'content' para Markdown, 'data' para YAML/JSON
  schema: z.object({
    title: z.string(),
    description_p1: z.string(),
    description_p2: z.string(),
    description_p3: z.string(),
  }),
});

const noticiasCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    image: z.string().optional(), // optional() significa que el campo no es obligatorio
    date: z.date(),
    body: z.string(), // El contenido principal del Markdown
  }),
});

const fechasEspecialesCollection = defineCollection({
  type: 'data', // 'data' para datos simples que no tienen un cuerpo de Markdown
  schema: z.object({
    name: z.string(),
    month: z.number(),
    day: z.number(),
  }),
});

const ofertasAcademicasCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    description: z.string(),
    color_class: z.string().optional(),
  }),
});

const historiaCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    paragraph1: z.string(),
    paragraph2: z.string(),
    paragraph3: z.string(),
    image: z.string().optional(),
  }),
});

const contactoInfoCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    phone: z.string(),
    address: z.string(),
    instagram_url: z.string(),
    instagram_handle: z.string(),
    map_embed_url: z.string(),
  }),
});

// Exporta tus colecciones para que Astro las reconozca
export const collections = {
  institucion: institucionCollection,
  noticias: noticiasCollection,
  fechas_especiales: fechasEspecialesCollection,
  ofertas_academicas: ofertasAcademicasCollection,
  historia: historiaCollection,
  contacto_info: contactoInfoCollection,
};

export default defineConfig({
  output: 'static', // Importante para sitios estáticos
  adapter: netlify(),
  integrations: [], // Puedes añadir integraciones si usas React, Vue, etc.
});
