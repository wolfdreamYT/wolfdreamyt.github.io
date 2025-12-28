
### ChangeLog ###

Version 1.0
    - Created base code
    - Bot allowed to scower any website

    This version is the first to come, with a bot that can scan and extract info from the website/page you want. Though
    it cannot worm-scan (go to every page that is in the pages) and cannot bypass robots.txt. This is more for legal and educational use, but i will make a better version later.

Version 2.0
    - Removed robots.txt feature
    - added more flexibility

    WebBot can now act as a worm on the website, going from each page to page and will not stop until it reachs default 500 pages scanned and extracted. You can configure the amount of websites it scans, but 500 is my favourite. the WebBot can now go on websites like Wikipedia since before the robots.txt file stopped it, but now the bot does not respect robots.txt aloowing you to find anything.

Version 3.0
    - Added HTML User Interface
    - Connected HTML to python via server.py
    - allowed local viewing (anyone on same wifi can use it)
    - allowed ngrok support

    WebBot can now be used on a UI (User Interface) as i saw alot of students and even my teacher may not know how to code,
    so this version now lets me locally host my WebBot so everyone in class can use it in a demonstration. Hey, extra points if i make a real prototype, but instead of a prototype i made the final product hehe

    I added password protection, in version 4 i will remove it but currently there is a authentication/credential requirement as i dont want just anyone using it, only the class can use it as i will give them the credentials in class. this is to ensure the demonstration stays contained.

    It does not run multiple at a time, so you must wait your turn until the other person has completed their scan. There is a limit set to the scan so that students can only use it for demo, not the full on product as they must download the project code so they can edit it and use it themselves. 

    I do not have unlimited RAM and SSD (storage) so students can only scan a maximum of 5 pages at a time, just enough to see and feel the product. If you want to use the full product, you must download the source code in my github or you can download it directly from my slideshow. Again, this is a demo mode so the price is you have to use a computor that you own/use yourself meaning you will host the product yourself, so dont be suprised if you have to go into coding and install python packages.

Version 2.5 & 3.0

    Nothing too new, i didnt add much but did the following:
    - modified settings for scanning
    - added monitoring mode
    - added verification/moderation system before downloading extraction
    - modified username & password to "demo"
    - allowed to run multiple times.
    - drastically lowered the USER_AGENTS to save bandwith
    - students and users can now use it at the same time without worry

    Version 3.0 was the file that was updated recently, but i just copied and paste it here in version 2.5 and did those changes. This means its the same as 3.0 but more limited and added more security. You now have to wait until i look at the terminal of the scanned websites and if i deem it not allowed/rule breaking i will deny download and terminate servers.