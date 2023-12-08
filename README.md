
# Capstone_2: MusicProc  
**Link to active site:** https://procmusic.onrender.com/  
  
**-QUICKSTART GUIDE-**  
======================================  
First step is to navigate to *backend* and *frontend* folders run *"npm install"*  
Second step is to navigate to frontend folder type command *"npm run dev"*  
  
You can create an account or login via the follwing account used for testing:  
Username: TestUser4  
Password: 1234  

**Music Page Controls**  
Tools can be found near the top left of the Detail Container  
Right Clicking a Music Block allows you to quick select a block  
  
  
**-INTRODUCTION-**  
======================================  
"Procedural Music Generation Tool (MusicProc)"  
  
**Main Tech Stack Utilized:**  
**Node**: Handled local server creation  
**React**: Handled component creation  
**Tone.js**: Handles tone generation, and simultaneous playback of various music loops in time. [https://tonejs.github.io/]  
**React-Xarrows**: Handles UI creation of arrows between two elements in react. [https://github.com/Eliav2/react-xarrows]  
**Express**: For the backend routing  
**Better-Sqlite3**: Used for database manipulation. [https://www.npmjs.com/package/better-sqlite3]  
**SQLite**: Saves song and sample data  
  
**-DESIGN-**  
The current iteration of this project is a website that runs on a Node frontend.As for the backend it utilizes Express and SQLite. The original intent of this project was to create a program you could run locally to create/play procedurally generated music. I tried out learning Electron with React, but after while I settled on a website.  
  
All data that is required for running this project is entirely provided by the user. In the case of Sample files (Intruments), data is provided via uploading mp3, ogg, or wav files. It the case of Songs, data is provided by manipulation of the GUI and saving said songs.  
  
**-DATABASE OUTLINE-**  
======================================
>USER –Many→ SAMPLES  
>USER ←None To Many→ SONGS  

>*USERs*    
>Username [String] PK  
>Password [String] hashed  
>Admin [Integer] (1 or 0)  

>*SONGs*    
>Title [String] PK  
>Data [String]  
>USER FK PK  

>*SAMPLEs*      
>Name [String] PK  
>Sound [BLOB]  
>Pitch [String]  
>Octave [Integer]  
>USER FK PK  

  
**-ISSUES RUN INTO DURING PROJECT-**
======================================
Library Limitaions   
Prop drilling    
React Components Sharing States  
Adding arrows as an overlay cleanly  

