# ZH Debug Notes

## Issue
After clicking ZH in the language dropdown, the page still shows all English text.
The language selector button still shows "EN" after clicking ZH.

## Observations
- The dropdown opened correctly (EN, ZH, KO, JA, HI, AR, ES, VI visible)
- After clicking ZH, the page didn't change language
- The button still shows "EN"
- The markdown extraction still shows English text

## Possible causes
1. The language state isn't being persisted/updated when clicking the dropdown option
2. The dropdown component might not be calling setLang correctly
3. There might be a mismatch between the button click handler and the state update
