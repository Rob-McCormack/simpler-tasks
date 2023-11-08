Good, now we want to prepend the  `spedialChars` in View


Not all `spedialChars` are single letters.
for example "title", "update"

```js
    const specialChars = [`
        { char: "title", meaning: "title", sortOrder: -2 },
        { char: "update", meaning: "update", sortOrder: -1 }
]:
```

Please fix so that the entire `char` is prepended to task