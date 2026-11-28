ChoiceLab
=========
A practice app for students and the adults who support them. Students
practice real-life situations, choose how they would respond, see what could
happen, and write a short reflection. Parents and teachers assign practice
and follow each student's progress.

To open
-------
Double-click index.html (any modern browser). No install, no server.
Keep the css and js folders beside index.html.

What's inside
-------------
index.html          App shell
css/styles.css      Styling (phone-first; dark "midnight" theme, ripple rings)
js/data.js          Sections, the 12 topics, and the 32 Everyday Life scenarios
js/data-faith.js    The 16 Faith and Spiritual Growth scenarios
js/art.js           Anime-style art drawn as SVG: characters, scenes, and a
                    picture for every choice and its outcome
js/app.js           Profiles, the practice flow, parent and teacher views
js/config.js        Switches you can turn on or off (see "Switches" below)

The library: 48 scenarios, 12 topics, 4 scenarios in each
---------------------------------------------------------
Everyday Life (32)
  Bullying and exclusion · Conflict and anger · Friendship and peer
  pressure · Digital choices and social media · Honesty and integrity ·
  Emotions and self-control · Communication and respect · Safety and
  asking for help
Faith and Spiritual Growth (16)
  Fear and trusting God · Prayer and patience · Forgiveness and grace ·
  Identity, purpose, and doing what is right

Students see only the practices assigned to them, plus any optional ones a
parent or teacher makes available. Parents and teachers can browse and
preview the whole library ("Browse the full library").

How it works
------------
Home     "See how it works" previews a scenario without saving anything.
Student  Pick a profile -> Up next. Each practice has five steps, and a
         student has to finish each one before the next opens:
           1 Situation          the scenario, its picture, and Listen
           2 Your choice        three options, each with a picture
           3 What could happen  the choice beside its likely outcome
                                (cause and effect), kept apart from...
           4 Reflect            why they chose it and what they might do
                                next time, in at least 10 words
           5 Complete           the last page: "Scenario complete (5/5)",
                                a message for that choice, a picture of a
                                helpful outcome with the student in it,
                                20 Courage Credits, their own reflection,
                                then "Continue to next scenario" or
                                "Return to assignments"
         Read-aloud is on every step.
         One practice at a time: once a student has made a choice, that
         practice shows "Started" and the others are locked until its
         reflection is finished. Coming back later picks it up at step 3.
         Every practice in the student's list shows who it is from and
         whether it is Not started, Started or Done.
         "Edit my character" lets a student make their character look like
         them (skin tone, hair or head covering, colours, top, glasses).
         That character is drawn as "you" in the scenes, in the picture for
         each choice, and in what could happen.
         Courage Credits: 20 for each finished practice, the same for every
         choice. They celebrate practice, not perfect answers.
Parent   Your students -> Open profile. The profile is short: the numbers,
         then "Assigned to <name>" (who assigned each practice and whether
         it is Not started or Started). Four sections open when you want
         the detail: Completed practices (the choice made, what the student
         read and wrote, a question to talk about), How <name> is choosing,
         Progress by topic, and Assign practice.
Teacher  Your classes and groups -> open one. "Assign practice to
         everyone" is the button at the top. Under the numbers,
         "Assigned to this class" lists every assigned and optional
         scenario with how many students are done, started and not
         started, and a Remove button. Then the roster, and how the class
         is choosing on each assigned scenario (with a class discussion
         question). Open a student for the same profile a parent sees.
         Groups can be a class, a small group, or an ISS / detention
         group; that label and the group's name appear only in the
         teacher view, never to students or parents.
         Removing a student from a group and deleting a group both ask for
         confirmation first.
Assign   Pick the type of practice (Everyday Life or Faith-based), then
         "Assign" a practice (it goes into the student's Up next) or mark
         it "Optional" (available, not required). Students see who each
         practice is from.
Back     Every parent and teacher page has a Back button that returns to
         the page you came from.

Switches
--------
js/config.js holds the app's switches. Open it in Notepad, change the
value, save, and reload the page.

studentAccess (off by default): a preview of the future sign-in.
  Off  Students pick their profile from a list.
  On   Students type their own access code and 4-digit PIN to open only
       their profile ("Sign out" replaces "Switch student"). Each
       student's profile in the parent and teacher views gains a
       "Student sign-in" section with the access code, the PIN (hidden
       until "Show PIN"), a "Reset PIN" button, and a sign-in link.
  To look at it without editing the file, add ?access=on to the address
  before the #, for example  index.html?access=on#/student
  Every student already has a code and PIN saved, so turning the switch
  on later needs no other change.
  Not built yet (these need a server, so they are not in this prototype):
  parent and teacher accounts with their own sign-in, QR codes, PINs
  stored safely off the device, and a limit on wrong PIN tries. Until
  then the Parent and Teacher tabs are open to anyone using the browser,
  so the PIN is a preview of the flow, not real protection.

Editing content
---------------
Scenarios live in js/data.js and js/data-faith.js. Each choice carries:
  impact  what that specific choice could do (step 3)
  next    a supportive next step or better option (step 4)
  close   a short closing line (step 5)
  act     which picture shows the choice (the list is ACTS in js/art.js)
  to      optional: who shares that picture (a person in the scene,
          'adult', or 'solo')
A new scenario's picture is described by its `scene` line: the background,
the student's expression and pose, and up to two other people. The first 24
scenarios have hand-drawn scenes instead: the function with the same id in
SCENES (js/art.js).

Notes
-----
* Read-aloud uses the voices already on the device and picks the most
  natural-sounding English one it finds (for example the "Natural" voices
  in Microsoft Edge, Google voices in Chrome, enhanced voices on iPhone,
  iPad and Mac). A student can choose another voice on the character page.
  How natural it sounds depends on the device; a human-quality voice on
  every device would need a paid text-to-speech service.
* Fonts: Bricolage Grotesque (headings) and Atkinson Hyperlegible Next
  (text) load from Google Fonts when online. Offline, the app falls back
  to system fonts and still works.
* Prototype: profiles and progress are saved only in this browser
  (localStorage). "Reset sample data" in the footer restores the sample
  family. A live version needs real accounts and private storage.
* The sample family (Maya and Leo) and the sample class (Grade 7 - Period 3,
  plus a small Reflection room group) are demo data so the parent and
  teacher views have something to show on first open.
* The project folder, the GitHub repository and the saved-data key keep
  the earlier working name (ChoiceRipple), so existing links and saved
  progress keep working.
* The first ChoiceLab prototype is untouched in
  ..\ChoiceLab_Prototype_Download\
