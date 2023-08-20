import os
import openai
openai.api_key = "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"

def getAudioTranscript(fileName):
    audio_file = open(fileName, "rb")
    transcript = openai.Audio.transcribe("whisper-1", audio_file)
    print (transcript)