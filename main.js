document.addEventListener('DOMContentLoaded', () => {

    // 1. NAVBAR SCROLL EFFECT
    const navbar = document.getElementById('navbar');

    const handleNavbarScroll = () => {
        if (window.scrollY > 24) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();

    // 2. HAMBURGER / DRAWER
    const hamburger = document.getElementById('hamburger');
    const navDrawer = document.getElementById('navDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerClose = document.getElementById('drawerClose');

    const openDrawer = () => {
        hamburger.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        navDrawer.classList.add('open');
        drawerOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        navDrawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
        document.body.style.overflow = '';
    };

    hamburger?.addEventListener('click', () => {
        hamburger.classList.contains('open') ? closeDrawer() : openDrawer();
    });

    drawerOverlay?.addEventListener('click', closeDrawer);
    drawerClose?.addEventListener('click', closeDrawer);

    document.querySelectorAll('.drawer-nav-link').forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    // 3. SMOOTH SCROLL FOR ANCHOR LINKS
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const id = anchor.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    // 4. FAQ ACCORDION
    document.querySelectorAll('.faq-item').forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const body = item.querySelector('.faq-body');

        trigger?.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            document.querySelectorAll('.faq-item.open').forEach(other => {
                other.classList.remove('open');
                other.querySelector('.faq-body')?.classList.remove('open');
                other.querySelector('.faq-trigger')?.setAttribute('aria-expanded', 'false');
            });

            if (!isOpen) {
                item.classList.add('open');
                body?.classList.add('open');
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // 5. PRICING TOGGLE
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const monthPrices = document.querySelectorAll('.price-monthly');
    const yearPrices = document.querySelectorAll('.price-yearly');

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const isYearly = btn.dataset.period === 'yearly';
            monthPrices.forEach(p => p.style.display = isYearly ? 'none' : '');
            yearPrices.forEach(p => p.style.display = isYearly ? '' : 'none');
        });
    });

    // 6. INTERSECTION OBSERVER (fade-in)
    const fadeEls = document.querySelectorAll('.fade-in');

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => fadeObserver.observe(el));

    // 7. COUNTER ANIMATION
    const counters = document.querySelectorAll('.metric-number[data-target]');

    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseFloat(el.dataset.target);
            const suffix = el.dataset.suffix || '';
            const prefix = el.dataset.prefix || '';
            const duration = 1800;
            const step = 16;
            const steps = duration / step;
            let current = 0;

            const timer = setInterval(() => {
                current += target / steps;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                const display = Number.isInteger(target) ? Math.round(current) : current.toFixed(1);
                el.textContent = prefix + display + suffix;
            }, step);

            countObserver.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(el => countObserver.observe(el));

    // 8. SCROLL TO TOP
    const scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollTopBtn?.classList.add('visible');
        } else {
            scrollTopBtn?.classList.remove('visible');
        }
    }, { passive: true });

    scrollTopBtn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 9. NAVBAR ACTIVE LINK
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-links a');

    const activeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => activeObserver.observe(s));

    // 10. LANGUAGE SYSTEM
    // All translations use data-i18n (textContent) or data-i18n-html (innerHTML)
    // Symbols use HTML entities in the dictionary (rendered via innerHTML for those keys)

    const I18N = {
        es: {
            // Navbar
            'nav.how':          'C\u00f3mo funciona',
            'nav.benefits':     'Beneficios',
            'nav.pricing':      'Precios',
            'nav.testimonials': 'Testimonios',
            'nav.about':        'Sobre nosotros',
            'nav.contact':      'Contacto',
            'nav.cta':          'Comenzar ahora',

            // Hero
            'hero.badge': '&#9201; Gesti\u00f3n de combustible en tiempo real',
            'hero.h1':    'Deja atr\u00e1s el <span class="hero-strike">caos</span>.<br>Gestiona combustible<br>como un <span class="hero-underline">profesional.</span>',
            'hero.subtitle': 'FullTank conecta empresas industriales con sus proveedores de combustible en una plataforma centralizada. Pedidos, pagos, log\u00edstica y trazabilidad en tiempo real \u2014 sin llamadas, sin Excel, sin errores.',
            'hero.check1':   'Sin tarjeta de cr\u00e9dito requerida',
            'hero.check2':   'Configuraci\u00f3n en menos de 10 minutos',
            'hero.check3':   'Soporte multiidioma incluido',
            'hero.cta':      'Solicitar una demo',
            'hero.play':     'Ver c\u00f3mo funciona',

            // Mockup
            'mockup.greeting': '👋 Buenos d\u00edas, Carlos',
            'mockup.kpi1':     'Pedidos activos',
            'mockup.kpi2':     'Pend. pago',
            'mockup.kpi3':     'En tr\u00e1nsito',
            'mockup.kpi4':     'Completados',
            'mockup.col1':     'ID',
            'mockup.col2':     'Tipo',
            'mockup.col3':     'Estado',
            'mockup.status1':  'Aprobado',
            'mockup.status2':  'Tr\u00e1nsito',
            'mockup.status3':  'Pendiente',
            'mockup.chart':    'Consumo mensual (galones)',
            'mockup.month1':   'Nov',
            'mockup.month2':   'Dic',
            'mockup.month3':   'Ene',
            'mockup.month4':   'Feb',
            'mockup.month5':   'Mar',
            'mockup.month6':   'Abr',

            // Social proof
            'social.label': 'Empresas que ya conf\u00edan en FullTank',

            // Problem
            'problem.label':    'El Problema',
            'problem.title':    '\u00bfTe suena familiar esta situaci\u00f3n?',
            'problem.subtitle': 'As\u00ed gestiona el combustible la mayor\u00eda de empresas hoy en d\u00eda\u2026',
            'problem.p1.title': 'Pedidos perdidos en WhatsApp',
            'problem.p1.text':  'Mensajes enterrados entre conversaciones. Sin confirmaci\u00f3n formal ni trazabilidad de qu\u00e9 se pidi\u00f3, cu\u00e1ndo y a qui\u00e9n.',
            'problem.p2.title': 'Excel interminable y desconectado',
            'problem.p2.text':  'Planillas duplicadas, datos desactualizados y errores de digitaci\u00f3n que nadie detecta hasta que ya es demasiado tarde.',
            'problem.p3.title': 'Llamadas para preguntar \u00ab\u00bfd\u00f3nde est\u00e1 mi pedido?\u00bb',
            'problem.p3.text':  'Horas perdidas en seguimiento manual. Ninguna visibilidad real del estado de la entrega.',
            'problem.p4.title': 'Errores que paralizan operaciones',
            'problem.p4.text':  'Un error en el pedido puede detener una obra entera. Las consecuencias econ\u00f3micas son devastadoras.',
            'problem.cta':      'FullTank elimina todo esto \u2192',

            // How it works
            'how.label':        'Proceso',
            'how.title':        'Gesti\u00f3n de combustible en 4 pasos simples',
            'how.subtitle':     'Desde el pedido hasta la entrega confirmada \u2014 todo en una sola plataforma.',
            'how.step1.title':  'Registra tu pedido',
            'how.step1.text':   'El solicitante crea un pedido en menos de 3 minutos: tipo de combustible, cantidad, fecha y direcci\u00f3n. Sube el comprobante de pago directo en la plataforma.',
            'how.step2.title':  'El proveedor aprueba',
            'how.step2.text':   'El proveedor recibe el pedido, valida el pago y lo aprueba con un clic. Sin llamadas, sin correos. El estado se actualiza autom\u00e1ticamente.',
            'how.step3.title':  'Despacho y trazabilidad',
            'how.step3.text':   'El proveedor asigna veh\u00edculo y conductor. El solicitante recibe notificaci\u00f3n de que su pedido est\u00e1 en camino, en tiempo real.',
            'how.step4.title':  'Confirmaci\u00f3n y cierre',
            'how.step4.text':   'El solicitante confirma la entrega. El proveedor cierra el pedido. El historial queda guardado para auditor\u00eda y reportes futuros.',

            // Features
            'features.label':    'Caracter\u00edsticas',
            'features.title':    'Todo lo que necesitas para gestionar<br>combustible B2B sin fricciones',
            'features.subtitle': 'Dise\u00f1ado espec\u00edficamente para solicitantes y proveedores de combustible industrial.',
            'features.f1.title': 'Trazabilidad en tiempo real',
            'features.f1.text':  'Monitorea cada pedido en tiempo real. Sabe exactamente en qu\u00e9 estado est\u00e1 tu combustible, desde la aprobaci\u00f3n hasta la entrega en obra.',
            'features.f2.title': 'Aprobaciones autom\u00e1ticas',
            'features.f2.text':  'Valida pagos y aprueba pedidos sin intermediarios. Reduce el tiempo de confirmaci\u00f3n de horas a minutos con flujos automatizados.',
            'features.f3.title': 'Dashboard inteligente',
            'features.f3.text':  'KPIs de pedidos, consumo mensual por proveedor y m\u00e9tricas de rendimiento en un panel visual y centralizado. Sin hojas de c\u00e1lculo.',
            'features.f4.title': 'Notificaciones autom\u00e1ticas',
            'features.f4.text':  'Alertas instant\u00e1neas en cada cambio de estado. Aprobado, despachado, entregado \u2014 tu equipo siempre informado sin hacer una sola llamada.',
            'features.f5.title': 'Reportes y exportaci\u00f3n PDF',
            'features.f5.text':  'Genera reportes de ventas o consumo filtrando por fecha, cliente o tipo de combustible. Desc\u00e1rgalos en PDF con un solo clic.',
            'features.f6.title': 'Gesti\u00f3n log\u00edstica integrada',
            'features.f6.text':  'Asigna veh\u00edculos disponibles y conductores a cada pedido aprobado. Evita conflictos de agenda con validaci\u00f3n autom\u00e1tica de disponibilidad.',

            // Segments
            'segments.title':    'Una plataforma. Dos soluciones.',
            'segments.subtitle': 'FullTank est\u00e1 dise\u00f1ado desde cero para las dos partes del proceso.',
            'segments.req.badge': 'Empresas Solicitantes',
            'segments.req.role':  '"El Operador Cr\u00edtico"',
            'segments.req.quote': '"Necesito saber exactamente d\u00f3nde est\u00e1 mi pedido sin tener que llamar todo el d\u00eda."',
            'segments.req.desc':  'Empresas de construcci\u00f3n, miner\u00eda, agroindustria y log\u00edstica que requieren combustible constante para sus operaciones y no pueden permitirse interrupciones.',
            'segments.req.li1':   'Registra pedidos en menos de 3 minutos',
            'segments.req.li2':   'Estado de pedido en tiempo real',
            'segments.req.li3':   'Historial completo de consumo y gastos',
            'segments.req.li4':   'Notificaciones de aprobaci\u00f3n y entrega',
            'segments.req.li5':   'Descarga reportes de consumo en PDF',
            'segments.req.cta':   'Soy solicitante \u2192',
            'segments.sup.badge': 'Proveedores de Combustible',
            'segments.sup.role':  '"La Gestora Saturada"',
            'segments.sup.quote': '"Si pudiera ver todos los pedidos organizados autom\u00e1ticamente, ahorrar\u00eda horas de trabajo cada d\u00eda."',
            'segments.sup.desc':  'Distribuidoras de combustible que atienden m\u00faltiples clientes corporativos y buscan escalar operaciones sin aumentar personal ni errores.',
            'segments.sup.li1':   'Centraliza todos los pedidos entrantes',
            'segments.sup.li2':   'Valida pagos y aprueba con un clic',
            'segments.sup.li3':   'Asigna veh\u00edculos y conductores sin conflictos',
            'segments.sup.li4':   'Reportes de ventas por cliente y periodo',
            'segments.sup.li5':   'Reduce errores log\u00edsticos en un 60%',
            'segments.sup.cta':   'Soy proveedor \u2192',

            // Metrics
            'metrics.title': 'Resultados que hablan por s\u00ed solos',
            'metrics.m1':    'Reducci\u00f3n en tiempo de gesti\u00f3n',
            'metrics.m2':    'Pedidos sin correcciones posteriores',
            'metrics.m3':    'Tiempo para registrar un pedido',
            'metrics.m4':    'Menos errores log\u00edsticos reportados',

            // About
            'about.label':        'Nuestra Startup',
            'about.title':        '\u00bfQui\u00e9nes somos?',
            'about.badge':        '\u00ab Startup PrimeFuel \u00b7 Lima, Per\u00fa',
            'about.description':  'Prime Fuel es un startup innovador dedicado a la gesti\u00f3n de la compraventa de combustible entre empresas solicitantes y proveedores. Somos el equipo de PrimeFuel, y nuestra propuesta se centra en la digitalizaci\u00f3n de un sector tradicionalmente dependiente de procesos manuales, brindando una soluci\u00f3n tecnol\u00f3gica que garantiza eficiencia, transparencia y un control m\u00e1s riguroso de las operaciones.',
            'about.mission.title':'Misi\u00f3n',
            'about.mission.text': 'Desarrollar soluciones tecnol\u00f3gicas avanzadas que transformen el mercado de combustible, eliminando los medios informales y reduciendo el margen de error, mediante una plataforma web intuitiva y accesible.',
            'about.vision.title': 'Visi\u00f3n',
            'about.vision.text':  'Posicionarnos como l\u00edderes en la digitalizaci\u00f3n del sector energ\u00e9tico, ofreciendo a las empresas una herramienta que facilite una gesti\u00f3n m\u00e1s eficiente, segura y sostenible, contribuyendo al progreso tecnol\u00f3gico y a la mejora de la competitividad del sector.',
            'about.stat1':        'Miembros fundadores de PrimeFuel',
            'about.stat2':        'Empresas en lista de espera',
            'about.stat3':        'Plataforma para todo el flujo de combustible',
            'about.upc':          '\u00bb Equipo PrimeFuel',

            // Team
            'team.video':    'Video sobre el equipo',
            'team.label':    'El Equipo',
            'team.title':    'Conoce a quienes hacen posible FullTank',
            'team.subtitle': 'Somos 5 profesionales de Ingenier\u00eda de Software, parte del equipo de PrimeFuel, comprometidos con digitalizar el sector energ\u00e9tico.',
            'team.career':   'Ing. de Software',
            'team.m1.desc':  'Profesional con pasi\u00f3n por la ciberseguridad e IA. Su fortaleza es liderar equipos eficazmente. Perseverante y dedicado, siempre listo para entregar proyectos exitosos.',
            'team.m2.desc':  'Colaborativo y adaptable. Disfruta aportar ideas y tiene s\u00f3lida base en C++ y Python, siempre buscando soluciones eficientes y simples.',
            'team.m3.desc':  'Profesional curiosa con experiencia en gesti\u00f3n de proyectos y metodolog\u00edas \u00e1giles. Enfocada en desarrollo web y an\u00e1lisis de datos.',
            'team.m4.desc':  'Enfocado en el desarrollo de soluciones tecnol\u00f3gicas innovadoras. Conocimientos en Python y C++, comprometido con la calidad del software.',
            'team.m5.desc':  'Ingeniero de Software, parte del equipo de PrimeFuel, con habilidades en desarrollo y dise\u00f1o de sistemas. Comprometido con la innovaci\u00f3n continua.',

            // Testimonials
            'testimonials.label':  'Testimonios',
            'testimonials.title':  'Lo que dicen quienes ya usan FullTank',
            'testimonials.t1.text': '"Antes perd\u00edamos horas coordinando pedidos por WhatsApp y Excel. Con FullTank, todo el equipo sabe el estado de cada pedido en tiempo real. Fue un cambio radical en nuestra operaci\u00f3n."',
            'testimonials.t1.name': 'Carlos R.',
            'testimonials.t1.role': 'Encargado Log\u00edstico \u00b7 MineraCorp Per\u00fa',
            'testimonials.t2.text': '"Manejamos m\u00e1s de 40,000 galones mensuales. FullTank nos permite validar pedidos y coordinar despachos sin saturar al equipo. Lo que antes tomaba horas, ahora toma minutos."',
            'testimonials.t2.name': 'Andrea L.',
            'testimonials.t2.role': 'Gerenta de Ventas \u00b7 DistribFuel SAC',
            'testimonials.t3.text': '"La trazabilidad en tiempo real cambi\u00f3 c\u00f3mo tomamos decisiones. Ya no dependemos de llamadas para saber si el combustible llega a tiempo. Eso vale oro en obras de construcci\u00f3n."',
            'testimonials.t3.name': 'Denis R.',
            'testimonials.t3.role': 'Jefe de Operaciones \u00b7 ConstructPro',

            // Pricing
            'pricing.label':       'Precios',
            'pricing.title':       'Planes que crecen contigo',
            'pricing.subtitle':    'Comienza ahora. Escala cuando tu operaci\u00f3n lo exija.',
            'pricing.monthly':     'Mensual',
            'pricing.yearly':      'Anual \u2014 ahorra 20%',
            'pricing.note':        '\u00a7 Todos los planes incluyen SSL, backups diarios y soporte en espa\u00f1ol.',
            'pricing.starter.desc':   'Para comenzar',
            'pricing.starter.period': '/ mes',
            'pricing.starter.li1':    'Hasta 20 pedidos/mes',
            'pricing.starter.li2':    '1 usuario administrador',
            'pricing.starter.li3':    'Dashboard b\u00e1sico de pedidos',
            'pricing.starter.li4':    'Notificaciones por email',
            'pricing.starter.li5':    'Historial \u00faltimos 3 meses',
            'pricing.starter.li6':    'Soporte por chat (48h)',
            'pricing.starter.cta':    'Comenzar ahora',
            'pricing.pro.badge':   '\u2605 M\u00e1s Popular',
            'pricing.pro.desc':    'Para operaciones activas',
            'pricing.pro.period':  '/ mes por empresa',
            'pricing.pro.li1':     'Pedidos ilimitados',
            'pricing.pro.li2':     'Hasta 5 usuarios por empresa',
            'pricing.pro.li3':     'Dashboard con analytics completo',
            'pricing.pro.li4':     'Notificaciones en tiempo real',
            'pricing.pro.li5':     'Asignaci\u00f3n de veh\u00edculos y conductores',
            'pricing.pro.li6':     'Reportes y exportaci\u00f3n PDF',
            'pricing.pro.li7':     'Historial completo',
            'pricing.pro.li8':     'Soporte prioritario (4h)',
            'pricing.pro.cta':     'Empezar con el plan Pro',
            'pricing.ent.desc':    'Para grandes operaciones',
            'pricing.ent.price':   'A consultar',
            'pricing.ent.period':  'Precio personalizado',
            'pricing.ent.li1':     'Todo lo del plan Pro, m\u00e1s:',
            'pricing.ent.li2':     'Usuarios ilimitados',
            'pricing.ent.li3':     'Integraci\u00f3n ERP (SAP, Oracle)',
            'pricing.ent.li4':     'API REST documentada',
            'pricing.ent.li5':     'Account manager dedicado',
            'pricing.ent.li6':     'SLA 99.9% uptime garantizado',
            'pricing.ent.li7':     'Onboarding personalizado',
            'pricing.ent.li8':     'Capacitaci\u00f3n del equipo',
            'pricing.ent.cta':     'Hablar con ventas',

            // FAQ
            'faq.title': 'Preguntas frecuentes',
            'faq.q1': '\u00bfNecesito instalar algo para usar FullTank?',
            'faq.a1': 'No. Es 100% web. Funciona desde cualquier navegador moderno en computadora, tablet o celular. Sin instalaciones, sin actualizaciones manuales.',
            'faq.q2': '\u00bfC\u00f3mo se gestionan los pagos dentro de la plataforma?',
            'faq.a2': 'El solicitante sube el comprobante de dep\u00f3sito bancario directamente en la plataforma. El proveedor lo valida y aprueba el pedido. FullTank no procesa pagos directamente \u2014 act\u00faa como gestor documental del proceso.',
            'faq.q3': '\u00bfPuedo tener varios usuarios en mi empresa?',
            'faq.a3': 'S\u00ed. El plan Starter incluye 1 usuario, el plan Pro hasta 5 y el plan Enterprise tiene usuarios ilimitados con roles y permisos diferenciados por funci\u00f3n.',
            'faq.q4': '\u00bfMis datos est\u00e1n protegidos?',
            'faq.a4': 'S\u00ed. Usamos autenticaci\u00f3n JWT, cifrado SSL en tr\u00e1nsito y backups diarios autom\u00e1ticos. Cumplimos con est\u00e1ndares de seguridad para datos empresariales sensibles.',
            'faq.q5': '\u00bfSe integra con mi sistema ERP actual?',
            'faq.a5': 'El plan Enterprise incluye integraci\u00f3n v\u00eda API REST documentada con SAP, Oracle y otros sistemas ERP. Nuestro equipo de ingenier\u00eda te acompa\u00f1a en el proceso.',
            'faq.q6': '\u00bfEn qu\u00e9 idiomas est\u00e1 disponible FullTank?',
            'faq.a6': 'Actualmente en espa\u00f1ol e ingl\u00e9s. Puedes cambiar el idioma desde cualquier pantalla con el selector en el navbar.',

            // CTA
            'cta.title':    '\u00bfListo para decirle adi\u00f3s<br>al caos del combustible?',
            'cta.subtitle': '\u00danete a m\u00e1s de 200 empresas que ya gestionan sus pedidos de combustible con FullTank. Sin contratos. Sin complicaciones.',
            'cta.btn':      'Empezar ahora \u2192',
            'cta.micro1':   'Sin tarjeta de cr\u00e9dito',
            'cta.micro2':   'Cancela en cualquier momento',
            'cta.micro3':   'Soporte en espa\u00f1ol',

            // Footer
            'footer.desc':      'Plataforma B2B para la gesti\u00f3n digital de compraventa y distribuci\u00f3n de combustible industrial en Per\u00fa.',
            'footer.col1.title':'Producto',
            'footer.col1.li1':  'C\u00f3mo funciona',
            'footer.col1.li2':  'Beneficios',
            'footer.col1.li3':  'Planes y precios',
            'footer.col1.li4':  'Solicitar demo',
            'footer.col2.title':'Empresa',
            'footer.col2.li1':  'Sobre PrimeFuel',
            'footer.col2.li2':  'Equipo',
            'footer.col2.li3':  'Blog',
            'footer.col2.li4':  'Carreras',
            'footer.col2.li5':  'Contacto',
            'footer.col3.title':'Legal y soporte',
            'footer.col3.li1':  'Centro de ayuda',
            'footer.col3.li2':  'Pol\u00edtica de privacidad',
            'footer.col3.li3':  'T\u00e9rminos de servicio',
            'footer.col3.li4':  'Estado del sistema',
            'footer.col3.li5':  'Seguridad',
            'footer.copy':      '\u00a9 2026 PrimeFuel. Todos los derechos reservados.',
            'footer.made':      'Hecho en Lima, Per\u00fa',

            // Contact form
            'form.label':    'Contacto',
            'form.title':    'Escr\u00edbenos',
            'form.subtitle': '\u00bfTienes dudas o quieres m\u00e1s informaci\u00f3n? Completa el formulario y nuestro equipo se pondr\u00e1 en contacto contigo.',
            'form.name':     'Nombre',
            'form.name.placeholder':    'Tu nombre completo',
            'form.email':    'Correo',
            'form.email.placeholder':   'tucorreo@empresa.com',
            'form.subject':  'T\u00edtulo',
            'form.subject.placeholder': 'Asunto de tu mensaje',
            'form.message':  'Mensaje',
            'form.message.placeholder': 'Cu\u00e9ntanos en qu\u00e9 podemos ayudarte',
            'form.submit':   'Enviar mensaje',
            'form.note':     '\u00a1Gracias! Hemos recibido tu mensaje.',
        },

        en: {
            // Navbar
            'nav.how':          'How it works',
            'nav.benefits':     'Benefits',
            'nav.pricing':      'Pricing',
            'nav.testimonials': 'Testimonials',
            'nav.about':        'About us',
            'nav.contact':      'Contact',
            'nav.cta':          'Get started now',

            // Hero
            'hero.badge': '&#9201; Real-time fuel management',
            'hero.h1':    'Leave the <span class="hero-strike">chaos</span> behind.<br>Manage your fuel<br>like a <span class="hero-underline">professional.</span>',
            'hero.subtitle': 'FullTank connects industrial companies with their fuel suppliers on a centralized platform. Orders, payments, logistics, and real-time traceability \u2014 no calls, no spreadsheets, no errors.',
            'hero.check1':   'No credit card required',
            'hero.check2':   'Setup in less than 10 minutes',
            'hero.check3':   'Multi-language support included',
            'hero.cta':      'Request a demo',
            'hero.play':     'See how it works',

            // Mockup
            'mockup.greeting': '👋 Good morning, Carlos',
            'mockup.kpi1':     'Active orders',
            'mockup.kpi2':     'Pending payment',
            'mockup.kpi3':     'In transit',
            'mockup.kpi4':     'Completed',
            'mockup.col1':     'ID',
            'mockup.col2':     'Type',
            'mockup.col3':     'Status',
            'mockup.status1':  'Approved',
            'mockup.status2':  'In transit',
            'mockup.status3':  'Pending',
            'mockup.chart':    'Monthly consumption (gallons)',
            'mockup.month1':   'Nov',
            'mockup.month2':   'Dec',
            'mockup.month3':   'Jan',
            'mockup.month4':   'Feb',
            'mockup.month5':   'Mar',
            'mockup.month6':   'Apr',

            // Social proof
            'social.label': 'Companies that already trust FullTank',

            // Problem
            'problem.label':    'The Problem',
            'problem.title':    'Does this situation sound familiar?',
            'problem.subtitle': 'This is how most companies manage fuel today\u2026',
            'problem.p1.title': 'Orders lost in WhatsApp',
            'problem.p1.text':  'Messages buried in conversations. No formal confirmation or traceability of what was ordered, when, or from whom.',
            'problem.p2.title': 'Endless and disconnected spreadsheets',
            'problem.p2.text':  'Duplicate sheets, outdated data, and typing errors that nobody catches until it is too late.',
            'problem.p3.title': 'Calls asking \u201cwhere is my order?\u201d',
            'problem.p3.text':  'Hours lost on manual follow-up. No real visibility into delivery status.',
            'problem.p4.title': 'Errors that halt operations',
            'problem.p4.text':  'A mistake in an order can shut down an entire project. The financial consequences are devastating.',
            'problem.cta':      'FullTank eliminates all of this \u2192',

            // How it works
            'how.label':        'Process',
            'how.title':        'Fuel management in 4 simple steps',
            'how.subtitle':     'From the order to confirmed delivery \u2014 all in one platform.',
            'how.step1.title':  'Place your order',
            'how.step1.text':   'The requester creates an order in under 3 minutes: fuel type, quantity, date, and address. Upload the payment receipt directly on the platform.',
            'how.step2.title':  'Supplier approves',
            'how.step2.text':   'The supplier receives the order, validates the payment, and approves it with one click. No calls, no emails. The status updates automatically.',
            'how.step3.title':  'Dispatch and traceability',
            'how.step3.text':   'The supplier assigns a vehicle and driver. The requester receives a notification that their order is on the way, in real time.',
            'how.step4.title':  'Confirmation and close',
            'how.step4.text':   'The requester confirms delivery. The supplier closes the order. The history is saved for auditing and future reports.',

            // Features
            'features.label':    'Features',
            'features.title':    'Everything you need to manage<br>B2B fuel without friction',
            'features.subtitle': 'Designed specifically for industrial fuel requesters and suppliers.',
            'features.f1.title': 'Real-time traceability',
            'features.f1.text':  'Monitor every order in real time. Know exactly what state your fuel is in, from approval to on-site delivery.',
            'features.f2.title': 'Automatic approvals',
            'features.f2.text':  'Validate payments and approve orders without intermediaries. Reduce confirmation time from hours to minutes with automated workflows.',
            'features.f3.title': 'Smart dashboard',
            'features.f3.text':  'Order KPIs, monthly consumption by supplier, and performance metrics in a visual, centralized panel. No spreadsheets needed.',
            'features.f4.title': 'Automatic notifications',
            'features.f4.text':  'Instant alerts on every status change. Approved, dispatched, delivered \u2014 your team always informed without making a single call.',
            'features.f5.title': 'Reports and PDF export',
            'features.f5.text':  'Generate sales or consumption reports filtered by date, client, or fuel type. Download them as PDF with a single click.',
            'features.f6.title': 'Integrated logistics management',
            'features.f6.text':  'Assign available vehicles and drivers to each approved order. Avoid scheduling conflicts with automatic availability validation.',

            // Segments
            'segments.title':    'One platform. Two solutions.',
            'segments.subtitle': 'FullTank is designed from the ground up for both sides of the process.',
            'segments.req.badge': 'Requesting Companies',
            'segments.req.role':  '"The Critical Operator"',
            'segments.req.quote': '"I need to know exactly where my order is without having to call all day."',
            'segments.req.desc':  'Construction, mining, agribusiness, and logistics companies that require constant fuel for their operations and cannot afford interruptions.',
            'segments.req.li1':   'Place orders in under 3 minutes',
            'segments.req.li2':   'Real-time order status',
            'segments.req.li3':   'Full consumption and expense history',
            'segments.req.li4':   'Approval and delivery notifications',
            'segments.req.li5':   'Download consumption reports as PDF',
            'segments.req.cta':   'I am a requester \u2192',
            'segments.sup.badge': 'Fuel Suppliers',
            'segments.sup.role':  '"The Overwhelmed Manager"',
            'segments.sup.quote': '"If I could see all orders organized automatically, I would save hours of work every day."',
            'segments.sup.desc':  'Fuel distributors serving multiple corporate clients who want to scale operations without adding staff or introducing more errors.',
            'segments.sup.li1':   'Centralize all incoming orders',
            'segments.sup.li2':   'Validate payments and approve with one click',
            'segments.sup.li3':   'Assign vehicles and drivers without conflicts',
            'segments.sup.li4':   'Sales reports by client and period',
            'segments.sup.li5':   'Reduce logistics errors by 60%',
            'segments.sup.cta':   'I am a supplier \u2192',

            // Metrics
            'metrics.title': 'Results that speak for themselves',
            'metrics.m1':    'Reduction in management time',
            'metrics.m2':    'Orders without subsequent corrections',
            'metrics.m3':    'Time to register an order',
            'metrics.m4':    'Fewer logistics errors reported',

            // About
            'about.label':        'Our Startup',
            'about.title':        'Who are we?',
            'about.badge':        '\u00ab PrimeFuel Startup \u00b7 Lima, Peru',
            'about.description':  'Prime Fuel is an innovative startup dedicated to managing the buying and selling of fuel between requesting companies and suppliers. We are the PrimeFuel team, and our proposal focuses on digitalizing a sector traditionally dependent on manual processes, providing a technological solution that ensures efficiency, transparency, and more rigorous operational control.',
            'about.mission.title':'Mission',
            'about.mission.text': 'To develop advanced technological solutions that transform the fuel market by eliminating informal channels and reducing the margin of error through an intuitive and accessible web platform.',
            'about.vision.title': 'Vision',
            'about.vision.text':  'To position ourselves as leaders in the digitalization of the energy sector, offering companies a tool that enables more efficient, secure, and sustainable management, contributing to technological progress and improving sector competitiveness.',
            'about.stat1':        'Founding members of PrimeFuel',
            'about.stat2':        'Companies on the waiting list',
            'about.stat3':        'Platform for the complete fuel flow',
            'about.upc':          '\u00bb PrimeFuel Team',

            // Team
            'team.video':    'Video about the team',
            'team.label':    'The Team',
            'team.title':    'Meet the people behind FullTank',
            'team.subtitle': 'We are 5 Software Engineers, part of the PrimeFuel team, committed to digitalizing the energy sector.',
            'team.career':   'Software Engineering',
            'team.m1.desc':  'Professional passionate about cybersecurity and AI. Their strength is leading teams effectively. Persevering and dedicated, always ready to deliver successful projects.',
            'team.m2.desc':  'Collaborative and adaptable. Enjoys contributing ideas and has a solid foundation in C++ and Python, always seeking efficient and simple solutions.',
            'team.m3.desc':  'Curious professional with experience in project management and agile methodologies. Focused on web development and data analysis.',
            'team.m4.desc':  'Focused on developing innovative technological solutions. Knowledge in Python and C++, committed to software quality.',
            'team.m5.desc':  'Software Engineer, part of the PrimeFuel team, with skills in development and system design. Committed to continuous innovation.',

            // Testimonials
            'testimonials.label':  'Testimonials',
            'testimonials.title':  'What those who already use FullTank say',
            'testimonials.t1.text': '"We used to lose hours coordinating orders via WhatsApp and Excel. With FullTank, the entire team knows the status of each order in real time. It was a radical change in our operation."',
            'testimonials.t1.name': 'Carlos R.',
            'testimonials.t1.role': 'Logistics Manager \u00b7 MineraCorp Peru',
            'testimonials.t2.text': '"We handle more than 40,000 gallons monthly. FullTank lets us validate orders and coordinate dispatches without overwhelming the team. What used to take hours now takes minutes."',
            'testimonials.t2.name': 'Andrea L.',
            'testimonials.t2.role': 'Sales Manager \u00b7 DistribFuel SAC',
            'testimonials.t3.text': '"Real-time traceability changed how we make decisions. We no longer depend on calls to know if fuel arrives on time. That is worth its weight in gold on construction sites."',
            'testimonials.t3.name': 'Denis R.',
            'testimonials.t3.role': 'Operations Manager \u00b7 ConstructPro',

            // Pricing
            'pricing.label':       'Pricing',
            'pricing.title':       'Plans that grow with you',
            'pricing.subtitle':    'Start now. Scale when your operation demands it.',
            'pricing.monthly':     'Monthly',
            'pricing.yearly':      'Yearly \u2014 save 20%',
            'pricing.note':        '\u00a7 All plans include SSL, daily backups, and Spanish support.',
            'pricing.starter.desc':   'To get started',
            'pricing.starter.period': '/ month',
            'pricing.starter.li1':    'Up to 20 orders/month',
            'pricing.starter.li2':    '1 admin user',
            'pricing.starter.li3':    'Basic order dashboard',
            'pricing.starter.li4':    'Email notifications',
            'pricing.starter.li5':    'Last 3 months history',
            'pricing.starter.li6':    'Chat support (48h)',
            'pricing.starter.cta':    'Start now',
            'pricing.pro.badge':   '\u2605 Most Popular',
            'pricing.pro.desc':    'For active operations',
            'pricing.pro.period':  '/ month per company',
            'pricing.pro.li1':     'Unlimited orders',
            'pricing.pro.li2':     'Up to 5 users per company',
            'pricing.pro.li3':     'Dashboard with full analytics',
            'pricing.pro.li4':     'Real-time notifications',
            'pricing.pro.li5':     'Vehicle and driver assignment',
            'pricing.pro.li6':     'Reports and PDF export',
            'pricing.pro.li7':     'Full history',
            'pricing.pro.li8':     'Priority support (4h)',
            'pricing.pro.cta':     'Get started with Pro',
            'pricing.ent.desc':    'For large operations',
            'pricing.ent.price':   'Custom quote',
            'pricing.ent.period':  'Custom pricing',
            'pricing.ent.li1':     'Everything in Pro, plus:',
            'pricing.ent.li2':     'Unlimited users',
            'pricing.ent.li3':     'ERP integration (SAP, Oracle)',
            'pricing.ent.li4':     'Documented REST API',
            'pricing.ent.li5':     'Dedicated account manager',
            'pricing.ent.li6':     'SLA 99.9% uptime guaranteed',
            'pricing.ent.li7':     'Custom onboarding',
            'pricing.ent.li8':     'Team training',
            'pricing.ent.cta':     'Talk to sales',

            // FAQ
            'faq.title': 'Frequently asked questions',
            'faq.q1': 'Do I need to install anything to use FullTank?',
            'faq.a1': 'No. It is 100% web-based. It works from any modern browser on a computer, tablet, or phone. No installations, no manual updates.',
            'faq.q2': 'How are payments handled within the platform?',
            'faq.a2': 'The requester uploads the bank deposit receipt directly on the platform. The supplier validates it and approves the order. FullTank does not process payments directly \u2014 it acts as a document manager for the process.',
            'faq.q3': 'Can I have multiple users in my company?',
            'faq.a3': 'Yes. The Starter plan includes 1 user, the Pro plan up to 5, and the Enterprise plan has unlimited users with differentiated roles and permissions.',
            'faq.q4': 'Is my data protected?',
            'faq.a4': 'Yes. We use JWT authentication, SSL encryption in transit, and automatic daily backups. We comply with security standards for sensitive business data.',
            'faq.q5': 'Does it integrate with my current ERP system?',
            'faq.a5': 'The Enterprise plan includes integration via documented REST API with SAP, Oracle, and other ERP systems. Our engineering team will guide you through the process.',
            'faq.q6': 'What languages is FullTank available in?',
            'faq.a6': 'Currently in Spanish and English. You can change the language from any screen using the selector in the navbar.',

            // CTA
            'cta.title':    'Ready to say goodbye<br>to fuel management chaos?',
            'cta.subtitle': 'Join more than 200 companies already managing their fuel orders with FullTank. No contracts. No complications.',
            'cta.btn':      'Start now \u2192',
            'cta.micro1':   'No credit card',
            'cta.micro2':   'Cancel anytime',
            'cta.micro3':   'Support in English',

            // Footer
            'footer.desc':      'B2B platform for the digital management of industrial fuel trading and distribution in Peru.',
            'footer.col1.title':'Product',
            'footer.col1.li1':  'How it works',
            'footer.col1.li2':  'Benefits',
            'footer.col1.li3':  'Plans and pricing',
            'footer.col1.li4':  'Request a demo',
            'footer.col2.title':'Company',
            'footer.col2.li1':  'About PrimeFuel',
            'footer.col2.li2':  'Team',
            'footer.col2.li3':  'Blog',
            'footer.col2.li4':  'Careers',
            'footer.col2.li5':  'Contact',
            'footer.col3.title':'Legal and support',
            'footer.col3.li1':  'Help center',
            'footer.col3.li2':  'Privacy policy',
            'footer.col3.li3':  'Terms of service',
            'footer.col3.li4':  'System status',
            'footer.col3.li5':  'Security',
            'footer.copy':      '\u00a9 2026 PrimeFuel. All rights reserved.',
            'footer.made':      'Made in Lima, Peru',

            // Contact form
            'form.label':    'Contact',
            'form.title':    'Get in touch',
            'form.subtitle': 'Have questions or want more information? Fill out the form and our team will get back to you.',
            'form.name':     'Name',
            'form.name.placeholder':    'Your full name',
            'form.email':    'Email',
            'form.email.placeholder':   'you@company.com',
            'form.subject':  'Subject',
            'form.subject.placeholder': 'Subject of your message',
            'form.message':  'Message',
            'form.message.placeholder': 'Tell us how we can help',
            'form.submit':   'Send message',
            'form.note':     'Thanks! We have received your message.',
        }
    };

    // Keys that need innerHTML (contain HTML tags or entities that must render)
    const HTML_KEYS = new Set([
        'hero.badge', 'hero.h1',
        'features.title',
        'cta.title',
    ]);

    let currentLang = localStorage.getItem('ft-lang') || 'es';

    const applyLanguage = (lang) => {
        currentLang = lang;

        const dict = I18N[lang];
        if (!dict) return;

        // Update language button labels
        document.querySelectorAll('.lang-select').forEach(btn => {
            btn.innerHTML = `&#127760; ${lang.toUpperCase()} &#9660;`;
        });

        // Apply data-i18n (textContent) translations
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (dict[key] !== undefined) {
                el.textContent = dict[key];
            }
        });

        // Apply data-i18n-html (innerHTML) translations
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.dataset.i18nHtml;
            if (dict[key] !== undefined) {
                el.innerHTML = dict[key];
            }
        });

        // Apply data-i18n-placeholder (placeholder attribute) translations
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if (dict[key] !== undefined) {
                el.setAttribute('placeholder', dict[key]);
            }
        });

        // Update html lang attribute
        document.documentElement.lang = lang;

        localStorage.setItem('ft-lang', lang);
    };

    // Attach click to all lang buttons
    document.querySelectorAll('.lang-select').forEach(btn => {
        btn.addEventListener('click', () => {
            applyLanguage(currentLang === 'es' ? 'en' : 'es');
        });
    });

    // Init: apply stored language preference on load
    if (currentLang !== 'es') {
        applyLanguage(currentLang);
    }

    // CONTACT FORM (static — no backend, just confirms receipt client-side)
    const contactForm = document.getElementById('contactForm');
    const formNote = document.getElementById('form-note');

    contactForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        contactForm.reset();
        if (formNote) {
            formNote.hidden = false;
        }
    });

});