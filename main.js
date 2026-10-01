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

    // 10. SEGMENT TABS
    const segmentTabs = document.querySelectorAll('[data-segment-tab]');
    const segmentPanels = document.querySelectorAll('[data-segment-panel]');

    segmentTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.segmentTab;

            segmentTabs.forEach(item => {
                const isActive = item === tab;
                item.classList.toggle('active', isActive);
                item.setAttribute('aria-selected', String(isActive));
            });

            segmentPanels.forEach(panel => {
                const isActive = panel.dataset.segmentPanel === target;
                panel.classList.toggle('active', isActive);
                panel.hidden = !isActive;
            });
        });
    });

    // 11. LANGUAGE SYSTEM
    // All translations use data-i18n (textContent) or data-i18n-html (innerHTML)
    // Symbols use HTML entities in the dictionary (rendered via innerHTML for those keys)

    const I18N = {
        es: {
            // Navbar
            'nav.how':          'C\u00f3mo funciona',
            'nav.benefits':     'Beneficios',
            'nav.sensors':      'Sensores IoT',
            'nav.pricing':      'Precios',
            'nav.testimonials': 'Testimonios',
            'nav.about':        'Sobre nosotros',
            'nav.contact':      'Contacto',
            'nav.cta':          'Agendar demo',

            // Hero
            'hero.badge': '&#9201; Para Distribuidores Log\u00edsticos de Combustible',
            'hero.h1':    'Convierte cada <span class="hero-strike">alerta tard\u00eda</span><br>en un despacho<br><span class="hero-underline">rentable y trazable.</span>',
            'hero.subtitle': 'FullTank conecta sensores de tanque, solicitudes autom\u00e1ticas, asignaci\u00f3n de cisternas y seguimiento de entrega en una sola plataforma para distribuidores que atienden clientes industriales.',
            'hero.check1':   'Pedidos generados por umbral IoT',
            'hero.check2':   'Cisterna compatible antes del despacho',
            'hero.check3':   'Estado de entrega visible hasta el cierre',
            'hero.cta':      'Agenda una demo operativa',
            'hero.play':     'Ver flujo IoT',

            // Mockup
            'mockup.greeting': 'Panel de despacho \u00b7 Marco',
            'mockup.kpi1':     'Alertas IoT',
            'mockup.kpi2':     'Por decidir',
            'mockup.kpi3':     'En ruta',
            'mockup.kpi4':     'Cerrados',
            'mockup.col1':     'Tanque',
            'mockup.col2':     'Volumen',
            'mockup.col3':     'Estado',
            'mockup.status1':  'Asignado',
            'mockup.status2':  'En ruta',
            'mockup.status3':  'Revisar',
            'mockup.chart':    'Demanda detectada por sensores',
            'mockup.month1':   'Nov',
            'mockup.month2':   'Dic',
            'mockup.month3':   'Ene',
            'mockup.month4':   'Feb',
            'mockup.month5':   'Mar',
            'mockup.month6':   'Abr',

            // Social proof
            'social.label': 'Dise\u00f1ado para distribuidores que abastecen operaciones cr\u00edticas',

            // Problem
            'problem.label':    'El Problema',
            'problem.title':    'El cuello de botella no est\u00e1 en vender combustible. Est\u00e1 en despacharlo sin fricci\u00f3n.',
            'problem.subtitle': 'El reporte confirma una operaci\u00f3n fragmentada: solicitudes por canales informales, asignaci\u00f3n manual y poca trazabilidad mientras la cisterna est\u00e1 en ruta.',
            'problem.p1.channel': '100%',
            'problem.p1.title': 'Solicitudes por WhatsApp, llamadas o correo',
            'problem.p1.text':  'El pedido nace fuera del sistema y llega incompleto: producto, volumen, ubicaci\u00f3n y fecha se vuelven transcripci\u00f3n manual.',
            'problem.p2.channel': 'Manual',
            'problem.p2.title': 'Conductor y cisterna se eligen por memoria',
            'problem.p2.text':  'La disponibilidad y capacidad no se validan de forma sistem\u00e1tica, elevando el riesgo de reasignaciones y entregas fallidas.',
            'problem.p3.channel': '0 pedidos sin estado',
            'problem.p3.title': 'La meta: trazabilidad hasta la recepci\u00f3n',
            'problem.p3.text':  'El distribuidor necesita confirmar avance, descarga y cierre sin depender de una llamada del conductor.',
            'problem.p4.meta':  'Riesgo operativo',
            'problem.p4.title': 'Una cisterna mal asignada rompe la promesa de entrega.',
            'problem.p4.text':  'FullTank verifica capacidad, disponibilidad y estado antes de enviar la unidad, para que cada alerta IoT termine en una entrega demostrable.',
            'problem.cta':      'Ver c\u00f3mo FullTank convierte alertas en despachos \u2192',

            // How it works
            'how.label':        'Proceso',
            'how.title':        'Del nivel cr\u00edtico a la entrega confirmada',
            'how.subtitle':     'El flujo principal empieza en el sensor del tanque, no en un formulario manual.',
            'how.step1.title':  'Sensor detecta bajo nivel',
            'how.step1.text':   'El tanque asociado cruza su umbral y env\u00eda una lectura estructurada a la plataforma.',
            'how.step2.title':  'Pedido autom\u00e1tico',
            'how.step2.text':   'FullTank crea la solicitud con volumen, ubicaci\u00f3n, producto y fecha sin reingreso manual.',
            'how.step3.title':  'Asignaci\u00f3n compatible',
            'how.step3.text':   'El distribuidor acepta, rechaza o asigna conductor y cisterna con capacidad suficiente.',
            'how.step4.title':  'Entrega trazable',
            'how.step4.text':   'Ruta, eventos, v\u00e1lvula, recepci\u00f3n y cierre quedan registrados para auditor\u00eda y reportes.',

            // Features
            'features.label':    'Beneficios',
            'features.title':    'Menos llamadas.<br>M\u00e1s entregas cerradas.',
            'features.subtitle': 'Capacidades pensadas para el jefe de operaciones, el planificador de flota y el equipo de despacho.',
            'features.f1.title': 'Demanda anticipada',
            'features.f1.text':  'Detecta bajo nivel antes de que el cliente llame. El pedido nace desde el tanque asociado.',
            'features.f2.title': 'Decisi\u00f3n centralizada',
            'features.f2.text':  'Acepta, rechaza o prioriza solicitudes con datos completos: producto, volumen, ubicaci\u00f3n y fecha.',
            'features.f3.title': 'Asignaci\u00f3n por capacidad',
            'features.f3.text':  'Recomienda conductor y cisterna seg\u00fan volumen, disponibilidad y compatibilidad operacional.',
            'features.f4.title': 'Seguimiento de entrega',
            'features.f4.text':  'Mant\u00e9n estado actualizado desde despacho hasta recepci\u00f3n, sin perseguir confirmaciones por tel\u00e9fono.',
            'features.f5.title': 'Reportes operativos',
            'features.f5.text':  'Convierte pedidos, rutas y entregas en indicadores de atenci\u00f3n, utilizaci\u00f3n de flota y cumplimiento.',
            'features.f6.title': 'Servicio diferenciador',
            'features.f6.text':  'Ofrece a tus compradores reposici\u00f3n oportuna y visibilidad sin convertirlos en otro segmento comercial.',

            // IoT Sensors
            'sensors.label':    'Soluci\u00f3n IoT',
            'sensors.title':    'Sensores IoT que activan operaciones, no solo alertas',
            'sensors.subtitle': 'La lectura del tanque se transforma en una solicitud accionable para el distribuidor: aceptar, asignar y entregar.',
            'sensors.flow1.title': 'El sensor mide el nivel',
            'sensors.flow1.text':  'El sensor reporta el nivel de combustible del tanque a la plataforma con una frecuencia definida. El dato queda disponible en tiempo real.',
            'sensors.flow2.title': 'Umbral dispara solicitud',
            'sensors.flow2.text':  'Cuando el nivel cae por debajo del umbral, FullTank genera la necesidad con volumen y ubicaci\u00f3n del tanque asociado.',
            'sensors.flow3.title': 'Operaci\u00f3n para despacho',
            'sensors.flow3.text':  'El distribuidor decide y asigna recursos desde el mismo tablero, sin reconstruir el contexto por canales externos.',
            'sensors.mp.tag':  'Sensor de presi\u00f3n hidrost\u00e1tica',
            'sensors.mp.name': 'MPX5050DP (NXP/Freescale)',
            'sensors.mp.desc': 'Mide la presi\u00f3n hidrost\u00e1tica y calcula el nivel del l\u00edquido de forma continua, obteniendo el porcentaje real del tanque.',
            'sensors.mp.pro1': 'Lectura continua del porcentaje real del tanque',
            'sensors.mp.pro2': 'Rango de presi\u00f3n y temperatura apto para uso en exteriores',
            'sensors.mp.con1': 'Componente crudo: requiere circuito propio y calibraci\u00f3n por tanque',
            'sensors.mp.con2': 'Contacto directo con el combustible, con riesgo de degradaci\u00f3n de sellos',
            'sensors.mp.con3': 'Sin conectividad integrada: necesita microcontrolador aparte',
            'sensors.cq.tag':  'Sensor capacitivo sin contacto',
            'sensors.cq.name': 'CQRobot Sensor de Nivel No-Contacto',
            'sensors.cq.desc': 'Detecta el l\u00edquido sin tocar el tanque: instalaci\u00f3n no invasiva, sin corrosi\u00f3n ni fugas.',
            'sensors.cq.pro1': 'Sin contacto con el combustible: sin corrosi\u00f3n ni fugas',
            'sensors.cq.pro2': 'M\u00f3dulo terminado, econ\u00f3mico y f\u00e1cil de integrar con Arduino o Raspberry Pi',
            'sensors.cq.con1': 'Solo detecta presencia o ausencia de l\u00edquido, no un porcentaje continuo',
            'sensors.cq.con2': 'Funciona solo en paredes no met\u00e1licas, como pl\u00e1stico o vidrio',
            'sensors.cq.con3': 'Requiere confirmar el material del tanque antes de instalarlo',
            'sensors.data.title': 'Datos que se convierten en planificaci\u00f3n',
            'sensors.data.text':  'El hist\u00f3rico de lecturas, pedidos, asignaciones y entregas permite anticipar demanda, medir cumplimiento y optimizar la utilizaci\u00f3n de la flota.',
            'sensors.stack.title':  'Arquitectura propuesta',
            'sensors.stack.web':    'Web: Angular & Spring Boot',
            'sensors.stack.mobile': 'Mobile: Flutter (Dart)',
            'sensors.stack.iot':    'IoT: C++ & Python',

            // Segments
            'segments.title':    'Un segmento comercial. Tres actores coordinados.',
            'segments.subtitle': 'El distribuidor contrata FullTank; compradores y conductores participan dentro del flujo operativo.',
            'segments.tab.distributor': 'Distribuidor',
            'segments.tab.buyer': 'Comprador asociado',
            'segments.tab.fleet': 'Conductor y flota',
            'segments.distributor.badge': 'Cliente principal',
            'segments.distributor.title': 'Distribuidores Log\u00edsticos de Combustible',
            'segments.distributor.text': 'Atienden compradores industriales con flota de cisternas y necesitan decidir r\u00e1pido, asignar bien y demostrar cada entrega.',
            'segments.distributor.k1': '40%',
            'segments.distributor.v1': 'menos tiempo entre solicitud y decisi\u00f3n.',
            'segments.distributor.k2': '100%',
            'segments.distributor.v2': 'validaci\u00f3n de capacidad recomendada.',
            'segments.distributor.k3': '1 tablero',
            'segments.distributor.v3': 'para solicitudes, flota y entregas.',
            'segments.buyer.badge': 'Actor operativo',
            'segments.buyer.title': 'Compradores asociados',
            'segments.buyer.text': 'Sus tanques activan el flujo. Reciben reposici\u00f3n oportuna y visibilidad sin iniciar la coordinaci\u00f3n manual.',
            'segments.buyer.k1': 'IoT',
            'segments.buyer.v1': 'alerta antes del desabastecimiento.',
            'segments.buyer.k2': 'Sin llamadas',
            'segments.buyer.v2': 'para saber si el pedido avanza.',
            'segments.buyer.k3': 'Continuidad',
            'segments.buyer.v3': 'para operaciones cr\u00edticas.',
            'segments.fleet.badge': 'Ejecuci\u00f3n en campo',
            'segments.fleet.title': 'Conductor, cisterna y entrega',
            'segments.fleet.text': 'La operaci\u00f3n queda conectada a disponibilidad, capacidad, ruta, evidencia de recepci\u00f3n y cierre de entrega.',
            'segments.fleet.k1': '2 min',
            'segments.fleet.v1': 'para asignaci\u00f3n v\u00e1lida como objetivo.',
            'segments.fleet.k2': 'Geocerca',
            'segments.fleet.v2': 'y eventos de seguridad trazables.',
            'segments.fleet.k3': 'Acta',
            'segments.fleet.v3': 'de recepci\u00f3n para cerrar el ciclo.',
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
            'metrics.title': 'Objetivos de impacto del nuevo flujo',
            'metrics.m1':    'Menos tiempo entre solicitud y decisi\u00f3n',
            'metrics.m2':    'Pedidos autom\u00e1ticos sin correcci\u00f3n posterior',
            'metrics.m3':    'Asignaci\u00f3n v\u00e1lida de conductor y cisterna',
            'metrics.m4':    'Capacidad insuficiente en recomendaciones',

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
            'pricing.subtitle':    'Empieza con despacho centralizado. Escala hacia IoT, telemetr\u00eda y anal\u00edtica operativa.',
            'pricing.monthly':     'Mensual',
            'pricing.yearly':      'Anual \u2014 ahorra 20%',
            'pricing.note':        '\u00a7 Todos los planes incluyen SSL, backups diarios y soporte en espa\u00f1ol.',
            'pricing.starter.desc':   'Para validar el flujo',
            'pricing.starter.period': '/ mes',
            'pricing.starter.li1':    'Hasta 20 solicitudes/mes',
            'pricing.starter.li2':    '1 tablero de distribuidor',
            'pricing.starter.li3':    'Registro manual de solicitudes',
            'pricing.starter.li4':    'Estados y notificaciones b\u00e1sicas',
            'pricing.starter.li5':    'Historial de 3 meses',
            'pricing.starter.li6':    'Soporte por chat (48h)',
            'pricing.starter.cta':    'Validar flujo',
            'pricing.pro.badge':   '\u2605 M\u00e1s Popular',
            'pricing.pro.desc':    'Para distribuidores en operaci\u00f3n',
            'pricing.pro.period':  '/ mes por empresa',
            'pricing.pro.li1':     'Solicitudes ilimitadas',
            'pricing.pro.li2':     'Hasta 5 usuarios operativos',
            'pricing.pro.li3':     'Tablero IoT y solicitudes autom\u00e1ticas',
            'pricing.pro.li4':     'Notificaciones en tiempo real',
            'pricing.pro.li5':     'Asignaci\u00f3n de cisterna y conductor',
            'pricing.pro.li6':     'Reportes operativos y PDF',
            'pricing.pro.li7':     'Historial completo de entregas',
            'pricing.pro.li8':     'Soporte prioritario (4h)',
            'pricing.pro.cta':     'Agendar demo Pro',
            'pricing.ent.desc':    'Para flotas y clientes cr\u00edticos',
            'pricing.ent.price':   'A consultar',
            'pricing.ent.period':  'Precio personalizado',
            'pricing.ent.li1':     'Todo lo del plan Pro, m\u00e1s:',
            'pricing.ent.li2':     'Usuarios ilimitados',
            'pricing.ent.li3':     'Integraci\u00f3n ERP y API REST',
            'pricing.ent.li4':     'Telemetr\u00eda, geocercas y seguridad',
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
            'cta.title':    'Convierte tus alertas de tanque<br>en entregas cerradas.',
            'cta.subtitle': 'Agenda una demo para ver c\u00f3mo FullTank ordena solicitudes, flota y trazabilidad desde el primer d\u00eda.',
            'cta.btn':      'Agenda una demo operativa \u2192',
            'cta.micro1':   'Diagn\u00f3stico del flujo actual',
            'cta.micro2':   'Demo con caso de despacho',
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
            'nav.sensors':      'IoT Sensors',
            'nav.pricing':      'Pricing',
            'nav.testimonials': 'Testimonials',
            'nav.about':        'About us',
            'nav.contact':      'Contact',
            'nav.cta':          'Book demo',

            // Hero
            'hero.badge': '&#9201; For Fuel Logistics Distributors',
            'hero.h1':    'Turn every <span class="hero-strike">late alert</span><br>into a profitable,<br><span class="hero-underline">traceable dispatch.</span>',
            'hero.subtitle': 'FullTank connects tank sensors, automatic requests, tanker assignment, and delivery tracking in one platform for distributors serving industrial clients.',
            'hero.check1':   'Orders generated by IoT threshold',
            'hero.check2':   'Compatible tanker before dispatch',
            'hero.check3':   'Delivery status visible through closeout',
            'hero.cta':      'Book an operations demo',
            'hero.play':     'See IoT flow',

            // Mockup
            'mockup.greeting': 'Dispatch board · Marco',
            'mockup.kpi1':     'IoT alerts',
            'mockup.kpi2':     'To decide',
            'mockup.kpi3':     'On route',
            'mockup.kpi4':     'Closed',
            'mockup.col1':     'Tank',
            'mockup.col2':     'Volume',
            'mockup.col3':     'Status',
            'mockup.status1':  'Assigned',
            'mockup.status2':  'On route',
            'mockup.status3':  'Review',
            'mockup.chart':    'Demand detected by sensors',
            'mockup.month1':   'Nov',
            'mockup.month2':   'Dec',
            'mockup.month3':   'Jan',
            'mockup.month4':   'Feb',
            'mockup.month5':   'Mar',
            'mockup.month6':   'Apr',

            // Social proof
            'social.label': 'Built for distributors supplying critical operations',

            // Problem
            'problem.label':    'The Problem',
            'problem.title':    'The bottleneck is not selling fuel. It is dispatching it without friction.',
            'problem.subtitle': 'The report confirms a fragmented operation: informal request channels, manual assignment, and limited traceability while the tanker is on route.',
            'problem.p1.channel': '100%',
            'problem.p1.title': 'Requests through WhatsApp, calls, or email',
            'problem.p1.text':  'The order starts outside the system and arrives incomplete: product, volume, location, and date become manual transcription.',
            'problem.p2.channel': 'Manual',
            'problem.p2.title': 'Driver and tanker selected from memory',
            'problem.p2.text':  'Availability and capacity are not verified systematically, increasing reassignment and failed-delivery risk.',
            'problem.p3.channel': '0 orders without status',
            'problem.p3.title': 'The goal: traceability through receipt',
            'problem.p3.text':  'The distributor needs progress, unloading, and closeout without depending on a driver phone call.',
            'problem.p4.meta':  'Operational risk',
            'problem.p4.title': 'A poorly assigned tanker breaks the delivery promise.',
            'problem.p4.text':  'FullTank checks capacity, availability, and status before the unit leaves, so every IoT alert ends in a provable delivery.',
            'problem.cta':      'See how FullTank turns alerts into dispatches \u2192',

            // How it works
            'how.label':        'Process',
            'how.title':        'From critical level to confirmed delivery',
            'how.subtitle':     'The main flow starts at the tank sensor, not a manual form.',
            'how.step1.title':  'Sensor detects low level',
            'how.step1.text':   'The associated tank crosses its threshold and sends a structured reading to the platform.',
            'how.step2.title':  'Automatic order',
            'how.step2.text':   'FullTank creates the request with volume, location, product, and date without manual re-entry.',
            'how.step3.title':  'Compatible assignment',
            'how.step3.text':   'The distributor accepts, rejects, or assigns a driver and tanker with enough capacity.',
            'how.step4.title':  'Traceable delivery',
            'how.step4.text':   'Route, events, valve, receipt, and closeout stay recorded for audits and reports.',

            // Features
            'features.label':    'Benefits',
            'features.title':    'Fewer calls.<br>More closed deliveries.',
            'features.subtitle': 'Capabilities built for operations leads, fleet planners, and dispatch teams.',
            'features.f1.title': 'Anticipated demand',
            'features.f1.text':  'Detect low level before the customer calls. The order starts from the associated tank.',
            'features.f2.title': 'Centralized decision',
            'features.f2.text':  'Accept, reject, or prioritize requests with complete product, volume, location, and date data.',
            'features.f3.title': 'Capacity-based assignment',
            'features.f3.text':  'Recommend driver and tanker based on volume, availability, and operational compatibility.',
            'features.f4.title': 'Delivery tracking',
            'features.f4.text':  'Keep status updated from dispatch to receipt without chasing confirmations by phone.',
            'features.f5.title': 'Operational reports',
            'features.f5.text':  'Turn orders, routes, and deliveries into service-time, fleet-utilization, and compliance indicators.',
            'features.f6.title': 'Differentiated service',
            'features.f6.text':  'Give buyers timely replenishment and visibility without turning them into a separate commercial segment.',

            // IoT Sensors
            'sensors.label':    'IoT Solution',
            'sensors.title':    'IoT sensors that activate operations, not just alerts',
            'sensors.subtitle': 'The tank reading becomes an actionable request for the distributor: accept, assign, and deliver.',
            'sensors.flow1.title': 'The sensor measures the level',
            'sensors.flow1.text':  'The sensor reports the tank fuel level to the platform at a defined frequency. The data is available in real time.',
            'sensors.flow2.title': 'Threshold triggers request',
            'sensors.flow2.text':  'When the level drops below the threshold, FullTank generates the need with volume and associated tank location.',
            'sensors.flow3.title': 'Dispatch operation',
            'sensors.flow3.text':  'The distributor decides and assigns resources from the same board, without rebuilding context through external channels.',
            'sensors.mp.tag':  'Hydrostatic pressure sensor',
            'sensors.mp.name': 'MPX5050DP (NXP/Freescale)',
            'sensors.mp.desc': 'Measures hydrostatic pressure and calculates the liquid level continuously, obtaining the tank\u2019s real percentage.',
            'sensors.mp.pro1': 'Continuous reading of the tank\u2019s real percentage',
            'sensors.mp.pro2': 'Pressure and temperature range suitable for outdoor use',
            'sensors.mp.con1': 'Raw component: requires its own circuit and per-tank calibration',
            'sensors.mp.con2': 'Direct contact with the fuel, with a risk of seal degradation',
            'sensors.mp.con3': 'No built-in connectivity: needs a separate microcontroller',
            'sensors.cq.tag':  'Non-contact capacitive sensor',
            'sensors.cq.name': 'CQRobot Non-Contact Level Sensor',
            'sensors.cq.desc': 'Detects liquid without touching the tank: non-invasive installation, no corrosion or leaks.',
            'sensors.cq.pro1': 'No contact with the fuel: no corrosion or leaks',
            'sensors.cq.pro2': 'Finished module, economical, and easy to integrate with Arduino or Raspberry Pi',
            'sensors.cq.con1': 'Only detects the presence or absence of liquid, not a continuous percentage',
            'sensors.cq.con2': 'Works only on non-metallic walls, such as plastic or glass',
            'sensors.cq.con3': 'Requires confirming the tank material before installation',
            'sensors.data.title': 'Data that becomes planning',
            'sensors.data.text':  'The history of readings, orders, assignments, and deliveries helps anticipate demand, measure compliance, and optimize fleet utilization.',
            'sensors.stack.title':  'Proposed architecture',
            'sensors.stack.web':    'Web: Angular & Spring Boot',
            'sensors.stack.mobile': 'Mobile: Flutter (Dart)',
            'sensors.stack.iot':    'IoT: C++ & Python',

            // Segments
            'segments.title':    'One commercial segment. Three coordinated actors.',
            'segments.subtitle': 'The distributor hires FullTank; buyers and drivers participate inside the operating flow.',
            'segments.tab.distributor': 'Distributor',
            'segments.tab.buyer': 'Associated buyer',
            'segments.tab.fleet': 'Driver and fleet',
            'segments.distributor.badge': 'Main customer',
            'segments.distributor.title': 'Fuel Logistics Distributors',
            'segments.distributor.text': 'They serve industrial buyers with tanker fleets and need to decide quickly, assign correctly, and prove every delivery.',
            'segments.distributor.k1': '40%',
            'segments.distributor.v1': 'less time between request and decision.',
            'segments.distributor.k2': '100%',
            'segments.distributor.v2': 'recommended capacity validation.',
            'segments.distributor.k3': '1 board',
            'segments.distributor.v3': 'for requests, fleet, and deliveries.',
            'segments.buyer.badge': 'Operating actor',
            'segments.buyer.title': 'Associated buyers',
            'segments.buyer.text': 'Their tanks activate the flow. They receive timely replenishment and visibility without starting manual coordination.',
            'segments.buyer.k1': 'IoT',
            'segments.buyer.v1': 'alert before stockout.',
            'segments.buyer.k2': 'No calls',
            'segments.buyer.v2': 'to know whether the order is moving.',
            'segments.buyer.k3': 'Continuity',
            'segments.buyer.v3': 'for critical operations.',
            'segments.fleet.badge': 'Field execution',
            'segments.fleet.title': 'Driver, tanker, and delivery',
            'segments.fleet.text': 'The operation connects availability, capacity, route, receipt evidence, and delivery closeout.',
            'segments.fleet.k1': '2 min',
            'segments.fleet.v1': 'target for valid assignment.',
            'segments.fleet.k2': 'Geofence',
            'segments.fleet.v2': 'and traceable security events.',
            'segments.fleet.k3': 'Receipt',
            'segments.fleet.v3': 'to close the cycle.',
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
            'metrics.title': 'Impact targets for the new flow',
            'metrics.m1':    'Less time between request and decision',
            'metrics.m2':    'Automatic orders without later correction',
            'metrics.m3':    'Valid driver and tanker assignment',
            'metrics.m4':    'Insufficient capacity in recommendations',

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
            'pricing.subtitle':    'Start with centralized dispatch. Scale toward IoT, telemetry, and operational analytics.',
            'pricing.monthly':     'Monthly',
            'pricing.yearly':      'Yearly \u2014 save 20%',
            'pricing.note':        '\u00a7 All plans include SSL, daily backups, and Spanish support.',
            'pricing.starter.desc':   'To validate the flow',
            'pricing.starter.period': '/ month',
            'pricing.starter.li1':    'Up to 20 requests/month',
            'pricing.starter.li2':    '1 distributor board',
            'pricing.starter.li3':    'Manual request registration',
            'pricing.starter.li4':    'Basic statuses and notifications',
            'pricing.starter.li5':    '3-month history',
            'pricing.starter.li6':    'Chat support (48h)',
            'pricing.starter.cta':    'Validate flow',
            'pricing.pro.badge':   '\u2605 Most Popular',
            'pricing.pro.desc':    'For distributors in operation',
            'pricing.pro.period':  '/ month per company',
            'pricing.pro.li1':     'Unlimited requests',
            'pricing.pro.li2':     'Up to 5 operational users',
            'pricing.pro.li3':     'IoT board and automatic requests',
            'pricing.pro.li4':     'Real-time notifications',
            'pricing.pro.li5':     'Tanker and driver assignment',
            'pricing.pro.li6':     'Operational reports and PDF',
            'pricing.pro.li7':     'Full delivery history',
            'pricing.pro.li8':     'Priority support (4h)',
            'pricing.pro.cta':     'Book Pro demo',
            'pricing.ent.desc':    'For fleets and critical clients',
            'pricing.ent.price':   'Custom quote',
            'pricing.ent.period':  'Custom pricing',
            'pricing.ent.li1':     'Everything in Pro, plus:',
            'pricing.ent.li2':     'Unlimited users',
            'pricing.ent.li3':     'ERP integration and REST API',
            'pricing.ent.li4':     'Telemetry, geofences, and security',
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
            'cta.title':    'Turn tank alerts<br>into closed deliveries.',
            'cta.subtitle': 'Book a demo to see how FullTank organizes requests, fleet, and traceability from day one.',
            'cta.btn':      'Book an operations demo \u2192',
            'cta.micro1':   'Current-flow diagnosis',
            'cta.micro2':   'Dispatch-case demo',
            'cta.micro3':   'English support',

            // Footer
            'footer.desc':      'B2B platform for the digital management of industrial fuel trading and distribution in Peru.',
            'footer.col1.title':'Product',
            'footer.col1.li1':  'How it works',
            'footer.col1.li2':  'Benefits',
            'footer.col1.li3':  'Plans and pricing',
            'footer.col1.li4':  'Request a demo',
            'footer.col2.title':'Company',
            'footer.col2.li1':  'About PrimeFuel',
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
