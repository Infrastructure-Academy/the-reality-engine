# ROOT CAUSE FOUND

The deployed site's ZH toggle is broken because of a localStorage key MISMATCH:

- The language dropdown WRITES to: `tre-language` (value is "ZH" after clicking)
- The LanguageContext READS from: `iaai-lang`

So clicking ZH sets `tre-language=ZH` but the context reads `iaai-lang` which is null, so it stays EN.

FIX: Make both use the same key. The LanguageContext uses "iaai-lang" but the dropdown component uses "tre-language".
