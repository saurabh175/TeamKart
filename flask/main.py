#import the getAudioTranscript from openai/audio.py


from open_ai.whisper.audio import getAudioTranscript
from open_ai.user.iterate_user_profile import strengthen_profile

# get the audio transcript

audio = getAudioTranscript("audio_data/Rosemount Ln.m4a")
print(strengthen_profile("", audio, ["Nike shoes", "Adidas shirt"]))