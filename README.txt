Choice Ripple
=============
A practice app for students and the adults who support them. Students
rehearse real-life social situations, choose how they would respond, and read
a reflection written for that exact choice. Parents and teachers open the
student's own profile and follow their practice progress.

To open
-------
Double-click index.html (any modern browser). No install, no server.
Keep the css and js folders beside index.html.

What's inside
-------------
index.html        App shell
css/styles.css    Styling (phone-first; ripple-ring visual system)
js/data.js        12 topics, 24 scenarios, 72 choice-specific reflections
js/art.js         Anime-style scene art, drawn as SVG - one scene per scenario
js/app.js         Profiles, practice flow, parent and teacher views

How it works
------------
Home     "See how it works" previews any scenario without saving anything.
Student  Pick a profile -> Up next -> read -> choose -> Continue ->
         reflection -> Next scenario. Read-aloud is on every scenario,
         its choices, and every reflection.
Parent   Your students -> Open profile -> completed practices, the choice
         made, the reflection the student read, a question to talk about,
         progress by topic, and assigning practice.
Teacher  Your classes and groups -> open one -> roster, how the class is
         choosing on each assigned scenario (with a class discussion
         question), and assigning practice to everyone at once. Open a
         student for the same profile and progress page a parent sees.
         Groups can be a class, a small group, or an ISS / detention group.
         Students see who assigned each practice (parent or teacher).

Editing content
---------------
Scenarios live in js/data.js. Each choice carries its own reflection:
  impact  what that specific choice likely does
  next    a supportive next step or better option
  close   a short closing message
A scenario's picture is the function with the same id in SCENES (js/art.js).

Notes
-----
* Fonts: Bricolage Grotesque (headings) and Atkinson Hyperlegible Next
  (text) load from Google Fonts when online. Offline, the app falls back
  to system fonts and still works.
* Prototype: profiles and progress are saved only in this browser
  (localStorage). "Reset sample data" in the footer restores the sample
  family. A live version needs real accounts and private storage.
* The sample family (Maya and Leo) and the sample class (Grade 7 - Period 3,
  plus a small Reflection room group) are demo data so the parent and
  teacher views have something to show on first open.
* The original ChoiceLab prototype is untouched in
  ..\ChoiceLab_Prototype_Download\
