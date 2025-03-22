
export async function load({ params }) {
    let audio_mp3 = undefined;
    let audio_wav = undefined;
    let transcript = undefined;

    try {
        audio_mp3 = (await import(`../../../data/laitu.mp3`));
        audio_wav = (await import(`../../../data/laitu.wav`));
        transcript = (await import(`../../../data/laitu.json`));

        console.log(audio_mp3);
        console.log(audio_wav);
        console.log(transcript);
    }
    catch(error){
        console.log("Error importing data files.");
        console.log(error);
    }

    return {
        audio_mp3, audio_wav, transcript
    };
};