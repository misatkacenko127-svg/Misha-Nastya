/**
 * GAME DATA — data-driven levels/chapters for the 2D story game.
 * Add new months here later without touching map-game.js.
 * All photo/video paths point to real files already present in the project.
 */

const GAME_DATA = {
  chapterTitle: 'До нашого назавжди',
  chapterSubtitle: 'Наша історія тільки починається.',

  levels: [
    {
      id: 'august-2025',
      title: 'Серпень 2025',
      subtitle: 'Це тільки початок',
      meetingDialogue: [
        { speaker: 'Міша', text: 'Привіт ❤️ Йдемо трохи погуляємо, а потім на лавочці посидимо.' },
        { speaker: 'Настя', text: 'Давай.' }
      ],
      benchDate: '10 серпня 2025',
      benchDialogue: [
        { speaker: 'Міша', text: 'Давай тікток подивимось?' },
        { speaker: 'Настя', text: 'Давай.' },
        { speaker: 'Настя', text: 'Я тебе кохаю, Міша.' },
        { speaker: 'Міша', text: 'Я тебе кохаю теж, Насте.' },
        { speaker: '', text: 'Нам треба був час, щоб звикнути, проте це був надзвичайно емоційний і крутий місяць, багато нового і незвичного.' },
        { speaker: '', text: 'Відбулась наша перша міні-сварка, і після неї я одразу зрозумів: вибір тебе — це моя найголовніша перемога і успіх!' }
      ],
      memory: {
        id: 'memory-august-2025-01',
        label: 'Зібрати спогад',
        photo: 'momentsaugust-2025/4.jpg',
        caption: 'Наш перший спогад · Серпень 2025'
      },
      statGain: { love: 2, trust: 1, understanding: 1 }
    },
    {
      id: 'september-2025',
      title: 'Вересень 2025',
      subtitle: 'Перша творчість',
      location: 'У Насті компаті вдома',
      greetingDialogue: [
        { speaker: 'Міша', text: 'Привіт, Насте ❤️' },
        { speaker: 'Настя', text: 'Привіт, Мішо!' }
      ],
      questionText: 'Чим будемо займатися?',
      choices: [
        {
          id: 'tiktok-dinner',
          label: '📱 Тікток, а потім вечеря',
          dialogue: [
            { speaker: 'Настя', text: 'Нуу, можемо тікток подивитись трохи, а потім мені треба вечерю йти готувати' },
            { speaker: 'Міша', text: 'Да, без проблем, хороший план.' }
          ],
          caption: '📱 Улюблений TikTok разом...'
        },
        {
          id: 'kms',
          label: '🔥 Жоский КМС',
          dialogue: [
            { speaker: 'Настя', text: 'Жоский КМС.' },
            { speaker: 'Міша', text: 'ДААА, ДУЖЕ ДОВГО НА ЦЕ ЧЕКАВ.' }
          ],
          timeSkipLabel: 'Через 50 хвилин...',
          afterDialogue: [
            { speaker: 'Настя', text: 'Міша, це було просто прекрасно, шедеврально, дякую тобі.' },
            { speaker: 'Міша', text: 'І тобі величезне дякую, було неймовірно.' }
          ]
        }
      ],
      kitchenDialogue: [
        { speaker: 'Міша', text: 'Дякую за святкову вечерю, було дуже смачно.' },
        { speaker: 'Настя', text: 'І тобі дякую, що мені' },
        { speaker: 'Настя', text: 'Так що може в більярд підемо?' },
            { speaker: 'Міша', text: 'З радості.' }
      ],
      endingText: '🎱 Вечір продовжується...',
      memory: {
        id: 'memory-september-2025-01',
        label: 'Вечір у Насті',
        photo: 'images/1year 1.jpg',
        caption: 'Наш вечір · Вересень 2025'
      },
      media: ['September/tiktok.MP4', 'September/football.MOV', 'September/zoo.MOV'],
      statGain: { love: 2, trust: 1, understanding: 1 }
    },
    {
      id: 'october-2025',
      title: 'Жовтень 2025',
      subtitle: 'Класні поїздки',
      location: 'Вдома',
      bedroomIntro: [
        { speaker: '', text: 'Жовтень 2025 · Вдома' }
      ],
      questionText: 'Що будемо робити?',
      choices: [
        {
          id: 'walk',
          label: '🚶 Погуляти / теніс / настільний теніс',
          dialogue: [
            { speaker: 'Настя', text: 'Міша щось скучно, може підемо кудись.' },
            { speaker: 'Міша', text: 'Да, ти права, якось скучно, давай може в теніс, а потім в настільний теніс і купимо ще щось в магазині.' },
            { speaker: 'Настя', text: 'Нууу, хз, можемо в принципі.' },
            { speaker: 'Міша', text: 'Ти не дуже хочеш в теніс?' },
            { speaker: 'Настя', text: 'Ну такоє.' },
            { speaker: 'Міша', text: 'А що ти хочеш?' },
            { speaker: 'Настя', text: 'Ну не знаю, може давай підемо гуляти, а потім по сінабонам і в старбакс німецьку вчити?' },
            { speaker: 'Міша', text: 'Ну в принципі можна, то йдемо?' },
            { speaker: 'Настя', text: 'Ні знаю, хочу вдома залишитись.' },
            { speaker: 'Міша', text: 'То давай залишимося.' },
            { speaker: 'Настя', text: 'НІ, йдемо кудись.' },
            { speaker: 'Міша', text: 'Добре, тоді йдемо погуляємо і там розберемся.' },
            { speaker: 'Настя', text: 'Ну ладно, йдемо.' }
          ],
          endingText: 'Жовтень починається... ♡'
        },
        {
          id: 'pool',
          label: '🏊 Піти в басейн',
          dialogue: [
            { speaker: 'Міша', text: 'Не хочеш піти в басейн зараз?' },
            { speaker: 'Настя', text: 'Та там холодно.' },
            { speaker: 'Міша', text: 'Та в критий, звичайно.' },
            { speaker: 'Настя', text: 'Ааа, ну можна.' },
            { speaker: 'Міша', text: 'Можемо повторити нашу першу зустріч в басейні, як ми трохи стидались і тд.' },
            { speaker: 'Настя', text: 'Ооо, вау, класна ідея.' }
          ]
        },
        {
          id: 'movie',
          label: '🎬 Подивитися фільм',
          dialogue: [
            { speaker: 'Настя', text: 'Що будемо робити?' },
            { speaker: 'Міша', text: 'Давай фільм подивимось.' },
            { speaker: 'Настя', text: 'Ммм, просто подивимось, чи як минулий раз?))' },
            { speaker: 'Міша', text: 'Як в минулий раз.' }
          ]
        }
      ],
      poolDialogue: [
        { speaker: 'Настя', text: 'Дякую, що запросив, було дійсно дуже класно і мило.' },
        { speaker: 'Міша', text: 'Будь ласочка, моє коханнячко, і тобі дуже-дуже дякую за все.' }
      ],
      poolQuestionText: 'Як будемо переодягатися?',
      poolChoices: [
        { id: 'separate', label: 'У різних роздягалках' },
        { id: 'together', label: 'В одній' }
      ],
      poolSeparateEnding: 'Ще один прекрасний день разом. ♡',
      poolTogetherDialogue: [
        { speaker: 'Настя', text: 'Дякую, це дуже класно і мені хотілося б ще.' },
        { speaker: 'Міша', text: 'І тобі дякую, обов\'язково повторимо!' }
      ],
      movieAfter3Min: '3 хвилини потому...',
      movieAfter30Min: '30 хвилин потому...',
      movieDialogue: [
        { speaker: 'Настя', text: 'Дяк, було круто.' },
        { speaker: 'Міша', text: 'Обожжнюю тебе.' },
            { speaker: 'Настя', text: 'І я тебе, добре, що ми нікуди не пішли.' },
        { speaker: 'Міша', text: 'Даааа, згоден.' }
      ],
      memory: {
        id: 'memory-october-2025-01',
        label: 'Наш жовтень',
        video: 'october/cute.mp4',
        caption: 'Наш жовтень · 2025'
      },
      statGain: { love: 2, trust: 1, understanding: 1 }
    },
    {
      id: 'november-2025',
      title: 'Листопад 2025',
      subtitle: 'Коли надворі холодно, а з тобою тепло',
      location: 'Вдома',
      bedroomIntro: [
        { speaker: '', text: 'Листопад 2025 · Вдома' }
      ],
      firstQuestionText: 'Настя: «Мішааа, ну що будемо сьогодні робити?»',
      firstChoices: [
        {
          id: 'stay',
          label: '🏠 Залишитися вдома',
          dialogue: [
            { speaker: 'Міша', text: 'Не знаююю... Я хочу з тобою кудись, але на вулиці взагалі капець.' },
            { speaker: 'Настя', text: 'А давай все одно щось придумаємо.' },
            { speaker: 'Міша', text: 'Неважливо куди, головне щоб з тобою.' },
            { speaker: 'Настя', text: 'Ой, який солодкий.' },
            { speaker: 'Міша', text: 'А я що зроблю, якщо в мене ти така?' }
          ]
        },
        {
          id: 'walk',
          label: '☕ Піти гуляти',
          dialogue: [
            { speaker: 'Настя', text: 'Я хочу кудись піти.' },
            { speaker: 'Міша', text: 'Зараз?' },
            { speaker: 'Настя', text: 'Ага.' },
            { speaker: 'Міша', text: 'А там дощ.' },
            { speaker: 'Настя', text: 'Ну і що?' },
            { speaker: 'Міша', text: 'Ну тоді ходімо, моє щастячко.' }
          ]
        },
        {
          id: 'evening',
          label: '🎬 Влаштувати наш вечір',
          dialogue: [
            { speaker: 'Настя', text: 'Може просто зробимо наш вечір?' },
            { speaker: 'Міша', text: 'Це як?' },
            { speaker: 'Настя', text: 'Ти, я, плед, фільм і щось смачненьке.' },
            { speaker: 'Міша', text: 'Дадада, хоть б не фейк не фейк.' },
            { speaker: 'Настя', text: 'Ахахах.' }
          ]
        }
      ],
      stayFoodQuestionText: 'Що приготуємо?',
      stayFoodChoices: [
        {
          id: 'pasta',
          label: '🍝 Паста',
          dialogue: [
            { speaker: 'Міша', text: 'Ммм, з моїм фірменим соусом?)))' },
            { speaker: 'Настя', text: 'Звичайно))).' }
          ],
          afterDialogue: [
            { speaker: 'Міша', text: 'Ну що, моє щастячко, пробуємо?' },
            { speaker: 'Настя', text: 'Давай.' },
            { speaker: 'Міша', text: 'Ну як?' },
            { speaker: 'Настя', text: 'Дуже смачно.' },
            { speaker: 'Міша', text: 'Я ж казав.' }
          ]
        },
        {
          id: 'pancakes',
          label: '🥞 Млинці',
          dialogue: [
            { speaker: 'Міша', text: 'Я так розумію, з Нутелою, а банан додавати чи ні?)))' },
            { speaker: 'Настя', text: 'Так.' },
            { speaker: 'Міша', text: 'Ммм, а про який банан ти подумала?)' },
            { speaker: 'Настя', text: 'Ах ти сучка..' }
          ],
          bananaQuestionText: 'Банан додавати?',
          bananaChoices: [
            {
              id: 'banana-no',
              label: 'Ні',
              dialogue: [
                { speaker: 'Міша', text: 'Ну і ладно, без банана!' }
              ]
            },
            {
              id: 'banana-yes',
              label: 'Так',
              dialogue: [
                { speaker: 'Настя', text: 'Я інший банан б взяла сьогодні, але ввечері)).' },
                { speaker: 'Міша', text: 'Ммм, ваууу, вже не можу дочекатись!' }
              ]
            }
          ],
          afterDialogue: [
            { speaker: 'Міша', text: 'Ну що, моє щастячко, пробуємо?' },
            { speaker: 'Настя', text: 'Давай.' },
            { speaker: 'Міша', text: 'Ну як?' },
            { speaker: 'Настя', text: 'Дуже смачно.' },
            { speaker: 'Міша', text: 'Я ж казав.' }
          ]
        },
        {
          id: 'pizza',
          label: '🍕 Піца',
          dialogue: [
            { speaker: 'Міша', text: 'Може замовимо краще і підемо поваляємось?' },
            { speaker: 'Настя', text: 'Да, давай краще так.' }
          ],
          afterDialogue: [
            { speaker: '', text: 'Замовили піцу. Час минає. Піца приїхала. Повернулись до ліжка і розслабились разом.' },
            { speaker: 'Настя', text: 'Піца, універі ти.' },
            { speaker: 'Міша', text: 'Дааа, взагалі вайб.' },
            { speaker: 'Настя', text: 'Тааак.' }
          ]
        }
      ],
      cozyEveningDialogue: [
        { speaker: 'Настя', text: 'Мені так подобається, коли ми отак просто разом.' },
        { speaker: 'Міша', text: 'Мені теж.' },
        { speaker: 'Настя', text: 'Навіть нічого особливого не робимо.' },
        { speaker: 'Міша', text: 'А мені все одно дуже добре.' },
        { speaker: 'Настя', text: 'Чому?' },
        { speaker: 'Міша', text: 'Бо ти поруч, моє щастячко.' },
        { speaker: 'Настя', text: 'Міш, можна просто так полежати?' },
        { speaker: 'Міша', text: 'Можна.' },
        { speaker: 'Настя', text: 'І нічого не робити?' },
        { speaker: 'Міша', text: 'Можна навіть усе життя.' },
        { speaker: 'Настя', text: 'Масінькій мій.' },
        { speaker: 'Міша', text: 'Нііі, це ти в мене масінька.' },
        { speaker: 'Настя', text: 'Ні ти))' },
        { speaker: 'Міша', text: 'Ой всьооо.' }
      ],
      eveningQuestionText: 'Що будемо робити далі?',
      eveningChoices: [
        {
          id: 'film',
          label: '🎬 Фільм',
          dialogue: [
            { speaker: 'Настя', text: 'Що будемо дивитися?' },
            { speaker: 'Міша', text: 'Обирай ти.' },
            { speaker: 'Настя', text: 'А якщо я виберу щось дуже романтичне?' },
            { speaker: 'Міша', text: 'Тоді буду дивитися на тебе більше, ніж на фільм.' },
            { speaker: 'Настя', text: 'Ну все, тепер точно вибираю романтику.' }
          ]
        },
        {
          id: 'music',
          label: '🎵 Наша музика',
          dialogue: [
            { speaker: 'Настя', text: 'Міш, можна просто так полежати?' },
            { speaker: 'Міша', text: 'Можна.' },
            { speaker: 'Настя', text: 'І нічого не робити?' },
            { speaker: 'Міша', text: 'Можна навіть усе життя.' },
            { speaker: 'Настя', text: 'Масінькій мій.' },
            { speaker: 'Міша', text: 'Нііі, це ти в мене масінька.' },
            { speaker: 'Настя', text: 'Ні ти))' },
            { speaker: 'Міша', text: 'Ой всьооо.' }
          ]
        },
        {
          id: 'talk',
          label: '💬 Просто поговорити',
          dialogue: [
            { speaker: 'Настя', text: 'Міш, а знаєш, що я люблю найбільше?' },
            { speaker: 'Міша', text: 'Що?' },
            { speaker: 'Настя', text: 'Коли ми можемо говорити про все.' },
            { speaker: 'Настя', text: 'Незважаючи на зміст, наскільки це може тупо прозвучати чи ще щось, але я реально тобі повністю можу довіритись, це так класно!' },
            { speaker: 'Міша', text: 'Ммм, буууба, це дужедуже міло, мені дуже приємно від твоїх слів, і я тобі дуже вдячний, що можу з тобою про все поговорити!' }
          ]
        }
      ],
      walkIntroDialogue: [
        { speaker: 'Настя', text: 'Я хочу кудись піти.' },
        { speaker: 'Міша', text: 'Зараз?' },
        { speaker: 'Настя', text: 'Ага.' },
        { speaker: 'Міша', text: 'А там дощ.' },
        { speaker: 'Настя', text: 'Ну і що?' },
        { speaker: 'Міша', text: 'Ну тоді ходімо, моє щастячко.' },
        { speaker: '', text: 'Йдуть під одним парасолею.' },
        { speaker: 'Настя', text: 'Мені холодно.' },
        { speaker: 'Міша', text: 'Іди сюди.' },
        { speaker: '', text: 'Міша обіймає Настю.' },
        { speaker: 'Настя', text: 'Ось так вже краще.' },
        { speaker: 'Міша', text: 'Я ж казав — зі мною тепліше.' },
        { speaker: 'Настя', text: 'Дякую, мій король!' },
        { speaker: 'Міша', text: 'Будь ласочка моя кіця.' }
      ],
      walkQuestionText: 'Куди підемо?',
      walkChoices: [
        {
          id: 'starbucks',
          label: '☕ Starbucks',
          dialogue: [
            { speaker: 'Настя', text: 'Блін, тут так затишно.' },
            { speaker: 'Міша', text: 'Ага.' },
            { speaker: 'Настя', text: 'Мені подобається.' },
            { speaker: 'Міша', text: 'Даа, давай, звичайно.' }
          ]
        },
        {
          id: 'cinnabon',
          label: '🍰 Cinnabon',
          dialogue: [
            { speaker: 'Настя', text: 'Ооо, тут є дубайський шоколад, хачу хачу хачу.' },
            { speaker: 'Міша', text: 'Добре, бери моє коханнячко, навіть 2, бо я теж буду, бо я знаю, що ти не будеш їсти якщо я не буду!' },
            { speaker: 'Настя', text: 'Ммм, кооть, це дуже міло і приємно.' }
          ]
        },
        {
          id: 'just-walk',
          label: '🌧️ Просто гуляти',
          dialogue: [
            { speaker: 'Настя', text: 'А куди ми взагалі йдемо?' },
            { speaker: 'Міша', text: 'Не знаю.' },
            { speaker: 'Настя', text: 'Ти навіть не знаєш?' },
            { speaker: 'Міша', text: 'Ні.' },
            { speaker: '', text: 'Але мені подобається.' },
            { speaker: 'Настя', text: 'Чому?' },
            { speaker: 'Міша', text: 'Бо я йду з тобою.' }
          ]
        }
      ],
      ourEveningDialogue: [
        { speaker: 'Настя', text: 'Може просто зробимо наш вечір?' },
        { speaker: 'Міша', text: 'Це як?' },
        { speaker: 'Настя', text: 'Ти, я, плед, фільм і щось смачненьке.' },
        { speaker: 'Міша', text: 'Дадада, хоть б не фейк не фейк.' },
        { speaker: 'Настя', text: 'Ахахах.' }
      ],
      healthIntroDialogue: [
        { speaker: '', text: 'Наступного дня...' },
        { speaker: 'Настя', text: 'Мішааа...' },
        { speaker: 'Настя', text: 'Ну як ти, моє сонечко?' },
        { speaker: 'Міша', text: 'Якось взагалі не дуже.' },
        { speaker: 'Настя', text: 'Так. Все.' },
        { speaker: 'Настя', text: 'Тепер я головна.' },
            { speaker: 'Міша', text: 'Дя, я тобі довіряю моя доросла кохана.' },
        { speaker: 'Настя', text: 'Буууба, зараз вилікуємо!' }
      ],
      healthQuestionText: 'Що зробимо?',
      healthChoices: [
        {
          id: 'food',
          label: '🥣 Приготувати щось смачненьке',
          dialogue: [
            { speaker: 'Настя', text: 'Їсти будеш.' },
            { speaker: 'Міша', text: 'Не хочу.' },
            { speaker: 'Настя', text: 'Будеш.' },
            { speaker: 'Міша', text: 'А якщо не буду?' },
            { speaker: 'Настя', text: 'Будеш.' },
            { speaker: 'Міша', text: 'Ой всьо, добре добре.' },
            { speaker: 'Настя', text: 'Ну вот так б зразу.' }
          ]
        },
        {
          id: 'tea',
          label: '🍵 Зробити чай',
          dialogue: [
            { speaker: 'Настя', text: 'Тримай, моє сонечко.' },
            { speaker: 'Міша', text: 'Дякую, кицю.' },
            { speaker: 'Настя', text: 'Пий.' },
            { speaker: 'Міша', text: 'Так точно.' },
            { speaker: 'Настя', text: 'І одужуй.' },
            { speaker: 'Міша', text: 'Якщо ти будеш поруч, швидше одужаю.' }
          ]
        },
        {
          id: 'stay',
          label: '🛋️ Просто залишитися поруч',
          dialogue: [
            { speaker: 'Міша', text: 'Ти можеш іти, якщо хочеш.' },
            { speaker: 'Настя', text: 'Не хочу.' },
            { speaker: 'Міша', text: 'Чому?' },
            { speaker: 'Настя', text: 'Бо хочу бути біля тебе.' },
            { speaker: 'Міша', text: 'Я тебе дуже сильно кохаю.' },
            { speaker: 'Настя', text: 'І я тебе дуже сильно кохаю.' }
          ]
        }
      ],
      futureIntroDialogue: [
        { speaker: '', text: 'Вечір...' },
        { speaker: 'Настя', text: 'Ну що, мій хворенький, вже краще?' },
        { speaker: 'Міша', text: 'Трошки.' },
        { speaker: 'Настя', text: 'Тоді можна дещо запитати?' },
        { speaker: 'Міша', text: 'Можна.' },
        { speaker: 'Настя', text: 'А ти уявляв наше майбутнє?' },
        { speaker: 'Міша', text: 'З тобою?' },
        { speaker: 'Настя', text: 'Ага.' },
        { speaker: 'Міша', text: 'Постійно.' }
      ],
      futureQuestionText: 'Про що мрієш?',
      futureChoices: [
        {
          id: 'home',
          label: '🏠 Наш дім',
          dialogue: [
            { speaker: 'Міша', text: 'Я хочу наш дім.' },
            { speaker: 'Настя', text: 'Який?' },
            { speaker: 'Міша', text: 'Не знаю.' },
            { speaker: 'Міша', text: 'Але щоб ти була там.' },
            { speaker: 'Настя', text: 'Тоді я вже хочу такий дім.' }
          ]
        },
        {
          id: 'travel',
          label: '✈️ Наші подорожі',
          dialogue: [
            { speaker: 'Міша', text: 'Я хочу показати тобі весь світ.' },
            { speaker: 'Настя', text: 'Весь?' },
            { speaker: 'Міша', text: 'Весь.' },
            { speaker: 'Настя', text: 'Тоді готуйся багато зі мною літати.' },
            { speaker: 'Міша', text: 'Готовий, моє коханнячко.' }
          ]
        },
        {
          id: 'future',
          label: '🐶 Наше майбутнє',
          dialogue: [
            { speaker: 'Міша', text: 'Я просто хочу бути разом з тобою назавжди!' },
            { speaker: 'Настя', text: 'Коооть, це дуууже міло!' }
          ]
        },
        {
          id: 'together',
          label: '❤️ Просто бути разом',
          dialogue: [
            { speaker: 'Міша', text: 'Якщо чесно...' },
            { speaker: 'Настя', text: 'Ммм?' },
            { speaker: 'Міша', text: 'Мені навіть не треба знати, що буде через десять років.' },
            { speaker: 'Міша', text: 'Я просто хочу, щоб там була ти.' },
            { speaker: 'Настя', text: 'Тоді я теж хочу бути там.' }
          ]
        }
      ],
      finalDialogue: [
        { speaker: 'Настя', text: 'Міш?' },
        { speaker: 'Міша', text: 'Ммм?' },
        { speaker: 'Настя', text: 'Я рада, що саме ти.' },
        { speaker: 'Міша', text: 'А я радий, що саме ти мене вибрала.' },
        { speaker: 'Настя', text: 'Я б знову тебе вибрала.' },
        { speaker: 'Міша', text: 'А я б знову в тебе закохався.' },
        { speaker: 'Настя', text: 'Мій ❤️' },
        { speaker: 'Міша', text: 'Моя ❤️' }
      ],
      finalLines: [
        'Листопад 2025',
        'На вулиці ставало все холодніше...',
        'А нам разом — все тепліше.'
      ],
      memory: {
        id: 'memory-november-2025-01',
        label: 'Листопад разом',
        video: 'November/Milota.MP4',
        caption: 'Наш листопад · 2025'
      },
      statGain: { love: 3, trust: 2, understanding: 2 }
    },
    {
      id: 'december-2025',
      title: 'Грудень 2025',
      subtitle: 'Новий прекрасний досвід',
      location: 'Вдома',
      introDialogue: [
        { speaker: 'Настя', text: 'Ти в мене така мілашка, хочу тебе обійняти і зацілувати.' },
        { speaker: 'Міша', text: 'Да моє коханнячко.' },
        { speaker: 'Настя', text: 'Іноді мені здається, що мені взагалі більше нічого не треба.' },
        { speaker: 'Міша', text: 'Моє щастячко...' },
        { speaker: 'Настя', text: 'Іди сюди ❤️' },
        { speaker: 'Міша', text: 'Іду, моя киця.' }
      ],
      suggestionDialogue: [
        { speaker: 'Настя', text: 'Кооть, а давай сьогодні зробимо щось таке, щоб потім згадувати?' },
        { speaker: 'Міша', text: 'Ооо, давай. А що саме?' }
      ],
      questionText: 'Що зробимо?',
      choices: [
        {
          id: 'tree',
          label: '🎄 Зробимо нашу новорічну кімнату',
          dialogue: [
            { speaker: 'Настя', text: 'Міш, ця гірлянда сюди.' },
            { speaker: 'Міша', text: 'Сюди?' },
            { speaker: 'Настя', text: 'Ні, трохи лівіше.' },
            { speaker: 'Міша', text: 'Так?' },
            { speaker: 'Настя', text: 'Ще правіше.' },
            { speaker: 'Міша', text: 'Ти знущаєшся?))' },
            { speaker: 'Настя', text: 'Ні, я просто хочу, щоб було ідеально.' },
            { speaker: 'Міша', text: 'Як ти?' },
            { speaker: 'Настя', text: 'Ммм...' },
            { speaker: 'Міша', text: 'Ну а що?' },
            { speaker: 'Настя', text: 'Ти в мене сьогодні особливо мілий.' }
          ],
          afterDialogue: [
            { speaker: '', text: '✨ Маленьке зимове щастя' }
          ]
        },
        {
          id: 'icecream',
          label: '🍦 Морозиво',
          dialogue: [
            { speaker: 'Настя', text: 'Коть, так холодно дуже морозиво їсти.' },
            { speaker: 'Міша', text: 'Та нічого страшного, ти в мене дуже гаряча і зможеш зігріти)))' },
            { speaker: 'Настя', text: 'Ммм, коть, це дуже міло, але тобі ні можна, ти недавно хворів сильно.' },
            { speaker: 'Міша', text: 'Коооть, да, але це було 2 тижні тому.' },
            { speaker: 'Настя', text: 'Ні, не можна, я тобі зроблю чайок з млинцями, а собі морозиво гигиги.' },
            { speaker: 'Міша', text: 'Ой всьо ну і ладно!' }
          ],
          afterDialogue: [
            { speaker: '', text: '🍦 Теплий чай з млинцями — краще за морозиво.' }
          ]
        },
        {
          id: 'letters',
          label: '💌 Напишемо листи одне одному',
          dialogue: [
            { speaker: 'Міша', text: 'А давай кожен напише іншому маленький лист.' },
            { speaker: 'Настя', text: 'А потім прочитаємо?' },
            { speaker: 'Міша', text: 'Ні.' },
            { speaker: 'Настя', text: 'А коли?' },
            { speaker: 'Міша', text: 'Через рік.' },
            { speaker: 'Настя', text: 'Оооо...' },
            { speaker: 'Міша', text: 'І подивимось, чи змінилось щось.' },
            { speaker: 'Настя', text: 'Кооть, це дуууже міло.' }
          ],
          letterQuestionText: 'Що напишеш?',
          letterChoices: [
            {
              id: 'thank-you',
              label: '«Дякую, що ти в мене є.»',
              dialogue: [
                { speaker: 'Міша', text: 'Дякую, що ти в мене є.' }
              ]
            },
            {
              id: 'many-years',
              label: '«Я хочу ще багато років поруч з тобою.»',
              dialogue: [
                { speaker: 'Міша', text: 'Я хочу ще багато років поруч з тобою.' }
              ]
            },
            {
              id: 'remember',
              label: '«Я хочу пам\'ятати кожен наш момент.»',
              dialogue: [
                { speaker: 'Міша', text: 'Я хочу пам\'ятати кожен наш момент.' }
              ]
            }
          ],
          memory: {
            id: 'memory-december-2025-letter',
            label: 'Лист для Насті',
            photo: 'december/happy.jpg',
            caption: 'Наш лист · Грудень 2025'
          },
          afterDialogue: [
            { speaker: '', text: 'Лист збережено як спогад цього грудня.' }
          ]
        }
      ],
      finalDialogue: [
        { speaker: 'Настя', text: 'Міш...' },
        { speaker: 'Міша', text: 'Да моє коханнячко?' },
        { speaker: 'Настя', text: 'Мені так подобається цей грудень.' },
        { speaker: 'Міша', text: 'Мені теж.' },
        { speaker: 'Настя', text: 'Чому?' },
        { speaker: 'Міша', text: 'Бо він наш.' },
        { speaker: 'Настя', text: 'Ти в мене така мілашка, хочу тебе обійняти і зацілувати.' },
        { speaker: 'Міша', text: 'Да моє коханнячко.' },
        { speaker: 'Настя', text: 'Можна я дещо скажу?' },
        { speaker: 'Міша', text: 'Звичайно.' },
        { speaker: 'Настя', text: 'Я хочу, щоб наступний рік був таким самим. Тільки щоб нас було ще більше.' },
        { speaker: 'Міша', text: 'Буде.' },
        { speaker: 'Настя', text: 'Обіцяєш?' },
        { speaker: 'Міша', text: 'Обіцяю.' }
      ],
      finalLines: [
        'Ще один місяць нашої історії завершено.',
        'А попереду — новий рік, нові моменти і ще більше нас.'
      ],
      memory: {
        id: 'memory-december-2025-01',
        label: 'Грудень разом',
        photo: 'december/happy.jpg',
        caption: 'Наш грудень · 2025'
      },
      statGain: { love: 3, trust: 2, understanding: 2 }
    },
    {
      id: 'january-2026',
      title: 'Січень 2026',
      subtitle: 'Новий рік — нові стосунки',
      location: 'Вдома',
      introDialogue: [
        { speaker: 'Настя', text: 'Ти в мене така мілашка, хочу тебе обійняти і зацілувати.' },
        { speaker: 'Міша', text: 'Да моє коханнячко.' },
        { speaker: 'Настя', text: 'Іноді мені здається, що мені взагалі більше нічого не треба.' },
        { speaker: 'Міша', text: 'Моє щастячко...' },
        { speaker: 'Настя', text: 'Іди сюди ❤️' },
        { speaker: 'Міша', text: 'Іду, моя киця.' }
      ],
      timeSkipText: '50 хвилин потому...',
      afterSkipDialogue: [
        { speaker: 'Міша', text: 'А що далі робити будемо?' }
      ],
      questionText: 'Що будемо робити?',
      choices: [
        {
          id: 'game',
          label: '🎮 Пограти разом',
          dialogue: [
            { speaker: 'Настя', text: 'Я тебе зараз рознесу.' },
            { speaker: 'Міша', text: 'Ти впевнена?' },
            { speaker: 'Настя', text: 'На всі сто.' }
          ],
          winMisha: [
            { speaker: 'Настя', text: 'Ніііі, нечесно!' },
            { speaker: 'Міша', text: 'Ой всьооо.' },
            { speaker: 'Настя', text: 'Зате твоя сучка))' }
          ],
          winNastya: [
            { speaker: 'Настя', text: 'ХА! Я ж казала!' },
            { speaker: 'Міша', text: 'Ой всьооо.' },
            { speaker: 'Настя', text: 'Дяяя.' }
          ]
        },
        {
          id: 'photos',
          label: '📷 Передивитися старі фото',
          dialogue: [
            { speaker: 'Настя', text: 'Кооть, давай переглянемо старі фотки.' },
            { speaker: 'Міша', text: 'Давай.' }
          ],
          photoReels: [
            {
              photo: 'momentsaugust-2025/4.jpg',
              caption: 'Липень 2025'
            },
            {
              photo: 'momentsaugust-2025/7.jpg',
              caption: 'Серпень 2025'
            },
            {
              photo: 'images/1year 1.jpg',
              caption: 'Вересень 2025'
            },
            {
              photo: 'images/найулюбленіша.jpg',
              caption: 'Жовтень 2025'
            },
            {
              photo: 'images/найпрекрасніша.jpg',
              caption: 'Листопад 2025'
            },
            {
              photo: 'december/happy.jpg',
              caption: 'Грудень 2025'
            }
          ],
          photoComments: [
            { speaker: 'Настя', text: 'Кооть, дивись, які ми тут маленькі.' },
            { speaker: 'Міша', text: 'Ага.' },
            { speaker: 'Настя', text: 'А це пам\'ятаєш?' },
            { speaker: 'Міша', text: 'Звичайно.' },
            { speaker: 'Настя', text: 'Ти реально все пам\'ятаєш?' },
            { speaker: 'Міша', text: 'Я з тобою все пам\'ятаю.' }
          ],
          memory: {
            id: 'memory-january-2026-photos',
            label: 'Старі фотки',
            photo: 'images/1year.jpg',
            caption: 'Наші спогади · Січень 2026'
          }
        },
        {
          id: 'talk',
          label: '💭 Поговорити про наше майбутнє',
          dialogue: [
            { speaker: 'Настя', text: 'Міш, а ти коли-небудь думав, якими ми будемо через декілька років?' },
            { speaker: 'Міша', text: 'Звичайно.' },
            { speaker: 'Настя', text: 'І якими?' },
            { speaker: 'Міша', text: 'Не знаю точно.' },
            { speaker: 'Настя', text: 'А я знаю.' },
            { speaker: 'Міша', text: 'Ну?' },
            { speaker: 'Настя', text: 'Разом.' },
            { speaker: 'Міша', text: 'Ммм.' },
            { speaker: 'Настя', text: 'І мені цього достатньо.' },
            { speaker: 'Міша', text: 'Мені теж.' }
          ],
          futureQuestionText: 'Що для тебе найголовніше?',
          futureChoices: [
            {
              id: 'home',
              label: '🏠 Свій дім',
              dialogue: [
                { speaker: 'Настя', text: 'Оце мені подобається.' },
                { speaker: 'Міша', text: 'Що саме?' },
                { speaker: 'Настя', text: 'Що я хочу все це, але тільки з тобою.' }
              ]
            },
            {
              id: 'travel',
              label: '✈️ Подорожі',
              dialogue: [
                { speaker: 'Настя', text: 'Оце мені подобається.' },
                { speaker: 'Міша', text: 'Що саме?' },
                { speaker: 'Настя', text: 'Що я хочу все це, але тільки з тобою.' }
              ]
            },
            {
              id: 'life',
              label: '❤️ Життя разом',
              dialogue: [
                { speaker: 'Настя', text: 'Оце мені подобається.' },
                { speaker: 'Міша', text: 'Що саме?' },
                { speaker: 'Настя', text: 'Що я хочу все це, але тільки з тобою.' }
              ]
            },
            {
              id: 'all',
              label: '♾️ Все одразу',
              dialogue: [
                { speaker: 'Настя', text: 'Оце мені подобається.' },
                { speaker: 'Міша', text: 'Що саме?' },
                { speaker: 'Настя', text: 'Що я хочу все це, але тільки з тобою.' }
              ]
            }
          ]
        }
      ],
      finalDialogue: [
        { speaker: 'Настя', text: 'Знаєш, я зрозуміла одну штуку.' },
        { speaker: 'Міша', text: 'Яку?' },
        { speaker: 'Настя', text: 'Раніше я думала, що щастя — це коли постійно відбувається щось круте.' },
        { speaker: 'Міша', text: 'А зараз?' },
        { speaker: 'Настя', text: 'А зараз мені здається, що щастя — це просто прокинутися і знати, що ти в мене є.' },
        { speaker: 'Міша', text: 'Буууба...' },
        { speaker: 'Настя', text: 'Що?))' },
        { speaker: 'Міша', text: 'Ти в мене така мілашка.' },
        { speaker: 'Настя', text: 'А ти моє щастячко.' },
        { speaker: 'Міша', text: 'Я тебе дуже сильно кохаю.' },
        { speaker: 'Настя', text: 'І я тебе дуже сильно кохаю.' }
      ],
      finalLines: [
        'Січень 2026',
        'Новий рік почався.\nА наше "ми" залишилось таким самим. ❤️'
      ],
      memory: {
        id: 'memory-january-2026-01',
        label: 'Січень разом',
        photo: 'january/amzing.jpg',
        caption: 'Наш січень · 2026'
      },
      statGain: { love: 3, trust: 2, understanding: 2 }
    }
  ],

  // Maps a playable month id to its Phaser scene key.
  monthScenes: {
    'august-2025': 'August2025Scene',
    'september-2025': 'September2025Scene',
    'october-2025': 'October2025Scene',
    'november-2025': 'November2025Scene',
    'december-2025': 'December2025Scene',
    'january-2026': 'January2025Scene'
  },

  // Every month is listed for the world/chapter map; the playable ones are in `levels`.
  monthRoadmap: [
    { id: 'august-2025', title: 'Серпень 2025', subtitle: 'Це тільки початок', status: 'playable' },
    { id: 'september-2025', title: 'Вересень 2025', subtitle: 'Перша творчість', status: 'playable' },
    { id: 'october-2025', title: 'Жовтень 2025', subtitle: 'Класні поїздки', status: 'playable' },
    { id: 'november-2025', title: 'Листопад 2025', subtitle: 'Справжнє доросле кохання', status: 'playable' },
    { id: 'december-2025', title: 'Грудень 2025', subtitle: 'Новий прекрасний досвід', status: 'playable' },
    { id: 'january-2026', title: 'Січень 2026', subtitle: 'Новий рік — нові стосунки', status: 'playable' },
    { id: 'february-2026', title: 'Лютий 2026', subtitle: 'Романтика', status: 'building' },
    { id: 'march-2026', title: 'Березень 2026', subtitle: 'Нарешті весна', status: 'building' },
    { id: 'april-2026', title: 'Квітень 2026', subtitle: 'Відстань', status: 'building' },
    { id: 'may-2026', title: 'Травень 2026', subtitle: 'Перший відпочинок', status: 'building' },
    { id: 'june-2026', title: 'Червень 2026', subtitle: 'НМТ', status: 'building' },
    { id: 'july-2026', title: 'Липень 2026', subtitle: 'Твій день народження', status: 'building' },
    { id: 'august-2026', title: 'Серпень 2026', subtitle: 'Наш рік стосунків', status: 'building' }
  ],

  finalArc: {
    destination: '💍 Наше майбутнє',
    lines: [
      'Це не кінець.',
      'Це тільки перший розділ.',
      'Далі ми будемо писати нашу історію разом.',
      'Міша ❤️ Настя',
      '10.08.2025 — ∞'
    ]
  }
};