# Prime Pussify
In the comic [Meow the Infinite](https://meowtheinfinite.com) there is a character called "The Prime Puss" who speaks in an unsettling voice. We wanted the text for the character to be jarring, but we didn't want to restrict font choices to only fonts with built-in jitter. Since Photoshop itself is not able to do basic font operations like random jitter, I cobbled together this script to automate the process of randomly jittering the size and position of the lettering in a Photoshop text layer.

Using the script is simple, if a bit awkward (due to Photoshop's unfortunate limitation on script UI). Simply select a text layer in the layer list, then execute the script. It will prompt you for five numbers that control the jitter: size, size vary, spacing, spacing vary, and baseline vary. The parameters have the following behaviors:

* **Size** is the base size for the font.
* **Size vary** is the amount of variance you want in the size of the font, 0 being no variation at all.
* **Spacing** is the base distance between neighboring characters.
* **Spacing vary** is the amount of variance you want in the spacing, 0 being no variation at all.
* **Baseline vary** is the amount of variance you want between each character and the text baseline, 0 being no variation at all.

The script should remember the settings, so the next time you run it, the input box should automatically contain the previous set of values you enterred.

If you've never used a Photoshop script before, and want to learn how to run the script and/or assign it to a menu option, please refer to the [Adobe documentation on running scripts](https://helpx.adobe.com/photoshop/using/scripting.html).

Ideally, there would be an interface in Photoshop that would just have these values as sliders, and you could play with them until you got the result you wanted. Furthermore, it would be great if you could store and recall presets. These would not be difficult features to add. However, unfortunately Photoshop does not seem to allow scripts to create real UI windows in the way that would be necessary for this to work. If anyone has any ideas on how to get around that limitation (without creating a full-blown plugin), please submit an issue or a pull request with how it could be done.

Happy drawing,

\- Casey

## What's different in this fork
* Ranges between minimum and maximum possible values of **Font Size, Tracking & Baseline** are increased further.
* Fine-tune your **Baseline vary** with **Baseline minimum value & Baseline maximum value** now, better geared towards SFX.
* Includes tracking compensation to reduce poor kerning due to high baseline differences between each characters.
* **`uiWindow.preferredSize`** width is reduced to smallest possible maximize your screen real estate.
* **Settings variables** is stored under `PrimePuss2` to allows interchangeability with the original **PrimePussify** without affecting each other. (Rename the `PrimePussify.jsx` file if you want to use both of them together.)

## To do
* Improve the script performance by preventing unnecessary calculations when 'vary' value of Size, Tracking or Baseline is 0.
* Minimum & maximum values fine-tuning for other parameters as well (Font size & tracking).
