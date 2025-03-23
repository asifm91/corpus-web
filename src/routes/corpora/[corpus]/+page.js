import { error } from '@sveltejs/kit';



export async function load({ params }) {
    let audio_mp3 = undefined;
    let audio_wav = undefined;
    let transcript = undefined;

    try {
        audio_mp3 = (await import(`../../../data/${params.corpus}.mp3`));
        audio_wav = (await import(`../../../data/${params.corpus}.wav`));
        transcript = (await import(`../../../data/${params.corpus}.json`));

        // console.log(audio_mp3);
        // console.log(audio_wav);
        // console.log(transcript);
        return {
            audio_mp3, audio_wav, transcript
        };
    }
    catch(error){
        console.log("Error importing data files.");
        console.log(error);
    }

    error(404, "Could not found the selected corpus.")
};
