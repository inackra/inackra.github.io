// Content for the homepage constructor (/demo/). The mock-ups are assembled
// from parts: product type (layout) × mood (theme) × niche (copy, data, accent).

export const copy={
 ru:{
  title:['Собери продукт.','За минуту.'],
  text:'Три шага, и ты увидишь, как может выглядеть твой продукт. Настоящий я соберу под ключ: продукт, бренд и рабочий прототип.',
  steps:['Что делаем?','Какое настроение?','Для какой сферы?'],
  build:'Собрать',back:'Назад',
  generating:['Собираю палитру','Подбираю шрифты','Раскладываю сетку','Оживляю экраны'],
  meanwhile:'Пока собирается',
  summary:'Твой продукт',restart:'Собрать заново',another:'Другой вариант',
  order:['Нравится?','Соберу настоящий.'],orderText:'Это была минута и немного магии. Настоящий продукт я соберу с исследованием, брендом и рабочим прототипом. Опиши задачу, а сборка уже приложена.',brief:'Сборка в заявке',promise:['Отвечу в течение дня','Без длинных брифов','Под ключ: продукт, бренд, прототип'],
  task:'Коротко о задаче',taskHint:'Например: MVP финтех-приложения, запуск весной',contact:'Почта или Telegram',contactHint:'you@mail.com или @username',send:'Хочу настоящий',
  sentTitle:'Принял.',sentText:'Твоя сборка и описание у меня. Отвечу в течение дня.',seeWork:'Посмотреть работы',playMore:'Собрать ещё',
  required:'Опиши задачу (хотя бы пару слов) и оставь почту или Telegram',sending:'Отправляю…',failed:'Не получилось отправить. Напиши мне на почту:',mailNote:'Откроется почта с готовым письмом.',privacy:'Контакт нужен только для ответа на заявку.',
  hint:'Наведи курсор на макет',
  share:'Поделиться',shareCopy:'Скопировать ссылку',shareCopied:'Ссылка скопирована',shareMore:'Ещё…',
  shareText:'Собрал макет своего продукта за минуту. Собери свой:',
  sharedTitle:'Этот макет собрали за минуту',sharedText:'Тип, настроение и сфера — три клика. Собери свой или закажи такой продукт.',
  buildOwn:'Собрать свой',wantThis:'Хочу такой продукт',wantReal:'Хочу настоящий',
  ogCta:['Собери свой продукт','за минуту'],
 },
 en:{
  title:['Build a product.','In a minute.'],
  text:'Three steps to see how your product could look. The real one I build end to end: product, brand and a working prototype.',
  steps:['What are we making?','Pick a mood','Pick a field'],
  build:'Build it',back:'Back',
  generating:['Mixing the palette','Pairing fonts','Laying out the grid','Bringing screens to life'],
  meanwhile:'While it builds',
  summary:'Your product',restart:'Start over',another:'Another take',
  order:['Like it?','Let’s make it real.'],orderText:'That was a minute and a bit of magic. The real product comes with research, a brand and a working prototype. Describe the task, your build is already attached.',brief:'Build attached',promise:['Reply within a day','No long briefs','End to end: product, brand, prototype'],
  task:'The task in short',taskHint:'E.g. a fintech app MVP, launching in spring',contact:'Email or Telegram',contactHint:'you@mail.com or @username',send:'I want the real one',
  sentTitle:'Got it.',sentText:'Your build and notes are with me. I’ll reply within a day.',seeWork:'See my work',playMore:'Build another',
  required:'Describe the task (a few words) and leave your email or Telegram',sending:'Sending…',failed:'Could not send it. Email me at:',mailNote:'Your email app opens with a ready letter.',privacy:'Your contact is used only to reply.',
  hint:'Move the cursor over the mock-up',
  share:'Share',shareCopy:'Copy link',shareCopied:'Link copied',shareMore:'More…',
  shareText:'I built a mock-up of my product in a minute. Build yours:',
  sharedTitle:'This mock-up took a minute to build',sharedText:'Type, mood and field: three clicks. Build your own or order a product like this.',
  buildOwn:'Build your own',wantThis:'I want this product',wantReal:'I want the real one',
  ogCta:['Build your product','in a minute'],
 },
};

export const types=[
 {id:'site',ru:'Сайт',en:'Website',noteRu:'Лендинг или сайт продукта',noteEn:'Landing or product site'},
 {id:'app',ru:'Мобильное приложение',en:'Mobile app',noteRu:'iOS и Android',noteEn:'iOS and Android'},
 {id:'saas',ru:'Инструмент',en:'SaaS tool',noteRu:'SaaS, дашборд, админка',noteEn:'SaaS, dashboard, admin'},
];

export const moods=[
 {id:'strict',ru:'Сдержанно',en:'Calm',noteRu:'Чисто, точно, по-швейцарски',noteEn:'Clean, precise, Swiss',swatch:['#f4f3ef','#121212','#3b5bfd']},
 {id:'bright',ru:'Смело',en:'Bold',noteRu:'Громкий цвет и крупный шрифт',noteEn:'Loud colour, big type',swatch:['#c6f432','#ff6a3d','#0b0b0b']},
 {id:'twist',ru:'С изюминкой',en:'Twisted',noteRu:'Тёмный, тёплый, с характером',noteEn:'Dark, warm, with character',swatch:['#12110f','#e8b27a','#f2ebe0']},
];

// Proof shown while the mock-up "builds". Figures from the case studies.
export const achievements={
 ru:[
  ['$3M → $7M','выручка Evapolar на Amazon после ребрендинга'],
  ['15 минут','вместо нескольких часов на лендинг в Semrush'],
  ['800+','макетов за 3 месяца: лендинги, визуалы и рассылки Semrush'],
  ['2 000+','покупателей Evapolar × Loóna за первые 4 месяца'],
  ['8 лет','в продуктах, брендинге и моушене'],
 ],
 en:[
  ['$3M → $7M','Evapolar revenue on Amazon after the rebrand'],
  ['15 min','instead of hours to build a Semrush landing page'],
  ['800+','layouts in 3 months: Semrush landings, visuals, emails'],
  ['2,000+','Evapolar × Loóna customers in the first 4 months'],
  ['8 years','across product, brand and motion'],
 ],
};

// Accent per mood: calm = quiet brand colour on paper, bold = the background
// itself, twisted = a warm highlight on near-black.
export const niches=[
 {id:'ai',ru:'AI',en:'AI',accent:{strict:'#3b5bfd',bright:'#c6f432',twist:'#e8b27a'},
  name:'Lumen',domain:'lumen.ai',headline:['Ask anything.','Get cited answers.'],
  sub:'An assistant that reads your documents and shows where every answer comes from.',cta:'Try Lumen',nav:['Product','Use cases','Pricing'],
  hello:'Good morning, Anna',metric:{label:'Answers this week',value:1284,delta:'+18%'},
  series:[18,22,20,31,28,36,34,45,41,52,58,66],
  list:[['Contract review, Q4','12 sources','2m'],['Onboarding policy','4 sources','1h'],['Vendor risk summary','9 sources','3h']],
  kpis:[['Docs indexed','12.4k'],['Avg. answer','3.2s'],['Accuracy','98%']],
  side:['Assistant','Documents','Sources','Team','Settings'],features:['Cited answers','Private by default','Works in Slack'],
  icons:['spark','docs','search','user'],toast:['Answer ready','Contract review, Q4'],stories:["Contracts", "Policies", "Sales", "HR", "Legal"],board:[["Queued", [["Q3 board deck", "8 files"], ["Pricing FAQ", "3 files"], ["Security review", "14 files"]]], ["Reading", [["Vendor contracts", "21 files"], ["Onboarding wiki", "6 files"], ["Support macros", "40 files"]]], ["Answered", [["Refund policy", "12 sources"], ["Travel rules", "4 sources"], ["SLA terms", "7 sources"]]]],mix:[["Docs", 52], ["Slack", 30], ["Email", 18]],top:"Most asked",notes:["Every answer links to the page it came from.", "Your files never train public models.", "Ask from any channel, get the answer in thread."],quote:["We cut contract review from two days to one hour.", "Olga M.", "Head of Legal, Brightline"]},
 {id:'fintech',ru:'Финтех',en:'Fintech',accent:{strict:'#0f8a5f',bright:'#8b6cff',twist:'#d9c27a'},
  name:'Rivo',domain:'rivo.money',headline:['Money that','moves with you.'],
  sub:'Cards, savings and transfers in one calm app. No fees hiding in small print.',cta:'Open account',nav:['Cards','Savings','Business'],
  hello:'Hi, Mark',metric:{label:'Balance',value:12480.2,prefix:'$',decimals:2,delta:'+$1,240'},
  series:[40,42,38,47,52,49,58,61,57,66,72,78],
  list:[['Salary','Today','+$4,200'],['Spotify','Yesterday','−$11.99'],['Coffee Lab','Mon','−$4.50']],
  kpis:[['Revenue','$84.2k'],['Active cards','2,310'],['Churn','1.2%']],
  side:['Overview','Cards','Payments','Customers','Settings'],features:['Instant transfers','Virtual cards','Smart savings'],
  icons:['home','card','swap','user'],toast:['Payment received','+$4,200 from Acme'],stories:["Cards", "Savings", "Travel", "Bills", "Gifts"],board:[["Pending", [["Acme Inc. invoice", "$4,200"], ["Office rent", "$2,150"], ["Figma seats", "$180"]]], ["In review", [["Card limit raise", "Mark T."], ["New vendor", "Studio Aro"], ["Refund #2291", "$64"]]], ["Paid", [["Payroll Nov", "$38,400"], ["AWS", "$1,212"], ["Insurance", "$420"]]]],mix:[["Cards", 48], ["Transfers", 34], ["Savings", 18]],top:"Latest payments",notes:["Send money to any card in seconds, 24/7.", "One-tap cards for every subscription.", "Round-ups save for you, automatically."],quote:["Finally a bank I don't have to think about.", "Daniel R.", "Freelance designer"]},
 {id:'crypto',ru:'Крипто',en:'Crypto',accent:{strict:'#e0761a',bright:'#ff6a3d',twist:'#9fd3a8'},
  name:'Kairo',domain:'kairo.xyz',headline:['Trade crypto','without the noise.'],
  sub:'One wallet, live prices and alerts that only fire when it matters.',cta:'Get the app',nav:['Markets','Wallet','Earn'],
  hello:'Portfolio',metric:{label:'BTC / USD',value:67412,prefix:'$',delta:'+2.4%'},
  series:[52,48,55,50,61,58,54,63,70,66,74,71],
  list:[['ETH','Ethereum','$3,512'],['SOL','Solana','$172.4'],['TON','Toncoin','$6.91']],
  kpis:[['Volume 24h','$4.1M'],['Traders','18.6k'],['Fees saved','$92k']],
  side:['Markets','Wallet','Orders','Alerts','Settings'],features:['Self-custody','Price alerts','Zero-fee swaps'],
  icons:['chart','swap','card','user'],toast:['Alert','BTC crossed $67k'],stories:["BTC", "ETH", "SOL", "TON", "Top"],board:[["Watchlist", [["BTC breakout", "$68k target"], ["SOL dip buy", "$160 limit"], ["TON staking", "6.1% APY"]]], ["Open orders", [["Buy 0.2 BTC", "Limit $66,800"], ["Sell 4 ETH", "Limit $3,650"], ["Swap 200 SOL", "To USDC"]]], ["Filled", [["Buy 12 TON", "$6.88"], ["Sell 1.5 ETH", "$3,498"], ["Buy 0.05 BTC", "$65,920"]]]],mix:[["BTC", 54], ["ETH", 28], ["Alts", 18]],top:"Top movers",notes:["Your keys stay on your device.", "Set a price, get one alert, no spam.", "Swap between 200+ tokens, no fees."],quote:["The only app where alerts don't drive me crazy.", "Ilya K.", "Trader since 2017"]},
 {id:'travel',ru:'Трэвел',en:'Travel',accent:{strict:'#1f7a8c',bright:'#ffd23f',twist:'#e39b7b'},
  name:'Nomi',domain:'nomi.travel',headline:['Trips planned','in minutes.'],
  sub:'Flights, stays and a day-by-day plan that adapts when plans change.',cta:'Plan a trip',nav:['Destinations','Stays','Guides'],
  hello:'Where next, Lea?',metric:{label:'Days to Lisbon',value:12,delta:'Oct 12'},
  series:[20,24,30,28,40,48,55,62,58,50,44,38],
  list:[['Lisbon','4 nights · Oct 12','$640'],['Kyoto','7 nights · Nov 3','$1,380'],['Tbilisi','3 nights · Dec 1','$410']],
  kpis:[['Bookings','3,920'],['Avg. trip','5.4 days'],['Rating','4.9']],
  side:['Trips','Bookings','Guests','Partners','Settings'],features:['Smart itineraries','Price tracking','Offline maps'],
  icons:['map','heart','search','user'],toast:['Price dropped','Lisbon, −$84'],stories:["Lisbon", "Kyoto", "Tbilisi", "London", "Rome"],board:[["Planning", [["Oslo, March", "2 guests"], ["Rome weekend", "4 guests"], ["Bali, summer", "2 guests"]]], ["Booked", [["Lisbon", "4 nights · Oct 12"], ["Kyoto", "7 nights · Nov 3"], ["Tbilisi", "3 nights · Dec 1"]]], ["Past trips", [["Porto", "5 nights"], ["Seoul", "9 nights"], ["Prague", "3 nights"]]]],mix:[["Stays", 46], ["Flights", 38], ["Tours", 16]],top:"Upcoming trips",notes:["A day-by-day plan built from your wishlist.", "We watch prices and rebook when they drop.", "Maps and tickets work without signal."],quote:["Planned two weeks in Japan over one coffee.", "Lea S.", "Travelled to 31 countries"]},
 {id:'health',ru:'Здоровье',en:'Health',accent:{strict:'#d2435b',bright:'#ff9cc0',twist:'#b9d4a3'},
  name:'Pulse',domain:'pulse.health',headline:['Sleep better.','Every night.'],
  sub:'A gentle coach that turns your sleep data into one small change a day.',cta:'Start free',nav:['How it works','Science','Plans'],
  hello:'Morning, Sam',metric:{label:'Sleep score',value:86,delta:'+6'},
  series:[62,70,66,74,71,78,75,80,77,83,81,86],
  list:[['Deep sleep','Last night','1h 52m'],['REM','Last night','2h 05m'],['Resting HR','Average','54 bpm']],
  kpis:[['Active users','42k'],['Avg. score','81'],['Retention','74%']],
  side:['Today','Sleep','Habits','Coach','Settings'],features:['Sleep coaching','Habit streaks','Wearable sync'],
  icons:['heart','chart','spark','user'],toast:['New record','Deep sleep +18 min'],stories:["Sleep", "Calm", "Run", "Yoga", "Strength"],board:[["Today", [["Wind down at 22:30", "Habit"], ["10 min walk", "Move"], ["No screens in bed", "Habit"]]], ["This week", [["5 nights 7h+", "3 of 5"], ["Morning light", "4 of 7"], ["Caffeine by 14:00", "5 of 7"]]], ["Done", [["Read 20 pages", "Habit"], ["Stretch", "Move"], ["Breathing 4-7-8", "Calm"]]]],mix:[["Deep", 24], ["REM", 26], ["Light", 50]],top:"Last night",notes:["One small change a day, based on your nights.", "Streaks that forgive a bad day.", "Works with Apple Watch, Oura and Garmin."],quote:["My sleep score went from 68 to 85 in a month.", "Sam T.", "Pulse member"]},
 {id:'ecom',ru:'E-commerce',en:'E-commerce',accent:{strict:'#8a5a3c',bright:'#4ad0ff',twist:'#e7c9a9'},
  name:'Forma',domain:'forma.store',headline:['Objects for','slow living.'],
  sub:'Ceramics, linen and wood from small studios across Europe.',cta:'Shop now',nav:['Shop','Studios','Journal'],
  hello:'New in',metric:{label:'Orders today',value:128,delta:'+24%'},
  series:[30,34,29,41,45,43,52,49,60,64,61,72],
  list:[['Stone Cups','Studio Aro','$64'],['Velvet Sofa','Lino','$1,120'],['Desk Lamp','Woodlab','$148']],
  kpis:[['Revenue','$38.9k'],['Orders','1,204'],['Avg. order','$72']],
  side:['Orders','Products','Customers','Studios','Settings'],features:['Free returns','Small studios','Carbon-neutral'],
  icons:['bag','heart','search','user'],toast:['New order','Stone Cups × 2'],stories:["Ceramics", "Sofas", "Living", "Art", "New"],board:[["New orders", [["#4821 Stone Cups × 2", "$128"], ["#4822 Velvet Sofa", "$1,120"], ["#4823 Desk Lamp", "$148"]]], ["Packing", [["#4817 Lamp Ono", "$210"], ["#4818 Mugs × 4", "$96"], ["#4819 Bowl set", "$74"]]], ["Shipped", [["#4810 Stone Vase", "$64"], ["#4811 Linen set", "$240"], ["#4812 Candle", "$32"]]]],mix:[["Ceramics", 44], ["Linen", 32], ["Wood", 24]],top:"Best sellers",notes:["30 days to change your mind, free pickup.", "Every piece made by a studio we visited.", "Delivery offset, packaging plastic-free."],quote:["The vase arrived wrapped like a gift.", "Marta P.", "Customer in Berlin"]},
 {id:'realty',ru:'Недвижимость',en:'Real estate',accent:{strict:'#2f5d50',bright:'#ff7a59',twist:'#c9a26b'},
  name:'Doma',domain:'doma.homes',headline:['Find a home','that fits.'],
  sub:'Verified listings, honest prices and viewings booked in two taps.',cta:'Find a home',nav:['Buy','Rent','Sell'],
  hello:'Saved homes',metric:{label:'Viewings this week',value:14,delta:'+5'},
  series:[22,26,25,31,35,33,40,44,42,49,53,58],
  list:[['Riverside loft','2 bd · 84 m²','$1,950'],['Old Town flat','1 bd · 52 m²','$1,240'],['Garden house','4 bd · 160 m²','$3,400']],
  kpis:[['Listings','8,420'],['Viewings','1,130'],['Avg. days','21']],
  side:['Listings','Viewings','Clients','Agents','Settings'],features:['Verified listings','3D tours','Instant viewings'],
  icons:['home','heart','map','user'],toast:['Viewing booked','Riverside loft, 18:30'],stories:["Lofts", "Houses", "Studios", "Gardens", "New"],board:[["New leads", [["Anna, 2 bd rent", "Old Town"], ["Mark, buy house", "Suburbs"], ["Lea, studio", "Center"]]], ["Viewings", [["Riverside loft", "Fri 18:30"], ["Garden house", "Sat 11:00"], ["Old Town flat", "Sat 15:00"]]], ["Closed", [["Harbor flat", "Sold $412k"], ["Park studio", "Rented"], ["Mill loft", "Sold $389k"]]]],mix:[["Rent", 58], ["Buy", 30], ["Sell", 12]],top:"Hot listings",notes:["Every listing checked by a local agent.", "Walk through a home before you go.", "Pick a time, the agent confirms in minutes."],quote:["We found our flat in a week, no fake listings.", "Anna and Tom", "Moved in October"]},
 {id:'food',ru:'Еда',en:'Food',accent:{strict:'#c2410c',bright:'#ffcf33',twist:'#e0a458'},
  name:'Bowl',domain:'bowl.kitchen',headline:['Dinner,','sorted.'],
  sub:'Fresh meals from local kitchens, delivered warm in under 30 minutes.',cta:'Order now',nav:['Menu','Kitchens','Plans'],
  hello:'Hungry, Nina?',metric:{label:'Orders today',value:342,delta:'+12%'},
  series:[18,24,40,36,28,30,46,62,58,44,38,50],
  list:[['Green bowl','Tofu · 520 kcal','$11'],['Ramen','Pork · 680 kcal','$14'],['Poke','Salmon · 490 kcal','$13']],
  kpis:[['Orders','9,840'],['Avg. time','24 min'],['Rating','4.8']],
  side:['Orders','Menu','Couriers','Kitchens','Settings'],features:['30-minute delivery','Local kitchens','No hidden fees'],
  icons:['bag','heart','map','user'],toast:['On the way','Courier is 4 min away'],stories:["Bowls", "Ramen", "Poke", "Vegan", "Sweet"],board:[["New", [["#312 Green bowl × 2", "2 min ago"], ["#313 Ramen", "4 min ago"], ["#314 Poke × 3", "5 min ago"]]], ["Cooking", [["#309 Ramen × 2", "8 min"], ["#310 Vegan box", "6 min"], ["#311 Soup", "3 min"]]], ["On the way", [["#305 Poke", "Courier Max"], ["#306 Bowls × 4", "Courier Ana"], ["#307 Ramen", "Courier Leo"]]]],mix:[["Bowls", 41], ["Ramen", 35], ["Poke", 24]],top:"Popular now",notes:["Warm at your door in under 30 minutes.", "Cooked by kitchens in your neighbourhood.", "The menu price is the price you pay."],quote:["Lunch for the whole team in 25 minutes.", "Nina V.", "Office manager"]},
];

export const findNiche=id=>niches.find(n=>n.id===id)||niches[0];

// Shared builds: /b/<type>-<variant>-<mood>-<niche>/ opens the same mock-up, already built.
export const shareCode=({type,mood,niche},variant)=>`${type}-${variant}-${mood}-${niche}`;
export function parseShare(code=''){
 const [type,v,mood,niche]=String(code).split('-');
 if(!types.some(t=>t.id===type)||!moods.some(m=>m.id===mood)||!niches.some(n=>n.id===niche)||!/^[0-2]$/.test(v||''))return null;
 return {type,mood,niche,variant:+v};
}
export const allShareCodes=()=>types.flatMap(t=>[0,1,2].flatMap(v=>moods.flatMap(m=>niches.map(n=>shareCode({type:t.id,mood:m.id,niche:n.id},v)))));
