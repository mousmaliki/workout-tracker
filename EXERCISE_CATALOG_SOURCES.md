# Exercise catalog sources

## Source reviewed

LiftLab's starter catalog uses the exercise names, equipment vocabulary, and muscle-tagging approach in the [Exercises Dataset with Muscle Volume](https://github.com/smyrdev/exercises-dataset). That project documents 1,324 entries, a normalized equipment list, primary and secondary muscles, categories, and an MIT license. Its README says exercise names, equipment data, and instructions derive from [hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset), which is also MIT-licensed.

The two MIT copyright and permission notices are included in `EXERCISE_CATALOG_LICENSE.txt`. The source dataset's exercise media has a separate rights holder and is not covered by MIT; LiftLab does not include or link those images or videos. The source project explicitly excludes its media from the MIT grant.

## How LiftLab uses the source

- LiftLab contains a curated set of 91 strength exercises, not a copy of the full 1,324-record dataset. The larger dataset includes many variants and multilingual instruction text; importing it wholesale would add catalog noise and duplicate data in each local profile.
- LiftLab normalizes the source's data into its own tag names: `primaryMuscles`, `secondaryMuscles`, and `equipment` arrays. Values use a controlled vocabulary so later filters can match consistently.
- Existing IDs `base-0` through `base-29` are retained because saved routines and workout history refer to them. New curated entries use stable `lib-` IDs.
- Rep ranges are LiftLab's initial logging targets, not values supplied or scientifically prescribed by the dataset. Users can edit them. They should not be read as individualized training advice.
- For the exercise-guidance feature, the English step text was reviewed as a reference and condensed into LiftLab's own movement-family cues. The app does not embed the full dataset or copy its media. These cues are general technique prompts and have not been reviewed by a certified coach or clinician; do not treat them as individualized medical advice.
- The dataset's code and text are MIT-licensed, with required notices preserved in `EXERCISE_CATALOG_LICENSE.txt`. Its GIFs and thumbnails have separate media terms, so LiftLab does not include them.
- When the catalog grows substantially, consider moving shared built-in exercise data out of each profile's LocalStorage record to avoid multiplying catalog storage across profiles.

Source terms were checked on 2026-10-22. Recheck the licenses and media rights before adding further datasets or media, especially before distributing a packaged Android app.
