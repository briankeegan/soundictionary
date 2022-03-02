// Expr: file:///Users/briankeegan/Documents/dictionary/soundDictionary/Mbay/oldwebsite/Mbay/Mbay3.htm
// Idioms:(see file:///Users/briankeegan/Documents/dictionary/soundDictionary/Mbay/oldwebsite/Mbay/Mbay3.htm)

## Issues
### Missing data
 A quick search of the index file will result in...
   - <span class="sara-bagirmi-lang">  </span> 37
   - <span class="sara-bagirmi-lang"></span> 5

Running the `findMissingData`...
 - there are 55 mistakes.
 - I think thats a small enough number to be able to manually fix. 

### Weird case of == or = after Syn:
// (Syn: =dɔ̀-nàng,dà-nìng)
// (Syn: ==dɔ̀-lūu)
Theres multiple equals signs. I think its a mistake, but its definitely in the original. I think i can safely take out but would love an expert in the fields opinion. Next move is to compare to the PDF, but its that has the mistake as well.
## Thoughts

 - This is a good news and bad.
 - Its good that the number is small enough,
 - also, caught a major bug in the original code... was skipping some word.
 - Could try to write program to fix... but i think with 55, its probably easier/smarter to go through each.


 ## Next steps

- Fixing mistakes
    - Update the index.html file, with the fixes, based on `missingData.json`.
    - Re-run `getAllDictionaryData` and `findMissingData`.
    - Repeat process

- Auditing work
  - Just double checking results as this is a lot of data.

