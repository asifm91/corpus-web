import { error } from "@sveltejs/kit";

// @ts-ignore
export async function load({ params }) {
  let audio_mp3 = undefined;
  let audio_wav = undefined;
  /** @type {Array<{ eng_phase: string, phonetic_phase: string, time: [number, number], individual_eng: Array<{ text: string, time: [number, number] }>, individual_phonetics: Array<{ text: string, time: [number, number] }> }>} */
  let transcript = [];

  try {
    audio_mp3 = await import(`../../../data/${params.corpus}.mp3`);
    audio_wav = await import(`../../../data/${params.corpus}.wav`);
    const jsonfile = await import(`../../../data/${params.corpus}.json`);

    // Process the transcript data
    const en_phases = jsonfile.default["contains"].filter((item) =>
      item.label.includes("_phrase-segnum-en")
    );

    en_phases.map((en_phase) => {
      en_phase["first"]["items"].forEach((subItem) => {
        const timeStr = subItem["target"][0]["id"]
          .split("#")[1]
          .replace("t=", "");

        const [start, end] = timeStr.split(",").map(Number);
        const entry = {
          speaker: en_phase.label[0],
          segNum: subItem.body.value,
          eng_phase: "",
          phonetic_phase: "",
          time: [start, end],
          individual_eng: [],
          individual_phonetics: [],
        };
        transcript.push(entry);
      });
    });

    const eng_phases = jsonfile.default["contains"].filter((item) =>
      item.label.includes("_phrase-lit-en")
    );

    eng_phases.map((eng_phase) => {
      eng_phase["first"]["items"].forEach((subItem) => {
        const engTimeStr = subItem["target"][0]["id"]
          .split("#")[1]
          .replace("t=", "");
        const [engStart, engEnd] = engTimeStr.split(",").map(Number);
        transcript.forEach((entry) => {
          if (engStart >= entry.time[0] && engEnd <= entry.time[1]) {
            entry.eng_phase = subItem.body.value;
            //   break
          }
        });
      });
    });
    const phonetic_phases = jsonfile.default["contains"].filter((item) =>
      item.label.includes("_phrase-txt-clj_MM_X_ETIC")
    );

    phonetic_phases.map((phonetic_phase) => {
      phonetic_phase["first"]["items"].forEach((subItem) => {
        const phoneticTimeStr = subItem["target"][0]["id"]
          .split("#")[1]
          .replace("t=", "");
        const [phoneticStart, phoneticEnd] = phoneticTimeStr
          .split(",")
          .map(Number);
        transcript.forEach((entry) => {
          if (phoneticStart >= entry.time[0] && phoneticEnd <= entry.time[1]) {
            entry.phonetic_phase = subItem.body.value;
            //   break
          }
        });
      });
    });

    const individual_engs = jsonfile.default["contains"].filter((item) =>
      item.label.includes("_morph-gls-en")
    );

    individual_engs.map((individual_eng) => {
      individual_eng["first"]["items"].forEach((subItem) => {
        const engTimeStr = subItem["target"][0]["id"]
          .split("#")[1]
          .replace("t=", "");
        const [TimeStart, TimeEnd] = engTimeStr.split(",").map(Number);
        transcript.forEach((entry) => {
          if (TimeStart >= entry.time[0] && TimeEnd <= entry.time[1]) {
            entry.individual_eng.push({
              text: subItem.body.value,
              time: [TimeStart, TimeEnd],
            });
            //   break
          }
        });
      });
    });
    const individual_phonetics = jsonfile.default["contains"].filter((item) =>
      item.label.includes("_morph-txt-clj-MM-fonipa-x-etic")
    );

    individual_phonetics.map((individual_phonetic) => {
      individual_phonetic["first"]["items"].forEach((subItem) => {
        const engTimeStr = subItem["target"][0]["id"]
          .split("#")[1]
          .replace("t=", "");
        const [TimeStart, TimeEnd] = engTimeStr.split(",").map(Number);
        transcript.forEach((entry) => {
          if (TimeStart >= entry.time[0] && TimeEnd <= entry.time[1]) {
            entry.individual_phonetics.push({
              text: subItem.body.value,
              time: [TimeStart, TimeEnd],
            });
            //   break
          }
        });
      });
    });

    // jsonfile.default["contains"].forEach(
    //   (
    //     /** @type {{ label: string, first: { items: Array<{ body: { value: string }, target: Array<{ id: string }> }> } }} */ item
    //   ) => {
    //     if (
    //       item.label.includes("_phrase-lit-en") ||
    //       item.label.includes("_phrase-txt-clj_MM_X_ETIC")
    //     ) {
    //       // Loop through all items in the first.items array
    //       item["first"]["items"].forEach((subItem) => {
    //         const timeStr = subItem["target"][0]["id"]
    //           .split("#")[1]
    //           .replace("t=", "");

    //         console.log(subItem);
    //         const [start, end] = timeStr.split(",").map(Number);
    //         const entry = {
    //           eng_phase: item.label.includes("_phrase-lit-en")
    //             ? subItem.body.value
    //             : "",
    //           phonetic_phase: item.label.includes("_phrase-txt-clj_MM_X_ETIC")
    //             ? subItem.body.value
    //             : "something",
    //           time: [start, end],
    //           individual_eng: [],
    //           individual_phonetics: [],
    //         };
    //         transcript.push(entry);
    //       });
    //       // Collect individual words within this time range
    //       jsonfile.default["contains"].forEach((wordItem) => {
    //         if (
    //           wordItem.label.includes("_morph-gls-en") ||
    //           wordItem.label.includes("_morph-txt-clj-MM-fonipa-x-etic")
    //         ) {
    //           const wordTimeStr = wordItem["first"]["items"][0]["target"][0][
    //             "id"
    //           ]
    //             .split("#")[1]
    //             .replace("t=", "");
    //           const [wordStart, wordEnd] = wordTimeStr.split(",").map(Number);

    //           if (wordStart >= start && wordEnd <= end) {
    //             const word = {
    //               text: wordItem["first"]["items"][0]["body"]["value"],
    //               time: [wordStart, wordEnd],
    //             };

    //             if (wordItem.label.includes("_morph-gls-en")) {
    //               entry.individual_eng.push(word);
    //             } else {
    //               entry.individual_phonetics.push(word);
    //             }
    //           }
    //         }
    //       });
    //     }
    //   }
    // );
    return {
      audio_mp3,
      audio_wav,
      transcript,
    };
  } catch (error) {
    console.log("Error importing data files.");
    console.log(error);
  }

  error(404, "Could not found the selected corpus.");
}
