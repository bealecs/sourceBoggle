# Clif's Boggle 
### Family-friendly Fun! 

As all great projects start, I was facing a problem that I wanted to solve. My family loves playing the popular word game, Boggle. However, there is a major flaw with the physical board game that would irritate me as a new parent that was trying to keep a newborn asleep.

#### The Problem:

When you shake the board around with all of the characters in it, it is **LOUD**. This was often an issue as we like to play around the later hours of the night. 

#### The Solution: 

I decided to make the board game online as a fun hobby-project. At first, the game started as just a simple board with the logic under the hood to support the original game's construct as much as possible. When I wanted a fresh assortment of letters on the board, rather than shaking the physical game board, I could click a button on my phone and rearrange the board configurations without making any noise. This was great, as it enabled us to play while keeping my baby sound asleep.

#### Always Tinkering... Learning...

My passion for programming has brought me a long way and taught me a lot of things. Lately, I have been working heavily with Supabase, an open-source Firebase alternative. Their documentation is fantastic, and their services are a breeze to use as a result.

Up to this point, the game I created was strictly client-sided logic with no persistence after a page refresh. This was fine if we were all gathered around a table hovering over a phone, but it could be better... I mean, the game was now already "mobile", so why not make it playable from anywhere in the world? Removing these restraints and bringing the game over to be server-enabled proved challenging. One thing about me, however, I thrive in a challenging environment (it is when I have the most fun, problem solving). 

Eventually, I was able to set up game lobbies, allow board configurations to be persistent across devices, and track user word count all while ensuring real-time updates thanks to Supabase. The best part is... **It is all free**. 

Supabase enables developers to build without needing to invest in infrastructure which is great for me to be able to complete passion projects like this one.
