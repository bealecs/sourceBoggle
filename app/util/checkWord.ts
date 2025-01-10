interface Player {
    letterCount: string[];
    wordCount: string[];
    currentPoints: number;
}

export const checkWord = async (player: Player) => {
    const wordToCheck = player.letterCount.join(""); // Convert to string

    if (wordToCheck.length < 3) {
      console.log("You must have atleast 3 letters in your word!");
      return;
    }

    console.log("checking word", wordToCheck);
    try {
      const res = await fetch(
        `https://dictionaryapi.com/api/v3/references/collegiate/json/${wordToCheck}?key=b72e4758-4d38-4206-8ba9-245beaca916b`
      );
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      const data = await res.json();
      console.log(data);

      //checks to make sure the given response is a valid word according to results from merriam webster's dictionary
      let success = false;
      data.map((dataEntry) => {
        if (
          dataEntry.fl === "verb" ||
          dataEntry.fl === "noun" ||
          dataEntry.fl === "adjective" ||
          dataEntry.fl === "adverb"
        ) {
          success = true;
        }
      });

      if (success) {
        player.wordCount.push(wordToCheck);
        let wordLength = wordToCheck.length;
        switch (wordLength) {
          case 3:
            player.currentPoints += 1;
            console.log("Success! +1 point");
            break;
          case 4:
            player.currentPoints += 2;
            console.log("Success! +2 points");
            break;
          case 5:
            player.currentPoints += 3;
            console.log("Success! +3 points");
            break;
          case 6:
            player.currentPoints += 4;
            console.log("Success! +4 points");
            break;
          case 7:
            player.currentPoints += 5;
            console.log("Success! +5 points");
            break;
          case 8:
            player.currentPoints += 6;
            console.log("Success! +6 points");
            break;
          case 9:
            player.currentPoints += 7;
            console.log("Success! +7 points");
            break;
          case 10:
            player.currentPoints += 8;
            console.log("Success! +8 points");
            break;
          case 11:
            player.currentPoints += 9;
            console.log("Success! +9 points");
            break;
          case 12:
            player.currentPoints += 10;
            console.log("Success! +10 points");
            break;
          case 13:
            player.currentPoints += 11;
            console.log("Success! +11 points");
            break;
          case 14:
            player.currentPoints += 12;
            console.log("Success! +12 points");
            break;
          case 15:
            player.currentPoints += 13;
            console.log("Success! +13 points");
            break;
          case 16:
            player.currentPoints += 14;
            console.log("Success! +14 points");
            break;
          default:
            return;
        }
      } else if (!success) {
        console.log(
          "The given string was not found as a word according to Merriam Webster's dictionary"
        );
      }
    } catch (error) {
      console.error("Error checking word:", error);
    }
  };