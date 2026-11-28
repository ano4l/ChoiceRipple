/* ChoiceLab — Faith and Spiritual Growth: 16 scenarios in four topics.
   Faith-based practice that families, churches and schools can choose to assign.
   Same shape as the scenarios in data.js; loaded after it. */
CRData.add([
  /* ───────── Fear and trusting God ───────── */
  {
    id: 'surgery', topic: 'trust', title: 'The night before surgery', place: 'Your bedroom · late at night',
    text: 'Grandpa Samuel has heart surgery in the morning. The house is quiet, but your chest feels tight and your mind keeps racing. Down the hall, you can see the light under Mom’s door.',
    ask: 'It’s late and you can’t sleep. What do you do?',
    alt: 'In a dark bedroom at night, you sit hugging your arms and looking worried.',
    talk: 'When you are scared for someone you love, who can you tell? What would you want to say to God about it?',
    adult: 'mom',
    scene: { bg: 'room', me: ['worried', 'hug'], them: [] },
    choices: [
      { id: 'search', kind: 'risky', act: 'phone', label: 'Look up everything that can go wrong in heart surgery on your phone',
        impact: 'Wanting to know more makes sense. But late-night searching mostly finds the scariest stories, not the facts about Grandpa. Your mind gets more pictures to worry about, and sleep gets even further away.',
        next: 'Put the phone down and take your questions to Mom. She knows what the doctors actually said about Grandpa.',
        close: 'Scary questions are better asked to a person than a screen.' },
      { id: 'mom', kind: 'strong', act: 'tell', label: 'Knock on Mom’s door, say, “I’m scared about Grandpa,” and ask to pray together',
        impact: 'Saying it out loud lets some of the weight out. Mom can tell you what the doctors said, and praying together reminds you that neither of you is carrying this alone. The fear may not vanish, but it gets smaller when it’s shared.',
        next: 'Tomorrow, ask Mom when you will hear news. You could also make Grandpa a card, so your care has somewhere to go.',
        close: 'You can be scared and still trust. God is with you, even here.' },
      { id: 'alone', kind: 'mixed', act: 'pray', label: 'Whisper one quick prayer, then lie there telling yourself you’re fine',
        impact: 'Praying is a real way to bring your fear to God, and that counts. But telling yourself you’re fine doesn’t make the tight feeling leave. Keeping it all inside usually means a long night alone with it.',
        next: 'Keep the prayer honest, like “God, I’m really scared.” Then let Mom know too. You don’t have to pick one.',
        close: 'God can handle your honest feelings. So can the people who love you.' }
    ]
  },
  {
    id: 'newschool', topic: 'trust', title: 'First day, new school', place: 'School gate · first morning',
    text: 'Your family moved over the summer. Now Dad’s car is stopped at the gate of a school where you know nobody. Your stomach flips. Dad asks, “Ready?” A girl named Thandiwe walks past and gives a small wave.',
    ask: 'The bell rings in five minutes. What do you do?',
    alt: 'At a school gate, you stand nervous and tense beside your dad while a girl smiles and waves.',
    talk: 'What helps you take a first step when you feel scared? Where have you felt God with you in a new place?',
    adult: 'dad',
    scene: { bg: 'gate', me: ['nervous', 'tense'], them: [['dad', 'caring', 'comfort'], ['k5', 'smile', 'wave']] },
    choices: [
      { id: 'fine', kind: 'mixed', act: 'ignore', label: 'Tell Dad, “I’m fine,” and walk in with your head down',
        impact: 'You got out of the car, and that takes courage. But “I’m fine” leaves Dad guessing, and a head-down walk makes it hard for anyone to say hi. You end up carrying the nerves by yourself.',
        next: 'Try telling Dad one true thing, like “I’m nervous.” Then look up for one friendly face, like Thandiwe’s.',
        close: 'Brave doesn’t mean not scared. It means going in anyway, with help.' },
      { id: 'step', kind: 'strong', act: 'pray', to: 0, label: 'Tell Dad you’re nervous, pray a short prayer together, then wave back at Thandiwe',
        impact: 'Naming the fear lets Dad encourage you, and a short prayer reminds you that you aren’t walking in alone. Waving back is a small step, but it gives the day one friendly start.',
        next: 'Pick one small goal for today, like learning two names. Tonight, tell Dad how it went, the good parts and the hard parts.',
        close: 'God goes with you into new places.' },
      { id: 'sick', kind: 'risky', act: 'lie', label: 'Tell Dad your stomach hurts so he will take you home',
        impact: 'Your stomach really does feel bad, so this is tempting. But going home doesn’t make the first day go away. It moves it to tomorrow, with one more day of dread added on, and Dad doesn’t learn what’s really wrong.',
        next: 'Tell Dad the real reason: “I’m scared I won’t know anyone.” He can help you plan the first ten minutes.',
        close: 'The first step is usually the hardest one.' }
    ]
  },
  {
    id: 'storm', topic: 'trust', title: 'When the lights go out', place: 'Grandma’s house · a stormy night',
    text: 'Thunder shakes the windows at Grandma’s house, and then the power goes out. Your little brother Eli grabs your arm and whispers, “I’m scared.” Your own heart is pounding. Grandma is in the kitchen.',
    ask: 'It’s dark and Eli is holding on. What now?',
    alt: 'In a dark living room during a storm, you look scared while your little brother huddles close.',
    talk: 'What helps you feel safe when something is loud or scary? How can you help someone younger feel safe too?',
    adult: 'grandma',
    scene: { bg: 'home', me: ['scared', 'tense'], them: [['k9', 'scared', 'hug']], extra: 'storm' },
    choices: [
      { id: 'grandma', kind: 'strong', act: 'tell', label: 'Take Eli’s hand, find Grandma, and ask her to pray with you both',
        impact: 'Grandma knows what to do in a storm, like where the flashlight is and where it’s safest to sit. Being together makes the dark feel smaller, and praying gives your fear somewhere to go while the thunder passes.',
        next: 'While you wait, try a short line together: “When I’m afraid, I will trust you.” (Psalm 56:3) Then ask Grandma what the storm plan is.',
        close: 'God is near in the storm, and so are the people who love you.' },
      { id: 'tough', kind: 'risky', act: 'yell', label: 'Snap, “Stop being a baby, it’s just thunder,” and act like you’re fine',
        impact: 'Acting tough hides your own fear for a moment. But Eli learns that being scared gets him snapped at, so he may stop telling you. And you are still scared, just more alone with it.',
        next: 'Try the honest version: “I’m a little scared too. Let’s go find Grandma together.”',
        close: 'Saying “me too” is one of the kindest things you can do.' },
      { id: 'blanket', kind: 'mixed', act: 'pray', to: 0, label: 'Pull a blanket over you both and keep praying for the storm to stop',
        impact: 'Staying close to Eli and praying are both good instincts. But the storm may keep going for a while, and Grandma doesn’t know you two are scared in the dark. Waiting it out alone makes the night feel longer.',
        next: 'Keep praying, and also go get Grandma. You can ask God for courage for right now, not only for the storm to end.',
        close: 'Prayer and asking for help go together.' }
    ]
  },
  {
    id: 'tryout', topic: 'trust', title: 'Still nervous after praying', place: 'Soccer field · tryout day',
    text: 'You prayed about today’s soccer tryout all week. Now your hands are shaking anyway. Your friend Jaylen looks over and says, “You prayed, right? So why are you still nervous?” Coach calls the next group.',
    ask: 'Your group is next. What do you do?',
    alt: 'On a soccer field, you press your hands together and look nervous while a friend shrugs and a coach waits.',
    talk: 'Can you trust God and feel nervous at the same time? What would you say to a friend who feels both?',
    adult: 'coach',
    scene: { bg: 'field', me: ['nervous', 'together'], them: [['k3', 'curious', 'shrug'], ['coach', 'neutral', 'hip']], extra: '?' },
    choices: [
      { id: 'deal', kind: 'mixed', act: 'pray', label: 'Pray, “Please let me make the team,” and decide that will settle it',
        impact: 'Asking God for what you hope for is honest, and praying can steady your breathing. But treating a prayer like a guarantee sets up a hard fall. If the list doesn’t have your name, it can feel like God wasn’t listening.',
        next: 'Add one more line to the prayer: “Help me do my best and be okay either way.” Then go play.',
        close: 'Prayer is a conversation, not a deal.' },
      { id: 'skip', kind: 'risky', act: 'lie', to: 1, label: 'Tell Coach you don’t feel well and sit out the tryout',
        impact: 'Sitting out makes the shaky feeling stop for now. But you never find out what you could have done, and next time the nerves show up, skipping will feel like the only option.',
        next: 'Nervous is allowed. Try three slow breaths, tell Jaylen, “Yeah, I’m nervous,” and take your turn anyway.',
        close: 'You can do things scared.' },
      { id: 'both', kind: 'strong', act: 'calm', label: 'Say, “I prayed and I’m still nervous. Both are true,” then breathe and go',
        impact: 'You told the truth without feeling bad about it. Trusting God doesn’t switch off nerves. It means you don’t face them alone. One slow breath later, you’re on the field giving it a real try.',
        next: 'Whatever the list says, tell someone how it felt, like a parent or Coach. Thank God for the courage, not just the result.',
        close: 'Courage isn’t the absence of nerves. It’s showing up with them.' }
    ]
  },

  /* ───────── Prayer and patience ───────── */
  {
    id: 'unanswered', topic: 'prayer', title: 'Still no answer', place: 'Kitchen table · after dinner',
    text: 'Dad lost his job two months ago. You have prayed every night for him to find a new one. Tonight he closes his laptop and sighs again. Your throat feels tight. Mom is drying dishes nearby.',
    ask: 'Nothing seems to be changing. What do you do?',
    alt: 'At home, you sit with your hands together looking down while your dad holds his head and your mom looks on with care.',
    talk: 'Have you ever prayed for something that didn’t change right away? What did you do with that feeling?',
    adult: 'mom',
    scene: { bg: 'home', me: ['down', 'together'], them: [['dad', 'down', 'headHold'], ['mom', 'caring', 'down']] },
    choices: [
      { id: 'blame', kind: 'risky', act: 'worry', label: 'Decide you must be praying wrong and try harder without telling anyone',
        impact: 'It makes sense to look for a reason. But things staying hard doesn’t mean you prayed badly, and Dad’s job search isn’t yours to fix. Blaming yourself adds a heavy worry on top of a hard season, and nobody knows you’re carrying it.',
        next: 'Tell Mom what you’ve been thinking: “I keep praying and nothing changes. Is it my fault?” Let her answer that.',
        close: 'There’s no wrong way to bring an honest heart to God.' },
      { id: 'stop', kind: 'mixed', act: 'silent', to: 'solo', label: 'Quietly stop praying about it and keep your disappointment to yourself',
        impact: 'Taking a break from something that hurts is understandable, and you aren’t in trouble for feeling let down. But the disappointment stays, and now it has nowhere to go. Mom and Dad can’t help with a feeling they don’t know about.',
        next: 'You can tell God the frustrated part too: “I’m tired of waiting.” Then say the same thing to Mom.',
        close: 'Frustration is allowed in prayer.' },
      { id: 'share', kind: 'strong', act: 'tell', label: 'Tell Mom, “I keep praying for Dad and I’m getting frustrated”',
        impact: 'Now Mom knows what you’ve been carrying, and she can tell you what’s really going on with the job search. Being honest about frustration, with her and with God, keeps you connected instead of stuck alone with it.',
        next: 'Ask if there’s one small thing you can do for Dad this week, like a note or a hug. Keep praying honestly, even the tired prayers.',
        close: 'Waiting is easier when you don’t wait alone.' }
    ]
  },
  {
    id: 'waiting', topic: 'prayer', title: 'Waiting for Biscuit', place: 'Front window · three days later',
    text: 'Your dog Biscuit slipped out the gate three days ago. You have prayed every morning. Now it’s getting dark, and your neighbor Mirae texts, “I think I saw a dog by the creek.” Your heart jumps. Dad is in the garage.',
    ask: 'It’s almost dark outside. What do you do?',
    alt: 'At home in the evening, you hold your phone and look hopeful as a message arrives.',
    talk: 'When you are waiting for news, what helps the time pass? How can praying and doing your part work together?',
    adult: 'dad',
    scene: { bg: 'home', me: ['hopeful', 'phone', 'phone'], them: [], extra: 'chat' },
    choices: [
      { id: 'dad', kind: 'strong', act: 'tell', label: 'Run to Dad, show him the text, and ask to go look together',
        impact: 'Dad can drive, bring a flashlight, and keep you both safe near the creek at night. You’re praying and doing your part at the same time. Whether or not the dog is Biscuit, you followed a real lead the safe way.',
        next: 'On the way, say a short prayer out loud with Dad. If it isn’t Biscuit, ask what else you can try tomorrow, like posters or calling the shelter.',
        close: 'Pray, and take the next safe step.' },
      { id: 'creek', kind: 'risky', act: 'walk', to: 'solo', label: 'Grab a flashlight and head to the creek by yourself right now',
        impact: 'You love Biscuit, and waiting feels impossible. But a creek in the dark is risky alone, and nobody would know where you are. If you slipped or got lost, your family would have two to search for.',
        next: 'Take thirty seconds to get Dad first. A grown-up, a car and a flashlight give Biscuit a better chance too.',
        close: 'Being brave includes being safe.' },
      { id: 'window', kind: 'mixed', act: 'pray', label: 'Stay at the window and pray harder, hoping Biscuit just comes home',
        impact: 'Praying is a good thing to do with a worried heart, and it’s safer than running out alone. But Mirae’s text is a real clue, and it won’t help if no one acts on it. Dad doesn’t even know about it yet.',
        next: 'Keep praying, and carry the text to Dad right now. Praying and acting aren’t opposites.',
        close: 'Hope is allowed to have hands and feet.' }
    ]
  },
  {
    id: 'pointless', topic: 'prayer', title: 'Talking to the ceiling', place: 'Cafeteria · lunch',
    text: 'At lunch you mention that you prayed for your sick cousin. Felix shrugs and says, “Praying doesn’t do anything. You’re just talking to the ceiling.” He isn’t being mean, but your face gets warm.',
    ask: 'Felix is waiting for you to answer. What do you say?',
    alt: 'At a cafeteria table, you look embarrassed with one hand half raised while a friend shrugs.',
    talk: 'How can you talk about what you believe without putting someone else down? What would you want a friend to understand?',
    adult: 'leader',
    scene: { bg: 'cafe', me: ['embarrassed', 'half'], them: [['k7', 'neutral', 'shrug']], extra: 'table' },
    choices: [
      { id: 'argue', kind: 'risky', act: 'yell', label: 'Snap, “That’s a dumb thing to say. You don’t know anything about it”',
        impact: 'It stings when someone brushes off something that matters to you. But snapping turns a difference into a fight. Felix is more likely to dig in than to listen, and lunch gets tense for everyone at the table.',
        next: 'Try a calmer line: “We see it differently. It matters to me, though.” You don’t have to win.',
        close: 'You can hold your belief without swinging it at anyone.' },
      { id: 'laugh', kind: 'mixed', act: 'joke', label: 'Laugh and say, “Yeah, probably,” then change the subject',
        impact: 'Laughing it off keeps lunch easy, and you don’t owe anyone a debate. But you said something you don’t believe, and that can leave a small ache. Felix also never finds out this matters to you.',
        next: 'Next time, try one honest sentence with no argument attached: “It actually helps me.” Then you can change the subject.',
        close: 'You can keep the peace and still be yourself.' },
      { id: 'steady', kind: 'strong', act: 'calm', label: 'Say, “It matters to me. We can see it differently and still be friends”',
        impact: 'You stayed honest about what you believe without telling Felix he has to agree. That kind of calm answer usually earns respect, and it leaves room for him to ask real questions later if he’s curious.',
        next: 'If his words keep bugging you, bring your questions to a parent or youth leader. Wondering about prayer is welcome, not wrong.',
        close: 'Honest and kind can live in the same sentence.' }
    ]
  },
  {
    id: 'toobusy', topic: 'prayer', title: 'The week got away', place: 'Youth group · Sunday morning',
    text: 'Last week your youth leader, Mr. Bello, asked everyone to try praying for five minutes a day. You meant to. Then came homework, practice and videos. Now Hyun-woo says he did all seven days, and it’s your turn to share.',
    ask: 'Everyone is looking at you. What do you say?',
    alt: 'In a church room, you look uneasy and rub the back of your neck while your youth leader smiles and a boy looks happy.',
    talk: 'What gets in the way when you mean to pray? What is one small, real way to start again?',
    adult: 'leader',
    scene: { bg: 'church', me: ['uneasy', 'neck'], them: [['leader', 'smile', 'half'], ['k11', 'happy', 'down']] },
    choices: [
      { id: 'bigplan', kind: 'mixed', act: 'think', label: 'Say, “I forgot,” then promise yourself thirty minutes every day to make up for it',
        impact: 'You were honest, and wanting to do better is a good instinct. But a giant promise made out of guilt is hard to keep. When day two gets busy, missing it can feel like failing all over again.',
        next: 'Go smaller, not bigger. Try one minute at the same time each day, like right before breakfast.',
        close: 'Prayer isn’t a debt to pay back. You can just begin again.' },
      { id: 'honest', kind: 'strong', act: 'honest', label: 'Say, “Honestly, I kept forgetting. Can you help me find a way to start?”',
        impact: 'Telling the truth takes the pressure off, and you probably aren’t the only one who forgot. Mr. Bello can help you find a small, real plan. Asking for help turns an embarrassing moment into a fresh start.',
        next: 'Tie one short prayer to something you already do, like brushing your teeth or the bus ride. Tell Mr. Bello how it goes next week.',
        close: 'A small honest start beats a perfect plan.' },
      { id: 'fake', kind: 'risky', act: 'lie', label: 'Say, “Yep, every day,” so you don’t look bad next to Hyun-woo',
        impact: 'The awkward moment passes quickly. But now you have to keep the story going, and Mr. Bello can’t help with a struggle he doesn’t know about. Pretending also makes praying feel like a performance instead of something real.',
        next: 'You can fix it after group: “I said I did it, but I didn’t. I want to try again.”',
        close: 'Nobody needs you to look perfect. Real is better.' }
    ]
  }
]);

CRData.add([
  /* ───────── Forgiveness and grace ───────── */
  {
    id: 'promise', topic: 'forgiveness', title: 'A promise that broke', place: 'School gate · Monday morning',
    text: 'Ibrahim promised to come to your piano recital on Saturday. His seat stayed empty. Now he runs up and says, “I’m really sorry. I went to the arcade and forgot.” Your chest feels tight.',
    ask: 'Ibrahim is waiting for your answer. What do you say?',
    alt: 'At the school gate, a boy holds his hands together and says sorry while you stand with your arms crossed, hurt.',
    talk: 'Can you forgive someone and still feel hurt? What helps trust grow back after a broken promise?',
    adult: 'mom',
    scene: { bg: 'gate', me: ['hurt', 'crossed'], them: [['k4', 'regret', 'together']] },
    choices: [
      { id: 'fine', kind: 'mixed', act: 'ignore', label: 'Say, “It’s fine,” and change the subject, even though you’re still angry',
        impact: 'Saying “it’s fine” keeps the peace, and wanting peace is a good thing. But Ibrahim never learns how much it mattered, and the hurt stays tucked inside you. Forgiving is not the same as pretending.',
        next: 'You can be honest and kind together. Try, “It’s not really fine yet. I was sad you weren’t there. I do want to work it out.”',
        close: 'Real forgiveness starts with the truth about what hurt.' },
      { id: 'truth', kind: 'strong', act: 'honest', label: 'Say, “It hurt that you forgot. Thanks for saying sorry. I want to forgive you.”',
        impact: 'You told the truth about the hurt and you left the door open. Ibrahim knows his sorry was heard, and he knows the promise mattered. Forgiving him may take a little time, and that is okay.',
        next: 'Trust grows back in small steps. Let him keep a smaller promise this week. If the sad feeling hangs on, talk with your mom about it. (Ephesians 4:32)',
        close: 'Forgiving is a choice you can make before the feeling catches up.' },
      { id: 'never', kind: 'risky', act: 'yell', label: 'Say, “Don’t bother. I’m never trusting you again,” and walk off',
        impact: 'Your anger makes sense. He broke a promise. But “never” shuts the door on a friend who is trying to make it right, and carrying this alone will likely feel heavier by lunch.',
        next: 'If you’re too upset to talk, say that instead: “I’m still mad. I need some time.” Then come back to it when you’re ready.',
        close: 'You can need time without closing the door for good.' }
    ]
  },
  {
    id: 'spilled', topic: 'forgiveness', title: 'The ruined drawing', place: 'Living room · Saturday afternoon',
    text: 'You spent three days on a drawing for the art fair. Your little sister Mei reaches for the markers and knocks juice all over it. She starts to cry. “I didn’t mean to!” Your hands shake.',
    ask: 'Your drawing is soaked. What do you do next?',
    alt: 'In a living room, you grip a ruined drawing and look angry while your little sister cries with her hands over her face.',
    talk: 'Is it harder to forgive an accident or something done on purpose? What helps you cool down before you talk?',
    adult: 'mom',
    scene: { bg: 'home', me: ['angry', 'hold', 'paper'], them: [['k7', 'sad', 'faceHide']] },
    choices: [
      { id: 'payback', kind: 'risky', act: 'grab', label: 'Grab her favorite coloring book and scribble all over it',
        impact: 'Getting even might feel fair for a second. But now two things are ruined, Mei is hurt on purpose, and your drawing is still wet. The angry feeling usually gets bigger, not smaller.',
        next: 'Put some space between you and the moment. Say, “I’m too mad to talk,” and go find your mom so she can help you both.',
        close: 'Payback doubles the mess. It never fixes the first one.' },
      { id: 'door', kind: 'mixed', act: 'walk', label: 'Go to your room, shut the door, and refuse to talk to her all weekend',
        impact: 'Walking away keeps you from doing something you’d regret, and that part is wise. But a whole weekend of silence leaves Mei scared that you hate her, and leaves you alone with the anger.',
        next: 'Take the break, then come back. You could say, “I’m still sad about my drawing. I know it was an accident.”',
        close: 'Cooling off is a pause, not the end of the story.' },
      { id: 'minute', kind: 'strong', act: 'breathe', label: 'Say, “I’m really upset. I need a minute,” then come back and talk',
        impact: 'You were honest about the anger without aiming it at Mei. A minute lets your body calm down. When you come back, you can hear that it was an accident, and she can hear that it mattered.',
        next: 'Forgiving her can come with a plan. Ask your mom for a high shelf or a table where your projects stay safe from now on.',
        close: 'You can forgive an accident and still protect what matters to you.' }
    ]
  },
  {
    id: 'sorryagain', topic: 'forgiveness', title: 'Sorry, again', place: 'Church hall · before youth group',
    text: 'Bronwyn shoves you off the end of the bench, hard. Your elbow stings. “Sorry, just kidding,” she says. It is the third time this month. Someone whispers, “You’re supposed to forgive her.”',
    ask: 'Your elbow still hurts. What do you do?',
    alt: 'In a church hall, a girl smirks with a hand on her hip while you hug your sore arm and look hurt.',
    talk: 'What is the difference between forgiving someone and letting them keep hurting you? Who could you tell?',
    adult: 'leader',
    scene: { bg: 'church', me: ['hurt', 'hug'], them: [['k9', 'smirk', 'hip']] },
    choices: [
      { id: 'leader', kind: 'strong', act: 'tell', label: 'Say, “Stop shoving me,” and go tell your youth leader what keeps happening',
        impact: 'You set a clear limit and brought in someone who can help. Forgiving Bronwyn does not mean letting her keep hurting you. A leader can make the shoving stop, which is good for you and for her too.',
        next: 'Tell your leader how many times it has happened. You can work on forgiving her in your heart and still keep your distance until she is safe to be around.',
        close: 'Forgiveness and a boundary can stand side by side.' },
      { id: 'faraway', kind: 'mixed', act: 'walk', label: 'Tell yourself you forgive her and quietly sit across the room from now on',
        impact: 'Moving away protects you, and wanting to forgive is a good thing. But nobody in charge knows about the shoving. Bronwyn may keep doing it to you later, or to someone smaller.',
        next: 'Keep the distance and add one step. Tell your youth leader or a parent, “She has shoved me three times. I need help.”',
        close: 'Forgiving someone never means you have to handle it alone.' },
      { id: 'shove', kind: 'risky', act: 'grab', label: 'Shove her back harder so she knows how it feels',
        impact: 'You are right to be angry. Being shoved hurts. But shoving back can get someone really hurt, and it may make you look like the one who started it. The pattern usually keeps going.',
        next: 'Step away from her and go straight to your youth leader. Say what happened and that it is the third time.',
        close: 'Your anger is telling the truth. Let a trusted adult help you with it.' }
    ]
  },
  {
    id: 'replay', topic: 'forgiveness', title: 'Still feeling awful', place: 'Your bedroom · late at night',
    text: 'This afternoon you yelled, “You ruin everything!” at your little brother Tavita. You said sorry at dinner and he hugged you. Now it is late, and the words keep replaying. Your stomach feels heavy.',
    ask: 'You can’t stop thinking about it. What do you do?',
    alt: 'In a dark bedroom, you sit up holding your head and look full of regret.',
    talk: 'Why can it be harder to forgive yourself than someone else? What would you say to a friend who felt this way?',
    adult: 'dad',
    scene: { bg: 'room', me: ['regret', 'headHold'], them: [] },
    choices: [
      { id: 'perfect', kind: 'mixed', act: 'think', label: 'Promise yourself you will never, ever lose your temper again',
        impact: 'Wanting to do better is a good sign. It shows you care about Tavita. But nobody can keep a promise to be perfect. The next slip will feel even worse, like proof that you failed.',
        next: 'Trade “never again” for one small plan. Next time you feel the heat rising, you could say, “I need a minute,” and step away.',
        close: 'Growing is the goal. Perfect was never the deal.' },
      { id: 'badkid', kind: 'risky', act: 'worry', label: 'Keep replaying it and tell yourself you are just a bad person',
        impact: 'Feeling sorry is healthy. It helped you apologize. But calling yourself bad goes past sorry into shame, and shame does not help Tavita at all. It mostly keeps you awake and makes tomorrow harder.',
        next: 'Try saying it the true way: “I did a wrong thing. I made it right. I am still loved.” If it keeps spinning, go tell your dad.',
        close: 'You made a mistake. You are not a mistake.' },
      { id: 'accept', kind: 'strong', act: 'pray', label: 'Pray, “God, I’m sorry. Thank you for forgiving me,” and let today be done',
        impact: 'You already did the brave part when you said sorry. Now you are letting forgiveness be real for you too. Tavita forgave you. God forgives you. Holding on to the guilt does not make the sorry any truer.',
        next: 'Tomorrow, do one kind thing for Tavita, not to earn anything, just because you love him. If the heavy feeling stays, talk with your dad.',
        close: 'Forgiven means you are allowed to put it down.' }
    ]
  },

  /* ───────── Identity, purpose, and doing what is right ───────── */
  {
    id: 'churchkid', topic: 'identity', title: 'Teased about church', place: 'Cafeteria · Monday lunch',
    text: 'You mention that you went to church yesterday. Declan laughs so loudly that the whole table looks up. “Wait, you actually believe that stuff? That’s so weird.” Your ears burn.',
    ask: 'The table is waiting. What do you say?',
    alt: 'At a cafeteria table, a boy laughs and points at you while you rub the back of your neck, embarrassed.',
    talk: 'When has it been hard to be yourself in front of others? What helps you stay steady when someone laughs?',
    adult: 'leader',
    scene: { bg: 'cafe', me: ['embarrassed', 'neck'], them: [['k2', 'laugh', 'point']], extra: 'ha' },
    choices: [
      { id: 'fireback', kind: 'risky', act: 'yell', label: 'Snap, “At least I’m not a jerk like you!”',
        impact: 'Being laughed at stings, and wanting to sting back is normal. But an insult turns the table against you, and it does not show anyone what your faith is really like. Declan gets the fight he was poking for.',
        next: 'You do not have to win. A calm line works better: “It matters to me. You don’t have to agree.”',
        close: 'You don’t have to defend your faith by hurting someone.' },
      { id: 'steady', kind: 'strong', act: 'calm', label: 'Say, “Yeah, I do. It matters to me,” and go back to eating',
        impact: 'A short, calm answer shows that a laugh cannot shake who you are. You did not hide and you did not attack. Most teasing fades when there is nothing to push against, and someone at the table may quietly respect it.',
        next: 'If Declan is really curious later, you can share more. If the teasing keeps going, tell a teacher. Your youth leader would be glad to hear about it too.',
        close: 'Who you are does not depend on who is laughing.' },
      { id: 'shrug', kind: 'mixed', act: 'joke', label: 'Laugh along and say, “My parents make me go. It’s so boring.”',
        impact: 'Laughing it off ends the moment fast, and wanting to fit in is very human. But you just said something you don’t believe, and that can leave a sour feeling. It also makes it harder to be honest next time.',
        next: 'You can take it back, even quietly. Try, “Actually, I like going. It’s just hard to say that out loud.”',
        close: 'Fitting in feels good. Being known feels better.' }
    ]
  },
  {
    id: 'lapcount', topic: 'identity', title: 'Two laps short', place: 'School field · fitness test',
    text: 'Everyone counts their own laps today. Twenty laps gets your name on the gym wall. You ran eighteen, and your legs are shaking. Coach Rivera lifts the clipboard. “How many?” Nobody else was counting yours.',
    ask: 'Coach is waiting for your number. What do you say?',
    alt: 'On a school field, a coach holds a clipboard and waits for your answer while you rub the back of your neck, thinking hard.',
    talk: 'Why does telling the truth matter when nobody could ever check? Who are you when no one is watching?',
    adult: 'coach',
    scene: { bg: 'field', me: ['thinking', 'neck'], them: [['coach', 'neutral', 'hold', 'papers']], extra: '?' },
    choices: [
      { id: 'eighteen', kind: 'strong', act: 'honest', label: 'Say, “Eighteen. I was two short,” even though it stings',
        impact: 'It costs you the wall this time, and that is a real loss. But eighteen is yours. You earned every lap of it. Coach learns your number can be trusted, and you never have to wonder if your name belongs up there.',
        next: 'Ask Coach when you can try again. Two more laps is something you can train for. Your worth was never hanging on that wall. (Luke 16:10)',
        close: 'An honest eighteen is worth more than a borrowed twenty.' },
      { id: 'twenty', kind: 'risky', act: 'lie', label: 'Say, “Twenty!” with a big smile, since nobody can prove otherwise',
        impact: 'You were so close, and wanting your name up there is not wrong. But every time you pass that wall, you will know the truth. A name you did not earn tends to feel smaller, not bigger.',
        next: 'You can fix it today. Go back to Coach and say, “I counted wrong. It was eighteen.” That takes more courage than two more laps.',
        close: 'Nobody watching is exactly when your choices are most your own.' },
      { id: 'makeup', kind: 'mixed', act: 'think', label: 'Say, “Twenty,” and plan to run two extra laps at recess to make up for it',
        impact: 'Wanting to make it true shows you care about earning it, and that counts. But the number was not true when you said it. Even after the extra laps, you would know your name went up on a shortcut.',
        next: 'Flip the order. Tell Coach the real number first, then ask, “Can I run two more at recess and try again?”',
        close: 'Truth first. Then the extra laps.' }
    ]
  },
  {
    id: 'nogift', topic: 'identity', title: 'Everyone has a gift', place: 'Church lobby · after service',
    text: 'The talent night sign-up sheet is filling up. Sena is singing. Kofi is playing drums. You hold the pencil and can’t think of one thing you are good at. Your throat gets tight.',
    ask: 'The pencil is still in your hand. What do you do?',
    alt: 'In a church lobby, you hold a pencil and look down while a girl waves happily and a boy smiles nearby.',
    talk: 'What is something you do that helps other people, even if it would never go on a stage? Who sees that in you?',
    adult: 'leader',
    scene: { bg: 'church', me: ['down', 'hold', 'pencil'], them: [['k10', 'happy', 'wave'], ['k5', 'smile', 'down']] },
    choices: [
      { id: 'copy', kind: 'mixed', act: 'write', label: 'Sign up to sing like Sena, even though singing makes you miserable',
        impact: 'Putting your name down takes courage, and trying new things is good. But picking something only because Sena does it means measuring yourself with her ruler. You may spend the whole night dreading it instead of enjoying it.',
        next: 'Ask yourself what you actually like doing, even if it seems small. Talent night also needs people who welcome, set up, and cheer.',
        close: 'You were not made to be a copy of anyone.' },
      { id: 'askleader', kind: 'strong', act: 'tell', label: 'Tell your youth leader, “I don’t know what I’m good at. Can you help?”',
        impact: 'Saying it out loud takes the lonely part away. People who know you often see gifts you can’t see yet, like being a good listener or making new kids feel welcome. Not every gift fits on a stage.',
        next: 'Ask two people who love you what they notice in you. Write down what they say and keep it somewhere you’ll see it.',
        close: 'You were made on purpose, and you are loved before you do anything.' },
      { id: 'skipit', kind: 'risky', act: 'walk', label: 'Put the pencil down, decide you have no gifts, and skip talent night',
        impact: 'Feeling small next to a list of talents is really common, and it hurts. But deciding you have nothing is a guess, not a fact. Skipping the night means missing friends, and it lets the comparison have the last word.',
        next: 'You don’t need an act to belong there. Go and cheer, and tell your youth leader or a parent how the sign-up sheet made you feel.',
        close: 'Not knowing your gift yet is different from not having one.' }
    ]
  },
  {
    id: 'labpartner', topic: 'identity', title: 'The partner nobody picked', place: 'Science lab · partner day',
    text: 'Mr. Bello says, “Find a partner.” Your best friend Hana waves you over. You have waited all week for this. Then you see Wendell, the new kid, standing alone and staring at the floor.',
    ask: 'Hana is waving. Wendell is alone. What do you do?',
    alt: 'In a science lab, your friend waves happily at you while a new boy stands alone looking down, and you look unsure.',
    talk: 'When has being kind cost you something you wanted? How could you include someone without leaving a friend out?',
    adult: 'teacher',
    scene: { bg: 'lab', me: ['uneasy', 'chin'], them: [['k3', 'happy', 'wave'], ['k11', 'down', 'down']] },
    choices: [
      { id: 'lookaway', kind: 'risky', act: 'ignore', to: 1, label: 'Hurry over to Hana and pretend you didn’t see Wendell',
        impact: 'Wanting to work with your best friend is not wrong. But pretending not to see takes effort, and Wendell very likely noticed who looked away. He learns that in this class, new kids stand alone.',
        next: 'You can still turn around. Ask Mr. Bello, “Can we be a group of three?” or tell Hana, “Let’s get Wendell.”',
        close: 'You can’t unsee someone. You can only choose what to do next.' },
      { id: 'wait', kind: 'mixed', act: 'think', label: 'Wait and see if someone else picks Wendell before you decide',
        impact: 'You noticed him, and that matters. Plenty of people never look up. But while everyone waits for someone else, Wendell stands there longer, and each second alone in front of the class feels like a minute.',
        next: 'When you notice, that is usually your cue. Try going first: “Hey Wendell, want to work with us?”',
        close: 'If you saw it, maybe you are the someone.' },
      { id: 'invite', kind: 'strong', act: 'kind', to: 1, label: 'Tell Hana, “One sec,” then ask Wendell, “Want to be my partner today?”',
        impact: 'It costs you something real, the partner day you were looking forward to. That is what makes it kindness and not just being nice. Wendell’s first week gets easier, and Hana sees what kind of friend you are.',
        next: 'Tell Hana you still want to pair up next time, so she knows it isn’t about her. Or ask Mr. Bello if three can work together.',
        close: 'Kindness that costs you something is the kind people remember.' }
    ]
  }
]);
