# Question Bank CSV Conversion Prompt

## Role

You convert certificate-exam source material into a validated UTF-8 CSV question bank. Preserve the original Korean wording and do not invent missing questions, choices, answers, explanations, images, or metadata.

## Output

Return only raw CSV content without a Markdown code fence or commentary. Use exactly this header and column order:

```text
exam_type,category,prompt,choice1,choice2,choice3,choice4,correct_answer,model_answer,key_points,explanation,difficulty,image_url,tags,source,source_year,reference_text,code_snippet,code_language,image_urls,certificate_id
```

Produce one question per CSV record. Encode as UTF-8. Follow RFC 4180 quoting: wrap a cell in double quotes when it contains a comma, double quote, or line break, and escape an internal double quote as `""`.

## Exam types

- Multiple-choice written CBT: `WRITTEN_CBT`. Fill consecutive choices, normally all four, and put the 1-based answer number in `correct_answer`. Leave `model_answer` and `key_points` empty.
- Constructed-response practical exam: `PRACTICAL_WRITTEN_RESPONSE`. Leave all choice and `correct_answer` cells empty. Fill `model_answer`; separate `key_points` with `|`.

## Rich content

- Put only the question sentence in `prompt`.
- Move a passage, conditions, a table-like block, or text labeled `[보기]` into `reference_text`. Preserve meaningful line breaks, but remove decorative box borders such as `┌`, `─`, `│`, and `└`.
- Put source code in `code_snippet` without Markdown fences. Put its language identifier, such as `c`, `java`, `python`, `sql`, or `text`, in `code_language`.
- Put the primary image path in `image_url`. Put additional paths in `image_urls`, separated with `|`. Allow at most six images total.
- For project-local images, use a leading-slash path matching a file below `public/`, for example `/questions/q001.png` or `/static/images/Engineer_Embedded/2026/q001.png`.
- Do not place `[이미지]`, an image path, a `[보기]` block, or source code back into `prompt` after assigning its dedicated field.

## Metadata

- Use only `easy`, `medium`, or `hard` for `difficulty`; use `medium` when the source gives no reliable difficulty.
- Separate `tags` with `|`.
- Put the exact exam/source label in `source` and a four-digit year in `source_year` when known.
- Use the requested stable ID in `certificate_id`. Examples: `information-processing-engineer` and `embedded-engineer`.
- Preserve the official subject name in `category`. Do not use `uncategorized` or create a category from a question number alone.

## Validation

- Exclude a question when a required answer is missing or unreliable; do not guess.
- Exclude a CBT question with fewer than two valid choices or an answer outside its choice range.
- Exclude a practical question without a model answer.
- Remove exact duplicates while retaining the version with more complete explanation and metadata.
- Ensure that multiline cells are quoted and every record has exactly 21 columns.
- Before responding, verify choice order, answer numbering, Korean text, reference/code separation, image paths, and CSV escaping.

## Source material

Convert the source material provided after this line according to all rules above:

---

[PASTE SOURCE MATERIAL HERE]
