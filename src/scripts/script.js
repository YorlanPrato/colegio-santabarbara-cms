document.addEventListener('DOMContentLoaded', () => {
    // --- Carrusel de Noticias ---
    const slides = document.querySelectorAll('.carousel-slide');
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    let currentSlide = 0;
    let carouselInterval;

    function showSlide(index) {
        if (!slides || slides.length === 0) return;
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
        updateDots(index);
    }

    function updateDots(index) {
        if (!dotsContainer || !slides || slides.length === 0) return;
        dotsContainer.innerHTML = '';
        slides.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === index) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => {
                currentSlide = i;
                showSlide(currentSlide);
                resetCarouselInterval();
            });
            dotsContainer.appendChild(dot);
        });
    }

    function nextSlide() {
        if (!slides || slides.length === 0) return;
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        if (!slides || slides.length === 0) return;
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function startCarousel() {
        if (!slides || slides.length === 0) return;
        carouselInterval = setInterval(nextSlide, 5000);
    }

    function resetCarouselInterval() {
        clearInterval(carouselInterval);
        startCarousel();
    }

    if (slides && slides.length > 0) {
        showSlide(currentSlide);
        startCarousel();

        const carouselWrapper = document.querySelector('.carousel-wrapper');
        if (carouselWrapper) {
            carouselWrapper.addEventListener('mouseenter', () => clearInterval(carouselInterval));
            carouselWrapper.addEventListener('mouseleave', startCarousel);
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetCarouselInterval();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetCarouselInterval();
            });
        }
    }

    // --- Scroll Suave para Menú y Resaltado de Opción Activa ---
    const scrollLinks = document.querySelectorAll('.scroll-link');
    const sections = document.querySelectorAll('section');
    const header = document.querySelector('.main-header');

    function activateNavLink(id) {
        scrollLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
                link.classList.add('active');
            }
        });
    }

    function checkActiveSection() {
        let currentActiveSectionId = 'inicio';
        const headerOffset = header ? header.offsetHeight : 0;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const offset = window.pageYOffset + rect.top - headerOffset;
            const activationMargin = 100;

            if (window.pageYOffset >= offset - activationMargin && window.pageYOffset < offset + section.offsetHeight - activationMargin) {
                currentActiveSectionId = section.id;
            }
        });
        activateNavLink(currentActiveSectionId);
    }

    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const headerOffset = header ? header.offsetHeight : 0;

            if (targetElement) {
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    window.addEventListener('scroll', checkActiveSection);
    window.addEventListener('load', () => {
        setTimeout(checkActiveSection, 100);
    });

    // --- Formulario de Contacto (Validación Básica) ---
    const contactForm = document.getElementById('contactForm');
    const formMessages = document.getElementById('form-messages');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const name = formData.get('nombre');
            const subject = formData.get('asunto');
            const email = formData.get('email');
            const message = formData.get('mensaje');

            if (!name || !subject || !email || !message) {
                displayMessage('Por favor, completa todos los campos del formulario.', 'error');
                return;
            }

            console.log('Formulario enviado:', { name, subject, email, message });
            displayMessage('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.', 'success');
            contactForm.reset();
        });
    }

    function displayMessage(message, type) {
        if (formMessages) {
            formMessages.textContent = message;
            formMessages.className = 'form-messages ' + type;
            formMessages.style.display = 'block';

            setTimeout(() => {
                formMessages.style.display = 'none';
            }, 5000);
        }
    }

    // --- Funcionalidad de Recuadros Ampliables en Oferta Académica ---
    const expandableCards = document.querySelectorAll('.expandable-card');

    expandableCards.forEach(card => {
        const header = card.querySelector('.card-header');
        const toggleButton = card.querySelector('.expand-toggle');

        function toggleCardExpansion() {
            const isCurrentlyExpanded = card.classList.contains('expanded');

            expandableCards.forEach(otherCard => {
                otherCard.classList.remove('expanded');
                const otherToggleButton = otherCard.querySelector('.expand-toggle');
                if (otherToggleButton) {
                    otherToggleButton.textContent = '+';
                }
            });

            if (!isCurrentlyExpanded) {
                card.classList.add('expanded');
                if (toggleButton) {
                    toggleButton.textContent = '-';
                }
            }
        }

        if (header) {
            header.addEventListener('click', toggleCardExpansion);
        }

        if (toggleButton) {
            toggleButton.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleCardExpansion();
            });
        }
    });

    // --- Calendario Dinámico ---
    const calendarDatesElement = document.getElementById('calendarDates');
    const currentMonthYearElement = document.getElementById('currentMonthYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    let currentHolidayTooltip = null;

    function showHolidayTooltip(message, targetElement) {
        if (currentHolidayTooltip) {
            currentHolidayTooltip.remove();
            currentHolidayTooltip = null;
        }

        const tooltip = document.createElement('div');
        tooltip.classList.add('holiday-tooltip');
        tooltip.textContent = message;
        document.body.appendChild(tooltip);

        currentHolidayTooltip = tooltip;

        const rect = targetElement.getBoundingClientRect();
        const scrollX = window.scrollX || document.documentElement.scrollLeft;
        const scrollY = window.scrollY || document.documentElement.scrollTop;

        requestAnimationFrame(() => {
            const tooltipWidth = tooltip.offsetWidth;
            const tooltipHeight = tooltip.offsetHeight;

            let topPosition = rect.top + scrollY - tooltipHeight - 10;
            let leftPosition = rect.left + scrollX + (rect.width / 2) - (tooltipWidth / 2);

            if (topPosition < 0) {
                topPosition = rect.bottom + scrollY + 10;
                tooltip.classList.add('below');
            } else {
                tooltip.classList.remove('below');
            }

            tooltip.style.top = `${topPosition}px`;
            tooltip.style.left = `${leftPosition}px`;
            tooltip.style.opacity = '1';
            tooltip.style.transform = tooltip.classList.contains('below') ? 'translateY(0)' : 'translateY(0)';
        });

        if (!document.body.dataset.tooltipClickListenerAdded) {
            document.addEventListener('click', hideHolidayTooltipOnClickOutside);
            document.body.dataset.tooltipClickListenerAdded = 'true';
        }
    }

    function hideHolidayTooltipOnClickOutside(event) {
        if (currentHolidayTooltip &&
            !currentHolidayTooltip.contains(event.target) &&
            !event.target.closest('.calendar-date-cell.holiday')
        ) {
            currentHolidayTooltip.style.opacity = '0';
            currentHolidayTooltip.style.transform = currentHolidayTooltip.classList.contains('below') ? 'translateY(-10px)' : 'translateY(10px)';
            setTimeout(() => {
                if (currentHolidayTooltip) {
                    currentHolidayTooltip.remove();
                    currentHolidayTooltip = null;
                    document.body.dataset.tooltipClickListenerAdded = '';
                    document.removeEventListener('click', hideHolidayTooltipOnClickOutside);
                }
            }, 200);
        }
    }

    // Usa window.holidaysData si está disponible, de lo contrario, usa un array vacío
    const holidays = window.holidaysData || [];

    function generateCalendar(year, month) {
        if (!calendarDatesElement || !currentMonthYearElement) return;

        calendarDatesElement.innerHTML = '';

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const firstDayOfWeek = firstDayOfMonth.getDay();

        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        currentMonthYearElement.textContent = `${monthNames[month]} ${year}`;

        for (let i = 0; i < firstDayOfWeek; i++) {
            const cell = document.createElement('div');
            cell.classList.add('calendar-date-cell', 'other-month');
            calendarDatesElement.appendChild(cell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement('div');
            cell.classList.add('calendar-date-cell', 'current-month');
            cell.textContent = day;

            const currentDay = new Date(year, month, day);

            if (currentDay.toDateString() === new Date().toDateString()) {
                cell.classList.add('today');
            }

            // Busca el día festivo en el array inyectado por Astro
            const holiday = holidays.find(h => h.month === month && h.day === day);
            if (holiday) {
                cell.classList.add('holiday');
                cell.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showHolidayTooltip(holiday.name, cell);
                });
            }

            calendarDatesElement.appendChild(cell);
        }

        const totalCells = firstDayOfWeek + daysInMonth;
        let cellsToAdd = 0;
        if (totalCells < 35) {
            cellsToAdd = 35 - totalCells;
        } else if (totalCells > 35 && totalCells < 42) {
            cellsToAdd = 42 - totalCells;
        }

        for (let i = 0; i < cellsToAdd; i++) {
            const cell = document.createElement('div');
            cell.classList.add('calendar-date-cell', 'other-month');
            calendarDatesElement.appendChild(cell);
        }
    }

    let currentDate = new Date(); // Mueve esto aquí para que sea accesible

    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
        });
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
        });
    }

    if (calendarDatesElement && currentMonthYearElement && prevMonthBtn && nextMonthBtn) {
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    }
});
