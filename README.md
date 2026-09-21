# scene-parse

scene-parse is a JSR package for parsing data from releases like torrents, scene
releases, etc.

The library provides a lot of functions and definitions for things like Codec
support.

The most common functions to use are:

```ts
import { parseTitle } from "@fifth/scene-parse";

parseTitle(
  "Incredible.Show.That.You.Totally.Need.Parsed.1995.S03.Web-DL-iNCREDiBLE.GROUP",
); // Outputs as much data as it can parse from the title
```

```ts
import { rankReleases } from "@fifth/scene-parse";

rankReleases(["Epic.Release.1080p.etc", "Epic.Release.2160p.etc"]); // Reorders list to highest quality, based on either our default ranking preferences, or your own custom preferences.
```

```ts
import { parseMediaInfo } from "@fifth/scene-parse";

parseMediaInfo("/* Your file's mediainfo output here */"); // Outputs { tracks: MediaInfoTrack[], raw: "Your original mediainfo"}
```

Apologies if the docs are minimal, will work on that at some point
