export const EMAIL = 'hello@inackra.work';
export const TELEGRAM = 'https://t.me/Jo1_Se';
export const TELEGRAM_HANDLE = '@Jo1_Se';
export const LINKEDIN = 'https://www.linkedin.com/in/yan-kavaleu-9879761b8/';
export const PORTFOLIO = '/work/';

export const content = {
  ru: {
    proto: 'Прототип структуры', version: 'Версия 0.1 · 17.11.2026', notes: 'Пояснения', skip: 'К содержимому',
    nav: ['Проекты', 'Сотрудничество', 'Обо мне', 'Контакт'],
    hero: {
      label: 'Yan Kavaleu · Multidisciplinary Designer',
      title: 'Превращаю сложную логику в понятные цифровые продукты.',
      text: 'Проектирую AI-продукты, SaaS и дизайн-системы. Соединяю продуктовый подход с опытом в брендинге, 3D и motion.',
      location: '',
      client: 'Обсудить проект', employer: 'Рассмотреть в команду',
      proof: '8 лет в дизайне · опыт в Semrush, AIO Tech, Evapolar и McCann',
      note: 'Первый экран: кто ты, какую пользу приносишь и два пути для посетителя. Оба ведут к общим кейсам, но к разным предложениям сотрудничества.'
    },
    work: {
      label: '01 / Опыт в деле', title: 'От AI-взаимодействий до систем, которыми пользуются команды.',
      intro: 'Четыре проекта, которые показывают продуктовую логику, системное мышление и визуальную работу.',
      details: 'Задача, мой вклад и результат', context: 'Задача', contribution: 'Мой вклад', result: 'Результат / статус',
      more: 'Открыть текущее портфолио',
      note: 'Кейсы — общие доказательства для обеих аудиторий. Сейчас это короткие истории из CV, а не готовые подробные кейсы. Визуальные места обозначены; материалы добавим после согласования структуры.',
      cases: [
        {
          id: 'plenum', name: 'Plenum', category: 'AI product · собственный проект',
          headline: 'Рабочее пространство, связывающее разговор, документы и контекст команды.',
          role: 'Creator & Product Designer', preview: 'Демонстрация ключевого AI-сценария',
          takeaway: 'От продуктовой идеи до функциональных прототипов.',
          context: 'Как работать со знаниями проекта внутри AI-разговора и сохранять контроль над контекстом и источниками.',
          contribution: ['Определяю направление продукта, пользовательские сценарии и паттерны взаимодействия.', 'Исследую редактирование извлечённого контекста прямо в AI-разговоре и связь с документами и картой проекта.', 'Проектирую прогресс длительных задач, частичные результаты, прерывания и восстановление.', 'Собираю функциональные прототипы с Claude и Codex, проверяю и уточняю поведение.'],
          outcome: 'Независимый продукт в разработке. Работа показывает процесс проектирования и прототипирования; коммерческие результаты пока не заявлены.'
        },
        {
          id: 'semrush', name: 'Semrush', category: 'Design systems · production workflows',
          headline: 'Системы, которые помогают выпускать материалы без постоянного участия дизайнера.',
          role: 'Product Designer / Design Systems', preview: 'Система компонентов и пример сборки страницы',
          takeaway: 'Сборка страницы в Figma: с нескольких часов до ≈15–20 минут.',
          context: 'Ускорить выпуск лендингов, писем и продуктовой графики после редизайна Semrush перед интеграцией с Adobe.',
          contribution: ['Создал модульную библиотеку страниц под восемь адаптивных брейкпоинтов.', 'Разработал настраиваемые шаблоны писем и адаптивные SVG-материалы.', 'Подготовил документацию и инструменты для самостоятельной работы маркетинга и контент-команд.'],
          outcome: 'В первый месяц команда выпустила 100+ лендингов и 500+ email-коммуникаций. Библиотека включала 100+ продуктовых визуализаций.'
        },
        {
          id: 'aio', name: 'AIO Tech', category: 'B2B SaaS · product UX',
          headline: 'Сложные сценарии маркетинговой платформы — от настройки до результата.',
          role: 'Product Designer', preview: 'Пользовательский путь и ключевые состояния интерфейса',
          takeaway: 'Полный сценарий A/B-тестирования и переиспользуемый UI kit.',
          context: 'Сделать управляемыми сценарии кампаний, правил и A/B-тестов с большим количеством настроек и состояний.',
          contribution: ['Проектировал навигацию, управление кампаниями, создание правил и сложные состояния.', 'Разработал полный путь A/B-тестирования сайтов и креативов: настройка, комбинации и результаты.', 'Спроектировал опциональный AI-сценарий тестирования комбинаций и выбора лучшего варианта.', 'Работал с продуктовой и инженерной командами от обсуждения задач до реализации.'],
          outcome: 'Создал UI kit, который продолжили использовать после моего ухода. Помимо продуктовых сценариев, вёл веб- и бренд-дизайн, координировал подрядчиков и создавал 3D/motion-материалы.'
        },
        {
          id: 'evapolar', name: 'Evapolar', category: 'Brand · web · 3D',
          headline: 'Единый визуальный язык для сайта, коммуникаций и продуктового контента.',
          role: 'Designer — Brand, Web & Design Systems', preview: 'Сайт, коммуникации и продуктовые 3D-материалы',
          takeaway: 'Около 70% визуального контента переведено в 3D.',
          context: 'Обновить бренд и сайт, выстроить повторяемое производство материалов и снизить зависимость от фотосъёмок.',
          contribution: ['Вёл обновление бренда и сайта, создал переиспользуемую веб-дизайн-систему.', 'Инициировал переход к 3D-визуализации продукта.', 'Арт-директировал съёмки и координировал фотографов, дополняя материалы 3D-ассетами.'],
          outcome: '3D заменило около 70% визуальных материалов, сделав производство быстрее и менее зависимым от съёмок. Опыт объединяет бренд, веб и организацию визуального производства.'
        }
      ]
    },
    clients: {
      label: '02 / Для клиентов', title: 'С какой задачей ко мне прийти',
      intro: 'Могу подключиться к отдельной задаче или связать продукт, систему и визуальную подачу в рамках одного проекта.',
      offers: [
        ['Спроектировать продукт или новый сценарий', 'AI-интерфейсы и B2B SaaS: структура, пользовательские пути, интерфейсные состояния и функциональные прототипы.'],
        ['Навести порядок в дизайн-системе', 'Компоненты, адаптивные правила, документация и инструменты, с которыми команда может работать самостоятельно.'],
        ['Обновить бренд и цифровую подачу', 'Айдентика, сайт, 3D и motion для согласованного образа продукта и его коммуникаций.']
      ],
      processTitle: 'Как начнём',
      steps: [['Контекст', 'Разберём продукт, задачу, ограничения и ожидаемый результат.'], ['Объём', 'Определим состав работы, этапы, сроки и стоимость.'], ['Работа', 'Пройдём от сценариев и прототипов к деталям и передаче в реализацию.']],
      cta: 'Рассказать о задаче',
      note: 'Клиент узнаёт свою задачу и понимает первый шаг. Цены и сроки не обещаем заранее: они зависят от конкретного объёма.'
    },
    about: {
      label: '03 / Обо мне', title: 'Продуктовая глубина. Визуальный кругозор.',
      text: ['Я Ян, мультидисциплинарный дизайнер с 8 годами опыта в продуктовом, визуальном и бренд-дизайне.', 'Работал со сложными SaaS-сценариями в AIO Tech, создавал масштабируемые системы в Semrush и объединял бренд, веб и 3D в Evapolar. Сейчас также развиваю собственный AI-продукт Plenum.', 'Мне интересно доводить идею до поведения, которое можно проверить: проектировать сценарии, собирать функциональные прототипы и работать с разработчиками над реализацией.'],
      tools: 'Figma · Claude · Codex · Blender · Adobe · DaVinci Resolve',
      note: 'Здесь появляется человек за работами. Позже можно добавить портрет или авторский визуал; биографию сохраняем короткой.'
    },
    team: {
      label: '04 / Для работодателей', title: 'Могу усилить продуктовую команду на стыке UX, систем и визуального дизайна.',
      intro: 'Соединяю продуктовый UX, визуальные системы и AI-assisted разработку.',
      strengths: ['Проектирование сложных сценариев, состояний и взаимодействий.', 'Компонентные системы и документация, поддерживающие работу команды.', 'Работа с продуктом и разработкой от обсуждения задачи до реализации.', 'Функциональные AI-прототипы и сильная визуальная база.'],
      experience: [['Semrush', 'Product Designer / Design Systems', '2025–2026'], ['AIO Tech', 'Product Designer', '2023–2025'], ['Evapolar', 'Designer — Brand, Web & Design Systems', '2022–2023'], ['McCann Worldgroup', 'Multidisciplinary Designer', '2021–2022']],
      location: 'Вильнюс, Литва · удалённая работа, офис в Литве — обсуждаемо',
      cta: 'Обсудить роль', cv: 'Скачать CV · PDF', linkedin: 'LinkedIn',
      note: 'Короткий путь для нанимающего: профиль → релевантный опыт → CV → разговор о роли. Текущую доступность нужно уточнить перед публичным запуском.'
    },
    contact: {
      label: '05 / Следующий шаг', title: 'Что будем делать вместе?',
      intro: 'Напиши несколько строк о проекте или роли — так у нас будет контекст для первого разговора.',
      project: 'У меня проект', role: 'Предлагаю роль',
      projectLabel: 'Что нужно сделать?', roleLabel: 'О какой роли речь?',
      projectPlaceholder: 'Что за продукт, какая задача, есть ли ориентир по срокам и бюджету…',
      rolePlaceholder: 'Компания, продукт, роль, формат работы и ссылка на вакансию…',
      send: 'Открыть письмо', hint: 'Откроется твоя почта с подготовленным письмом. На сайте ничего не отправляется.',
      email: 'Или напиши напрямую', copy: 'Скопировать email', copied: 'Email скопирован', failed: 'Не удалось скопировать — выдели email выше.',
      subjectProject: 'Обсудить проект — Yan Kavaleu', subjectRole: 'Предложение роли — Yan Kavaleu',
      defaultProject: 'Привет, Ян! Хочу обсудить проект.\n\nПродукт / компания:\nЗадача:\nСроки:\nБюджет:',
      defaultRole: 'Привет, Ян! Хочу обсудить роль.\n\nКомпания:\nПродукт:\nРоль:\nФормат работы:\nВакансия:',
      note: 'Финальная конверсия — письмо по делу. Сейчас кнопка открывает почтовое приложение; реальную форму можно выбрать позже, если она понадобится.'
    },
    footer: 'Yan Kavaleu · Вильнюс, Литва', back: 'Наверх',
    review: { title: 'Что проверяем в версии 0.1', text: 'Позиционирование, порядок блоков, убедительность кейсов и два сценария обращения. Цвета, шрифты, изображения и анимации пока не выбраны.', refs: 'Референсы на следующий этап', refText: 'Lusion / About — подача студии; Shopify Winter ’26 — переходы и сторителлинг; Will Beeching — авторское портфолио.' }
  },
  en: {
    proto: 'Structure prototype', version: 'Version 0.1 · 17 Nov 2026', notes: 'Review notes', skip: 'Skip to content',
    nav: ['Selected work', 'Collaboration', 'About', 'Contact'],
    hero: {
      label: 'Yan Kavaleu · Multidisciplinary Designer',
      title: 'I turn complex workflows into clear digital products.',
      text: 'I design AI products, SaaS experiences and design systems, combining product thinking with a background in branding, 3D and motion.',
      location: '', client: 'Discuss a project', employer: 'Explore a team fit',
      proof: '8 years in design · experience at Semrush, AIO Tech, Evapolar and McCann',
      note: 'The opening explains who you are, what you bring and two possible next steps. Both audiences share the same project evidence, with separate collaboration offers.'
    },
    work: {
      label: '01 / Selected work', title: 'From AI interactions to systems that teams can build with.',
      intro: 'Four projects showing product thinking, systems work and visual craft.',
      details: 'Challenge, contribution and outcome', context: 'Challenge', contribution: 'My contribution', result: 'Outcome / status',
      more: 'View my existing portfolio',
      note: 'Shared evidence for clients and employers. These are short narratives based on the CV, not finished full case studies. Visual slots are reserved for the next phase.',
      cases: [
        {
          id: 'plenum', name: 'Plenum', category: 'AI product · independent project',
          headline: 'A workspace connecting conversation, documents and team context.',
          role: 'Creator & Product Designer', preview: 'Key AI workflow demonstration',
          takeaway: 'From product direction to functional prototypes.',
          context: 'How can people work with project knowledge inside an AI conversation while staying in control of context and sources?',
          contribution: ['Define product direction, user workflows and interaction patterns.', 'Explore editing retrieved context directly in an AI conversation, connected to documents and a project map.', 'Design progress, partial results, interruptions and recovery for long-running AI tasks.', 'Build functional prototypes with Claude and Codex, testing and refining behaviour.'],
          outcome: 'An independent product in development. This work demonstrates product exploration and prototyping; commercial outcomes are not claimed.'
        },
        {
          id: 'semrush', name: 'Semrush', category: 'Design systems · production workflows',
          headline: 'Systems that help teams create materials independently.',
          role: 'Product Designer / Design Systems', preview: 'Component system and page assembly example',
          takeaway: 'Figma page assembly: from several hours to approximately 15–20 minutes.',
          context: 'Speed up production of landing pages, emails and product visuals after the Semrush redesign ahead of the Adobe integration.',
          contribution: ['Created a modular page library covering eight responsive breakpoints.', 'Built configurable email templates and responsive SVG assets.', 'Documented the systems and enabled marketing and content teams to assemble materials independently.'],
          outcome: 'The team released 100+ landing pages and 500+ email communications in the first month. The library included 100+ product visuals.'
        },
        {
          id: 'aio', name: 'AIO Tech', category: 'B2B SaaS · product UX',
          headline: 'Complex marketing workflows, from configuration to results.',
          role: 'Product Designer', preview: 'User journey and key interface states',
          takeaway: 'An end-to-end A/B-testing flow and a reusable UI kit.',
          context: 'Make campaigns, rules and A/B tests manageable across complex configurations and interface states.',
          contribution: ['Designed navigation, campaign management, rule creation and complex states.', 'Designed the complete journey for website and creative A/B testing: configuration, combinations and results.', 'Designed an optional AI-assisted flow for testing combinations and selecting the best-performing option.', 'Worked with product and engineering from grooming through implementation.'],
          outcome: 'Built a UI kit that continued to be used after my departure. Alongside product UX, led web and brand design, coordinated contractors and created 3D and motion assets.'
        },
        {
          id: 'evapolar', name: 'Evapolar', category: 'Brand · web · 3D',
          headline: 'A consistent visual language across web, communications and product content.',
          role: 'Designer — Brand, Web & Design Systems', preview: 'Website, communications and 3D product visuals',
          takeaway: 'Approximately 70% of visual content shifted to 3D.',
          context: 'Refresh the brand and website, create repeatable production workflows and reduce dependence on photography.',
          contribution: ['Led brand and website redesign work and built a reusable web design system.', 'Initiated the transition to 3D product visualisation.', 'Directed photoshoots and coordinated photographers, using 3D assets to fill content gaps.'],
          outcome: '3D replaced approximately 70% of visuals, making production faster and less dependent on photography. The work connected branding, web design and visual production.'
        }
      ]
    },
    clients: {
      label: '02 / For clients', title: 'What we can work on',
      intro: 'I can join a focused assignment or connect product, systems and visual work within one project.',
      offers: [['Design a product or a new workflow', 'AI interfaces and B2B SaaS: structure, user journeys, interface states and functional prototypes.'], ['Build a system your team can use', 'Components, responsive rules, documentation and tools that help teams work independently.'], ['Refresh a brand and its digital presence', 'Identity, websites, 3D and motion that bring a product and its communications together.']],
      processTitle: 'How we start',
      steps: [['Context', 'Understand the product, the problem, constraints and the intended outcome.'], ['Scope', 'Agree on deliverables, stages, timeline and cost.'], ['Delivery', 'Move from workflows and prototypes into detailed design and implementation handoff.']],
      cta: 'Tell me about your project',
      note: 'A client should recognise their problem and understand the next step. Timeline and pricing depend on scope.'
    },
    about: {
      label: '03 / About', title: 'Product depth. Visual range.',
      text: ['I’m Yan, a multidisciplinary designer with 8 years of multidisciplinary experience across product, visual and brand design.', 'My work spans complex SaaS workflows at AIO Tech, scalable systems at Semrush, and brand, web and 3D at Evapolar. I’m also developing Plenum, an independent AI product.', 'I like taking ideas into behaviour we can test: mapping workflows, building functional prototypes and working with engineers on implementation.'],
      tools: 'Figma · Claude · Codex · Blender · Adobe · DaVinci Resolve',
      note: 'A short introduction to the person behind the work. A portrait or an authored visual can be added later.'
    },
    team: {
      label: '04 / For employers', title: 'Product thinking, systems and visual craft for your team.',
      intro: 'I connect product UX, visual systems and AI-assisted development.',
      strengths: ['Complex user workflows, interface states and interaction design.', 'Component systems and documentation that support the team.', 'Collaboration with product and engineering through implementation.', 'Functional AI prototypes and a strong visual design foundation.'],
      experience: [['Semrush', 'Product Designer / Design Systems', '2025–2026'], ['AIO Tech', 'Product Designer', '2023–2025'], ['Evapolar', 'Designer — Brand, Web & Design Systems', '2022–2023'], ['McCann Worldgroup', 'Multidisciplinary Designer', '2021–2022']],
      location: 'Vilnius, Lithuania · remote; office-based roles in Lithuania can be discussed',
      cta: 'Discuss a role', cv: 'Download CV · PDF', linkedin: 'LinkedIn',
      note: 'A short hiring path: profile → relevant experience → CV → role discussion. Confirm current availability before public launch.'
    },
    contact: {
      label: '05 / Next step', title: 'What shall we work on together?',
      intro: 'Share a few lines about your project or role to give our first conversation some context.',
      project: 'I have a project', role: 'I’m hiring', projectLabel: 'What do you need to create?', roleLabel: 'Tell me about the role',
      projectPlaceholder: 'Your product, the challenge, and any timeline or budget in mind…',
      rolePlaceholder: 'Company, product, role, working arrangement and a link to the opening…',
      send: 'Open email', hint: 'Opens your email app with a prepared message. Nothing is submitted on this website.',
      email: 'Or email me directly', copy: 'Copy email', copied: 'Email copied', failed: 'Could not copy — select the email above.',
      subjectProject: 'Project enquiry — Yan Kavaleu', subjectRole: 'Role opportunity — Yan Kavaleu',
      defaultProject: 'Hi Yan, I’d like to discuss a project.\n\nProduct / company:\nChallenge:\nTimeline:\nBudget:',
      defaultRole: 'Hi Yan, I’d like to discuss a role.\n\nCompany:\nProduct:\nRole:\nWorking arrangement:\nJob description:',
      note: 'The conversion is a useful email. This prototype opens an email app; a hosted form can be considered later if needed.'
    },
    footer: 'Yan Kavaleu · Vilnius, Lithuania', back: 'Back to top',
    review: {title: 'What we’re reviewing in v0.1', text: 'Positioning, section order, project evidence and the two enquiry paths. Colours, typography, imagery and animation have not been selected.', refs: 'References for the next phase', refText: 'Lusion / About — studio presentation; Shopify Winter ’26 — transitions and storytelling; Will Beeching — personal portfolio.'}
  }
};
