---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

// Obtener contenido de la institución
const institucion = (await getCollection('institucion'))[0]; // Asume una sola entrada

// Obtener noticias para el carrusel, ordenar por fecha (más reciente primero)
const noticias = (await getCollection('noticias')).sort(
  (a, b) => b.data.date.getTime() - a.data.date.getTime()
);

// Obtener fechas especiales para el calendario
const fechasEspeciales = await getCollection('fechas_especiales');
// Mapear los datos para que coincidan con el formato esperado por script.js
const holidaysData = fechasEspeciales.map(entry => ({
  name: entry.data.name,
  month: entry.data.month,
  day: entry.data.day
}));

// Obtener ofertas académicas
const ofertasAcademicas = await getCollection('ofertas_academicas');

// Obtener reseña histórica
const historia = (await getCollection('historia'))[0]; // Asume una sola entrada

// Obtener información de contacto
const contactoInfo = (await getCollection('contacto_info'))[0]; // Asume una sola entrada
---

<BaseLayout title="U.E. Colegio Santa Bárbara - Inicio" holidays={holidaysData}>
    <section id="inicio" class="hero-section">
        <div class="container content-carousel-grid">
            <div class="institution-about">
                <h2>{institucion.data.title}</h2>
                <!-- set:html permite renderizar Markdown o HTML directamente -->
                <p set:html={institucion.data.description_p1} />
                <p set:html={institucion.data.description_p2} />
                <p set:html={institucion.data.description_p3} />
            </div>

            <div class="news-carousel-container">
                <h3>Últimas Noticias</h3>
                <div class="carousel-wrapper">
                    <!-- Itera sobre las noticias obtenidas del CMS -->
                    {noticias.map((noticia, index) => (
                        <div class={`carousel-slide ${index === 0 ? 'active' : ''}`}>
                            <!-- Usa la imagen del CMS o un placeholder si no hay -->
                            <img src={noticia.data.image || 'https://placehold.co/400x400/02BF61/FFFFFF?text=Imagen+Noticia'} alt={noticia.data.title} />
                            <div class="carousel-caption">
                                <h4>{noticia.data.title}</h4>
                                <p>{noticia.data.summary}</p>
                            </div>
                        </div>
                    ))}
                    <button class="carousel-prev"></button>
                    <button class="carousel-next"></button>
                </div>
                <div class="carousel-dots"></div>
            </div>
        </div>
    </section>

    <section id="calendario" class="section-container section-green-bg">
        <div class="container">
            <h2>Calendario Académico</h2>
            <div class="calendar-display">
                <div class="calendar-header">
                    <button id="prevMonth" class="calendar-nav-btn">‹</button>
                    <h3 id="currentMonthYear"></h3>
                    <button id="nextMonth" class="calendar-nav-btn">›</button>
                </div>
                <div class="calendar-weekdays">
                    <span>Dom</span>
                    <span>Lun</span>
                    <span>Mar</span>
                    <span>Mié</span>
                    <span>Jue</span>
                    <span>Vie</span>
                    <span>Sáb</span>
                </div>
                <div class="calendar-dates" id="calendarDates">
                    <!-- El contenido del calendario se genera con JavaScript -->
                </div>
            </div>
        </div>
    </section>

    <section id="oferta" class="section-container">
        <div class="container">
            <h2>Nuestra Oferta Educativa</h2>
            <div class="grid-layout offer-expandable-grid">
                <!-- Itera sobre las ofertas académicas obtenidas del CMS -->
                {ofertasAcademicas.map(oferta => (
                    <div class={`offer-card expandable-card ${oferta.data.color_class || ''}`}>
                        <div class="card-header">
                            <!-- Reemplaza <br> si lo usas en el título del CMS para que no se renderice como HTML -->
                            <h3>{oferta.data.title.replace('<br>', '')}</h3>
                            <button class="expand-toggle">+</button>
                        </div>
                        <div class="card-content">
                            <p>{oferta.data.summary}</p>
                            <p set:html={oferta.data.description} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>

    <section id="historia" class="section-container section-green-bg">
        <div class="container content-with-image">
            <div class="text-content">
                <h2>{historia.data.title}</h2>
                <p set:html={historia.data.paragraph1} />
                <p set:html={historia.data.paragraph2} />
                <p set:html={historia.data.paragraph3} />
            </div>
            <div class="image-content">
                <!-- Usa la imagen del CMS o un placeholder si no hay -->
                <img src={historia.data.image || 'https://placehold.co/400x300/02BF61/FFFFFF?text=Imagen+Historia'} alt="Imagen de la historia del colegio">
            </div>
        </div>
    </section>

    <section id="contacto" class="section-container">
        <div class="container contact-grid">
            <div class="contact-form-container">
                <h3>Envíanos un mensaje</h3>
                <!-- Añade data-netlify="true" para que Netlify capture los envíos del formulario -->
                <form id="contactForm" class="contact-form" data-netlify="true">
                    <div class="form-group">
                        <label for="nombre">Nombre:</label>
                        <input type="text" id="nombre" name="nombre" required>
                    </div>
                    <div class="form-group">
                        <label for="asunto">Asunto:</label>
                        <input type="text" id="asunto" name="asunto" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Tu Correo Electrónico:</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="mensaje">Mensaje:</label>
                        <textarea id="mensaje" name="mensaje" rows="5" required></textarea>
                    </div>
                    <button type="submit" class="btn-submit">Enviar Mensaje</button>
                </form>
                <div id="form-messages" class="form-messages"></div>
            </div>

            <div class="contact-info-map">
                <div class="contact-details">
                    <h3>{contactoInfo.data.title}</h3>
                    <p><strong>Teléfono:</strong> {contactoInfo.data.phone}</p>
                    <p><strong>Dirección:</strong> {contactoInfo.data.address}</p>
                    <p><strong>Síguenos en Instagram:</strong></p>
                    <p class="instagram-link">
                        <a href={contactoInfo.data.instagram_url} target="_blank" aria-label="Instagram de Colegio Santa Bárbara">
                            <i class="fab fa-instagram instagram-icon"></i> {contactoInfo.data.instagram_handle}
                        </a>
                    </p>
                </div>
                <div class="map-container">
                    <h3>Nuestra Ubicación</h3>
                    <!-- Usa la URL del mapa del CMS -->
                    <iframe src={contactoInfo.data.map_embed_url} width="100%" height="300" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
            </div>
        </div>
    </section>
</BaseLayout>