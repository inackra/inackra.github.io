import evapolarMedia from './evapolar/media.json';
import {evapolarCopy} from './evapolar/copy';
import {projectCovers} from './projectMedia';
import {semrushCopy} from './semrush/copy';
import sources from '../public/assets/cases/sources.json';

// Text and visuals adapted from the owner's published Readymag case studies.
const image=(folder,index)=>sources.assets.find(a=>a.case===folder&&a.index===index&&a.path);
const chapter=(title,text,folder,indexes,layout='wide')=>({title,text,images:indexes.map(i=>image(folder,i)).filter(Boolean),layout});
const ready={
 ru:{
  aio:{period:'2023–2026',discipline:'B2B SaaS / MarTech',line:'От настройки эксперимента до понятного результата.',
   context:'Разработать продуктовый UX маркетинговой платформы от pre-seed до MVP и следующих релизов: объединить рекламные инструменты и сложные сценарии в понятном рабочем пространстве.',
   contribution:['Проектировал регистрацию, дашборд, управление правами доступа и рекламными кампаниями.','Разработал визуальный редактор лендингов с A/B-тестированием текста, изображений и комбинаций элементов.','Спроектировал режимы распределения трафика First, AI и Weights.','Развивал дизайн-систему, UI kit, 3D, анимацию и визуальные коммуникации продукта.'],
   outcome:'Вместе с командой довёл продукт от ранней стадии до MVP и последующих релизов. Создал переиспользуемый UI kit и связанные сценарии работы с рекламой, контентом и экспериментами.',
   chapters:[chapter('Регистрация','Последовательное знакомство с платформой: инвайт, данные пользователя, создание рабочего пространства и подписка, которую можно пропустить. Между шагами предусмотрена настройка 2FA.','allinone',[1,2,3,4,5]),chapter('Дашборд','Ключевые показатели рекламных кампаний, финансовые метрики и аналитика в одном экране.','allinone',[6]),chapter('Совместная работа и доступы','Управление участниками открывается из меню объекта в Tracker. Пользователи и команды, поиск, массовые операции и настройка прав — в одном окне.','allinone',[7,8,9,10]),chapter('Редактор и A/B-тестирование','Текст, изображения и их комбинации можно тестировать прямо в редакторе. First оставляет первый вариант, AI автоматически перераспределяет показы в пользу эффективного контента, Weights даёт маркетологу ручной контроль весов.','allinone',[11,12,13,14,15]),chapter('Meta Ads Manager','Собственный интерфейс работы с профилями, аккаунтами, кампаниями, группами объявлений и статистикой. Данные объединены через официальный Meta API.','allinone',[16,17,18,19])]},
  buburuza:{id:'buburuza',name:'Buburuza',category:'Fintech · onboarding · motion',role:'Product Designer / 3D & Motion',period:'2025–2026',discipline:'Fintech / необанк',line:'Первое знакомство с цифровым банком.',headline:'Онбординг и визуальный язык европейского необанка на этапе MVP.',takeaway:'От первых шагов в приложении до визуальной презентации продукта.',
   context:'Помочь команде сформировать первое впечатление о европейском необанке: сделать знакомство с сервисом понятным и визуально выразительным.',
   contribution:['Спроектировал онбординг и первые сценарии взаимодействия с приложением.','Создал UI-компоненты и развил дизайн-систему.','Создавал 3D-анимации и визуальные вставки для презентационного ролика MVP.','Для онбординга сочетал 3D-анимацию с покадровым 2D VFX.'],
   outcome:'Подготовлены интерфейсные решения для знакомства с приложением, компоненты и визуальные материалы MVP. Анимации помогали объяснять ценность продукта инвесторам и ранним пользователям.',
   chapters:[chapter('Визуальный язык продукта','Экраны знакомства с продуктом сочетают интерфейс и 3D с покадровым 2D VFX.','buburuza',[14,15,16],'phones'),chapter('Онбординг','Регистрация включает email и телефон с верификацией, подтверждение геолокации и создание никнейма. Никнейм используется для общения и внутренних функций приложения.','buburuza',[8,9,10,11,12,13],'phones'),chapter('UI kit','UI-компоненты, состояния и варианты, созданные в рамках развития дизайн-системы.','buburuza',[0,1,2,3,4,5,6],'grid')]}
 },
 en:{
  aio:{period:'2023–2026',discipline:'B2B SaaS / MarTech',line:'From experiment configuration to meaningful results.',context:'Design the product UX for a marketing platform from pre-seed through MVP and subsequent releases, bringing advertising tools and complex workflows into one workspace.',contribution:['Designed registration, dashboards, access management and campaign workflows.','Designed a visual landing-page editor with A/B tests for text, images and combinations.','Designed the First, AI and Weights traffic allocation modes.','Developed the design system, UI kit, 3D, motion and product communications.'],outcome:'Worked with the team from early product stages through MVP and subsequent releases. Created a reusable UI kit and connected workflows for advertising, content and experiments.',chapters:[chapter('Registration','A guided introduction: invitation, user details, workspace creation and an optional subscription step. Two-factor authentication can be configured between steps.','allinone',[1,2,3,4,5]),chapter('Dashboard','Campaign performance, financial metrics and analytics in one view.','allinone',[6]),chapter('Collaboration and permissions','Manage people and teams from an object’s menu inside Tracker. Search, bulk operations and flexible permissions stay in a single window.','allinone',[7,8,9,10]),chapter('Editor and A/B testing','Test text, images and combinations directly in the editor. First displays the first variant, AI shifts impressions towards stronger content, and Weights gives marketers manual control over traffic.','allinone',[11,12,13,14,15]),chapter('Meta Ads Manager','A dedicated interface for profiles, accounts, campaigns, ad sets and reporting, connected through the official Meta API.','allinone',[16,17,18,19])]},
  buburuza:{id:'buburuza',name:'Buburuza',category:'Fintech · onboarding · motion',role:'Product Designer / 3D & Motion',period:'2025–2026',discipline:'Fintech / neobank',line:'The first encounter with a digital bank.',headline:'Onboarding and visual direction for a European neobank’s MVP.',takeaway:'From first steps in the app to the product presentation.',context:'Help the team shape the first impression of a European neobank, making the introduction clear and visually expressive.',contribution:['Designed onboarding and the first in-app workflows.','Created UI components and developed the design system.','Produced 3D animations and visual inserts for the MVP presentation video.','Combined 3D animation with frame-by-frame 2D VFX for onboarding.'],outcome:'Delivered introductory app workflows, components and visual materials for the MVP. Animations helped explain the product’s value to investors and early users.',chapters:[chapter('Product visual language','Introductory screens combine the interface with 3D and frame-by-frame 2D VFX.','buburuza',[14,15,16],'phones'),chapter('Onboarding','Registration covers email and phone verification, location confirmation and a nickname used in communication and internal app features.','buburuza',[8,9,10,11,12,13],'phones'),chapter('UI kit','Components, states and variants created as part of the evolving design system.','buburuza',[0,1,2,3,4,5,6],'grid')]}
 }
};
export function getCaseStudies(base,lang){
 const entries=[...base.slice(0,3),ready[lang].buburuza,...base.slice(3)];
 return entries.map(item=>{
  if(item.id==='plenum')return {...item,status:'ready',cover:projectCovers.plenum,role:'Founder / Product Designer / AI-assisted Builder',discipline:'AI product / Product Intelligence',line:lang==='ru'?'От разрозненных источников к общей модели продукта.':'From fragmented sources to a shared product model.',headline:lang==='ru'?'Спроектировал продукт, его поведение и процесс разработки с AI.':'Designed the product, its behaviour and its AI-assisted development process.',takeaway:lang==='ru'?'Холст, доказательства и контролируемые выводы в одном рабочем пространстве.':'Canvas, evidence and qualified findings in one workspace.'};
  if(item.id==='semrush'){
   const copy=semrushCopy[lang];
   return {...item,status:'ready',cover:image('semrush',0),period:'2025–2026',line:copy.headline,headline:copy.headline,takeaway:copy.takeaway};
  }
  if(item.id==='evapolar'){
   const copy=evapolarCopy[lang];
   return {...item,status:'ready',cover:evapolarMedia.cover,role:copy.role,category:copy.discipline,discipline:copy.discipline,period:'2022–2023',headline:copy.headline,line:copy.headline,takeaway:lang==='ru'?'2 000+ покупателей за первые четыре месяца запуска Evapolar × Loóna.':'2,000+ customers in the first four months of the Evapolar × Loóna launch.'};
  }
  const details=ready[lang][item.id];
  if(!details)return {...item,status:'soon',line:item.headline};
  const folder=item.id==='aio'?'allinone':item.id;
  return {...item,...details,status:'ready',cover:projectCovers[item.id]||image(folder,item.id==='aio'?6:item.id==='buburuza'?7:0),source:''};
 });
}
