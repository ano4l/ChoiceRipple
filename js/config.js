/* ChoiceLab switches. Change a value, save this file, and reload the page. */
window.CRConfig = {
  /* Student access codes and PINs: an early preview of the future sign-in.
     false  Students pick their profile from a list (how the app works today).
     true   Students type their own access code and 4-digit PIN to open only their profile.
            Parents and teachers see each student's code on the student's profile and can reset the PIN.
     To look at it without changing this file, add ?access=on to the address, before the #.
     Still to come before this is real: parent and teacher accounts, QR codes, and PINs kept
     on a server instead of in this browser. */
  studentAccess: false
};
