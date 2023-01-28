# split-on-silence

Splits audio files with silence detection.

Uses [FFmpeg](https://ffmpeg.org/) to detect silence.

The file search starts from the current working directory.

```sh
cd /directory/with/audio/files/
/path/to/split-on-silence/index.js
```

Settings can be changed with environment variables:
- `SPLIT_ON_SILENCE_PATTERN` — regular expression for files (default is `/.\.(?:mp3|ogg|m4a|aac|flac)$/i`).
- `SPLIT_ON_SILENCE_DURATION` — silence duration for [silencedetect](https://ffmpeg.org/ffmpeg-filters.html#silencedetect) filter (default is `10`).
- `SPLIT_ON_SILENCE_NOISE` — noise tolerance for [silencedetect](https://ffmpeg.org/ffmpeg-filters.html#silencedetect) filter (default is `'-60dB'`).
