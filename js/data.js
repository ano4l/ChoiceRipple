/* ChoiceLab — topics and the Everyday Life scenarios (the Faith and Spiritual Growth
   scenarios are in data-faith.js).
   Every scenario has its own prompt, its own three responses, and for each response:
   impact (what could happen) → next (a supportive next step) → close (the line to keep).
   act: which picture shows the choice · to: who shares that picture (see js/art.js)
   kind: 'strong' = helps · 'mixed' = partly helps · 'risky' = likely makes it harder */
(function (global) {
  'use strict';

  /* Two sections, twelve topics, four scenarios in each topic. */
  var GROUPS = [
    { id: 'everyday', name: 'Everyday Life', blurb: 'School, friends, feelings and staying safe.' },
    { id: 'faith', name: 'Faith and Spiritual Growth', tab: 'Faith-based', blurb: 'Faith-based practice that families, churches and schools can choose to assign.' }
  ];
  var TOPICS = [
    { id: 'bullying', group: 'everyday', name: 'Bullying and exclusion', short: 'Bullying & exclusion', bg: '#f3e4d4', ink: '#7a4719' },
    { id: 'conflict', group: 'everyday', name: 'Conflict and anger', short: 'Conflict & anger', bg: '#fbe3dc', ink: '#9c3f2b' },
    { id: 'friendship', group: 'everyday', name: 'Friendship and peer pressure', short: 'Friendship & pressure', bg: '#fdeccc', ink: '#855600' },
    { id: 'digital', group: 'everyday', name: 'Digital choices and social media', short: 'Digital choices', bg: '#d9eef0', ink: '#1c5f6b' },
    { id: 'honesty', group: 'everyday', name: 'Honesty and integrity', short: 'Honesty & integrity', bg: '#eaedd3', ink: '#56601c' },
    { id: 'emotions', group: 'everyday', name: 'Emotions and self-control', short: 'Emotions & self-control', bg: '#fbe1e8', ink: '#963357' },
    { id: 'communication', group: 'everyday', name: 'Communication and respect', short: 'Communication & respect', bg: '#dcecf7', ink: '#225682' },
    { id: 'safety', group: 'everyday', name: 'Safety and asking for help', short: 'Safety & asking for help', bg: '#fde7d0', ink: '#94470f' },
    { id: 'trust', group: 'faith', name: 'Fear and trusting God', short: 'Fear & trusting God', bg: '#dfe7fb', ink: '#344d98' },
    { id: 'prayer', group: 'faith', name: 'Prayer and patience', short: 'Prayer & patience', bg: '#e8e3f6', ink: '#54428f' },
    { id: 'forgiveness', group: 'faith', name: 'Forgiveness and grace', short: 'Forgiveness & grace', bg: '#e0efe2', ink: '#2c6638' },
    { id: 'identity', group: 'faith', name: 'Identity, purpose, and doing what is right', short: 'Identity & purpose', bg: '#f4e0f1', ink: '#7a3774' }
  ];

  var SCENARIOS = [
    {
      id: 'heated', topic: 'conflict', title: 'When words get heated', place: 'Hallway · between classes',
      text: 'Dev bumps your shoulder at the lockers, laughs, and says, “You’re so dramatic.” A few students turn to watch. Your face gets hot.',
      ask: 'Everyone is watching. What do you do?',
      alt: 'A boy laughs and points while another student clenches his fists, red-faced and furious, in a school hallway.',
      talk: 'What does your body do right before you snap? What helps you buy two seconds?',
      choices: [
        { id: 'snap', kind: 'risky', label: 'Snap back loudly so he knows you’re not scared',
          impact: 'Snapping back in front of a crowd usually makes the moment bigger, not smaller. Dev gets an audience to perform for, and you’re both more likely to say something you can’t take back.',
          next: 'Try one slow breath, then a short line like “Not doing this here,” and keep walking. You can sort it out later without the crowd.',
          close: 'Feeling angry is okay. You still get to choose what your anger does.' },
        { id: 'walk', kind: 'strong', label: 'Take a breath, say “Not cool. I’m done,” and walk on',
          impact: 'A short, steady line shows you won’t be pushed around, and walking on takes the audience away. Without a reaction to feed on, the moment usually fizzles.',
          next: 'If Dev keeps it up, talk to him one-on-one later, or let a teacher know it’s turning into a pattern.',
          close: 'Staying in charge of yourself is real strength.' },
        { id: 'stew', kind: 'mixed', label: 'Say nothing and stay mad about it all day',
          impact: 'Staying quiet keeps things from blowing up right now, and that counts. But the anger doesn’t go anywhere. It tends to leak out later at someone who didn’t earn it.',
          next: 'Give the feeling somewhere to go: tell a friend, write it down, or tell Dev privately, “That bothered me.”',
          close: 'Your feelings deserve a way out that doesn’t hurt you.' }
      ]
    },
    {
      id: 'blamed', topic: 'conflict', title: 'Blamed for the loss', place: 'Soccer field · after the game',
      text: 'Your team just lost by one goal. Kenji storms over, points at you, and shouts, “You ruined it for everyone!” Your eyes sting. Other players are listening.',
      ask: 'Kenji is still glaring at you. What do you say?',
      alt: 'A soccer player shouts and points at a teammate, who looks stung and close to tears, fists tight.',
      talk: 'When someone blames you unfairly, what do you wish they knew?',
      choices: [
        { id: 'yell', kind: 'risky', label: 'Yell back, “You missed shots too!”',
          impact: 'Trading blame feels fair in the moment, but it turns one loss into two people fighting. The team ends up picking sides instead of getting better.',
          next: 'Try naming it without attacking: “I’m upset too. Let’s talk when we’ve both cooled down.”',
          close: 'A loss lasts one game. How you treat teammates lasts the season.' },
        { id: 'avoid', kind: 'mixed', label: 'Walk off without a word and avoid him all week',
          impact: 'Leaving stops the argument, and that’s better than a shouting match. But a week of avoiding Kenji leaves his words unanswered and makes practice tense for everyone.',
          next: 'Once you’re calm, say one honest thing: “What you said hurt. I want to fix this.”',
          close: 'Space helps most when you come back.' },
        { id: 'cool', kind: 'strong', label: 'Say, “I’m upset too. Can we talk after we cool down?”',
          impact: 'You showed Kenji you care about the game without taking the bait. Asking for time lets both of you calm down enough to actually hear each other.',
          next: 'Follow through later: “That was a rough game. What can we both work on?” If he keeps blaming you, bring in the coach.',
          close: 'Cooling down first isn’t backing down. It’s how real talks happen.' }
      ]
    },

    {
      id: 'quiet', topic: 'friendship', title: 'Gone quiet', place: 'Cafeteria · the day after',
      text: 'Yesterday you sat with a different group at lunch. Today Aaliyah won’t answer your messages. When you look over, she crosses her arms and looks away.',
      ask: 'Aaliyah still hasn’t replied. What’s your move?',
      alt: 'A worried student checks an unanswered message while her friend sits apart with arms crossed, eyes shut, turned away.',
      talk: 'How can you tell the difference between a friend needing space and a friend being upset with you?',
      choices: [
        { id: 'ask', kind: 'strong', label: 'Go over and say, “Did I upset you? Can we talk?”',
          impact: 'Asking directly gives Aaliyah a chance to tell you what’s wrong instead of leaving you both guessing. Even if she needs a minute, she knows you care enough to ask.',
          next: 'Listen first, even if you don’t agree. Then share your side: “I like sitting with you. I also wanted to meet new people.”',
          close: 'A two-minute honest talk beats a two-week silence.' },
        { id: 'ignore', kind: 'risky', label: 'Ignore her back until she says sorry first',
          impact: 'Matching her silence turns a small hurt into a contest neither of you can win. Each day it goes on, it gets harder for either of you to speak first.',
          next: 'Break the standoff with one easy line: “Hey, I feel like something’s off. Can we talk?”',
          close: 'Somebody has to go first. It can be you.' },
        { id: 'others', kind: 'mixed', label: 'Ask your other friends what her problem is',
          impact: 'Wanting to understand makes sense. But asking around instead of asking Aaliyah can turn into gossip fast, and she may hear a twisted version of what you said.',
          next: 'Take the question straight to her: “I’d rather hear it from you. Did I do something?”',
          close: 'Go to the person, not around them.' }
      ]
    },
    {
      id: 'apology', topic: 'friendship', title: 'The apology you owe', place: 'Library · study time',
      text: 'Tomás was only trying to help with your project, and you snapped, “I don’t need your help!” Now he’s staring at his book and hasn’t said a word.',
      ask: 'The silence is getting awkward. What do you do?',
      alt: 'A student rubs the back of his neck, embarrassed and regretful, while his friend looks down at a book, hurt.',
      talk: 'What makes an apology feel real to you? What makes one feel fake?',
      choices: [
        { id: 'normal', kind: 'mixed', label: 'Act normal and hope he forgets about it',
          impact: 'Acting normal might smooth things over on the surface. But Tomás is left wondering whether you even noticed you hurt him, and that small crack can stay.',
          next: 'It’s not too late. Try, “About earlier, I shouldn’t have snapped at you.”',
          close: 'Pretending it didn’t happen isn’t the same as fixing it.' },
        { id: 'sorry', kind: 'strong', label: 'Say, “I’m sorry I snapped. You were trying to help.”',
          impact: 'A real apology names what you did and doesn’t make excuses. Tomás hears that his effort mattered, which makes it much easier for him to let it go.',
          next: 'Add what you’ll do differently: “I was stressed. Next time I’ll just say I need a minute.”',
          close: 'Owning a mistake takes ten seconds and can save a friendship.' },
        { id: 'but', kind: 'risky', label: 'Say, “Sorry you got upset, but you were being annoying.”',
          impact: 'This sounds like an apology but puts the blame back on Tomás. He’ll likely feel worse, because now he’s been snapped at twice.',
          next: 'Drop the “but.” Try, “I’m sorry I snapped. That wasn’t fair to you.”',
          close: 'A real sorry has no “but” in it.' }
      ]
    },

    {
      id: 'vape', topic: 'friendship', title: 'Just one time', place: 'Behind the gym · after school',
      text: 'An older student named Brooks holds out a vape. “It’s only one time,” he says. “Everybody does it.” Your stomach tightens. You don’t want it.',
      ask: 'Brooks is waiting. What do you do?',
      alt: 'An older student in a beanie smirks and holds out a vape; a younger student leans back uneasily with a hand raised to refuse.',
      talk: 'What’s a line you’d actually feel comfortable saying if someone offered you something?',
      choices: [
        { id: 'take', kind: 'risky', label: 'Take one puff so he stops asking',
          impact: 'Going along to end the pressure usually has the opposite effect. Now Brooks knows pushing works, and next time the ask gets bigger. Vapes can also carry nicotine and other things your body doesn’t need.',
          next: 'A short, calm “No thanks, I’m good” while you keep walking works better than you’d think. You don’t owe him a reason.',
          close: 'You never have to trade your health for someone’s approval.' },
        { id: 'no', kind: 'strong', label: 'Say, “No thanks, I’m good,” and head back to your friends',
          impact: 'A short no with no long explanation is hard to argue with. Walking toward your friends ends the conversation and puts you somewhere you feel like yourself.',
          next: 'If he keeps pushing you or younger kids, tell an adult you trust. That’s looking out for people, not snitching.',
          close: '“No” is a complete sentence.' },
        { id: 'later', kind: 'mixed', label: 'Laugh and say, “Maybe later”',
          impact: '“Maybe later” gets you out of this moment without a scene, which is something. But it tells Brooks the door is still open, so expect him to ask again.',
          next: 'Next time, close the door: “Nah, that’s not my thing.” Then change the subject or leave.',
          close: 'A clear no now saves you from ten more asks.' }
      ]
    },
    {
      id: 'dare', topic: 'friendship', title: 'The dare', place: 'School gate · lunch',
      text: 'Milo and Jaylen wave you over to the open gate. “We’re sneaking out to the corner store. Don’t be boring!” Leaving campus is against the rules, and no adult would know where you are.',
      ask: 'They’re waving you over. What do you do?',
      alt: 'Two grinning students beckon toward an open school gate while a third hugs her arms, nervous and unsure.',
      talk: 'Is it harder to say no to a friend or to someone you want to impress? Why?',
      choices: [
        { id: 'excuse', kind: 'mixed', label: 'Make up an excuse: “I have to see a teacher.”',
          impact: 'The excuse keeps you safe today, and that matters. But it hides your real answer, so they’ll likely ask again tomorrow and you’ll need a new excuse.',
          next: 'Try the honest version next time: “That’s not for me.” It only has to be said once.',
          close: 'Your real answer is good enough.' },
        { id: 'go', kind: 'risky', label: 'Go along. You don’t want to be the boring one',
          impact: 'Going along keeps you in the group for now, but you’d be off campus where no adult knows where you are. If anything goes wrong, a small dare becomes a big problem, and “they dared me” won’t help much.',
          next: 'You can stay their friend and still skip the dare: “I’m out, but save me a seat at lunch.”',
          close: 'Real friends still like you when you say no.' },
        { id: 'offer', kind: 'strong', label: 'Say, “I’m not into that. Want to shoot hoops instead?”',
          impact: 'You said no without making it a fight, and you gave them something else to do. That makes it easier for someone else in the group to back out too.',
          next: 'If they go anyway, you don’t have to chase them or cover for them. Just do your own thing.',
          close: 'You can say no and still be fun.' }
      ]
    },

    {
      id: 'directions', topic: 'communication', title: 'Lost on the directions', place: 'Science class · start of the lab',
      text: 'Your teacher explains the lab and says, “Go ahead and start.” Everyone around you begins writing. You stare at the worksheet. You have no idea what the first step is.',
      ask: 'Everyone else is working. What do you do?',
      alt: 'A confused student stares at a worksheet with question marks overhead while a classmate writes steadily beside him.',
      talk: 'What makes it hard to ask a question in front of the class? What would make it easier?',
      choices: [
        { id: 'raise', kind: 'strong', label: 'Raise your hand and ask, “Can you explain the first step again?”',
          impact: 'Asking right away gets you unstuck before you fall behind. And you’re almost never the only one confused. Someone nearby is probably relieved you asked.',
          next: 'Make it specific: “I got the part about measuring, but what do we write first?” Specific questions get faster answers.',
          close: 'Asking is how smart people get smarter.' },
        { id: 'copy', kind: 'mixed', label: 'Quietly copy what your neighbor is writing',
          impact: 'Copying gets words on your page, so you look busy. But you still won’t understand the lab, and if your neighbor is wrong, now you both are.',
          next: 'Ask your neighbor to explain instead of copying: “What are we supposed to do first?”',
          close: 'Looking busy and understanding aren’t the same thing.' },
        { id: 'pretend', kind: 'risky', label: 'Pretend to work and hope it makes sense later',
          impact: 'Pretending feels safer than asking, but the confusion grows with every step you miss. By the end, a ten-second question has turned into a whole lab to redo.',
          next: 'Ask early, even quietly at the teacher’s desk: “I’m lost on step one.”',
          close: 'A small question now beats a big problem later.' }
      ]
    },
    {
      id: 'talkedover', topic: 'communication', title: 'Talked over', place: 'Classroom · group project',
      text: 'Your group is planning a poster. You start to share an idea, and Priya talks right over you. You try again, and Marcus cuts in. Neither of them notices.',
      ask: 'You still have your idea. What do you do?',
      alt: 'Two students talk excitedly over the head of a third, who sits between them looking annoyed and unheard.',
      talk: 'When has someone talked over you? What did you wish you had said?',
      choices: [
        { id: 'giveup', kind: 'mixed', label: 'Give up and let them decide everything',
          impact: 'Stepping back keeps the peace, and sometimes that’s fine. But your group loses your idea, and Priya and Marcus never find out they were steamrolling you.',
          next: 'Try once more with a clear opener: “Hang on, I have an idea I’d like to finish.”',
          close: 'Your ideas deserve air time too.' },
        { id: 'shutdown', kind: 'risky', label: 'Mutter, “Forget it, you never listen,” and stop helping',
          impact: 'They’ll hear that you’re mad, but not what you actually need. Shutting down also leaves the work to them, which can make the group see you as the problem.',
          next: 'Say the need, not just the frustration: “I’ve been trying to share an idea. Can I finish it?”',
          close: 'People can’t fix what you don’t tell them.' },
        { id: 'speak', kind: 'strong', label: 'Say, “Hang on, I have an idea I’d like to finish.”',
          impact: 'A calm, clear line like that gets attention without starting a fight. Most people who interrupt don’t realize they’re doing it, and they’ll stop once you point it out.',
          next: 'If it keeps happening, suggest going around the circle so everyone gets a turn.',
          close: 'Speaking up kindly is a skill, and you just practiced it.' }
      ]
    },

    {
      id: 'wronganswer', topic: 'emotions', title: 'The wrong answer', place: 'Math class',
      text: 'Noor answers a question out loud, and it’s wrong. A few kids laugh. One points. Noor’s cheeks go red and she stares at her desk.',
      ask: 'Noor looks like she wants to disappear. What do you do?',
      alt: 'A girl in a hijab blushes and looks down, hugging her arms, while two classmates laugh and point behind her.',
      talk: 'How does it feel when people laugh at a mistake you made? What would you want a classmate to do?',
      choices: [
        { id: 'laugh', kind: 'risky', label: 'Laugh along. It was kind of funny',
          impact: 'Even a small laugh adds to the pile Noor is already under. Next time she’ll think twice before raising her hand, and so will everyone else who’s afraid of being wrong.',
          next: 'Stay out of the laughter, and afterward tell her, “I thought the same answer.”',
          close: 'A classroom is only safe to try in if somebody makes it safe.' },
        { id: 'support', kind: 'strong', label: 'Say, “I thought that too,” and check on her after class',
          impact: 'Speaking up breaks the laughter and tells Noor she isn’t alone. It also shows the class that wrong answers are part of learning, not something to mock.',
          next: 'After class, keep it simple: “Don’t worry about it. That one tricked me too.”',
          close: 'One kind sentence can change someone’s whole day.' },
        { id: 'quiet', kind: 'mixed', label: 'Stay quiet and look down at your own desk',
          impact: 'Not laughing matters. You didn’t add to it. But from where Noor sits, silence and laughter can feel almost the same, because nobody is on her side.',
          next: 'Add one small thing: catch her eye, or tell her after class, “That question was hard.”',
          close: 'Not joining in is good. Reaching out is better.' }
      ]
    },
    {
      id: 'badgrade', topic: 'emotions', title: 'A rough grade', place: 'Classroom · tests handed back',
      text: 'Tests come back. You got an A. Your lab partner Jun looks at his paper, drops his head into his hand, and goes completely silent.',
      ask: 'Jun hasn’t moved. What do you do?',
      alt: 'A boy slumps with his hand in his hair over a test covered in red marks while his partner watches with concern.',
      talk: 'When you’re disappointed, what helps more: advice, or someone just getting it?',
      choices: [
        { id: 'show', kind: 'risky', label: 'Hold up your A and ask, “What did you get?”',
          impact: 'You might just be excited, but right now your A lands like salt in a cut. Jun may feel smaller, and less likely to tell you how he’s really doing.',
          next: 'Tuck the test away and check in first: “Rough one? Want to go over it together later?”',
          close: 'Read the room before you share the good news.' },
        { id: 'dismiss', kind: 'mixed', label: 'Tell him, “It’s just one test. Don’t be upset.”',
          impact: 'You’re trying to make him feel better, and that’s kind. But “don’t be upset” can sound like his feelings are wrong, when what he needs first is for someone to get it.',
          next: 'Try starting with the feeling: “That stinks. I’d be bummed too.” Then offer help.',
          close: 'People need to feel heard before they can feel better.' },
        { id: 'offer', kind: 'strong', label: 'Say quietly, “Rough one? Want to go over it together later?”',
          impact: 'You noticed how he felt and offered help without making a big deal of it. Keeping it quiet protects his pride and leaves the choice with him.',
          next: 'If he says no, that’s okay. “I’m around if you change your mind” keeps the door open.',
          close: 'Noticing is the first step of caring.' }
      ]
    },

    {
      id: 'phonegrab', topic: 'communication', title: 'Hands off my phone', place: 'Hallway · before class',
      text: 'You’re texting when Sadie reaches for your phone. “Let me see who you’re talking to!” she says, grinning. This is the third time this week, and you’ve already asked her to stop.',
      ask: 'Sadie is grabbing for it again. What do you do?',
      alt: 'A grinning girl reaches for a phone while her friend holds it out of reach, annoyed, with a hand up to block her.',
      talk: 'What’s something that feels private to you, even with close friends?',
      choices: [
        { id: 'hand', kind: 'mixed', label: 'Hand it over so it doesn’t turn into a fight',
          impact: 'Handing it over avoids an argument today. But it teaches Sadie that grabbing works, and your messages, and the people who sent them, lose their privacy.',
          next: 'You can keep the friendship and the boundary: “I like hanging out with you. My phone is still private.”',
          close: 'Keeping the peace shouldn’t cost you your privacy.' },
        { id: 'boundary', kind: 'strong', label: 'Say, “No, that’s private. Please stop grabbing my phone.”',
          impact: 'You were clear about the line and what you need her to do. A good friend may be surprised for a second, but will respect it.',
          next: 'If she laughs it off and tries again, repeat it once and put your phone away. If it keeps happening, talk to an adult you trust.',
          close: 'A boundary said kindly is still a boundary.' },
        { id: 'grabback', kind: 'risky', label: 'Snatch her phone to show her how it feels',
          impact: 'It might feel fair, but now you’ve both crossed the same line. The lesson gets lost, and it turns into a grabbing match or a real fight.',
          next: 'Use words instead of payback: “I don’t go through your phone. Don’t go through mine.”',
          close: 'You teach people how to treat you by showing them, not by copying them.' }
      ]
    },
    {
      id: 'nickname', topic: 'communication', title: 'Use my name', place: 'Schoolyard · recess',
      text: 'Cole keeps calling you a nickname you hate. You’ve asked him to stop twice. Today he does it again, shrugs, and says, “Relax, I’m just playing.”',
      ask: 'Cole is smirking. What do you do?',
      alt: 'A smirking boy shrugs while another student faces him with a firm look and a raised hand that says stop.',
      talk: 'How do you know when teasing has stopped being fun for someone?',
      choices: [
        { id: 'meaner', kind: 'risky', label: 'Come up with an even meaner nickname for him',
          impact: 'Now it’s a contest of who can be meaner, and nobody wins those. Cole gets to say you’re doing the same thing, and the real problem gets buried.',
          next: 'Skip the comeback and name the line: “I don’t like that name. Stop.”',
          close: 'Standing up for yourself doesn’t require putting someone else down.' },
        { id: 'laughoff', kind: 'mixed', label: 'Laugh it off again so it’s not a big deal',
          impact: 'Laughing keeps things light, but it also tells Cole the nickname is fine with you. He can’t tell you’re bothered if you keep smiling through it.',
          next: 'Drop the smile and say it plainly: “I’ve asked you to stop. Use my name.”',
          close: 'You’re allowed to take your own feelings seriously.' },
        { id: 'firm', kind: 'strong', label: 'Look at him and say, “I asked you to stop. Use my name.”',
          impact: 'A steady voice and eye contact make it clear this isn’t a joke to you. You told Cole exactly what you need, which makes it easy for him to do it.',
          next: 'If he keeps going after a clear ask, it’s no longer playing. That’s the time to bring in a teacher.',
          close: 'Your name is yours. You get to decide what you’re called.' }
      ]
    },

    {
      id: 'picture', topic: 'digital', title: 'A picture starts spreading', place: 'Class group chat · after school',
      text: 'Someone drops an embarrassing photo of Kiara into the class group chat. She clearly didn’t want it shared. Laughing emojis pile up, and two people ask you to forward it.',
      ask: 'The chat is waiting on you. What do you do?',
      alt: 'A student stares at his phone in shock as a photo, laughing emojis, and a forward arrow fill the group chat.',
      talk: 'If a photo of you was being passed around, what would you want your friends to do?',
      resource: { label: 'StopBullying.gov: what kids can do', url: 'https://www.stopbullying.gov/kids/what-you-can-do' },
      choices: [
        { id: 'forward', kind: 'risky', label: 'Forward it. Everyone has already seen it anyway',
          impact: 'Every forward sends the photo to more people and makes it harder to ever pull back. Kiara doesn’t just get embarrassed once. She gets embarrassed again each time it’s shared, and now your name is on it.',
          next: 'Let the chain stop with you. Don’t share it, and tell a trusted adult so it can be taken down.',
          close: 'You can’t unsend a photo, but you can be where it stops.' },
        { id: 'emoji', kind: 'mixed', label: 'Add a laughing emoji, but don’t forward it',
          impact: 'Not forwarding it helps. But a laughing emoji still tells the chat the post is welcome, and Kiara can see exactly who laughed.',
          next: 'Skip the reaction and check on her privately instead: “That wasn’t okay. Are you alright?”',
          close: 'Online, even a tiny tap sends a message.' },
        { id: 'support', kind: 'strong', label: 'Don’t share it, and message Kiara: “I’m not passing it on. You okay?”',
          impact: 'The photo stops with you, and Kiara finds out she has at least one person on her side. That message might be the only kind one she gets tonight.',
          next: 'Ask what she wants: “Do you want help telling a teacher or your parent?” An adult can help get it removed.',
          close: 'Being the one who doesn’t share is a quiet kind of brave.' }
      ]
    },
    {
      id: 'password', topic: 'digital', title: 'Prove you trust me', place: 'Your room · hanging out',
      text: 'Your best friend Harper clasps her hands and says, “Best friends share everything. Just tell me your password. Don’t you trust me?”',
      ask: 'Harper is giving you puppy eyes. What do you say?',
      alt: 'A girl pleads with big hopeful eyes and clasped hands while her friend holds a phone close, uneasy; a padlock hangs between them.',
      talk: 'What’s the difference between keeping a secret and keeping something private?',
      choices: [
        { id: 'keep', kind: 'strong', label: 'Say, “I trust you, but my password stays with me.”',
          impact: 'You separated two things that got tangled: trusting a friend and sharing a login. Saying both parts out loud lets Harper know it isn’t about her.',
          next: 'If she keeps pushing, hold the line kindly and change the subject. If you ever did share a password, change it and tell a parent.',
          close: 'A good friend can hear “no” and still be your friend.' },
        { id: 'share', kind: 'risky', label: 'Tell her. She’s your best friend',
          impact: 'Harper may never mean to misuse it, but once a password is shared you can’t control where it goes. Friendships change, people post from each other’s accounts as jokes, and it’s your name on everything.',
          next: 'You can protect the friendship and the password: “I trust you. My password just isn’t something I share with anyone.”',
          close: 'Trust isn’t proven with passwords.' },
        { id: 'fake', kind: 'mixed', label: 'Give her a fake password',
          impact: 'The fake keeps your account safe, so the instinct is good. But when it doesn’t work, Harper will know you lied, and now the issue is honesty instead of privacy.',
          next: 'The honest version is easier in the long run: “I don’t share passwords, even with people I love.”',
          close: 'You don’t need a trick to keep a boundary.' }
      ]
    },

    {
      id: 'joke', topic: 'bullying', title: 'The joke at the table', place: 'Cafeteria · lunch',
      text: 'At lunch, Carter starts copying the way Ben talks. The table cracks up. “Nobody wants you here,” Carter adds. Ben stares at his tray and stops eating.',
      ask: 'People are looking to see if you’ll laugh. What do you do?',
      alt: 'One student laughs and points, another snickers behind her hand, and the boy between them stares at his lunch tray with a tear in his eye.',
      talk: 'Why is it so hard to be the one person at the table who doesn’t laugh?',
      resource: { label: 'StopBullying.gov: how bystanders can help', url: 'https://www.stopbullying.gov/prevention/bystanders-to-bullying' },
      choices: [
        { id: 'join', kind: 'risky', label: 'Join in on the joke',
          impact: 'Joining in tells the table that mocking Ben is okay, and it tells Ben he’s on his own. Even one more laugh adds weight to what he’s already carrying, and it makes the joke more likely to come back tomorrow.',
          next: 'Don’t add to it. Change the subject or say, “That’s enough,” then check on Ben afterward. If it keeps happening, tell an adult you trust.',
          close: 'You can’t take a laugh back, but you can choose differently next time. Ben will notice.' },
        { id: 'speak', kind: 'strong', label: 'Say, “Not funny, Carter,” and ask Ben to come sit with you',
          impact: 'You broke up the audience Carter was playing to, and you gave Ben a way out with company. When one person speaks up, others who felt uncomfortable often follow.',
          next: 'Check in with Ben later, and let an adult know this is happening. Repeated mocking is bullying, and it shouldn’t be yours to fix alone.',
          close: 'It takes one voice to change a table.' },
        { id: 'silent', kind: 'mixed', label: 'Stay quiet and keep eating',
          impact: 'You didn’t laugh, and that matters. But to Ben, a silent table can feel like everyone agrees with Carter. And Carter reads silence as permission.',
          next: 'Add one small action: sit by Ben, change the subject, or tell him later, “That wasn’t okay. I’m sorry I didn’t say anything.”',
          close: 'Small actions count. Silence usually doesn’t.' }
      ]
    },
    {
      id: 'leftout', topic: 'bullying', title: 'Shut out on purpose', place: 'Hallway · by the lockers',
      text: 'Your group decided nobody is talking to Imani this week. Now she walks up to you with a small wave and says, “Hey.” Behind her, two of your friends are watching and whispering.',
      ask: 'Imani is waiting for you to answer. What do you do?',
      alt: 'A girl gives a small, hopeful wave with a nervous smile while two students behind her whisper and stare.',
      talk: 'Have you ever gone along with a group “rule” you didn’t agree with? What made it hard to break?',
      choices: [
        { id: 'whisper', kind: 'mixed', label: 'Whisper, “I can’t talk right now,” and hurry off',
          impact: 'You let her know it isn’t personal, which is more than nothing. But she’s still left standing alone, and now she knows the group’s rule matters more than she does.',
          next: 'Find her later, away from the group, and be honest: “I’m sorry. That wasn’t right. I’m done with the ignoring thing.”',
          close: 'Halfway kind is a start. Keep going.' },
        { id: 'hi', kind: 'strong', label: 'Say hi back and talk to her like normal',
          impact: 'One normal conversation punches a hole in the freeze-out. Imani knows she isn’t invisible, and your friends see that not everyone is going along with it.',
          next: 'If your friends push back, keep it simple: “I’m not doing the ignoring thing.” If it keeps going, tell an adult. Shutting someone out on purpose is bullying.',
          close: 'Being kind when it costs something is what counts.' },
        { id: 'pretend', kind: 'risky', label: 'Pretend you didn’t hear her and look at your phone',
          impact: 'Being looked through hurts more than most insults. Imani gets the message that even you won’t see her, and your friends learn the freeze-out is working.',
          next: 'It costs very little to say “Hey” back. You don’t need the group’s permission to be decent.',
          close: 'Ignoring someone is still doing something to them.' }
      ]
    },

    {
      id: 'answers', topic: 'honesty', title: 'Send me your answers', place: 'Your desk · the night before it’s due',
      text: 'You just finished the math homework when DeShawn texts: “Send me your answers?? Nobody will know.” He’s your friend, and he sounds stressed.',
      ask: 'He’s waiting for a reply. What do you send?',
      alt: 'A student rests her chin on her fist, torn, as a message asks her to send a photo of her homework.',
      talk: 'Where’s the line between helping a friend and doing the work for them?',
      choices: [
        { id: 'send', kind: 'risky', label: 'Send a photo of your answers. It’s just homework',
          impact: 'It solves tonight for DeShawn, but he still won’t understand the math when the quiz comes. And if two papers match, you’re both in trouble, even though you did the work.',
          next: 'Offer real help instead: “I can’t send answers, but I’ll call and walk you through number one.”',
          close: 'Helping a friend learn beats helping a friend copy.' },
        { id: 'read', kind: 'mixed', label: 'Leave him on read and deal with it tomorrow',
          impact: 'Not sending keeps your work yours, which is the right call. But silence leaves DeShawn stuck and guessing whether you’re mad at him.',
          next: 'A quick honest reply does both jobs: “Can’t send them, sorry. Want help with the first few?”',
          close: 'A clear no is kinder than no answer.' },
        { id: 'help', kind: 'strong', label: 'Reply, “I can’t send answers, but I’ll call and work through it with you.”',
          impact: 'You kept your work honest and still showed up for your friend. Ten minutes on a call helps DeShawn far more than a photo he’d copy without understanding.',
          next: 'If he’s this stressed often, nudge him to tell the teacher he’s stuck. Teachers can only help with what they know about.',
          close: 'You can be a good friend and an honest one at the same time.' }
      ]
    },
    {
      id: 'broken', topic: 'honesty', title: 'Nobody saw', place: 'Science lab · cleanup time',
      text: 'Rushing to put things away, you knock a class tablet off the counter. The screen cracks. You look around. Nobody saw it happen.',
      ask: 'The room is empty. What do you do?',
      alt: 'A student grabs her head, wide-eyed and panicked, staring at a tablet with a cracked screen on the lab counter.',
      talk: 'Why does telling the truth feel scarier than it usually turns out to be?',
      choices: [
        { id: 'tell', kind: 'strong', label: 'Find the teacher and say, “I broke this by accident. How can I help?”',
          impact: 'Telling right away shows it was an accident and that you can be trusted. Most adults respond to honesty with a lot more calm than you’d expect.',
          next: 'Ask what would make it right, whether that’s helping report it or being more careful at cleanup.',
          close: 'Owning it when nobody’s watching is what integrity means.' },
        { id: 'note', kind: 'mixed', label: 'Leave an unsigned note saying it’s broken',
          impact: 'The note makes sure nobody uses a cracked tablet or gets blamed for it, which is thoughtful. But you’ll still carry the worry of being found out, and the teacher can’t see your honesty.',
          next: 'Sign the note, or better, say it in person: “That was me. I’m sorry.”',
          close: 'You’re most of the way to honest. Take the last step.' },
        { id: 'hide', kind: 'risky', label: 'Put it back on the shelf and say nothing',
          impact: 'It works until the next person picks it up. Then someone else might get blamed, and if it’s traced back to you, the hiding looks worse than the accident ever did.',
          next: 'Accidents are forgivable. Go tell the teacher, “I broke this by accident. How can I help fix it?”',
          close: 'The accident wasn’t the problem. Hiding it would be.' }
      ]
    },

    {
      id: 'takeover', topic: 'conflict', title: 'One person runs the show', place: 'Library · group project',
      text: 'Your group has a presentation due Friday. Zoe scoops up all the papers and says, “I’ll just do it all. You two are too slow.” Your other teammate looks at the floor.',
      ask: 'Zoe is already walking off with the work. What do you do?',
      alt: 'A girl hugs a stack of papers with a smug, eyes-closed look; one teammate folds his arms, annoyed, and another looks down, deflated.',
      talk: 'What does a good group leader do differently from a bossy one?',
      choices: [
        { id: 'let', kind: 'mixed', label: 'Let her. Less work for you',
          impact: 'It’s less work today. But your name goes on a project you didn’t shape, you won’t know the material when it’s time to present, and Zoe ends up stressed and resentful.',
          next: 'Offer a split instead: “Let’s each take a part. Which one do you want most?”',
          close: 'Easy now can mean awkward on Friday.' },
        { id: 'argue', kind: 'risky', label: 'Tell her she’s not the boss and argue about who’s in charge',
          impact: 'Now the fight is about who’s in charge instead of the project. Time gets burned, Zoe digs in harder, and your third teammate pulls back even more.',
          next: 'Aim at the work, not the person: “I want to do my share. Can we split this three ways?”',
          close: 'Fight for the project, not for the title.' },
        { id: 'split', kind: 'strong', label: 'Say, “We each need a part. Which section do you want most?”',
          impact: 'You pushed back without attacking her, and you gave Zoe first pick, which respects how much she cares. It also pulls your quiet teammate back in.',
          next: 'Write down who’s doing what and when you’ll check in. Clear roles prevent the next argument.',
          close: 'Good leaders make room. You just led.' }
      ]
    },
    {
      id: 'missingpart', topic: 'conflict', title: 'The missing part', place: 'Library · the day before presenting',
      text: 'You present tomorrow, and Andre’s slides are still blank. He’s clutching his head at his laptop. Lena crosses her arms and says, “Seriously? You had all week.”',
      ask: 'Andre looks overwhelmed and Lena is fuming. What do you do?',
      alt: 'A boy clutches his head, overwhelmed, in front of a laptop with empty slides while a teammate glares with her arms crossed.',
      talk: 'When a teammate lets you down, what do you want to know before you get mad?',
      choices: [
        { id: 'pileon', kind: 'risky', label: 'Back Lena up: “Yeah, you’re going to make us fail.”',
          impact: 'Piling on might feel honest, but shame rarely makes anyone work faster. Andre is already overwhelmed, and now he’s embarrassed too, which makes it harder for him to think.',
          next: 'Swap blame for a plan: “What’s getting in the way? What can you finish tonight, and what can we help with?”',
          close: 'Pressure plus blame equals a frozen teammate.' },
        { id: 'ask', kind: 'strong', label: 'Ask, “What’s getting in the way? What can you finish tonight?”',
          impact: 'You treated it as a problem to solve instead of a person to blame. Andre gets a way forward, and you learn whether he’s stuck, confused, or dealing with something else.',
          next: 'Split what’s left into small pieces with times, and check in once tonight. Tell the teacher if the workload was truly uneven.',
          close: 'The best teammates ask before they judge.' },
        { id: 'doit', kind: 'mixed', label: 'Quietly do his slides yourself tonight',
          impact: 'The project gets finished, and that’s generous of you. But Andre never learns what went wrong, you end up tired and maybe resentful, and it sets you up to carry him next time.',
          next: 'If you help, do it with him, not for him: “I’ll take two slides if you take two. Deal?”',
          close: 'Rescuing isn’t the same as teamwork.' }
      ]
    },

    {
      id: 'name', topic: 'bullying', title: 'Say my name', place: 'Classroom · first week',
      text: 'During introductions, a classmate squints at Oluwaseun’s name tag and laughs. “That’s way too hard. I’ll just call you Sam.” Oluwaseun’s smile fades and he looks down.',
      ask: 'The classmate turns to you, grinning. What do you do?',
      alt: 'A cheerful boy shrugs as he says “Sam?” while the classmate he renamed looks down, his smile gone.',
      talk: 'What does your name mean to you? How does it feel when someone gets it wrong on purpose?',
      resource: { label: 'Learning for Justice: responding to bias at school', url: 'https://www.learningforjustice.org/publication/responding-to-hate-and-bias-at-school' },
      choices: [
        { id: 'later', kind: 'mixed', label: 'Say nothing now, but tell Oluwaseun later that it wasn’t okay',
          impact: 'Checking in later does help. He’ll know someone noticed. But in the moment he still stood there alone, and the classmate never heard that anyone disagreed.',
          next: 'Next time, even a quick “Actually, it’s Oluwaseun” in the moment does a lot.',
          close: 'Support counts most when it shows up on time.' },
        { id: 'say', kind: 'strong', label: 'Say, “It’s Oluwaseun. Can you say it once more so we get it right?”',
          impact: 'You showed that his name is worth the effort, and you made it normal to ask instead of rename. Oluwaseun sees that someone in the room respects who he is.',
          next: 'Use his name in conversation today. Hearing it said right, casually, means more than a big speech.',
          close: 'Getting someone’s name right is a small act of respect that lands big.' },
        { id: 'laugh', kind: 'risky', label: 'Laugh along and move on',
          impact: 'Laughing along tells Oluwaseun that his real name is a joke here. A name carries family and history, and having it swapped out says, “You’re too much trouble to learn.”',
          next: 'The fix is small: say his name out loud, correctly, and ask him to help you get it right.',
          close: 'Learning a name takes a minute. Being renamed can sting for years.' }
      ]
    },
    {
      id: 'food', topic: 'bullying', title: 'Lunch from home', place: 'Cafeteria · lunch',
      text: 'Linh opens her lunch from home. The kid across from her pinches his nose. “Ew, what is that? It smells weird.” Linh’s face turns red and she starts closing the lid.',
      ask: 'Linh is about to put her lunch away. What do you do?',
      alt: 'A boy pinches his nose with a disgusted face while a girl blushes and looks down, closing her lunchbox.',
      talk: 'What’s a food or tradition from our family that you’d want friends to be curious about?',
      choices: [
        { id: 'scoot', kind: 'risky', label: 'Scoot away a little so nobody teases you too',
          impact: 'Moving away protects you for a moment, but to Linh it looks like you agree. Now she’s dealing with the comment and an empty space beside her.',
          next: 'Stay put. Even staying next to her says something. Better yet, ask about her lunch.',
          close: 'Where you sit can say more than words.' },
        { id: 'ask', kind: 'strong', label: 'Say, “It looks good to me. What is it, Linh?”',
          impact: 'Your curiosity flips the moment from “weird” to “interesting.” Linh gets to explain her food with pride instead of hiding it, and the insult loses its audience.',
          next: 'If the comments keep coming, be direct: “Don’t make fun of people’s food.” Tell an adult if it becomes a pattern.',
          close: 'Curiosity is one of the kindest things you can offer.' },
        { id: 'stay', kind: 'mixed', label: 'Say nothing, but stay sitting right next to her',
          impact: 'Staying close matters. Linh isn’t alone at the table. But the comment still hangs there unanswered, and she may still put her lunch away.',
          next: 'Add a few words: “Don’t listen to him. That looks good.”',
          close: 'Staying is good. Staying and speaking is better.' }
      ]
    },

    {
      id: 'secret', topic: 'safety', title: 'A secret that’s too big', place: 'Bench outside school · after class',
      note: 'This practice is about a friend who is feeling hopeless. You can skip it, and you can always talk with a trusted adult instead.',
      text: 'Riley has been quiet for weeks. Today Riley says, “Sometimes I don’t see the point of anything. Promise you won’t tell anyone.” Riley is hugging their arms and won’t look up.',
      ask: 'Riley is waiting for your promise. What do you do?',
      alt: 'A teenager sits hunched on a bench at dusk, eyes down, arms wrapped tight, while a friend reaches a hand toward their shoulder with a worried look.',
      talk: 'Who are three adults you could go to if a friend told you something that scared you?',
      resource: { label: '988 Lifeline: call or text 988 (U.S.), any time', url: 'https://988lifeline.org/' },
      choices: [
        { id: 'promise', kind: 'risky', label: 'Promise to keep it secret',
          impact: 'Promising feels loyal, but it leaves Riley without the help they need and leaves you carrying something too heavy for one person. Words like these should always be taken seriously.',
          next: 'Stay with Riley, and tell a trusted adult today, like a parent, counselor, or teacher, even though Riley asked you not to. In the U.S., anyone can call or text 988 at any time.',
          close: 'Telling isn’t betraying Riley. It’s how you stay their friend.' },
        { id: 'together', kind: 'strong', label: 'Say, “I’m glad you told me. I care too much to keep this secret. Let’s go to the counselor together.”',
          impact: 'You listened, you took it seriously, and you didn’t leave Riley alone with it. Offering to go together makes getting help feel less scary. This is what a caring friend does.',
          next: 'Stay with Riley until an adult is involved. If Riley won’t go, tell the counselor or a parent yourself, today. In the U.S., anyone can call or text 988 at any time.',
          close: 'You don’t have to fix it. You just have to bring in someone who can help.' },
        { id: 'brush', kind: 'risky', label: 'Say, “Everyone feels like that sometimes,” and change the subject',
          impact: 'You may be trying to comfort Riley, but this can sound like their feelings aren’t a big deal. Riley might decide not to tell anyone else, and that’s the danger.',
          next: 'Go back to it: “I’m sorry I brushed that off. I’m worried about you.” Then tell a trusted adult today. In the U.S., anyone can call or text 988 at any time.',
          close: 'It’s never too late to take a friend seriously.' }
      ]
    },
    {
      id: 'smoke', topic: 'safety', title: 'Something smells like smoke', place: 'Hallway · near the science rooms',
      text: 'You and Mateo smell smoke near the science rooms. A thin gray haze is drifting along the ceiling. Mateo points. “Let’s go check it out ourselves!”',
      ask: 'Mateo is already stepping toward it. What do you do?',
      alt: 'A curious boy points toward smoke drifting down the hallway while his alarmed friend throws up a hand to stop him.',
      talk: 'If something felt unsafe at school, who is the nearest adult you would tell?',
      choices: [
        { id: 'check', kind: 'risky', label: 'Go with him to find where it’s coming from',
          impact: 'Walking toward smoke puts both of you closer to whatever is causing it, and smoke itself can hurt you quickly. Adults also lose time if they have to look for you two.',
          next: 'Move away from the smoke and tell the nearest adult exactly where you smelled it. Then follow your school’s emergency directions.',
          close: 'Brave isn’t walking toward danger. It’s getting the right help fast.' },
        { id: 'keepwalking', kind: 'mixed', label: 'Keep walking. Someone else probably reported it',
          impact: 'Walking away from the smoke keeps you safer, and that part is right. But if everyone assumes someone else reported it, nobody does.',
          next: 'Take ten seconds to tell an adult: “I smelled smoke by the science rooms.” If they already know, no harm done.',
          close: 'If you notice it, report it. Don’t count on “someone else.”' },
        { id: 'tell', kind: 'strong', label: 'Stop him, move away, and tell the nearest teacher exactly where it is',
          impact: 'You kept both of you out of danger and got the information to someone who can act on it. “Near the science rooms, by the ceiling” is exactly the detail adults need.',
          next: 'Follow the school’s emergency directions right away, and stay with your class so adults know you’re safe.',
          close: 'Quick thinking and a clear report can protect a whole building.' }
      ]
    },

    /* ───────── added with the 48-scenario library; their pictures are staged from `scene` ───────── */
    /* ───────── Digital choices and social media ───────── */
    {
      id: 'pileon', topic: 'digital', title: 'The comment pile-on', place: 'Your room · after dinner',
      text: 'Ines posted a video of herself singing. The comments are turning mean. “My ears hurt,” one says. Your friend Tyrell tags you: “Add something funny!” Your thumb hovers over the keyboard.',
      ask: 'Tyrell is waiting for your comment. What do you do?',
      alt: 'In your bedroom at night, you hold your phone and look uneasy while a grinning boy types on his and message cards pile up.',
      talk: 'Why is it easier to be mean online than face to face? What would you want a friend to do if the comments were about you?',
      adult: 'mom',
      scene: { bg: 'room', me: ['uneasy', 'phone', 'phone'], them: [['k3', 'cheeky', 'phone', 'phone']], extra: 'chat' },
      choices: [
        { id: 'addjoke', kind: 'risky', act: 'joke', label: 'Add a joke about her singing so Tyrell laughs',
          impact: 'One more joke feels small when twenty people already posted. But Ines reads every one, and yours comes from someone she knows. Comments can be screenshotted and saved long after the laugh is over.',
          next: 'Before you post, ask yourself, “Would I say this to her face?” If not, skip it. Then send Ines one kind line instead.',
          close: 'A pile-on is made of single comments. Yours counts.' },
        { id: 'closeapp', kind: 'mixed', act: 'block', label: 'Close the app and stay out of it',
          impact: 'Staying out means you add nothing to the pile, and that matters. But Ines still sees a wall of mean comments and nobody on her side. From where she sits, silence can look like agreeing.',
          next: 'You don’t have to fight the whole thread. One private message, like “I liked your video,” can change her night.',
          close: 'Not joining in is good. Showing up for someone is even better.' },
        { id: 'kindline', kind: 'strong', act: 'phone', label: 'Post “It took guts to share this” and message Ines privately',
          impact: 'A kind comment breaks the pattern. It shows Ines she isn’t alone, and it makes other people think twice before adding another joke. Often one person going first is all it takes.',
          next: 'If the comments keep getting crueler, take a screenshot and show a parent or teacher. Ines can also report the thread.',
          close: 'One kind comment can be louder than ten mean ones.' }
      ]
    },
    {
      id: 'gamechat', topic: 'digital', title: 'New friend in game chat', place: 'Home · after homework',
      text: 'For weeks you’ve teamed up online with a player called PixelWolf. Today the messages change. “You’re so cool. What school do you go to? Send a pic. Don’t tell your parents, they won’t get it.” Your stomach flips.',
      ask: 'PixelWolf is typing again. What do you do?',
      alt: 'On the couch at home, you hold your phone and look uneasy as message cards pop up beside you.',
      talk: 'How can you tell the difference between a friend online and a stranger who is being friendly? Who would you show a message like this?',
      adult: 'dad',
      note: 'This practice is about someone online asking for personal details. You can skip it, and you can always talk with a trusted adult instead.',
      scene: { bg: 'home', me: ['uneasy', 'phone', 'phone'], them: [], extra: 'chat' },
      choices: [
        { id: 'sayno', kind: 'mixed', act: 'refuse', to: 'solo', label: 'Type “I don’t share that stuff” and keep playing together',
          impact: 'Saying no to personal questions protects your information, and that is a smart instinct. But someone who asks you to hide things from your parents usually keeps pushing. Staying in the chat gives them more chances.',
          next: 'Go one step further. Stop replying, block the player, and show the messages to a parent or another trusted adult.',
          close: 'A good no is even stronger with an adult behind it.' },
        { id: 'answer', kind: 'risky', act: 'giveIn', to: 'solo', label: 'Answer the questions, since you’ve played together for weeks',
          impact: 'Playing together can feel like knowing someone, but you only know a username. Your school and your photo can’t be taken back once they are sent. “Don’t tell your parents” is a warning sign, not a friendship sign.',
          next: 'It’s not too late, even if you already shared something. Stop replying and tell a parent or trusted adult today. Asking for help is the right move.',
          close: 'Real friends never ask you to keep them a secret.' },
        { id: 'showadult', kind: 'strong', act: 'tell', label: 'Stop replying, block and report the player, and show a parent the messages',
          impact: 'Blocking ends the conversation, and reporting helps protect other kids in the game. Showing an adult the messages means you don’t have to figure out alone whether this person is safe.',
          next: 'Keep the screenshots so your parent can see exactly what was said. Together you can check the privacy settings on your account.',
          close: 'Showing an adult isn’t tattling. It’s how you stay safe.' }
      ]
    },

    /* ───────── Honesty and integrity ───────── */
    {
      id: 'change', topic: 'honesty', title: 'Too much change', place: 'Bake sale table · lunch',
      text: 'You buy a cookie at the bake sale with a five. Malia, the eighth grader running the cash box, is rushing. She hands you change for a twenty. Nobody notices. The extra bills feel warm in your hand.',
      ask: 'The line is moving. What do you do?',
      alt: 'At a bake sale table in the cafeteria, you look down at the cash in your hands while a busy older girl talks to the next person.',
      talk: 'Is it still dishonest if the mistake was someone else’s? Who ends up paying for it?',
      scene: { bg: 'cafe', me: ['thinking', 'hold', 'cash'], them: [['k6', 'talk', 'half']], extra: 'table' },
      choices: [
        { id: 'giveback', kind: 'strong', act: 'honest', label: 'Say, “You gave me too much,” and hand the extra back',
          impact: 'Malia gets to fix the mistake before the cash box comes up short. It takes ten seconds, and she learns you’re someone she can trust with money, even when no one is checking.',
          next: 'If she looks flustered, keep it light: “No worries, it’s busy.” Then enjoy your cookie.',
          close: 'Honesty counts most when nobody would ever know.' },
        { id: 'jar', kind: 'mixed', act: 'share', label: 'Slip the extra into the donation jar without saying anything',
          impact: 'The money ends up back with the bake sale, so you didn’t keep what wasn’t yours. But the cash box still comes up short, and Malia may spend the afternoon wondering what she did wrong.',
          next: 'Add the missing piece. Tell her, “You gave me too much change earlier. I put it in the jar.”',
          close: 'Fixing it quietly is good. Fixing it out loud clears things up.' },
        { id: 'pocket', kind: 'risky', act: 'hide', label: 'Pocket the money, since it was her mistake',
          impact: 'It can feel like luck, not lying. But the cash box will be short at the end of the day, and Malia is the one who has to explain it. The money also tends to feel heavier than you expect.',
          next: 'You can still turn around. “Hey, I think you gave me too much” works just as well five minutes later.',
          close: 'Someone else’s mistake doesn’t make it yours to keep.' }
      ]
    },
    {
      id: 'credit', topic: 'honesty', title: 'Whose idea was it?', place: 'Classroom · project day',
      text: 'Your teacher holds up your team’s poster. “This pop-up volcano is brilliant! Whose idea was it?” It was Pavel’s. But your teacher is smiling right at you, and Pavel hasn’t said a word. Your chest feels warm from the praise.',
      ask: 'Your teacher is waiting for an answer. What do you say?',
      alt: 'In a classroom, your teacher happily holds up a paper while you rub the back of your neck, thinking, and a quiet classmate looks on hopefully.',
      talk: 'How does it feel when someone else gets praised for your idea? Why can sharing credit be hard in the moment?',
      scene: { bg: 'classroom', me: ['thinking', 'neck'], them: [['teacher', 'happy', 'hold', 'paper'], ['k4', 'hopeful', 'down']] },
      choices: [
        { id: 'claim', kind: 'risky', act: 'lie', label: 'Say, “Thanks! I thought of it last night.”',
          impact: 'The praise feels great for a minute. But Pavel knows the truth, and now he knows you’ll take what’s his when it’s easy. Trust between partners is hard to rebuild once it cracks.',
          next: 'You can still fix it today. Tell your teacher, “Actually, the volcano was Pavel’s idea,” and tell Pavel you’re sorry.',
          close: 'Praise you didn’t earn never feels as good as it looks.' },
        { id: 'namehim', kind: 'strong', act: 'honest', label: 'Say, “That was Pavel’s idea. I did the lettering.”',
          impact: 'Pavel gets seen for his work, and you still get credit for yours. Your teacher also learns something about you that matters more than a poster. You tell the truth when it costs you a little.',
          next: 'Keep doing it in small moments. “That was her idea” is one of the easiest ways to build trust on a team.',
          close: 'Giving credit away doesn’t shrink your share.' },
        { id: 'weboth', kind: 'mixed', act: 'calm', label: 'Say, “We both worked on it,” and leave it there',
          impact: 'It’s true that you both worked hard, and you didn’t claim the idea outright. But the question was whose idea it was. A fuzzy answer lets the praise land on you while Pavel’s part stays hidden.',
          next: 'Make it specific: “We both built it, but the pop-up volcano was Pavel’s idea.”',
          close: 'A half-truth can still leave someone out.' }
      ]
    },

    /* ───────── Emotions and self-control ───────── */
    {
      id: 'ragequit', topic: 'emotions', title: 'One more loss', place: 'Living room · Saturday afternoon',
      text: 'Your cousin Bashir zooms past you at the finish line. That’s five losses in a row. “Too slow!” he laughs. Your jaw is tight and your hands squeeze the controller. You want to throw it across the room.',
      ask: 'Bashir is starting a rematch. What do you do?',
      alt: 'In a living room, you grip a game controller, angry, while your cousin laughs and holds his own controller.',
      talk: 'Where do you feel anger first in your body? What is one thing that helps it pass?',
      adult: 'mom',
      scene: { bg: 'home', me: ['angry', 'hold', 'controller'], them: [['k7', 'laugh', 'hold', 'controller']], extra: 'storm' },
      choices: [
        { id: 'leave', kind: 'mixed', act: 'walk', label: 'Quit the game and go to your room without a word',
          impact: 'Walking away before you throw something is a real win. Nothing gets broken and nobody gets hurt. But Bashir has no idea what happened, and the anger comes with you to your room.',
          next: 'Add one sentence on your way out: “I’m getting too mad. I need a break.” Then come back when your body feels calmer.',
          close: 'Leaving is okay. Saying why makes it stronger.' },
        { id: 'throwit', kind: 'risky', act: 'yell', label: 'Throw the controller and shout, “This game is rigged!”',
          impact: 'The anger gets out fast, but it takes other things with it. Controllers break, Bashir stops wanting to play with you, and you may lose the game for a lot longer than one afternoon.',
          next: 'Next time your jaw gets tight, treat it as a signal. Put the controller down and say, “I need a minute.”',
          close: 'Losing a game is small. What you do next can make it big.' },
        { id: 'pause', kind: 'strong', act: 'breathe', label: 'Set the controller down and say, “I’m getting mad. I need a minute.”',
          impact: 'Naming the feeling out loud takes some of its power away. A few minutes and a drink of water let your body cool down, and Bashir sees you can lose without blowing up.',
          next: 'When you come back, try a different game, or ask Bashir to show you how he takes that last turn.',
          close: 'It’s okay to be mad. You’re still the one holding the controls.' }
      ]
    },
    {
      id: 'stagefright', topic: 'emotions', title: 'Your turn to present', place: 'Classroom · presentation day',
      text: 'You’re next to present your book report. Your hands are shaking and your mouth is dry. Your heart pounds so loud you’re sure everyone can hear it. Your teacher smiles and says, “Whenever you’re ready.”',
      ask: 'The room goes quiet. What do you do?',
      alt: 'At the front of a classroom, you hold your papers and look nervous while your teacher smiles at you.',
      talk: 'What does being nervous feel like in your body? What has helped you get through it before?',
      scene: { bg: 'classroom', me: ['nervous', 'hold', 'papers'], them: [['teacher', 'smile', 'half']] },
      choices: [
        { id: 'begin', kind: 'strong', act: 'breathe', label: 'Take two slow breaths, plant your feet, and read your first line',
          impact: 'Slow breaths tell your body it’s safe, and your heart starts to settle. Starting is usually the hardest part. Once the first sentence is out, the nerves often shrink with every line.',
          next: 'Next time, practice your opening sentence until you know it cold. A strong start carries you through the shaky part.',
          close: 'Brave doesn’t mean not nervous. It means nervous and doing it anyway.' },
        { id: 'nurse', kind: 'risky', act: 'lie', label: 'Say you feel sick and ask to go to the nurse',
          impact: 'The fear drops right away, and that relief is real. But the presentation is still waiting tomorrow, and now the fear has had a whole night to grow. Skipping it teaches your brain that presenting really is dangerous.',
          next: 'Tell your teacher the true thing instead: “I’m really nervous.” Teachers hear that a lot, and most have ways to help.',
          close: 'Nerves get smaller when you walk through them, not around them.' },
        { id: 'golast', kind: 'mixed', act: 'ask', label: 'Ask your teacher if you can go last',
          impact: 'Asking for what you need is a good skill, and a few extra minutes can help you steady yourself. But waiting can also give the nerves more time to build while you watch everyone else finish.',
          next: 'If you do wait, use the time. Breathe slowly, read your first line in your head, and pick one friendly face to look at.',
          close: 'Extra time helps most when you use it to get ready.' }
      ]
    },

    /* ───────── Safety and asking for help ───────── */
    {
      id: 'ride', topic: 'safety', title: 'A ride you didn’t expect', place: 'School gate · after practice',
      text: 'Practice ran late and your ride isn’t here. A car pulls up. A man you’ve seen at a few games rolls down the window. “I’m Luca’s uncle. Your mom sent me. Hop in.” Your mom never mentioned this.',
      ask: 'He’s waiting with the engine running. What do you do?',
      alt: 'At the school gate, you stand alone hugging your arms, looking uneasy and unsure.',
      talk: 'Does your family have a pickup plan or a code word? Which adults could you go to if a plan changes suddenly?',
      adult: 'coach',
      note: 'This practice is about being offered a ride by someone you don’t know well. You can skip it, and you can always talk with a trusted adult instead.',
      scene: { bg: 'gate', me: ['uneasy', 'hug'], them: [], extra: '?' },
      choices: [
        { id: 'getin', kind: 'risky', act: 'giveIn', to: 'solo', label: 'Get in, since he knows your friend and your mom',
          impact: 'He might be telling the truth. But you can’t check from the sidewalk, and anyone can learn a name or two. Once you’re in a car, you have far fewer choices than you do standing outside it.',
          next: 'Stay out of the car and step back. Say, “I need to check with my mom first,” and go find your coach or another adult you know.',
          close: 'You never have to be polite about your own safety.' },
        { id: 'waitalone', kind: 'mixed', act: 'refuse', to: 'solo', label: 'Say, “No thanks, I’ll wait,” and stay at the gate alone',
          impact: 'Saying no and staying out of the car is exactly the right call. But you’re still alone at the gate, it’s getting late, and no adult knows what just happened or where you are.',
          next: 'Walk back to where your coach or other adults are. Tell them about the car, and call home from there.',
          close: 'A strong no works best with a safe place to go next.' },
        { id: 'findcoach', kind: 'strong', act: 'tell', label: 'Step back, say “I’ll check first,” and go find your coach',
          impact: 'You keep your distance, and you don’t have to decide whether he’s telling the truth. Your coach can call your mom in one minute. If the ride is real, nothing is lost. If it isn’t, you’re already safe.',
          next: 'Talk with your family about a pickup plan, like a code word that only you and your trusted adults know.',
          close: 'Checking first is never rude. Safe adults understand.' }
      ]
    },
    {
      id: 'backpack', topic: 'safety', title: 'What’s in the backpack', place: 'Lockers · before first bell',
      text: 'At the lockers, Emeka unzips his backpack a little. Inside is a pocketknife. “It’s my brother’s. Cool, right?” he whispers. “Don’t tell anyone. I’d be in so much trouble.” Your stomach drops. You like Emeka.',
      ask: 'The bell is about to ring. What do you do?',
      alt: 'In a school hallway, a grinning boy talks quietly to you while you stand tense and alarmed.',
      talk: 'What is the difference between a secret that is fun to keep and a secret that could get someone hurt?',
      adult: 'teacher',
      note: 'This practice is about a friend who brings something dangerous to school. You can skip it, and you can always talk with a trusted adult instead.',
      scene: { bg: 'hall', me: ['alarmed', 'tense'], them: [['k10', 'cheeky', 'half']], extra: '!' },
      choices: [
        { id: 'takehome', kind: 'mixed', act: 'calm', label: 'Tell Emeka, “That’s not safe here. Take it home,” and say nothing else',
          impact: 'Telling Emeka the truth to his face takes courage, and he may even listen. But the knife is still in the building all day, and no adult who could keep everyone safe knows it’s there.',
          next: 'Take the next step and quietly tell a teacher or counselor right away. You can say, “I’m worried about something in a friend’s backpack.”',
          close: 'Some problems are too big for kids to hold alone.' },
        { id: 'teacher', kind: 'strong', act: 'tell', label: 'Go straight to a teacher and quietly say what you saw',
          impact: 'A teacher can handle it calmly and privately, before anyone gets hurt. Emeka may be upset with you at first. But an adult stepping in early is far better for him than an accident, or someone else finding it.',
          next: 'You don’t have to confront Emeka or touch the backpack. Tell the adult what you saw and where, and let them take it from there.',
          close: 'Telling to keep people safe is not snitching.' },
        { id: 'promise', kind: 'risky', act: 'giveIn', label: 'Promise to keep it secret and ask to see it',
          impact: 'Keeping the promise feels loyal. But now you are carrying a secret that could get someone hurt, and handling the knife puts you in the middle of it. Accidents happen fast, even when nobody means harm.',
          next: 'A promise like this one is okay to break. Step away and tell a teacher or another trusted adult as soon as you can.',
          close: 'Safety secrets are the ones you’re allowed to tell.' }
      ]
    }
  ];

  /* Pictures for the first 24 scenarios, whose scenes are hand-drawn in art.js:
     choice id → act, or 'act:to' where to is the person sharing the picture. */
  var PICS = {
    heated: { snap: 'yell', walk: 'calm', stew: 'silent' },
    blamed: { yell: 'yell', avoid: 'walk', cool: 'calm' },
    quiet: { ask: 'ask', ignore: 'ignore', others: 'phone' },
    apology: { normal: 'ignore', sorry: 'kind', but: 'lie' },
    vape: { take: 'giveIn', no: 'refuse', later: 'lie' },
    dare: { excuse: 'lie', go: 'giveIn', offer: 'calm' },
    directions: { raise: 'ask:adult', copy: 'write', pretend: 'worry' },
    talkedover: { giveup: 'silent', shutdown: 'yell', speak: 'calm' },
    wronganswer: { laugh: 'joke:2', support: 'kind:2', quiet: 'ignore:2' },
    badgrade: { show: 'ask', dismiss: 'calm', offer: 'help' },
    phonegrab: { hand: 'giveIn', boundary: 'refuse', grabback: 'grab' },
    nickname: { meaner: 'yell', laughoff: 'lie', firm: 'calm' },
    picture: { forward: 'post', emoji: 'phone', support: 'kind' },
    password: { keep: 'refuse', share: 'giveIn', fake: 'lie' },
    joke: { join: 'joke:2', speak: 'calm:0', silent: 'ignore:2' },
    leftout: { whisper: 'walk:2', hi: 'kind:2', pretend: 'ignore:2' },
    answers: { send: 'post', read: 'ignore', help: 'kind' },
    broken: { tell: 'tell', note: 'write', hide: 'hide:solo' },
    takeover: { let: 'silent:1', argue: 'yell:1', split: 'ask:1' },
    missingpart: { pileon: 'yell:1', ask: 'ask:1', doit: 'write' },
    name: { later: 'silent:1', say: 'calm:0', laugh: 'joke:1' },
    food: { scoot: 'walk:1', ask: 'kind:1', stay: 'silent:1' },
    secret: { promise: 'help', together: 'tell', brush: 'ignore' },
    smoke: { check: 'giveIn', keepwalking: 'walk', tell: 'tell' }
  };
  var CASTING = { picture: { foil: 'k3' }, answers: { foil: 'k5' }, secret: { adult: 'counselor' } };
  SCENARIOS.forEach(function (s) {
    var m = PICS[s.id]; if (!m) return;
    Object.assign(s, CASTING[s.id] || {});
    s.choices.forEach(function (c) {
      var p = (m[c.id] || 'calm').split(':');
      c.act = p[0];
      if (p[1] != null) c.to = /^\d+$/.test(p[1]) ? Number(p[1]) : p[1];
    });
  });

  var KIND = {
    strong: { tag: 'Helps', heading: 'That choice helps.', nextLabel: 'Your next step' },
    mixed: { tag: 'Partly helps', heading: 'A fair start. Let’s build on it.', nextLabel: 'To make it stronger' },
    risky: { tag: 'Makes it harder', heading: 'Let’s look at that choice.', nextLabel: 'A better option' }
  };

  var VALUES = ['Staying safe', 'Being fair', 'Kindness', 'Courage', 'Honesty', 'Staying calm', 'Fitting in'];

  global.CRData = {
    groups: GROUPS, topics: TOPICS, scenarios: SCENARIOS, kind: KIND, values: VALUES,
    add: function (list) { list.forEach(function (x) { SCENARIOS.push(x); }); },
    group: function (id) { return GROUPS.filter(function (g) { return g.id === id; })[0]; },
    featured: ['joke', 'heated', 'picture'],
    topic: function (id) { return TOPICS.filter(function (t) { return t.id === id; })[0]; },
    scenario: function (id) { return SCENARIOS.filter(function (s) { return s.id === id; })[0]; }
  };
})(window);
