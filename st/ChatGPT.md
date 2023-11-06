That is great...

Task item:
'h high1 @james #oliverRd +TaskToGo'
is correct in JSON as:

```
  "4": {
    "type": "high priority",
    "content": "high1 @james #oliverRd +TaskToGo",
    "mentions": [
      "james"
    ],
    "locations": [
      "oliverRd"
    ],
    "projects": [
      "TaskToGo"
    ]
  },
```

Now, I wonder, why do we need the duplication in:
`    "content": "high1 @james #oliverRd +TaskToGo",`
When we have @james, #oliverRd, +TasksToGo
in the JSON structure?

We will want to use mentions, locations and projects for sorting,
and will be formatting them soon

Question: Is there any reason to have `"content": ` have these duplicated?

Can we not just write out
"'h high1 @james #oliverRd +TaskToGo'"
from the JSON ?

